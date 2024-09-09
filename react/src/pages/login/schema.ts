import { z } from "zod"

export const LoginFormSchema = z.object({
  name: z
    .string({
      required_error: "Username is required."
    })
    .trim()
    .min(8, { message: "Username must be at least 8 characters long." })
    .max(50, { message: "Username must be at most 50 characters long." }),
  password: z
    .string({
      required_error: "Password is required."
    })
    .trim()
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(50, { message: "Password must be at most 50 characters long." }),
})

export type LoginFormInputSchema = z.infer<typeof LoginFormSchema>
