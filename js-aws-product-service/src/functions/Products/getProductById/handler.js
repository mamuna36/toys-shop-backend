'use strict'
const AWS = require('aws-sdk')

module.exports.getProductById = async (event) => {
  const { id } = event.pathParameters
  const documentClient = new AWS.DynamoDB.DocumentClient()
  const productParams = {}
  const stockParams = {}
  productParams.TableName = process.env.DYNAMODB_PRODUCTS_TABLE
  var key = { id: id }
  productParams.Key = key
  stockParams.TableName = process.env.DYNAMODB_STOCKS_TABLE
  stockParams.Key = key
  const productData = await documentClient.get(productParams).promise()
  const stockData = await documentClient.get(stockParams).promise()
  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify({
      id: productData.Item.id,
      title: productData.Item.title,
      description: productData.Item.description,
      price: productData.Item.price,
      count: stockData.Item.count
    })
  }
}
