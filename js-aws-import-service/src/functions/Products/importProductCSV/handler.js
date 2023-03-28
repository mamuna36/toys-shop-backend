'use strict'
const AWS = require('aws-sdk')

module.exports.importProductCSV = async (event) => {
  try {
    const name = event.queryStringParameters.name
    const BUCKET = 'toys-shop-product-files'
    const s3 = new AWS.S3({ region: 'us-east-1' })
    const getSignedURLParams = {
      Bucket: BUCKET,
      Key: `uploaded/${name}`,
      Expires: 60,
      ContentType: 'text/csv'
    }
    console.log(getSignedURLParams)
    const result = await s3.getSignedUrlPromise('putObject', getSignedURLParams)
    console.log(result)
    const headers = {
      'Access-Control-Allow-Headers': 'Content-Type, Authorization',
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Methods': 'OPTIONS,POST,GET,PUT'
    }
    return { headers: headers, statusCode: 200, body: result }
    
  } catch (error) {
    console.log('importProductCSV', error)
    
  }
  
}
