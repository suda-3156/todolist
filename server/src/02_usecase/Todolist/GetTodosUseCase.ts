import { ITodolistRepository, TodoType, Todolist_attrs } from "../../01_repository/TodolistRepository"
import { Failure, Result } from "../../type"
import { UseCaseError } from "../UseCaseError"



export interface IGetTodosUseCase {
  execute: (todolist_id: string, skip: number, take: number) 
    => Promise<Result<TodoType[], UseCaseError>>
}

export class GetTodosUseCase implements IGetTodosUseCase {
  constructor(
    private readonly TR: ITodolistRepository
  ){}

  execute = async (
    todolist_id:  string,
    skip:         number,
    take:         number,
  ) :Promise<Result<TodoType[], UseCaseError>> => {
    const todosRes = await this.TR.getListByTodolistId(todolist_id, skip, take)
    
    if ( todosRes.isFailure() ) {
      switch ( todosRes.error.category ) {
        case "RECORD_NOT_FOUND":
          return new Failure<UseCaseError>(new UseCaseError("RECORD_NOT_FOUND"))
        default:
          return new Failure<UseCaseError>(new UseCaseError("DB_ACCESS_ERROR"))
      }
    }

    return todosRes
  }
}