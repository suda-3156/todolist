import { z } from "zod"


export const EditTodoSchema = z.object({
  todolist_id: z
    .string()
    .trim()
    .min(1, { message: "invalid todolist_id" }),
  todo_id: z
    .string()
    .trim()
    .min(1, { message: "invalid todolist_id" }),
  todo_title: z
    .string()
    .trim()
    .min(1, { message: "invalid todo title" })
    .max(60, { message: "invalid todo title"}),
  completed: z
    .boolean(),
  deleted: z
    .boolean(),
  style: z
    .string()
    .trim()
    .min(1, { message: "invalid style name"})
    .max(60, { message: "invalid style name"})
})

