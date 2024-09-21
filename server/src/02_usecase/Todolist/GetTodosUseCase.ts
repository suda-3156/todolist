import { ITodolistRepository, Todo, Todolist_attrs } from "../../01_repository/TodolistRepository"
import { Failure, Result } from "../../type"
import { UseCaseError } from "../UseCaseError"




// type Todolist = {
//   todolist_attrs: Todolist_attrs,
//   todos: Todo[]
// }

export interface IGetTodosUseCase {
  execute: (todolist_id: string, skip: number, take: number) => Promise<Result<Todo[], UseCaseError>>
}

export class GetTodosUseCase implements IGetTodosUseCase {
  TR: ITodolistRepository

  constructor( TodolistRepository: ITodolistRepository) {
    this.TR = TodolistRepository
  }

  execute = async (todolist_id: string, skip: number, take: number) :Promise<Result<Todo[], UseCaseError>> => {
    const todos = await this.TR.getListByTodolistId(todolist_id, skip, take)
    if ( todos.isFailure() ) { 
      return new Failure<UseCaseError>(new UseCaseError("DB_ACCESS_ERROR"))
    }

    return todos
  }
}