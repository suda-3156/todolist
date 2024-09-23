import { Request, Response } from "express";
import { IClearTodoUseCase } from "../02_usecase/Todolist/ClearTodoUseCase";
import { ICreateTodolistUseCase } from "../02_usecase/Todolist/CreateTodolistUseCase";
import { ICreateTodoUseCase } from "../02_usecase/Todolist/CreateTodoUseCase";
import { IDeleteTodolistUseCase } from "../02_usecase/Todolist/DeleteTodolistUseCase";
import { IEditTodolistUseCase } from "../02_usecase/Todolist/EditTodolistUseCase";
import { IEditTodoUseCase } from "../02_usecase/Todolist/EditTodoUseCase";
import { IRetrieveTodolistOverviewUseCase } from "../02_usecase/Todolist/RetrieveTodolistOverviewUseCase";
import { IRetrieveTodosUseCase } from "../02_usecase/Todolist/RetrieveTodosUseCase";
import { ApiError, ParamsApiError } from "./type";
import { NewTodoSchema } from "./validation/NewTodoSchema";
import { NewTodolistSchema } from "./validation/NewTodolistSchema";
import { RetrieveTodosSchema } from "./validation/RetrieveTodosSchema";





export interface ITodolistController {
  createTodo: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>
  createTodolist: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>
  retriveTodos: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>
  retriveTodolistOverview: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>
  updateTodo: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>
  updateTodolist: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>
  clearTodo: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>
  deleteTodolist: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>
}

export class TodolistController implements ITodolistController {
  constructor(
    private ClearTodoUseCase: IClearTodoUseCase,
    private CreateTodoUseCase: ICreateTodoUseCase,
    private CreateTodolistUseCase: ICreateTodolistUseCase,
    private DeleteTodolistUseCase: IDeleteTodolistUseCase,
    private EditTodoUseCase: IEditTodoUseCase,
    private EditTodolistUseCase: IEditTodolistUseCase,
    private RetrieveTodosUseCase: IRetrieveTodosUseCase,
    private RetrieveTodolistOverviewUseCase: IRetrieveTodolistOverviewUseCase
  ) {}

  createTodo = async (req: Request, res: Response) => {
    // parameter check
    const result = NewTodoSchema.safeParse(req.body.todo)
    if (!result.success) {
      const response :ParamsApiError = {
        title: "PARAMETER_ERROR",
        category: "BAD_REQUEST",
        status: 400
      }
      return res.status(400).json(response)
    }

    // create new todo
    const newTodo_or_error = await this.CreateTodoUseCase.execute(result.data)
    if ( newTodo_or_error.isFailure() ) {
      switch ( newTodo_or_error.error.category ) {
        case "RECORD_NOT_FOUND":
          return res.status(400).json({
            title: "PARAMETER_ERROR",
            category: "BAD_REQUEST",
            message: "Style or Todolist not found",
            status: 400
          })
        default: 
          const response :ApiError = {
            title: "FAILED_TO_CREATE_USER",
            category: "SYSTEM_ERROR",
            status: 500
          }
          return res.status(500).json(response) 
      }
    }

    // res
    const newTodo = newTodo_or_error.value
    return res.status(201).json({
      title: "SUCCESS",
      todo: newTodo
    })
  }

  createTodolist = async (req: Request, res: Response) => {
    //parameter check
    const result = NewTodolistSchema.safeParse(req.body.todolist)
    if ( !result.success ) {
      const response :ParamsApiError = {
        title: "PARAMETER_ERROR",
        category: "BAD_REQUEST",
        status: 400
      }
      return res.status(400).json(response)
    }

    // create new todolist
    const newTodolist_or_error = await this.CreateTodolistUseCase.execute(result.data)
    if ( newTodolist_or_error.isFailure() ) {
      switch ( newTodolist_or_error.error.category ) {
        case "RECORD_NOT_FOUND":
          return res.status(400).json({
            title: "PARAMETER_ERROR",
            category: "BAD_REQUEST",
            message: "Style not found",
            status: 400
          })
        default: 
          const response :ApiError = {
            title: "FAILED_TO_CREATE_USER",
            category: "SYSTEM_ERROR",
            status: 500
          }
          return res.status(500).json(response) 
      }
    }

    // res
    const newTodolist = newTodolist_or_error.value
    return res.status(201).json({
      title: "SUCCESS",
      todo: newTodolist
    })
  }

  retriveTodos = async (req: Request, res: Response) :Promise<Response<any, Record<string, any>>> => {
    // parameter check
    const result = RetrieveTodosSchema.safeParse(req.body.todolist)
    if ( !result.success ) {
      const response :ParamsApiError = {
        title: "PARAMETER_ERROR",
        category: "BAD_REQUEST",
        status: 400
      }
      return res.status(400).json(response)
    }

    // get
    const resTodos_or_error = await this.RetrieveTodosUseCase.execute(result.data.todolist_id, result.data.skip, result.data.take)
    if ( resTodos_or_error.isFailure() ) {
      switch ( resTodos_or_error.error.category ) {
        case "RECORD_NOT_FOUND":
          return res.status(400).json({
            title: "PARAMETER_ERROR",
            category: "BAD_REQUEST",
            message: "Style not found",
            status: 400
          })
        default: 
          const response :ApiError = {
            title: "FAILED_TO_CREATE_USER",
            category: "SYSTEM_ERROR",
            status: 500
          }
          return res.status(500).json(response) 
      }
    }

    const resTodos = resTodos_or_error.value
    return res.status(201).json({
      title: "SUCCESS",
      todos: resTodos
    })
  }

  retriveTodolistOverview = async (req: Request, res: Response) :Promise<Response<any, Record<string, any>>> => {
    // parameter check
    const result = req.body.name
    if ( !result.success ) {
      const response :ParamsApiError = {
        title: "PARAMETER_ERROR",
        category: "BAD_REQUEST",
        status: 400
      }
      return res.status(400).json(response)
    }

  }
  
}