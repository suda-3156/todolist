import { ITodolistRepository, Todolist_attrs } from "../../01_repository/TodolistRepository"
import { Failure, Result } from "../../type"
import { UseCaseError } from "../UseCaseError"



export interface IDeleteTodolistUseCase {
  execute: (todolist_id: string) => Promise<Result<Todolist_attrs, UseCaseError>>
}

export class DeleteTodolistUseCase implements IDeleteTodolistUseCase {
  constructor(
    private readonly TR: ITodolistRepository
  ){}

  execute = async (
    todolist_id: string
  ) :Promise<Result<Todolist_attrs, UseCaseError>> => {
    const todolistRes = await this.TR.deleteTodolist(todolist_id)

    if ( todolistRes.isFailure() ) {
      switch ( todolistRes.error.category ) {
        case "RECORD_NOT_FOUND":
          return new Failure<UseCaseError>(new UseCaseError("RECORD_NOT_FOUND"))
        default:
          return new Failure<UseCaseError>(new UseCaseError("DB_ACCESS_ERROR"))
      }
    }
    return todolistRes
  }
}