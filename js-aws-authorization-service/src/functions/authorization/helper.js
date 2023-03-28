module.exports.generatePolicy = (
  params
) => {
  const { principalId, resource, effect = 'Deny' } = params

  return {
    principalId,
    policyDocument: {
      Version: '2012-10-17',
      Statement: [
        {
          Action: 'execute-api:Invoke',
          Effect: effect,
          Resource: resource
        }
      ]
    }
  }
}
