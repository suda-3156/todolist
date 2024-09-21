import { Request, Response } from "express";
import { CreateUserUseCaseError, ICreateUserUseCase, NewUser } from "../02_usecase/createUser";
import { z } from "zod";
import { NewUserSchema } from "./validation/NewUserSchema";
import { ApiError, ParamsApiError } from "./type";
import { generateJWT } from "./auth/generateJWT";




export interface IUserController {
  createUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>
}

export class UserController implements IUserController {
  private CreateUserUseCase: ICreateUserUseCase

  constructor(CreateUserUseCase: ICreateUserUseCase) {
    this.CreateUserUseCase = CreateUserUseCase
  }

  createUser = async (req: Request, res: Response) => {
    // parameter check
    const result = NewUserSchema.safeParse(req.body.user)
    if (!result.success) {
      const response :ParamsApiError = {
        title: "PARAMETER_ERROR",
        category: "BAD_REQUEST",
        status: 400
      }
      return res.status(400).json(response)
    }
    
    // create new user
    const newUser_or_error = await this.CreateUserUseCase.execute(result.data)
    if ( newUser_or_error.isFailure() ) {
      switch (newUser_or_error.error.category) {
        case "DB_NOT_FOUND":
          return res.status(400).json({
            title: "PARAMETER_ERROR",
            category: "BAD_REQUEST",
            message: "role not found",
            status: 400
          })
        case "VALIDATION_ERROR":
          return res.status(422).json({
            title: "VALIDATION_ERROR",
            category: "VALIDATION_ERROR",
            message: newUser_or_error.error.message,
            status: 422
          })
        default:
          const response :ApiError = {
            title: "FAILED_TO_CREATE_USER",
            category: "SYSTEM_ERROR",
            status: 500
          }
          return res.status(500).json(response) 
      }
    }
    const newUser = newUser_or_error.value

    // generate a jwt
    const accessToken = generateJWT(newUser.user_id)

    return res.status(201).json({
      title: "SUCCESS",
      user: {
        name: newUser.name,
        email: newUser.email,
        role: newUser.role
      },
      token: {
        accessToken: accessToken
      }
    })
  }
}



