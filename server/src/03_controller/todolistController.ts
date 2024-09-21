import { IClearTodoUseCase } from "../02_usecase/Todolist/ClearTodoUseCase";
import { ICreateTodolistUseCase } from "../02_usecase/Todolist/CreateTodolistUseCase";
import { ICreateTodoUseCase } from "../02_usecase/Todolist/CreateTodoUseCase";
import { IDeleteTodolistUseCase } from "../02_usecase/Todolist/DeleteTodolistUseCase";
import { IEditTodolistUseCase } from "../02_usecase/Todolist/EditTodolistUseCase";
import { IEditTodoUseCase } from "../02_usecase/Todolist/EditTodoUseCase";
import { IGetTodolistOverviewUseCase } from "../02_usecase/Todolist/GetTodolistOverviewUseCase";
import { IGetTodosUseCase } from "../02_usecase/Todolist/GetTodosUseCase";





export interface ITodolistController {

}

export class TodolistController implements ITodolistController {
  private ClearTodoUseCase: IClearTodoUseCase 
  private CreateTodoUseCase: ICreateTodoUseCase
  private CreateTodolistUseCase: ICreateTodolistUseCase
  private DeleteTodolistUseCase: IDeleteTodolistUseCase
  private EditTodoUseCase: IEditTodoUseCase
  private EditTodolistUseCase: IEditTodolistUseCase
  private GetTodosUseCase: IGetTodosUseCase
  private GetTodolistOverviewUseCase: IGetTodolistOverviewUseCase

  constructor(
    ClearTodoUseCase: IClearTodoUseCase,
    CreateTodoUseCase: ICreateTodoUseCase,
    CreateTodolistUseCase: ICreateTodolistUseCase,
    DeleteTodolistUseCase: IDeleteTodolistUseCase,
    EditTodoUseCase: IEditTodoUseCase,
    EditTodolistUseCase: IEditTodolistUseCase,
    GetTodosUseCase: IGetTodosUseCase,
    GetTodolistOverviewUseCase: IGetTodolistOverviewUseCase
  ) {
    this.ClearTodoUseCase = ClearTodoUseCase
    this.CreateTodoUseCase = CreateTodoUseCase
    this.CreateTodolistUseCase = CreateTodolistUseCase
    this.DeleteTodolistUseCase = DeleteTodolistUseCase
    this.EditTodoUseCase = EditTodoUseCase
    this.EditTodolistUseCase = EditTodolistUseCase
    this.GetTodosUseCase = GetTodosUseCase
    this.GetTodolistOverviewUseCase = GetTodolistOverviewUseCase
  }

  
}