'use strict'
const AWS = require('aws-sdk')

const createS3Product = async (data) => {
  const { id, title, description, price, count } = data
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
}

 const createProduct = async (event) => {
  await createS3Product(JSON.parse(event.body))
  return {
    statusCode: 201,
    body: JSON.stringify({ productData: productParams, stockData: stockParams })
  }
}
module.exports = {createS3Product, createProduct}