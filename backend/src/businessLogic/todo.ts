import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/TodoAccess'
import { BucketAccess } from '../dataLayer/BucketAccess'
import { CreateTodoRequest} from '../requests/CreateTodoRequest'
import {UpdateTodoRequest} from '../requests/UpdateTodoRequest'
import { parseUserId } from '../auth/utils'

const todoAccess = new TodoAccess()
const bucketAccess = new BucketAccess()

export async function getTodos(jwtToken: string): Promise<TodoItem[]> {
    const userId = parseUserId(jwtToken)
    return todoAccess.getTodos(userId)
}

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  jwtToken: string
): Promise<TodoItem> {

  const itemId = uuid.v4()
  const userId = parseUserId(jwtToken)

  return await todoAccess.createTodo({
    userId: userId,
    todoId: itemId,
    createdAt: new Date().toISOString(),
    name: createTodoRequest.name,
    dueDate: createTodoRequest.dueDate,
    done: false,
    // userId: string
    // todoId: string
    // createdAt: string
    // name: string
    // dueDate: string
    // done: boolean
    // attachmentUrl?: string
  })
}

export async function deleteTodo(todoId: string){
    return await todoAccess.deleteTodo(todoId)
}

export async function generateUploadUrl(todoId: string, jwtToken: string){
    const userId = parseUserId(jwtToken)
    const generatedUrl = await bucketAccess.generateUploadUrl(todoId, userId);
    return generatedUrl
}

export async function updateTodo(
    updateTodoRequest: UpdateTodoRequest,
    // jwtToken: string
  ){
  
    // const userId = parseUserId(jwtToken)
  
    return await todoAccess.updateTodo({
        name: updateTodoRequest.name,
        dueDate: updateTodoRequest.dueDate,
        done: updateTodoRequest.done
        // name: string
        // dueDate: string
        // done: boolean
    })
  }

