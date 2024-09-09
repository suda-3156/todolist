
import { Request, Response } from "express"
import { prisma } from "../../index"
import { ProblemDetails, SuccessResponse, TodoResponse } from "../type"




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
    const response :ProblemDetails = {
      title: "DATABASE_ERROR",
      detail: "Cannot create or update the todo item.",
      type: "SYSTEM_ERROR",
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
    const response :ProblemDetails = {
      title: "DATABASE_ERROR",
      detail: "Cannot delete the todo item.",
      type: "SYSTEM_ERROR",
      status: 500,
    }
    return res.status(500).json(response)
  }

  const response :SuccessResponse = {
    title: "DELETE_ITEM"
  } 
  return res.status(200).json(response)
}