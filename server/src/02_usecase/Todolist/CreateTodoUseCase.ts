import { randomUUID } from "crypto"
import { ITodolistRepository, TodoType } from "@/01_repository/TodolistRepository"
import { Failure, Result } from "@/type"
import { UseCaseError } from "../UseCaseError"




type NewTodo = {
  todolist_id:    string,
  user_id:        string,
  todo_title:     string,
  style_id:       number,
}

export interface ICreateTodoUseCase {
  execute: (newTodo: NewTodo) => Promise<Result<TodoType, UseCaseError>>
}

export class CreateTodoUseCase implements ICreateTodoUseCase {
  constructor(
    private readonly TR: ITodolistRepository
  ){}

  execute = async (
    newTodo: NewTodo
  ) :Promise<Result<TodoType, UseCaseError>> => {
    const newTodoId = randomUUID().toString()

    const todoRes = await this.TR.upsertTodo({
      ...newTodo,
      todo_id: newTodoId,
      completed: false,
      deleted: false,
    })

    if ( todoRes.isFailure() ) {
      switch ( todoRes.error.category ) {
        case "RECORD_NOT_FOUND":
          return new Failure<UseCaseError>(new UseCaseError("RECORD_NOT_FOUND"))
        default:
          return new Failure<UseCaseError>(new UseCaseError("DB_ACCESS_ERROR"))
      }
    }

    return todoRes
  }
}