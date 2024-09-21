import { z } from "zod";


export const NewUserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "invalid name" })
    .max(64, { message: "invalid name" }),
  email: z
    .string({
      required_error: "email is required"
    })
    .trim()
    .email({message : "invalid email" }),
  password: z
    .string()
    .trim()
    .min(8, { message: "invalid password" })
    .max(64, { message: "invlid password" }),
  role: z
    .string()
    .trim()
    .min(1, { message: "role is required"})
})