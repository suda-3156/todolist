import { z } from "zod";



export const DeleteTodolistSchema = z.object({
  todolist_id: z
    .string()
    .trim()
    .min(1),
})