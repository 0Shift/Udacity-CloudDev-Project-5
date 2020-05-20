import * as AWS  from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'

const XAWS = AWSXRay.captureAWS(AWS)

import { TodoItem } from '../models/TodoItem'

export class TodoAccess {

    constructor(
        private readonly docClient: DocumentClient = createDynamoDBClient(),
        private readonly todoTable = process.env.GROUPS_TABLE,
        private index = process.env.USER_INDEX
        ) {
    }

    async getTodos(): Promise<TodoItem[]> {
        console.log('Getting all todos')
        const result = await this.docClient.query({
        TableName: this.todoTable

        }).promise()

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

    async deleteTodo(todo: TodoItem): Promise<TodoItem> {
            return todo 
    }

    async generateUpdateUrl(todo: TodoItem): Promise<TodoItem> {
            return todo 
    }

    async dupdateTodo(todo: TodoItem): Promise<TodoItem> {
            return todo 
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