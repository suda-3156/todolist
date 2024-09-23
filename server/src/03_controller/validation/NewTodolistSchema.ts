import { z } from "zod";


export const NewTodolistSchema = z.object({
  todolist_title: z
    .string()
    .trim()
    .min(1, { message: "invalid todolist title" })
    .max(60, { message: "invalid todolist title"}),
  name: z
    .string()
    .trim()
    .min(1, { message: "invalid username" })
    .max(64, { message: "invalid username" }),
  style: z
    .string()
    .trim()
    .min(1, { message: "invalid style name"})
    .max(60, { message: "invalid style name"})
})