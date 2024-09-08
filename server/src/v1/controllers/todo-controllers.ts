
import { Request, Response } from "express"
import { prisma } from "../../index"




export const upsertItem = async (req: Request, res: Response) => {
  const itemId = req.body.todo.itemId

  const todo = await prisma.todo.upsert({
    where: { itemId : itemId },
    create: {
      itemId: itemId,
      title: req.body.todo.title,
      completed: req.body.todo.completed,
      deleted: req.body.todo.deleted,
      authorId: req.body.user.id
    },
      update: {
      title: req.body.todo.title,
      completed: req.body.todo.completed,
      deleted: req.body.todo.deleted
    }
  })

  if ( !todo ) {
    return res.status(500).json({
      responseCd: "-1",
      data: {
        errors: [
          "SYSTEM_ERROR"
        ]
      }
    })
  }

  return res.status(200).json({
    responseCd: "0",
    data: { todo }
  })
  
}

export const deleteItem = async (req: Request, res: Response) => {
  const itemId = req.body.todo.itemId

  const result = await prisma.todo.delete({
    where: { itemId : itemId }
  })
  
  if ( !result ) {
    return res.status(500).json({
      responseCd: "-1",
      data: {
        errors: [
          "SYSTEM_ERROR"
        ]
      }
    })
  }

  return res.status(200).json({
    responseCd: "0",
    data: {}
  })
}