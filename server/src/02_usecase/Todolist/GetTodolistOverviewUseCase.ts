import { ITodolistRepository, Todo, Todolist_attrs } from "../../01_repository/TodolistRepository"
import { IUserRepository } from "../../01_repository/UserRepository"
import { Failure, Result, Success } from "../../type"
import { UseCaseError } from "../UseCaseError"




type Todolist = {
  todolist_attrs: Todolist_attrs,
  todos: Todo[]
}

export interface IGetTodolistOverviewUseCase {
  execute: (username: string) => Promise<Result<Todolist[], UseCaseError>>
}

export class GetTodolistOverviewUseCase implements IGetTodolistOverviewUseCase {
  TR: ITodolistRepository
  UR: IUserRepository

  constructor( TodolistRepository: ITodolistRepository, UserRepository: IUserRepository) {
    this.TR = TodolistRepository
    this.UR = UserRepository
  }

  execute = async (username: string) :Promise<Result<Todolist[], UseCaseError>> => {
    const user_data = await this.UR.findByName(username)
    if ( user_data.isFailure() ){
      if ( user_data.error.errorType === "RECORD_NOT_FOUND") {
        return new Failure<UseCaseError>(new UseCaseError("RECORD_NOT_FOUND"))
      }
      return new Failure<UseCaseError>(new UseCaseError("DB_ACCESS_ERROR"))
    }
    
    const todolist_attrs_list = await this.TR.getListByUserId(user_data.value.user_id)
    if ( todolist_attrs_list.isFailure() ) {
      return new Failure<UseCaseError>(new UseCaseError("DB_ACCESS_ERROR"))
    }

    const todolists = await Promise.all(
      todolist_attrs_list.value.map(async (todolist_attrs) => {
        const todos = await this.TR.getListByTodolistId(todolist_attrs.todolist_id, 0, 5)
        if ( todos.isFailure() ) {
          throw new Error
        }

        return {
          todolist_attrs: todolist_attrs,
          todos: todos.value
        }
      })
    ).catch(() => {
      return new Error
    })
    if ( todolists instanceof Error ) {
      return new Failure<UseCaseError>(new UseCaseError("DB_ACCESS_ERROR"))
    }

    return new Success<Todolist[]>(todolists)
  }
}