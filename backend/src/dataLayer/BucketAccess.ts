import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

export class BucketAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly s3 = createS3Bucket(),
        private readonly imgBucket = process.env.IMAGES_S3_BUCKET,
        private readonly todoTable = process.env.TODOS_TABLE,
        private readonly urlExpiration = process.env.SIGNED_URL_EXPIRATION
        ) {
    }

    async generateUploadUrl(todoId: string, userId: string): Promise<string> {
        const uploadUrl = this.s3.getSignedUrl("putObject", {
          Bucket: this.imgBucket,
          Key: todoId,
          Expires: this.urlExpiration
      });
      await this.docClient.update({
            TableName: this.todoTable,
            Key: { userId, todoId },
            UpdateExpression: "set attachmentUrl=:URL",
            ExpressionAttributeValues: {
              ":URL": uploadUrl.split("?")[0]
          },
          ReturnValues: "UPDATED_NEW"
        })
        .promise();
  
      return uploadUrl;
    }

}

function createDynamoDBClient() {
  if (process.env.IS_OFFLINE) {
    console.log('Creating a local DynamoDB instance')
    return new XAWS.DynamoDB.DocumentClient({
      region: 'localhost',
      endpoint: 'http://localhost:8000'
    })
  }

  return new XAWS.DynamoDB.DocumentClient()
}

function createS3Bucket(){
    return new XAWS.S3({
        signatureVersion: 'v4'
      })
}