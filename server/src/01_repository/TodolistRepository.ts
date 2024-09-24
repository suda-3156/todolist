/**
 * TodolistRepository
 * 
 * todolist_attrsの基本情報
 *  todolist_id:      string
 *  user_id:          string
 *  todolist_title:   string  max: 128
 *  style_id:         number
 *  updatedAt:        Date
 * 
 * todolistのアイテム,todoの基本情報
 *  todo_id:          string
 *  todolist_id:      string
 *  user_id:          string
 *  todo_title:       string  max: 128
 *  completed:        boolean
 *  deleted:          boolean
 *  style_id:         number
 *  updatedAt:        Date
 */

import { PrismaClient } from "@prisma/client"
import { Failure, Result, Success } from "../type"
import { RepositoryError } from "./RepositoryError"


export type Todolist_attrs = {
  todolist_id:    string,
  user_id:        string,
  todolist_title: string,
  style_id:       number,
  updatedAt:      Date,
}

export type TodoType = {
  todo_id:        string,
  todolist_id:    string,
  user_id:        string,
  todo_title:     string,
  completed:      boolean,
  deleted:        boolean,
  style_id:       number,
  updatedAt:      Date,
}

export type UpsertTodolist_attrs = {
  todolist_id:    string,
  user_id:        string,
  todolist_title: string,
  style_id:       number,
}

export type UpsertTodoType = {
  todo_id:        string,
  todolist_id:    string,
  user_id:        string,
  todo_title:     string,
  completed:      boolean,
  deleted:        boolean,
  style_id:       number,
}


export interface ITodolistRepository {
  // find
  findByTodolistId: (todolist_id: string)
    => Promise<Result<Todolist_attrs, RepositoryError>>
  findByTodoId: (todo_id: string)
    => Promise<Result<TodoType, RepositoryError>>

  // 親のIDで子を返す
  getListByUserId: (user_id: string, skip: number, take: number)
    => Promise<Result<Todolist_attrs[], RepositoryError>>
  getListByTodolistId: (todolist_id: string, skip: number, take: number)
    => Promise<Result<TodoType[], RepositoryError>>

  // upsert
  upsertTodolist: (todolist_attrs: UpsertTodolist_attrs)
    => Promise<Result<Todolist_attrs, RepositoryError>>
  upsertTodo: (todo: UpsertTodoType)
    => Promise<Result<TodoType, RepositoryError>>
  
  // delete
  deleteTodolist: (todolist_id: string) 
    => Promise<Result<Todolist_attrs, RepositoryError>>
  deleteTodo: (todo_id: string) 
    => Promise<Result<TodoType, RepositoryError>>
}

export class TodolistRepository implements ITodolistRepository {
  constructor(
    private prisma: PrismaClient
  ){}

  findByTodolistId = async (
    todolist_id: string
  ) :Promise<Result<Todolist_attrs, RepositoryError>> => {
    const todolist_attrs_or_error = await ( async() => {
      try {
        return await this.prisma.todolist.findUnique({
          where: { todolist_id: todolist_id },
          select: {
            todolist_id:    true,
            user_id:        true,
            todolist_title: true,
            style_id:       true,
            updatedAt:      true,
          }
        })
      } catch (error) {
        return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
      }})()

    if ( todolist_attrs_or_error instanceof Failure ){
      return todolist_attrs_or_error
    }
    if ( todolist_attrs_or_error === null ) {
      return new Failure<RepositoryError>(new RepositoryError("RECORD_NOT_FOUND"))
    }
    
    return new Success<Todolist_attrs>(todolist_attrs_or_error)
  }

  findByTodoId = async (
    todo_id: string
  ) :Promise<Result<TodoType, RepositoryError>> => {
    const todo_or_error = await ( async() => {
      try {
        return await this.prisma.todo.findUnique({
          where: { todo_id: todo_id },
          select: {
            todo_id:        true,
            todolist_id:    true,
            user_id:        true,
            todo_title:     true,
            completed:      true,
            deleted:        true,
            style_id:       true,
            updatedAt:      true,
          }
        })
      } catch (error) {
        return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
      }})()

    if ( todo_or_error instanceof Failure ){
      return todo_or_error
    }
    if ( todo_or_error === null ) {
      return new Failure<RepositoryError>(new RepositoryError("RECORD_NOT_FOUND"))
    }
    
    return new Success<TodoType>(todo_or_error)
  }

  getListByUserId = async (
    user_id: string
  ) :Promise<Result<Todolist_attrs[], RepositoryError>> => {
    const todolist_attrs_list_or_error = await ( async() => {
      try {
        return await this.prisma.todolist.findMany({
          where: { user_id: user_id },
          select: {
            todolist_id:    true,
            user_id:        true,
            todolist_title: true,
            style_id:       true,
            updatedAt:      true,
          }
        })
      } catch (error) {
        return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
      }})()

    if ( todolist_attrs_list_or_error instanceof Failure ){
      return todolist_attrs_list_or_error
    }
    
    return new Success<Todolist_attrs[]>(todolist_attrs_list_or_error)
  }

  getListByTodolistId = async (
    todolist_id: string,
    skip: number,
    take: number
  ) :Promise<Result<TodoType[], RepositoryError>> => {
    const todo_list_or_error = await ( async() => {
      try {
        return await this.prisma.todo.findMany({
          skip: skip,
          take: take,
          where: { todolist_id: todolist_id },
          select: {
            todo_id:        true,
            todolist_id:    true,
            user_id:        true,
            todo_title:     true,
            completed:      true,
            deleted:        true,
            style_id:       true,
            updatedAt:      true,
          }
        })
      } catch (error) {
        return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
      }})()

    if ( todo_list_or_error instanceof Failure ){
      return todo_list_or_error
    }
    
    return new Success<TodoType[]>(todo_list_or_error)
  }

  upsertTodolist = async ({
    todolist_id,
    user_id,
    todolist_title,
    style_id,
  }: UpsertTodolist_attrs) :Promise<Result<Todolist_attrs, RepositoryError>> => {
    const todolist_attrs_or_error = await ( async() => {
      try {
        return await this.prisma.todolist.upsert({
          where: { todolist_id: todolist_id },
          create: {
            todolist_id:    todolist_id,
            user_id:        user_id,
            todolist_title: todolist_title,
            style_id:       style_id,
          },
          update: {
            todolist_title: todolist_title,
            style_id:       style_id,
          },
          select: {
            todolist_id:    true,
            user_id:        true,
            todolist_title: true,
            style_id:       true,
            updatedAt:      true,
          }
        })
      } catch (error) {
        return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
      }})()

    if ( todolist_attrs_or_error instanceof Failure ){
      return todolist_attrs_or_error
    }
    
    return new Success<Todolist_attrs>(todolist_attrs_or_error)
  }

  upsertTodo = async ({
    todo_id,
    todolist_id,
    user_id,
    todo_title,
    completed,
    deleted,
    style_id,
  }: UpsertTodoType) :Promise<Result<TodoType, RepositoryError>> => {
    const todo_or_error = await ( async() => {
      try {
        return await this.prisma.todo.upsert({
          where: { todo_id: todo_id },
          create: {
            todo_id:      todo_id,
            todolist_id:  todolist_id,
            user_id:      user_id,
            todo_title:   todo_title,
            completed:    completed,
            deleted:      deleted,
            style_id:     style_id,
          },
          update: {
            todolist_id:  todolist_id,
            todo_title:   todo_title,
            completed:    completed,
            deleted:      deleted,
            style_id:     style_id,
          },
          select: {
            todo_id:      true,
            todolist_id:  true,
            user_id:      true,
            todo_title:   true,
            completed:    true,
            deleted:      true,
            style_id:     true,
            updatedAt:    true,
          }
        })
      } catch (error) {
        return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
      }})()

    if ( todo_or_error instanceof Failure ){
      return todo_or_error
    }
    
    return new Success<TodoType>(todo_or_error)
  }
  
  deleteTodolist = async (
    todolist_id: string
  ) :Promise<Result<Todolist_attrs, RepositoryError>> => {
    const todolist_attrs_or_error = await ( async() => {
      try {
        return await this.prisma.todolist.delete({
          where: { todolist_id: todolist_id },
          select: {
            todolist_id:    true,
            user_id:        true,
            todolist_title: true,
            style_id:       true,
            updatedAt:      true,
          }
        })
      } catch (error) {
        return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
      }})()

    if ( todolist_attrs_or_error instanceof Failure ){
      return todolist_attrs_or_error
    }
    
    return new Success<Todolist_attrs>(todolist_attrs_or_error)
  }

  deleteTodo = async (
    todo_id: string
  ) :Promise<Result<TodoType, RepositoryError>> => {
    const todo_or_error = await ( async() => {
      try {
        return await this.prisma.todo.delete({
          where: { todo_id: todo_id },
          select: {
            todo_id:        true,
            todolist_id:    true,
            user_id:        true,
            todo_title:     true,
            completed:      true,
            deleted:        true,
            style_id:       true,
            updatedAt:      true,
          }
        })
      } catch (error) {
        return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
      }})()

    if ( todo_or_error instanceof Failure ){
      return todo_or_error
    }
    
    return new Success<TodoType>(todo_or_error)
  }
}
