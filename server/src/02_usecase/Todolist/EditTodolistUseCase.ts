import { ITodolistRepository, Todolist_attrs, UpsertTodolist_attrs } from "../../01_repository/TodolistRepository"
import { Failure, Result } from "../../type"
import { UseCaseError } from "../UseCaseError"



export interface IEditTodolistUseCase {
  execute: (todolist_attrs: UpsertTodolist_attrs) => Promise<Result<Todolist_attrs, UseCaseError>>
}

export class EditTodolistUseCase implements IEditTodolistUseCase {
  constructor(
    private readonly TR: ITodolistRepository
  ){}

  execute = async (
    todolist_attrs: UpsertTodolist_attrs
  ) :Promise<Result<Todolist_attrs, UseCaseError>> => {
    const todolistRes = await this.TR.upsertTodolist(todolist_attrs)

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