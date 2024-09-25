import { z } from "zod";



export const GetTodosSchema = z.object({
  todolist_id: z
    .string()
    .trim()
    .min(1, { message: "invalid todolist_id" }),
  skip: z
    .number(),
  take: z
    .number()
})