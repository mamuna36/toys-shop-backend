# toys-shop-backend

# -CloudX- Backend Repository

CloudX: AWS Practitioner for JS #4 Course - Backend Repository

## **Task 5**

### **Task 5. 1**

- [x] **import service integration in backend **

  - [x] Create a service named import-service
  - [x] Backend Repo structure is like 
    -backend-repo
      - import-service
      - product-service
  - [x] Create and configure S3 bucket from AWS console.

### **Task 5. 2**

- [x] **Product By Id Lambda Function**

  - [x] Create a Lambda function called `importProductFile`
  - [x] Requested URL should be `/import`

  - GET - https://57p9vrm503.execute-api.us-east-1.amazonaws.com/dev/import
  - [x] Lambda function logic is implemented to return signed URL.
  - [x] Update serverless.yml with policies to allow lambda functions to interact with S3
  - [x] The lambda endpoint should be integrated with the frontend by updating import property of the API paths configuration


### **Task 5. 3**

- [x] Create a lambda function called importFileParser under the same serverless.yml file which will be triggered by an S3 event.
- [x] The event should be s3:ObjectCreated:*
- [x] Configure the event to be fired only by changes in the uploaded folder in S3.
- [x] The lambda function should use a readable stream to get an object from S3, parse it using csv-parser package and log each record to be shown in CloudWatch(screenshot is provided).

### **Task 5. 3**

- [x] all work is commited to a separate branch

### **Additional Tasks**
- [x] async/await is used in lambda functions
- [x] At the end of the stream the lambda function should move the file from the uploaded folder into the parsed folder (move the file means that file should be copied into a new folder in the same bucket called parsed, and then deleted from uploaded folder)