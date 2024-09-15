/**
 * TodolistRepository
 * @param user_id
 * @returns todolist
 *  todolist_id, todolit_title, 
 */

import { PrismaClient } from "@prisma/client"



type Todolist_attrs = {
  todolist_id: string,
  todolist_title: string,
  style: number,
  user_id: string,
  updatedAt: Date,
}

type Todo = {
  todo_id: string,
  todo_title: string,
  completed: boolean,
  deleted: boolean,
  style: number,
  updatedAt: Date
}


class TodolistRepositoryError extends Error {}

export interface ITodolistRepository {
  // user_idでtodolistを見つける
  findByUserId: (user_id: string, skip:number, take: number) => Promise<Todolist_attrs[]> 
  // todolist_idでtodolistを見つける
  findByTodolistId: (todolist_id: string) => Promise<Todolist_attrs>
  // todolist_idでtodosを指定されたoffset, lengthで見つける
  getTodos: (todolist_id: string, skip: number, take: number) => Promise<Todo[]>
  // todo_idでtodoを見つける
  findByTodoId: (todo_id: string) => Promise<Todo>
  // todolist_idでtodolist_attrsをupsertする
  upsertTodolist: (todolist: Todolist_attrs) => Promise<Todolist_attrs>
  // todolist_idでdeleteする(付随するtodosも)
  deleteTodolist: (todolist_id: string) => Promise<Todolist_attrs>
  // todo_idでupsertする
  upsertTodo: (todo: Todo) => Promise<Todo>
  // todo_idでdeleteする
  deleteTodo: (todo_id: string) => Promise<Todo>
}

export class TodolistRepository implements ITodolistRepository {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  findByUserId = async (user_id: string, skip:number, take: number) :Promise<Todolist_attrs[]> => {
    const todolist_attrs_list = await this.prisma.user_todolist.findMany({
      skip: skip,
      take: take,
      where: { user_id: user_id },
      select: {
        todolist_id: true,
        todolist_title: true,
        style: true,
        user_id: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    return todolist_attrs_list
  }

  findByTodolistId = async (todolist_id: string) :Promise<Todolist_attrs> => {
    const todolist_attrs = await this.prisma.user_todolist.findUnique({
      where: { todolist_id: todolist_id },
      select: {
        todolist_id: true,
        todolist_title: true,
        style: true,
        user_id: true,
        updatedAt: true,
      }
    })

    if ( !todolist_attrs ) {
      throw new TodolistRepositoryError
    }

    return todolist_attrs
  }

  getTodos = async (todolist_id: string, skip: number, take: number) :Promise<Todo[]> => {
    const todo_ids = await this.prisma.todolist_todo.findMany({
      skip: skip,
      take: take,
      where: { todolist_id: todolist_id },
      select: {
        todo_id: true,
        todo_title: true,
        updatedAt: true,
      },
      orderBy: {
        updatedAt: 'desc'
      }
    })

    const todos = await Promise.all(todo_ids.map( async (todo_attrs) => {
      const todo = await this.prisma.todo_info.findUnique({
        where: { todo_id: todo_attrs.todo_id }
      })
      if( !todo ) {
        throw new TodolistRepositoryError
      }
      return {
        todo_id: todo_attrs.todo_id,
        todo_title: todo_attrs.todo_title,
        completed: todo.completed,
        deleted: todo.deleted,
        style: todo.style,
        updatedAt: todo.updatedAt
      }
    }))

    return todos
  }

  findByTodoId = async (todo_id: string) :Promise<Todo> => {
    const todo_attrs = await this.prisma.todolist_todo.findUnique({
      where: { todo_id: todo_id },
      select: {
        todo_id: true,
        todo_title: true,
        updatedAt: true,
      }
    })
    if( !todo_attrs ) {
      throw new TodolistRepositoryError
    }

    const todo = await this.prisma.todo_info.findUnique({
      where: { todo_id: todo_id }
    })
    if ( !todo ) {
      throw new TodolistRepositoryError
    }

    return todo
  }

  upsertTodolist = async (todolist: Todolist_attrs) :Promise<Todolist_attrs> => {
    const todolist_attrs = await this.prisma.user_todolist.upsert({
      where: { todolist_id: todolist.todolist_id },
      create: {
        todolist_id: todolist.todolist_id,
        todolist_title: todolist.todolist_title,
        style: todolist.style,
        user_id: todolist.user_id,
      },
      update: {
        todolist_title: todolist.todolist_title,
        style: todolist.style
      }
    })
    return todolist_attrs
  }

  deleteTodolist = async (todolist_id: string) :Promise<Todolist_attrs> => {
    
    const todo_attrs_list = await this.prisma.todolist_todo.findMany({
      where: { todolist_id: todolist_id }
    })
    if ( !todo_attrs_list ) {
      throw new TodolistRepositoryError
    }

    await this.prisma.$transaction([

    ])

    await Promise.all(
      todo_attrs_list.map( async (todo_attrs) => {
        await this.prisma.todo_info.delete({
          where: { todo_id: todo_attrs.todo_id }
        }).catch (() => {
          throw new Error
        })
      })
    )

    await this.prisma.todolist_todo.deleteMany({
      where: { todolist_id: todolist_id}
    }).catch(() => {
      throw new TodolistRepositoryError
    })
    
    await this.prisma.user_todolist.delete({
      where: { todolist_id: todolist_id }
    }).catch(() => {
      throw new TodolistRepositoryError
    })
  }
  // todo_idでupsertする
  upsertTodo: (todo: Todo) => Promise<Todo>
  // todo_idでdeleteする
  deleteTodo: (todo_id: string) => Promise<Todo>
}

//TODO: db初期化する