import { z } from "zod";



export const ClearTodoSchema = z.object({
  todo_id: z
    .string()
    .trim()
    .min(1),
})