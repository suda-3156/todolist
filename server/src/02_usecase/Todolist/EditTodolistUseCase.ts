import { ITodolistRepository, Todolist_attrs } from "../../01_repository/TodolistRepository"
import { Failure, Result } from "../../type"
import { UseCaseError } from "../UseCaseError"



export interface IEditTodolistUseCase {
  execute: (todolist_attrs: Todolist_attrs) => Promise<Result<Todolist_attrs, UseCaseError>>
}

export class EditTodolistUseCase implements IEditTodolistUseCase {
  TR: ITodolistRepository

  constructor( TodolistRepository: ITodolistRepository) {
    this.TR = TodolistRepository
  }

  execute = async (todolist_attrs: Todolist_attrs) :Promise<Result<Todolist_attrs, UseCaseError>> => {
    const todolistRes = await this.TR.upsertTodolist(todolist_attrs)
    if ( todolistRes.isFailure() ) {
      return new Failure<UseCaseError>(new UseCaseError("DB_ACCESS_ERROR"))
    }

    return todolistRes
  }
}