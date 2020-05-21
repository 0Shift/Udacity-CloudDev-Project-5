import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

export class BucketAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly imgBucket = process.env.IMAGES_S3_BUCKET,
        ) {
    }

    async generateUploadUrl(todoId: string, userId: string): Promise<string> {
    //     const uploadUrl = this.imgBucket.getSignedUrl("putObject", {
    //       Bucket: this.bucket,
    //       Key: todoId,
    //       Expires: this.urlExp
    //   });
    //   await this.docClient.update({
    //         TableName: this.todosTable,
    //         Key: { userId, todoId },
    //         UpdateExpression: "set attachmentUrl=:URL",
    //         ExpressionAttributeValues: {
    //           ":URL": uploadUrl.split("?")[0]
    //       },
    //       ReturnValues: "UPDATED_NEW"
    //     })
    //     .promise();
  
    //   return uploadUrl;
    return ""
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
