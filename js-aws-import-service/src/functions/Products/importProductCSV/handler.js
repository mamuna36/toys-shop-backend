'use strict'
const AWS = require('aws-sdk')

module.exports.importProductCSV = async (event) => {
  const { name } = event.pathParameters
  const BUCKET = 'toys-shop-product-files'
  const s3 = new AWS.S3({ region: 'us-east-1' })
  let signedUrl = ''
  const getSignedURLParams = {
    BUCKET: BUCKET,
    Key: `uploaded/${name}`,
    Expires: 60,
    ContentType: 'text/csv'
  }

  s3.getSignedUrl('putObject', getSignedURLParams, (error, url) => {
    signedUrl += url
  })
  return {
    statusCode: 200,
    body: JSON.stringify(signedUrl)
  }
}
