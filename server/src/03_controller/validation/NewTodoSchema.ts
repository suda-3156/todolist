import { z } from "zod"


export const NewTodoSchema = z.object({
  todolist_id: z
    .string()
    .trim()
    .min(1, { message: "invalid todolist_id" }),
  todo_title: z
    .string()
    .trim()
    .min(1, { message: "invalid todo title" })
    .max(60, { message: "invalid todo title"}),
  style: z
    .string()
    .trim()
    .min(1, { message: "invalid style name"})
    .max(60, { message: "invalid style name"})
})