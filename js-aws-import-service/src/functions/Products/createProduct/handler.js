'use strict'
const AWS = require('aws-sdk')

module.exports.createProduct = async (event) => {
  const { id, title, description, price, count } = JSON.parse(event.body)
  const dynamoDb = new AWS.DynamoDB.DocumentClient()
  const productParams = {
    TableName: process.env.DYNAMODB_PRODUCTS_TABLE,
    Item: {
      id: id,
      title: title,
      description: description,
      price: price
    }
  }
  const stockParams = {
    TableName: process.env.DYNAMODB_STOCKS_TABLE,
    Item: {
      id: id,
      count: count
    }
  }
  await dynamoDb.put(productParams).promise()
  await dynamoDb.put(stockParams).promise()
  return {
    statusCode: 201,
    body: JSON.stringify({ productData: productParams, stockData: stockParams })
  }
}
