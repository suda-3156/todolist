import { ITodolistRepository, TodoType, UpsertTodoType } from "@/01_repository/TodolistRepository"
import { Failure, Result } from "../../type"
import { UseCaseError } from "../UseCaseError"



export interface IEditTodoUseCase {
  execute: (todo: UpsertTodoType) => Promise<Result<TodoType, UseCaseError>>
}

export class EditTodoUseCase implements IEditTodoUseCase {
  constructor(
    private readonly TR: ITodolistRepository
  ){}

  execute = async (
    todo: UpsertTodoType
  ) :Promise<Result<TodoType, UseCaseError>> => {
    const todoRes = await this.TR.upsertTodo(todo)

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