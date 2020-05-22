import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { TodoItem } from '../models/TodoItem'
import { TodoUpdate} from '../models/TodoUpdate'


export class TodoAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todoTable = process.env.TODO_TABLE,
        private readonly index = process.env.USER_INDEX
        ) {
    }

    async getTodos(userId: string): Promise<TodoItem[]> {
        console.log('Getting all todos', userId)
        const result = await this.docClient.query({
            TableName: this.todoTable,
            IndexName: this.index,
            KeyConditionExpression: 'userId = :userId',
            ExpressionAttributeValues: {
              ':userId': userId
            }
        }).promise()

        // const result = await this.docClient.scan({
        //     TableName: this.todoTable
        //   }).promise()

        const items = result.Items

        return items as TodoItem[]
    }


    async createTodo(todo: TodoItem): Promise<TodoItem> {
        await this.docClient.put({
        TableName: this.todoTable,
        Item: todo
        }).promise()

        return todo 
        }


    async deleteTodo(todoId: string) {
        await this.docClient.delete({
            TableName: this.todoTable,
            Key: {
                "todoId": todoId
            }
            }).promise()
    }


    async updateTodo(todoUpdate: TodoUpdate, todoId: string, userId: string) {
        await this.docClient.update({
            TableName: this.todoTable,
            Key: {
              todoId,
              userId
            },
            UpdateExpression: 'set #name = :n, #dueDate = :due, #done = :d',
            ExpressionAttributeValues: {
              ':n': todoUpdate.name,
              ':due': todoUpdate.dueDate,
              ':d': todoUpdate.done
            },
            ExpressionAttributeNames: {
              '#name': 'name',
              '#dueDate': 'dueDate',
              '#done': 'done'
            }
          }).promise();
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
