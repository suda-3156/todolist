import { z } from "zod";



export const GetTodolistOverviewSchema = z.object({
  skip: z
    .number(),
  take: z
    .number()
})