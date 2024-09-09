import { NextFunction, Request, Response } from "express"
import { z } from "zod"
import { ValidationProblemDetails } from "../../type"


const TodoItemSchema = z.object({
  itemId: z.string(),
  title: z.string(),
  completed: z.boolean(),
  deleted: z.boolean()
})

export const isTodoItem = (req: Request, res: Response, next: NextFunction) => {
  const result = TodoItemSchema.safeParse(req.body.todo)

  if (!result.success) {
    const response :ValidationProblemDetails = {
      title: "VALIDATION_ERROR",
      detail: "Request must include todo item.",
      type: "VALIDATION_ERROR",
      status: 422,
      errors: result.error
    }
    return res.status(422).json(response)
  }

  next()
}
