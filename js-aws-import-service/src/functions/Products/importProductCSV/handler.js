'use strict'
const AWS = require('aws-sdk')

module.exports.importProductCSV = async (event) => {
  const name = event.queryStringParameters.name
  const BUCKET = 'toys-shop-product-files'
  const s3 = new AWS.S3({ region: 'us-east-1' })
  let signedUrl
  const getSignedURLParams = {
    BUCKET: BUCKET,
    Key: `uploaded/${name}`,
    Expires: 60,
    ContentType: 'text/csv'
  }

  await s3.getSignedUrlPromise(
    'putObject',
    getSignedURLParams,
    (error, url) => {
      if(error) console.error(error)
      signedUrl = url
    }
  )
  console.log(signedUrl)
   const headers = {
            "Access-Control-Allow-Headers" : "Content-Type",
            "Access-Control-Allow-Origin": "*",
            "Access-Control-Allow-Methods": "OPTIONS,POST,GET,PUT"
        }
  return ({headers: headers, statusCode: 200, body: signedUrl})
  
}
