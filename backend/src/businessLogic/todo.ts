import * as uuid from 'uuid'

import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/TodoAccess'
import { CreateTodoRequest} from '../requests/CreateTodoRequest'
import { parseUserId } from '../auth/utils'

const todoAccess = new TodoAccess()

export async function getTodos(): Promise<TodoItem[]> {
  return todoAccess.getTodos()
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

export async function deleteTodo(){

}

export async function generateUploadUrl(){

}

export async function updateTodo(){

}

