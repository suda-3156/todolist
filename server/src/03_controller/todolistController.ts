import { Request, Response } from "express";
import { ApiError, ParamsApiError } from "./type";

import { ICreateTodolistUseCase } from "../02_usecase/Todolist/CreateTodolistUseCase";
import { ICreateTodoUseCase } from "../02_usecase/Todolist/CreateTodoUseCase";
import { IGetTodolistOverviewUseCase } from "@/02_usecase/Todolist/GetTodolistOverviewUseCase";
import { IGetTodosUseCase } from "@/02_usecase/Todolist/GetTodosUseCase";
import { IEditTodolistUseCase } from "../02_usecase/Todolist/EditTodolistUseCase";
import { IEditTodoUseCase } from "../02_usecase/Todolist/EditTodoUseCase";
import { IClearTodoUseCase } from "../02_usecase/Todolist/ClearTodoUseCase";
import { IDeleteTodolistUseCase } from "../02_usecase/Todolist/DeleteTodolistUseCase";
import { IGetStyleUseCase } from "@/02_usecase/Style/GetStyleUseCase";


import { NewTodoSchema } from "./validation/NewTodoSchema";
import { NewTodolistSchema } from "./validation/NewTodolistSchema";
import { GetTodosSchema } from "./validation/GetTodosSchema";
import { EditTodoSchema } from "./validation/EditTodoSchema";
import { EditTodolistSchema } from "./validation/EditTodolistSchema";
import { UserType } from "@/01_repository/UserRepository";
import { GetTodolistOverviewSchema } from "./validation/GetTodolistOverviewSchema";
import { ClearTodoSchema } from "./validation/ClearTodoSchema";
import { DeleteTodolistSchema } from "./validation/DeleteTodolistSchema";
import { IGetStyleByIdUseCase } from "@/02_usecase/Style/GetStyleByIdUseCase";



export interface ITodolistController {
  createTodo:           (req: Request, res: Response) 
    => Promise<Response<any, Record<string, any>>>
  createTodolist:       (req: Request, res: Response) 
    => Promise<Response<any, Record<string, any>>>
  getTodos:             (req: Request, res: Response) 
    => Promise<Response<any, Record<string, any>>>
  getTodolistOverview:  (req: Request, res: Response) 
    => Promise<Response<any, Record<string, any>>>
  updateTodo:           (req: Request, res: Response) 
    => Promise<Response<any, Record<string, any>>>
  updateTodolist:       (req: Request, res: Response) 
    => Promise<Response<any, Record<string, any>>>
  clearTodo:            (req: Request, res: Response) 
    => Promise<Response<any, Record<string, any>>>
  deleteTodolist:       (req: Request, res: Response) 
    => Promise<Response<any, Record<string, any>>>
}

export class TodolistController implements ITodolistController {
  constructor(
    private readonly CreateTodoUseCase:           ICreateTodoUseCase,
    private readonly CreateTodolistUseCase:       ICreateTodolistUseCase,
    private readonly GetTodosUseCase:             IGetTodosUseCase,
    private readonly GetTodolistOverviewUseCase:  IGetTodolistOverviewUseCase,
    private readonly EditTodoUseCase:             IEditTodoUseCase,
    private readonly EditTodolistUseCase:         IEditTodolistUseCase,
    private readonly ClearTodoUseCase:            IClearTodoUseCase,
    private readonly DeleteTodolistUseCase:       IDeleteTodolistUseCase,
    private readonly GetStyleUseCase:             IGetStyleUseCase,
    // private readonly GetStyleByIdUseCase:         IGetStyleByIdUseCase,
  ) {}

  createTodo = async (
    req: Request,
    res: Response
  ) :Promise<Response<any, Record<string, any>>> => {
    // parameter check
    const result = NewTodoSchema.safeParse(req.body.todo)
    if (!result.success) {
      const response :ParamsApiError = {
        title:    "PARAMETER_ERROR",
        category: "BAD_REQUEST",
        status:   400
      }
      return res.status(400).json(response)
    }

    // userはmidlewareのverifyTokenでreq.body.userに入っているはず．
    const user_data = req.body.user as UserType

    // style → style_id
    const style_data = await this.GetStyleUseCase.execute(result.data.style)
    if ( style_data.isFailure() ) {
      switch ( style_data.error.category ) {
        case "RECORD_NOT_FOUND":
          return res.status(400).json({
            title:    "PARAMETER_ERROR",
            category: "BAD_REQUEST",
            message:  "Style or Todolist not found",
            status:   400
          })
        default: 
          const response :ApiError = {
            title:    "FAILED_TO_CREATE_USER",
            category: "SYSTEM_ERROR",
            status:   500
          }
          return res.status(500).json(response) 
      }
    }

    // create new todo
    const newTodo_or_error = await this.CreateTodoUseCase.execute({
      todolist_id:    result.data.todolist_id,
      user_id:        user_data.user_id,
      todo_title:     result.data.todo_title,
      style_id:       style_data.value.style_id,
    })
    if ( newTodo_or_error.isFailure() ) {
      switch ( newTodo_or_error.error.category ) {
        default: 
          const response :ApiError = {
            title:    "FAILED_TO_CREATE_USER",
            category: "SYSTEM_ERROR",
            status:   500
          }
          return res.status(500).json(response) 
      }
    }

    // res
    return res.status(201).json({
      title:  "SUCCESS",
      todo:   {
        ...newTodo_or_error.value,
        style: style_data.value.style
      }
    })
  }

  createTodolist = async (
    req: Request, 
    res: Response
  ) => {
    //parameter check
    const result = NewTodolistSchema.safeParse(req.body.todolist)
    if ( !result.success ) {
      const response :ParamsApiError = {
        title:    "PARAMETER_ERROR",
        category: "BAD_REQUEST",
        status:   400
      }
      return res.status(400).json(response)
    }

    // userはmidlewareのverifyTokenでreq.body.userに入っているはず．
    const user_data = req.body.user as UserType

    // style → style_id
    const style_data = await this.GetStyleUseCase.execute(result.data.style)
    if ( style_data.isFailure() ) {
      switch ( style_data.error.category ) {
        case "RECORD_NOT_FOUND":
          return res.status(400).json({
            title:    "PARAMETER_ERROR",
            category: "BAD_REQUEST",
            message:  "Style or Todolist not found",
            status:   400
          })  
        default: 
          const response :ApiError = {
            title:    "FAILED_TO_CREATE_USER",
            category: "SYSTEM_ERROR",
            status:   500
          }
          return res.status(500).json(response) 
      }
    }

    // create new todolist
    const newTodolist_or_error = await this.CreateTodolistUseCase.execute({
      user_id:        user_data.user_id,
      todolist_title: result.data.todolist_title,
      style_id:       style_data.value.style_id,
    })
    if ( newTodolist_or_error.isFailure() ) {
      switch ( newTodolist_or_error.error.category ) {
        default: 
          const response :ApiError = {
            title:    "FAILED_TO_CREATE_USER",
            category: "SYSTEM_ERROR",
            status:   500
          }
          return res.status(500).json(response) 
      }
    }

    // res
    return res.status(201).json({
      title:  "SUCCESS",
      todo:   {
        ...newTodolist_or_error.value,
        style: style_data.value.style
      }
    })
  }

  getTodos = async (
    req: Request,
    res: Response
  ) => {
    // parameter check
    const result = GetTodosSchema.safeParse(req.body.todo)
    if ( !result.success ) {
      const response :ParamsApiError = {
        title:    "PARAMETER_ERROR",
        category: "BAD_REQUEST",
        status:   400
      }
      return res.status(400).json(response)
    }

    // get
    const resTodos_or_error = await this.GetTodosUseCase.execute(
      result.data.todolist_id,
      result.data.skip,
      result.data.take
    )
    if ( resTodos_or_error.isFailure() ) {
      switch ( resTodos_or_error.error.category ) {
        case "RECORD_NOT_FOUND":
          return res.status(400).json({
            title:    "RECORD_NOT_FOUND",
            category: "BAD_REQUEST",
            message:  "todo not found",
            status:   400
          })
        default: 
          const response :ApiError = {
            title:    "FAILED_TO_CREATE_USER",
            category: "SYSTEM_ERROR",
            status:   500
          }
          return res.status(500).json(response) 
      }
    }

    // const style_data = await Promise.all(
    //   resTodos_or_error.value.map( async (todo) => {
    //     const each_style_data = await this.GetStyleByIdUseCase.execute(todo.style_id)
    //     return {
    //       ...todo,
    //       each_style_data: each_style_data,
    //     }
    //   })
    // )

    return res.status(201).json({
      title: "SUCCESS",
      todos: {
        ...resTodos_or_error.value,
        // style
        // XXX: DARURURURURUR
      }
    })
  }
getTodolistOverview = async (
    req: Request,
    res: Response
  ) :Promise<Response<any, Record<string, any>>> => {
    // param check
    const result = GetTodolistOverviewSchema.safeParse(req.body.todolist)
    if ( !result.success ) {
      const response :ParamsApiError = {
        title:    "PARAMETER_ERROR",
        category: "BAD_REQUEST",
        status:   400
      }
      return res.status(400).json(response)
    }

    // verifyTokenでreq.body.user as UserTypeなはず
    const user_data = req.body.user as UserType

    const todolistOverview = await this.GetTodolistOverviewUseCase.execute(
      user_data.user_id,
      result.data.skip,
      result.data.take,
    )
    if ( todolistOverview.isFailure() ) {
      switch ( todolistOverview.error.category ) {
        case "RECORD_NOT_FOUND":
          return res.status(400).json({
            title:    "PARAMETER_ERROR",
            category: "BAD_REQUEST",
            message:  "Style not found",
            status:   400
          })
        default: 
          const response :ApiError = {
            title:    "FAILED_TO_CREATE_USER",
            category: "SYSTEM_ERROR",
            status:   500
          }
          return res.status(500).json(response) 
      }
    }

    return res.status(201).json({
      title: "SUCCESS",
      todolistOverview: todolistOverview.value
    })
  }

  updateTodo = async (
    req: Request,
    res: Response
  ) :Promise<Response<any, Record<string, any>>> => {
    //param check
    const result = EditTodoSchema.safeParse(req.body.todo)
    if ( !result.success ) {
      const response :ParamsApiError = {
        title:    "PARAMETER_ERROR",
        category: "BAD_REQUEST",
        status:   400
      }
      return res.status(400).json(response)
    }

    // userはmidlewareのverifyTokenでreq.body.userに入っているはず．
    const user_data = req.body.user as UserType

    // style → style_id
    const style_data = await this.GetStyleUseCase.execute(result.data.style)
    if ( style_data.isFailure() ) {
      switch ( style_data.error.category ) {
        case "RECORD_NOT_FOUND":
          return res.status(400).json({
            title:    "PARAMETER_ERROR",
            category: "BAD_REQUEST",
            message:  "Style or Todolist not found",
            status:   400
          })
        default: 
          const response :ApiError = {
            title:    "FAILED_TO_CREATE_USER",
            category: "SYSTEM_ERROR",
            status:   500
          }
          return res.status(500).json(response) 
      }
    }

    const newTodo_or_error = await this.EditTodoUseCase.execute({
      ...result.data, 
      user_id:  user_data.user_id,
      style_id: style_data.value.style_id,
    })
    if ( newTodo_or_error.isFailure() ) {
      switch ( newTodo_or_error.error.category ) {
        default: 
          const response :ApiError = {
            title: "FAILED_TO_CREATE_USER",
            category: "SYSTEM_ERROR",
            status: 500
          }
          return res.status(500).json(response) 
      }
    }

    return res.status(201).json({
      title: "SUCCESS",
      todo: newTodo_or_error.value
    })
  }

  updateTodolist = async (
    req: Request,
    res: Response
  ) :Promise<Response<any, Record<string, any>>> => {
    // param check
    const result = EditTodolistSchema.safeParse(req.body.todolist)
    if ( !result.success ) {
      const response :ParamsApiError = {
        title:    "PARAMETER_ERROR",
        category: "BAD_REQUEST",
        status:   400
      }
      return res.status(400).json(response)
    }

    // userはmidlewareのverifyTokenでreq.body.userに入っているはず．
    const user_data = req.body.user as UserType

    // style → style_id
    const style_data = await this.GetStyleUseCase.execute(result.data.style)
    if ( style_data.isFailure() ) {
      switch ( style_data.error.category ) {
        case "RECORD_NOT_FOUND":
          return res.status(400).json({
            title:    "PARAMETER_ERROR",
            category: "BAD_REQUEST",
            message:  "Style or Todolist not found",
            status:   400
          })
        default: 
          const response :ApiError = {
            title:    "FAILED_TO_CREATE_USER",
            category: "SYSTEM_ERROR",
            status:   500
          }
          return res.status(500).json(response) 
      }
    }

    const todolist_or_error = await this.EditTodolistUseCase.execute({
      ...result.data, 
      user_id:  user_data.user_id,
      style_id: style_data.value.style_id,
    })
    if ( todolist_or_error.isFailure() ) {
      switch ( todolist_or_error.error.category ) {
        default: 
          const response :ApiError = {
            title:    "FAILED_TO_CREATE_USER",
            category: "SYSTEM_ERROR",
            status:   500
          }
          return res.status(500).json(response) 
      }
    }

    return res.status(201).json({
      title:  "SUCCESS",
      todo:   todolist_or_error.value
    })
  }

  clearTodo = async (
    req: Request,
    res: Response
  ) => {
    // parameter check
    const result = ClearTodoSchema.safeParse(req.body.todo)
    if ( !result.success ) {
      const response :ParamsApiError = {
        title:    "PARAMETER_ERROR",
        category: "BAD_REQUEST",
        status:   400
      }
      return res.status(400).json(response)
    }

    // clear
    const resTodo_or_error = await this.ClearTodoUseCase.execute(
      result.data.todo_id,
    )
    if ( resTodo_or_error.isFailure() ) {
      switch ( resTodo_or_error.error.category ) {
        case "RECORD_NOT_FOUND":
          return res.status(400).json({
            title:    "RECORD_NOT_FOUND",
            category: "BAD_REQUEST",
            message:  "todo not found",
            status:   400
          })
        default: 
          const response :ApiError = {
            title:    "FAILED_TO_CREATE_USER",
            category: "SYSTEM_ERROR",
            status:   500
          }
          return res.status(500).json(response) 
      }
    }

    return res.status(201).json({
      title: "SUCCESS",
      todos: resTodo_or_error.value
    })
  }

  deleteTodolist = async (
    req: Request,
    res: Response
  ) => {
    // parameter check
    const result = DeleteTodolistSchema.safeParse(req.body.todolist)
    if ( !result.success ) {
      const response :ParamsApiError = {
        title:    "PARAMETER_ERROR",
        category: "BAD_REQUEST",
        status:   400
      }
      return res.status(400).json(response)
    }

    // clear
    const todolist_or_error = await this.DeleteTodolistUseCase.execute(
      result.data.todolist_id,
    )
    if ( todolist_or_error.isFailure() ) {
      switch ( todolist_or_error.error.category ) {
        case "RECORD_NOT_FOUND":
          return res.status(400).json({
            title:    "RECORD_NOT_FOUND",
            category: "BAD_REQUEST",
            message:  "todo not found",
            status:   400
          })
        default: 
          const response :ApiError = {
            title:    "FAILED_TO_CREATE_USER",
            category: "SYSTEM_ERROR",
            status:   500
          }
          return res.status(500).json(response) 
      }
    }

    return res.status(201).json({
      title: "SUCCESS",
      todos: todolist_or_error.value
    })
  }
}