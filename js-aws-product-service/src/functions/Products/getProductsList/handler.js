'use strict'
const AWS = require('aws-sdk')

module.exports.getProducts = async (event) => {
  const ProductScanParams = {
    TableName: process.env.DYNAMODB_PRODUCTS_TABLE
  }
  const StockScanParams = {
    TableName: process.env.DYNAMODB_STOCKS_TABLE
  }
  const dynamodb = new AWS.DynamoDB.DocumentClient()
  const products = await dynamodb.scan(ProductScanParams).promise()
  const stocks = await dynamodb.scan(StockScanParams).promise()
  let merged = []
  for (let i = 0; i < products.Items.length; i++) {
    merged.push({
      ...products.Items[i],
      ...stocks.Items.find((itmInner) => itmInner.id === products.Items[i].id)
    })
  }

  if (products.Count === 0) {
    return {
      statusCode: 404,
      body: 'There are no products found'
    }
  }
  if (stocks.Count === 0) {
    return {
      statusCode: 404,
      body: 'There are no stocks found'
    }
  }

  return {
    statusCode: 200,
    headers: {
      'Access-Control-Allow-Origin': '*',
      'Access-Control-Allow-Credentials': true
    },
    body: JSON.stringify(
      merged.map((product) => {
        return {
          id: product.id,
          title: product.title,
          description: product.description,
          price: product.price,
          count: product.count
        }
      })
    )
  }
}
