import { NextFunction, Request, Response } from "express"
import { z } from "zod"
import { prisma } from "../../../index"
import { ValidationProblemDetails } from "../../type"


const UserRegisterSchema = z.object({
  name: z
    .string()
    .min(1, { message: "invalid name" })
    .max(64, { message: "invalid name" }),
  email: z
    .string({
      required_error: "email is required"
    })
    .email({message : "invalid email" }),
  password: z
    .string()
    .min(8, { message: "invalid password" })
    .max(64, { message: "invlid password" })
})

export const isUserRegister = async (req: Request, res: Response, next: NextFunction) => {
  const result = UserRegisterSchema.safeParse(req.body.user)
  if(!result.success) {
    const response :ValidationProblemDetails = {
      title: "VALIDATION_ERROR",
      detail: "Request must include user type.",
      type: "VALIDATION_ERROR",
      status: 422,
      errors: result.error
    }
    return res.status(422).json(response)
  }

  const user = await prisma.user.findFirst({
    where: { OR : [
      {email: req.body.user.email},
      {name: req.body.user.name}
    ]}
  })

  if (user) {
    const response :ValidationProblemDetails = {
      title: "INVALID_NAME_OR_EMAIL",
      detail: "This username or email is already used.",
      type: "VALIDATION_ERROR",
      status: 422
    }
    return res.status(422).json(response)
  }

  next()
}

const UserLoginSchema = z.object({
  name: z
    .string()
    .min(1, { message: "name required" })
    .max(64, { message: "invalid name" }),
  password: z
    .string()
    .min(1, { message: "password required" })
    .max(64, { message: "invlid password" })
})

export const isUserLogin = (req: Request, res: Response, next: NextFunction) => {
  const result = UserLoginSchema.safeParse(req.body.user)

  if(!result.success) {
    const response :ValidationProblemDetails = {
      title: "VALIDATION_ERROR",
      detail: "Request must include user with name and password.",
      type: "VALIDATION_ERROR",
      status: 422,
      errors: result.error
    }
    return res.status(422).json(response)
  }
  next()
}



