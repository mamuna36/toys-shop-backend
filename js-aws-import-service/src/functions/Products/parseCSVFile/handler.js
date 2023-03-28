'use strict'
const { S3, SQS } = require('aws-sdk')
const csv = require('csv-parser')



const Bucket = 'toys-shop-product-files'

module.exports.importFileParser = async (event) => {
  const s3 = new S3({ region: 'us-east-1' })
  const sqs = new SQS()
  try {
    for (const record of event.Records) {
      const parsedFilePath = record.s3.object.key.replace('uploaded', 'parsed')

      return new Promise((resolve, reject) => {
        const s3Stream = s3
          .getObject({
            Bucket: Bucket,
            Key: record.s3.object.key
          })
          .createReadStream()

        const headers = ['id', 'title', 'description', 'price', 'count']
        s3Stream
          .pipe(csv({ separator: ',', headers: headers, skipLines: 1 }))
          .on('data', async (data) => {
            const { title, description, price, count } = data
            if (
              !title ||
              !description ||
              (!price && price !== 0) ||
              (!count && count !== 0)
            ) {
              console.log(
                `Failed to process item - item is invalid: ${JSON.stringify(
                  data
                )}`
              )
              return
            }
            try {
              await sqs
                .sendMessage({
                  QueueUrl: process.env.PROCESS_PRODUCT_SQS_URL,
                  MessageBody: JSON.stringify(data)
                })
                .promise()

              console.log(`Processed item: ${JSON.stringify(data)}`)
            } catch (e) {
              console.log('Failed to process item: failed to send sqs')
              console.error(e)
            }
          })
          .on('end', async () => {
            console.log(`Move from ${Bucket}/${record.s3.object.key}`)

            try {
              await s3
                .copyObject({
                  Bucket: Bucket,
                  CopySource: `${Bucket}/${record.s3.object.key}`,
                  Key: parsedFilePath
                })
                .promise()

              await s3
                .deleteObject({
                  Bucket: Bucket,
                  Key: record.s3.object.key
                })
                .promise()

              console.log(`Moved into ${Bucket}/${parsedFilePath}`)
              resolve(null)
            } catch (e) {
              logger.error(e)
              reject(e)
            }
          })
      })
    }
  } catch (err) {
    console.error('Error (file processing failed): ', err)
  }
}
