import { ITodolistRepository, Todolist_attrs } from "../../01_repository/TodolistRepository"
import { Failure, Result } from "../../type"
import { UseCaseError } from "../UseCaseError"



export interface IDeleteTodolistUseCase {
  execute: (todolist_id: string) => Promise<Result<Todolist_attrs, UseCaseError>>
}

export class DeleteTodolistUseCase implements IDeleteTodolistUseCase {
  TR: ITodolistRepository

  constructor( TodolistRepository: ITodolistRepository) {
    this.TR = TodolistRepository
  }

  execute = async (todolist_id: string) :Promise<Result<Todolist_attrs, UseCaseError>> => {
    const todolistRes = await this.TR.deleteTodolist(todolist_id)
    if ( todolistRes.isFailure() ) {
      return new Failure<UseCaseError>(new UseCaseError("DB_ACCESS_ERROR"))
    }

    return todolistRes
  }
}