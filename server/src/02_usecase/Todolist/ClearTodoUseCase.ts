import { ITodolistRepository, TodoType } from "../../01_repository/TodolistRepository"
import { Failure, Result } from "../../type"
import { UseCaseError } from "../UseCaseError"



export interface IClearTodoUseCase {
  execute: (todo_id: string) => Promise<Result<TodoType, UseCaseError>>
}

export class ClearTodoUseCase implements IClearTodoUseCase {
  constructor(
    private readonly TR: ITodolistRepository
  ){}

  execute = async (
    todo_id: string
  ) :Promise<Result<TodoType, UseCaseError>> => {
    const todoRes = await this.TR.deleteTodo(todo_id)
    
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