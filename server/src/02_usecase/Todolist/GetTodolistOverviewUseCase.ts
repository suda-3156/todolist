import { ITodolistRepository, TodoType, Todolist_attrs } from "@/01_repository/TodolistRepository"
import { IUserRepository } from "@/01_repository/UserRepository"
import { Failure, Result, Success } from "../../type"
import { UseCaseError } from "../UseCaseError"




type Todolist = {
  todolist_attrs: Todolist_attrs,
  todos: TodoType[]
}

export interface IGetTodolistOverviewUseCase {
  execute: (user_id: string, skip: number, take: number) 
    => Promise<Result<Todolist[], UseCaseError>>
}

export class GetTodolistOverviewUseCase implements IGetTodolistOverviewUseCase {
  constructor(
    private readonly TR: ITodolistRepository,
    private readonly UR: IUserRepository
  ){}

  execute = async (
    user_id:  string, // user_idはverifyTokenで取得するものなので、妥当性チェックはしない.
    skip:     number,
    take:     number,
  ) :Promise<Result<Todolist[], UseCaseError>> => {
    
    const todolist_attrs_list = await this.TR.getListByUserId(user_id, skip, take)
    if ( todolist_attrs_list.isFailure() ) {
      switch ( todolist_attrs_list.error.category ) {
        default:
          return new Failure<UseCaseError>(new UseCaseError("DB_ACCESS_ERROR"))
      }
    }

    const todolists = await Promise.all(
      todolist_attrs_list.value.map(async (todolist_attrs) => {
        const todos = await this.TR.getListByTodolistId(todolist_attrs.todolist_id, 0, 10)
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