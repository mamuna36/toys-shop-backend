'use strict'
const generatePolicy = require('./helper')
const GITHUB_LOGIN = process.env.GITHUB_LOGIN
const TEST_PASSWORD = process.env.TEST_PASSWORD

const basicToken = Buffer.from(`${GITHUB_LOGIN}:${TEST_PASSWORD}`)

module.exports.basicAuthorizer = async (event) => {
  const authHeader = event.authorizationToken
    console.log(req.headers);
 
    if (!authHeader) {
      return {
        statusCode: 401,
        body: 'You are not authenticated!'
      }
       
    }
 
  if (!authHeader?.startsWith('Basic ')) {
    return 'Unauthorized'
  }

  if (basicToken !== authHeader.split('Basic ')?.[1]) {
    return generatePolicy({
      principalId: basicToken,
      resource: event.methodArn,
      effect: 'Deny'
    })
  }

  return generatePolicy({
    principalId: basicToken,
    resource: event.methodArn,
    effect: 'Allow'
  })

}
