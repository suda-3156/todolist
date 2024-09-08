import { NextFunction, Request, Response } from "express"
import { z } from "zod"


const TodoItemSchema = z.object({
  itemId: z.string(),
  title: z.string(),
  completed: z.boolean(),
  deleted: z.boolean()
})

export const isTodoItem = (req: Request, res: Response, next: NextFunction) => {
  const result = TodoItemSchema.safeParse(req.body.todo)

  if (!result.success) {
    return res.status(400).json({
      responseCd: "-2",
      data: {
        errors: [
          "PARAMETER_ERROR"
        ]
      }
    })
  }

  next()
}
