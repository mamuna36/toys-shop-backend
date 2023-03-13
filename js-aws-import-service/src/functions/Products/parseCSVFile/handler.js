'use strict'
const AWS = require('aws-sdk')
const csv = require('csv-parser')
module.exports.parseCSVFile = async () => {
  const s3 = new AWS.S3({ region: 'us-east-1' })
  const results = []
  const params = {
    Bucket: BUCKET,
    Prefix: 'uploaded/',
    Delimiter: '/'
  }
  const s3Stream = s3.getObject(params).createReadStream()

  s3Stream
    .pipe(csv())
    .on('data', (data) => {
      results.push(data)
    })
    .on('error', (error) => {
      console.error(error)
    })
    .on('end', () => {
      console.log(results)
    })
}
