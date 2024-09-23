import { NextFunction, Request, Response } from "express";
import { ICreateUserUseCase } from "../02_usecase/Account/CreateUserUseCase";
import { NewUserSchema } from "./validation/NewUserSchema";
import { ApiError, ParamsApiError } from "./type";
import { generateJWT } from "./auth/generateJWT";
import { UserSchema } from "./validation/UserSchema";
import { ILoginUseCase } from "../02_usecase/Account/LoginUseCase";
import { decodeJWT } from "./auth/decodeJWT";
import { IVerifyUserIdUseCase } from "../02_usecase/Account/VerifyUserIdUseCase";




export interface IUserController {
  createUser: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>
  login: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>
  authenticate: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>>
  verifyToken: (req: Request, res: Response) => Promise<Response<any, Record<string, any>>> | undefined
}

export class UserController implements IUserController {
  constructor(
    private CreateUserUseCase: ICreateUserUseCase,
    private LoginUseCase: ILoginUseCase,
    private VerifyUserIdUseCase: IVerifyUserIdUseCase,
  ) {}

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
        case "DB_ACCESS_ERROR":
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

  login = async (req: Request, res: Response) => {
    // parameter check
    const result = UserSchema.safeParse(req.body.user)
    if (!result.success) {
      const response :ParamsApiError = {
        title: "PARAMETER_ERROR",
        category: "BAD_REQUEST",
        status: 400
      }
      return res.status(400).json(response)
    }
    
    const user_or_error = await this.LoginUseCase.execute(result.data)
    if ( user_or_error.isFailure() ) {
      switch (user_or_error.error.category) {
        case "RECORD_NOT_FOUND":
          return res.status(422).json({
            title: "VALIDATION_ERROR",
            category: "VALIDATION_ERROR",
            message: "user not found",
            status: 422
          })
        case "UNAUTHORIZED":
          return res.status(401).json({
            title: "UNAUTHORIZED",
            category: "UNAUTHORIZED",
            message: "name or password is wrong",
            status: 401
          })
        default:
          const response :ApiError = {
            title: "FAILED_TO_LOGIN",
            category: "SYSTEM_ERROR",
            status: 500
          }
          return res.status(500).json(response) 
      }
    }
    const user = user_or_error.value

    // generate a jwt
    const accessToken = generateJWT(user.user_id)

    return res.status(201).json({
      title: "SUCCESS",
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      },
      token: {
        accessToken: accessToken
      }
    })
  }

  authenticate = async (req: Request, res: Response) => {
    const jwt = decodeJWT(req)
    if ( jwt.isFailure() ) {
      return res.status(401).json({
        title: "UNAUTHORIZED",
        category: "UNAUTHORIZED",
        message: "You don't have any valid token.",
        status: 401
      })
    }

    const user_or_error = await this.VerifyUserIdUseCase.execute(jwt.value.user_id)
    if ( user_or_error.isFailure() ) {
      switch (user_or_error.error.category) {
        case "RECORD_NOT_FOUND":
          return res.status(422).json({
            title: "RECORD_NOT_FOUND",
            category: "VALIDATION_ERROR",
            message: "user not found",
            status: 422
          })
        default:
          const response :ApiError = {
            title: "FAILED_TO_LOGIN",
            category: "SYSTEM_ERROR",
            status: 500
          }
          return res.status(500).json(response) 
      }
    }
    const user = user_or_error.value

    return res.status(201).json({
      title: "SUCCESS",
      user: {
        name: user.name,
        email: user.email,
        role: user.role
      }
    })
  }

  verifyToken = async (req: Request, res: Response, next: NextFunction) => {
    const jwt = decodeJWT(req)
    if ( jwt.isFailure() ) {
      return res.status(401).json({
        title: "UNAUTHORIZED",
        category: "UNAUTHORIZED",
        message: "You don't have any valid token.",
        status: 401
      })
    }

    const user_or_error = await this.VerifyUserIdUseCase.execute(jwt.value.user_id)
    if ( user_or_error.isFailure() ) {
      switch (user_or_error.error.category) {
        case "RECORD_NOT_FOUND":
          return res.status(422).json({
            title: "RECORD_NOT_FOUND",
            category: "VALIDATION_ERROR",
            message: "user not found",
            status: 422
          })
        default:
          const response :ApiError = {
            title: "FAILED_TO_LOGIN",
            category: "SYSTEM_ERROR",
            status: 500
          }
          return res.status(500).json(response) 
      }
    }

    req.body.user = user_or_error.value
    next()
  }
}



