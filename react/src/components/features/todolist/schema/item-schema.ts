import { z } from "zod"


export const TodoItemSchema = z.object({
  todo_title: z
    .string()
    .trim(),
  completed: z
    .boolean(),
  deleted: z
    .boolean(),
  font_color: z
    .string()
    .regex(/^[a-fA-F0-9]{3}|[a-fA-F0-9]{6}$/),
  bg_color: z
    .string()
    .regex(/^[a-fA-F0-9]{3}|[a-fA-F0-9]{6}$/),
})

export type TodoItemInputSchema = z.infer<typeof TodoItemSchema>