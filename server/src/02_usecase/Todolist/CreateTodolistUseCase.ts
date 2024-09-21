import { randomUUID } from "crypto"
import { ITodolistRepository, Todolist_attrs } from "../../01_repository/TodolistRepository"
import { Failure, Result } from "../../type"
import { UseCaseError } from "../UseCaseError"




type NewTodolist = {
  todolist_title: string,
  username: string,
  style: string,
}

export interface ICreateTodolistUseCase {
  execute: (newTodolist: NewTodolist) => Promise<Result<Todolist_attrs, UseCaseError>>
}

export class CreateTodolistUseCase implements ICreateTodolistUseCase {
  TR: ITodolistRepository

  constructor( TodolistRepository: ITodolistRepository) {
    this.TR = TodolistRepository
  }

  execute = async (newTodolist: NewTodolist) :Promise<Result<Todolist_attrs, UseCaseError>> => {
    const newTodolistId = randomUUID().toString()
    const newDate = new Date()

    const todolistRes = await this.TR.upsertTodolist({
      ...newTodolist,
      todolist_id: newTodolistId,
      updatedAt: newDate
    })
    if ( todolistRes.isFailure() ) {
      return new Failure<UseCaseError>(new UseCaseError("DB_ACCESS_ERROR"))
    }

    return todolistRes
  }
}