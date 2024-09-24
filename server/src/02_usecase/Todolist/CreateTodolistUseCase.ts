import { randomUUID } from "crypto"
import { ITodolistRepository, Todolist_attrs } from "@/01_repository/TodolistRepository"
import { Failure, Result } from "@/type"
import { UseCaseError } from "../UseCaseError"




type NewTodolist = {
  user_id:        string,
  todolist_title: string,
  style_id:       number,
}

export interface ICreateTodolistUseCase {
  execute: (newTodolist: NewTodolist) => Promise<Result<Todolist_attrs, UseCaseError>>
}

export class CreateTodolistUseCase implements ICreateTodolistUseCase {
  constructor(
    private readonly TR: ITodolistRepository
  ){}

  execute = async (
    newTodolist: NewTodolist
  ) :Promise<Result<Todolist_attrs, UseCaseError>> => {
    // user_idの妥当性チェックはしない.このuser_idはverifyTokenで渡されたものになるから.
    
    const newTodolistId = randomUUID().toString()
    const newDate = new Date()

    const todolistRes = await this.TR.upsertTodolist({
      ...newTodolist,
      todolist_id: newTodolistId,
    })
    if ( todolistRes.isFailure() ) {
      return new Failure<UseCaseError>(new UseCaseError("DB_ACCESS_ERROR"))
    }

    return todolistRes
  }
}