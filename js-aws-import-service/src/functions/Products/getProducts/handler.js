'use strict'
const AWS = require('aws-sdk')
const BUCKET = 'toys-shop-product-files'

module.exports.getProducts = async (event) => {
  const S3 = new AWS.S3({ region: 'us-east-1' })
  let statusCode = 200
  let body = {}
  let files = []
  const params = {
    Bucket: BUCKET,
    Prefix: 'uploaded/',
    Delimiter: '/'
  }
  try {
    const s3Response = await S3.listObjectsV2(params).promise()
    files = s3Response.Contents
    body = JSON.stringify(
      files
        .filter((file) => file.Size)
        .map((file) => `https://${BUCKET}.s3.amazonaws.com/${file.Key}`)
    )
  } catch (error) {
    console.error('error appeared:')
    console.error(error)
    statusCode = 500
    body = error
  }

  return {
    statusCode,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body
  }
}
