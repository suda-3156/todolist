import { ITodolistRepository, Todo } from "../../01_repository/TodolistRepository"
import { Failure, Result } from "../../type"
import { UseCaseError } from "../UseCaseError"



export interface IClearTodoUseCase {
  execute: (todo_id: string) => Promise<Result<Todo, UseCaseError>>
}

export class ClearTodoUseCase implements IClearTodoUseCase {
  TR: ITodolistRepository

  constructor( TodolistRepository: ITodolistRepository) {
    this.TR = TodolistRepository
  }

  execute = async (todo_id: string) :Promise<Result<Todo, UseCaseError>> => {
    const todoRes = await this.TR.deleteTodo(todo_id)
    if ( todoRes.isFailure() ) {
      return new Failure<UseCaseError>(new UseCaseError("DB_ACCESS_ERROR"))
    }

    return todoRes
  }
}