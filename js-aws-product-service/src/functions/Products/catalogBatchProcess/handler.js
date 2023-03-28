const createProduct = require('../createProduct/handler')
module.exports.catalogBatchProcess = async (event) => {

  for (const record of event.Records) {
    try {
      const { title, description, price, count } = JSON.parse(record.body)
      if (
        !title ||
        !description ||
        (!price && price !== 0) ||
        (!count && count !== 0)
      ) {
        console.log('Failed: Product could not be created', {
          title,
          description,
          price,
          count
        })
        continue
      }
      const createdProduct = await createProduct(event)

      console.log('Product is successfully created', createdProduct)
    } catch (e) {
      console.error(e)
    }
  }
}

