import { randomUUID } from "crypto"
import { ITodolistRepository, Todo } from "../../01_repository/TodolistRepository"
import { Failure, Result } from "../../type"
import { UseCaseError } from "../UseCaseError"




type NewTodo = {
  todolist_id: string,
  todo_title: string,
  style: string,
}

export interface ICreateTodoUseCase {
  execute: (newTodo: NewTodo) => Promise<Result<Todo, UseCaseError>>
}

export class CreateTodoUseCase implements ICreateTodoUseCase {
  TR: ITodolistRepository

  constructor( TodolistRepository: ITodolistRepository) {
    this.TR = TodolistRepository
  }

  execute = async (newTodo: NewTodo) :Promise<Result<Todo, UseCaseError>> => {
    const newTodoId = randomUUID().toString()
    const newDate = new Date()

    const todoRes = await this.TR.upsertTodo({
      ...newTodo,
      todo_id: newTodoId,
      completed: false,
      deleted: false,
      updatedAt: newDate
    })
    if ( todoRes.isFailure() ) {
      if ( todoRes.error.errorType === "RECORD_NOT_FOUND") {
        return new Failure<UseCaseError>(new UseCaseError("RECORD_NOT_FOUND"))
      }
      return new Failure<UseCaseError>(new UseCaseError("DB_ACCESS_ERROR"))
    }

    return todoRes
  }
}