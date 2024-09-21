
import { Request, Response } from "express"
import { prisma } from "../../index"
import { ApiErrorType, TodoList } from "../type"
import { Prisma } from "@prisma/client"
import { emitWarning } from "process"

const getAllTodolist = async (req: Request) => {
  return await prisma.user.findUnique({
    where: { name: req.body.user.name },
    select: {
      todolist: {
        where: {
          author_id: req.body.user.id
        },
        select: {
          todolist_title: true,
          todolist_id: true,
          createdAt: true,
          updatedAt: true,
          todoitem: {
            where: {
              author_id: req.body.user.id
            },
            select: {
              todo_id: true,
              todo_title: true,
              completed: true,
              deleted: true,
              createdAt: true,
              updatedAt: true,
            }
          }
        }
      }
    }
  })
}

type Todolists = Prisma.PromiseReturnType<typeof getAllTodolist>

export const getAll = async (req: Request, res: Response) => {
  const todolists = await getAllTodolist(req)

  if ( !todolists ) {
    const response :ApiErrorType = {
      title: "DATABASE_ERROR",
      message: "Couldn't get todolists from database.",
      category: "SYSTEM_ERROR",
      status: 500,
    }
    return res.status(500).json(response)
  }

  const response :{title: string, todolists: Todolists} = {
    title: "GET_ALL_TODOLISTS",
    todolists: todolists
  } 
  return res.status(200).json(response)
}

export const upsertItem = async (req: Request, res: Response) => {
  const itemId = req.body.todo.itemId

  const todo = await prisma.todo.upsert({
    where: { itemId : itemId },
    create: {
      itemId: itemId,
      title: req.body.todo.title,
      completed: req.body.todo.completed,
      deleted: req.body.todo.deleted,
      authorId: req.body.user.id,
      author: req.body.user.name
    },
    update: {
      title: req.body.todo.title,
      completed: req.body.todo.completed,
      deleted: req.body.todo.deleted
    }
  })

  if ( !todo ) {
    const response :ApiErrorType = {
      title: "DATABASE_ERROR",
      message: "Cannot create or update the todo item.",
      category: "SYSTEM_ERROR",
      status: 500,
    }
    return res.status(500).json(response)
  }
  const response :TodoResponse = {
    title: "UPSERT_ITEM",
    todo: todo
  } 
  return res.status(200).json(response)
}

export const deleteItem = async (req: Request, res: Response) => {
  const itemId = req.body.todo.itemId

  const result = await prisma.todo.delete({
    where: { itemId : itemId }
  })
  
  if ( !result ) {
    const response :ApiErrorType = {
      title: "DATABASE_ERROR",
      message: "Cannot delete the todo item.",
      category: "SYSTEM_ERROR",
      status: 500,
    }
    return res.status(500).json(response)
  }

  const response :SuccessResponse = {
    title: "DELETE_ITEM"
  } 
  return res.status(200).json(response)
}