import { ITodolistRepository, Todo } from "../../01_repository/TodolistRepository"
import { Failure, Result } from "../../type"
import { UseCaseError } from "../UseCaseError"



export interface IEditTodoUseCase {
  execute: (todo: Todo) => Promise<Result<Todo, UseCaseError>>
}

export class EditTodoUseCase implements IEditTodoUseCase {
  TR: ITodolistRepository

  constructor( TodolistRepository: ITodolistRepository) {
    this.TR = TodolistRepository
  }

  execute = async (todo: Todo) :Promise<Result<Todo, UseCaseError>> => {
    const todoRes = await this.TR.upsertTodo(todo)
    if ( todoRes.isFailure() ) {
      return new Failure<UseCaseError>(new UseCaseError("DB_ACCESS_ERROR"))
    }

    return todoRes
  }
}