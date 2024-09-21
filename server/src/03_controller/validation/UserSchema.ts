import { z } from "zod";


export const UserSchema = z.object({
  name: z
    .string()
    .trim()
    .min(1, { message: "invalid name" })
    .max(64, { message: "invalid name" }),
  password: z
    .string()
    .trim()
    .min(8, { message: "invalid password" })
    .max(64, { message: "invlid password" })
})