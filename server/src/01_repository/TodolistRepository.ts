import { PrismaClient } from "@prisma/client"
import { Failure, Result, Success } from "../type"
import { RepositoryError } from "./RepositoryError"


export type Todolist_attrs = {
  todolist_id: string,
  todolist_title: string,
  style: string,
  name: string,
  updatedAt: Date,
}

export type Todo = {
  todo_id: string,
  todolist_id: string,
  todo_title: string,
  completed: boolean,
  deleted: boolean,
  style: string,
  updatedAt: Date,
  name: string
}


export interface ITodolistRepository {
  // idで該当するものを返す
  findByTodolistId: (todolist_id: string,) => Promise<Result<Todolist_attrs, RepositoryError>>
  findByTodoId: (todo_id: string) => Promise<Result<Todo, RepositoryError>>

  // 親のIDで子を返す
  getListByUserId: (user_id: string, skip: number, take: number) => Promise<Result<Todolist_attrs[], RepositoryError>>
  getListByTodolistId: (todolist_id: string, skip: number, take: number) => Promise<Result<Todo[], RepositoryError>>

  // idでupsert
  upsertTodolist: (todolist_attrs: Todolist_attrs) => Promise<Result<Todolist_attrs, RepositoryError>>
  upsertTodo: (todo: Todo) => Promise<Result<Todo, RepositoryError>>
  
  // idでdelete
  deleteTodolist: (todolist_id: string) => Promise<Result<Todolist_attrs, RepositoryError>>
  deleteTodo: (todo_id: string) => Promise<Result<Todo, RepositoryError>>
}

export class TodolistRepository implements ITodolistRepository {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  findByTodolistId = async (todolist_id: string) :Promise<Result<Todolist_attrs, RepositoryError>> => {
    try {
      const raw_todolist_attrs = await this.prisma.todolist.findUnique({
        where: { todolist_id: todolist_id },
        select: {
          todolist_id: true,
          todolist_title: true,
          updatedAt: true,
          style: true,
          user: true
        }
      })
      if( !raw_todolist_attrs ) {
        return new Failure<RepositoryError>(new RepositoryError("RECORD_NOT_FOUND"))
      }
  
      const todolist_attrs = {
        ...raw_todolist_attrs,
        name: raw_todolist_attrs.user.name,
        style: raw_todolist_attrs.style.style
      }
      return new Success<Todolist_attrs>(todolist_attrs)

    } catch (error) {
      return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
    }
  }

  findByTodoId = async (todo_id: string) :Promise<Result<Todo, RepositoryError>> => {
    try {
      const raw_todo = await this.prisma.todo.findUnique({
        where: { todo_id: todo_id },
        select: {
          todo_id: true,
          todo_title: true,
          completed: true,
          deleted: true,
          style: true,
          updatedAt: true,
          todolist_id: true
        }
      })
      if( !raw_todo ) {
        return new Failure<RepositoryError>(new RepositoryError("RECORD_NOT_FOUND"))
      }
  
      const todo = {
        ...raw_todo,
        style: raw_todo.style.style
      }
      return new Success<Todo>(todo)
      
    } catch (error) {
      return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
    }
  }

  getListByUserId = async (user_id: string) :Promise<Result<Todolist_attrs[], RepositoryError>> => {
    try {
      const raw_todolist_attrs_list = await this.prisma.todolist.findMany({
        where: { user_id: user_id },
        select: {
          todolist_id: true,
          todolist_title: true,
          updatedAt: true,
          style: true,
          user: true,
        }
      })

      const todolist_attrs_list = (raw_todolist_attrs_list).map((raw_todolist_attrs) => {
        return {
          todolist_id: raw_todolist_attrs.todolist_title,
          todolist_title: raw_todolist_attrs.todolist_id,
          style: raw_todolist_attrs.style.style,
          name: raw_todolist_attrs.user.name,
          updatedAt: raw_todolist_attrs.updatedAt
        }
      })

      return new Success<Todolist_attrs[]>(todolist_attrs_list)

    } catch (error) {
      return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
    }
  }

  getListByTodolistId = async (todolist_id: string, skip: number, take: number) :Promise<Result<Todo[], RepositoryError>> => {
    try {
      const raw_todo_list = await this.prisma.todo.findMany({
        skip: skip,
        take: take,
        where: { todolist_id: todolist_id },
        select: {
          todo_id: true,
          todo_title: true,
          completed: true,
          deleted: true,
          style: true,
          updatedAt: true,
          todolist_id: true
        }
      }) 

      const todo_list = (raw_todo_list).map((todo) => {
        return {
          ...todo,
          style: todo.style.style,
        }
      })

      return new Success<Todo[]>(todo_list)
    } catch (error) {
      return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
    }
  }

  upsertTodolist = async (todolist_attrs: Todolist_attrs) :Promise<Result<Todolist_attrs, RepositoryError>> => {
    try {
      const style_data = await this.prisma.style.findUnique({
        where: { style: todolist_attrs.style }
      })
      const user_data = await this.prisma.user.findUnique({
        where: { name: todolist_attrs.name }
      })
      if ( !style_data || !user_data ) {
        return new Failure<RepositoryError>(new RepositoryError("RECORD_NOT_FOUND"))
      }
  
      const new_todolist_attrs = await this.prisma.todolist.upsert({
        where: { todolist_id: todolist_attrs.todolist_id },
        create: {
          todolist_id: todolist_attrs.todolist_id,
          todolist_title: todolist_attrs.todolist_title,
          style_id: style_data.style_id,
          user_id: user_data.user_id,
        },
        update: {
          todolist_id: todolist_attrs.todolist_id,
          todolist_title: todolist_attrs.todolist_title,
          style_id: style_data.style_id,
        }
      })

      const retVal = {
        todolist_id: new_todolist_attrs.todolist_id,
        todolist_title: new_todolist_attrs.todolist_title,
        style: style_data.style,
        name: user_data.name,
        updatedAt: new_todolist_attrs.updatedAt
      }

      return new Success<Todolist_attrs>(retVal)
      
    } catch (error) {
      return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
    }
  }
  
  deleteTodolist = async (todolist_id: string) :Promise<Result<Todolist_attrs, RepositoryError>> => {
    try {
      const todolist_attrs = await this.prisma.todolist.delete({
        where: { todolist_id: todolist_id },
        select: {
          todolist_id: true,
          todolist_title: true,
          style: true,
          user: true,
          updatedAt: true
        }
      })

      const retVal = {
        todolist_id: todolist_attrs.todolist_id,
        todolist_title: todolist_attrs.todolist_title,
        style: todolist_attrs.style.style,
        name: todolist_attrs.user.name,
        updatedAt: todolist_attrs.updatedAt
      }

      return new Success<Todolist_attrs>(retVal)
    } catch (error) {
      return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
    }
  }
  
  upsertTodo = async (todo: Todo) :Promise<Result<Todo, RepositoryError>> => {
    try {
      const style_data = await this.prisma.style.findUnique({
        where: { style: todo.style }
      })
      if ( !style_data ) {
        return new Failure<RepositoryError>(new RepositoryError("RECORD_NOT_FOUND"))
      }
      
      const todolist_data = await this.prisma.todolist.findUnique({
        where: { todolist_id: todo.todolist_id }
      })
      if ( !todolist_data ) {
        return new Failure<RepositoryError>(new RepositoryError("RECORD_NOT_FOUND"))
      }
  
      const new_todo = await this.prisma.todo.upsert({
        where: { todo_id: todo.todo_id },
        create: {
          todolist_id: todo.todolist_id,
          todo_id: todo.todo_id,
          todo_title: todo.todo_title,
          completed: todo.completed,
          deleted: todo.deleted,
          style_id: style_data.style_id
        },
        update: {
          todo_title: todo.todo_title,
          completed: todo.completed,
          deleted: todo.deleted,
          style_id: style_data.style_id
        },
        select: {
          todo_id: true,
          todolist_id: true,
          todo_title: true,
          completed: true,
          deleted: true,
          style: true,
          updatedAt: true
        }
      })
  
      const retVal = {
        ...new_todo,
        style: new_todo.style.style      
      }
      return new Success<Todo>(retVal)
    } catch (error) {
      return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
    }
  }

  deleteTodo = async (todo_id: string) :Promise<Result<Todo, RepositoryError>> => {
    try {
      const todo = await this.prisma.todo.delete({
        where: { todo_id: todo_id },
        select: {
          todo_id: true,
          todolist_id: true,
          todo_title: true,
          completed: true,
          deleted: true,
          updatedAt: true,
          style: true
        }
      })

      return new Success<Todo>({
        ...todo,
        style: todo.style.style
      })
    } catch (error) {
      return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
    }
  }
}

//TODO: db初期化する