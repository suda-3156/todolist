import { z } from "zod"
// TODO: スキーマをまとめられないか、入力文字を半角に縛るなどしたい
export const SignupFormSchema = z.object({
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
  confirmPassword: z
    .string({
      required_error: "Password is required."
    })
    .trim()
    .min(8, { message: "Password must be at least 8 characters long." })
    .max(50, { message: "Password must be at most 50 characters long." }),
  email: z
    .string({
      required_error: "Mail address is required."
    })
    .trim()
    .email()
})
.refine((data) => data.password === data.confirmPassword, {
  message: "Passwords do not match.",
  path: ["confirmPassword"],
})

export type SignupFormInputSchema = z.infer<typeof SignupFormSchema>
