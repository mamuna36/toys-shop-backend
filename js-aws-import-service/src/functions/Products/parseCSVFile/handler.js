const  { S3 } = require('aws-sdk')
const csv = require('csv-parser') 

const s3 = new S3({ region: 'us-east-1' })

const Bucket = 'toys-shop-product-files'

module.exports.importFileParser = async (event) => {
  console.log('importFileParser event: ', event)
  try {
    for (const record of event.Records) {
        const parsedFilePath = record.s3.object.key.replace(
          'uploaded',
          'parsed'
        )

        return new Promise((resolve, reject) => {
          const s3Stream = s3
            .getObject({
              Bucket: Bucket,
              Key: record.s3.object.key
            })
            .createReadStream()

          s3Stream
            .pipe(csv())
            .on('data', (data) => {
              console.log(data)
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
    console.error('Error (importFileParser): ', err)
  }
}
