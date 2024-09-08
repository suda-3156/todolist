import { NextFunction, Request, Response } from "express"
import { z } from "zod"
import { prisma } from "../../../index"


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
    return res.status(400).json({
      responseCd: "-2",
      data: {
        errors: [
          "PARAMETER_ERROR",
          result.error
        ]
      }
    })
  }

  await prisma.user.findFirst({
    where: { OR : [
      {email: req.body.user.email},
      {name: req.body.user.name}
    ]}
  }).then((user) => {
    if (user) {
      return res.status(401).json({
        responseCd: "1",
        data: {
          errors: [
            "INVALID_NAME_OR_PASSWORD"
          ]
        }
      }) 
    }
  })

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
    return res.status(400).json({
      responseCd: "-2",
      data: {
        errors: [
          "PARAMETER_ERROR",
          result.error
        ]
      }
    })
  }
  next()
}



