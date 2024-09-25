import { Request, Response } from "express";

import { ICreateUserUseCase } from "../02_usecase/Account/CreateUserUseCase";
import { ILoginUseCase } from "../02_usecase/Account/LoginUseCase";
import { IVerifyUserIdUseCase } from "../02_usecase/Account/VerifyUserIdUseCase";

import { ApiError, ParamsApiError } from "./type";
import { NewUserSchema } from "./validation/NewUserSchema";
import { UserSchema } from "./validation/UserSchema";
import { generateJWT } from "./auth/generateJWT";
import { decodeJWT } from "./auth/decodeJWT";
import { IGetRoleUseCase } from "@/02_usecase/Role/GetRoleUseCase";
import { IGetRoleByIdUseCase } from "@/02_usecase/Role/GetRoleByIdUseCase";




export interface IUserController {
  createUser: (req: Request, res: Response)
    => Promise<Response<any, Record<string, any>>>
  login: (req: Request, res: Response)
    => Promise<Response<any, Record<string, any>>>
  authenticate: (req: Request, res: Response)
    => Promise<Response<any, Record<string, any>>>
  // deleteUser: (req: Request, res: Response)
}

export class UserController implements IUserController {
  constructor(
    private readonly CreateUserUseCase:   ICreateUserUseCase,
    private readonly LoginUseCase:        ILoginUseCase,
    private readonly VerifyUserIdUseCase: IVerifyUserIdUseCase,
    private readonly GetRoleUseCase:      IGetRoleUseCase,
    private readonly GetRoleByIdUseCase:  IGetRoleByIdUseCase,
  ) {}

  createUser = async (
    req: Request,
    res: Response,
  ) :Promise<Response<any, Record<string, any>>> => {
    // parameter check
    const result = NewUserSchema.safeParse(req.body.user)
    if (!result.success) {
      const response :ParamsApiError = {
        title:    "PARAMETER_ERROR",
        category: "BAD_REQUEST",
        status:   400
      }
      return res.status(400).json(response)
    }

    // roleのチェック.
    const roleExists = await this.GetRoleUseCase.execute(result.data.role)
    if ( roleExists.isFailure() ) {
      const response :ParamsApiError = {
        title:    "ROLE_NOT_FOUND",
        category: "VALIDATION_ERROR",
        status:   422
      }
      return res.status(422).json(response)
    }
    
    // create new user
    const newUser_or_error = await this.CreateUserUseCase.execute({
      name:         result.data.name,
      plain_email:  result.data.email,
      plain_pwd:    result.data.password,
      role_id:      roleExists.value.role_id,
    })
    if ( newUser_or_error.isFailure() ) {
      switch (newUser_or_error.error.category) {
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
        name:         newUser.name,
        email:        newUser.plain_email,
        role:         result.data.role,
      },
      token: {
        accessToken:  accessToken
      }
    })
  }

  login = async (
    req: Request,
    res: Response
  ) => {
    // parameter check
    const result = UserSchema.safeParse(req.body.user)
    if (!result.success) {
      const response :ParamsApiError = {
        title:    "PARAMETER_ERROR",
        category: "BAD_REQUEST",
        status:   400
      }
      return res.status(400).json(response)
    }
    
    const user_or_error = await this.LoginUseCase.execute({
      name:       result.data.name,
      plain_pwd:  result.data.password,
    })
    if ( user_or_error.isFailure() ) {
      switch (user_or_error.error.category) {
        case "RECORD_NOT_FOUND":
          return res.status(422).json({
            title:    "VALIDATION_ERROR",
            category: "VALIDATION_ERROR",
            message:  "user not found",
            status:   422
          })
        case "UNAUTHORIZED":
          return res.status(401).json({
            title:    "UNAUTHORIZED",
            category: "UNAUTHORIZED",
            message:  "Username or password is wrong",
            status:   401
          })
        default:
          const response :ApiError = {
            title:    "FAILED_TO_LOGIN",
            category: "SYSTEM_ERROR",
            status:   500
          }
          return res.status(500).json(response) 
      }
    }
    const user = user_or_error.value

    // generate a jwt
    const accessToken = generateJWT(user.user_id)

    // find role
    const role_data = await this.GetRoleByIdUseCase.execute(user.role_id)
    if ( role_data.isFailure() ) {
      switch (role_data.error.category) {
        default:
          const response :ApiError = {
            title:    "FAILED_TO_LOGIN",
            category: "SYSTEM_ERROR",
            status:   500
          }
          return res.status(500).json(response) 
      }
    }

    return res.status(201).json({
      title: "SUCCESS",
      user: {
        name:   user.name,
        email:  user.plain_email,
        role:   role_data.value.role,
      },
      token: {
        accessToken: accessToken
      }
    })
  }

  authenticate = async (
    req: Request, 
    res: Response
  ) => {
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
            title:    "RECORD_NOT_FOUND",
            category: "VALIDATION_ERROR",
            message:  "user not found",
            status:   422
          })
        default:
          const response :ApiError = {
            title:    "FAILED_TO_LOGIN",
            category: "SYSTEM_ERROR",
            status:   500
          }
          return res.status(500).json(response) 
      }
    }
    const user = user_or_error.value

    // find role
    const role_data = await this.GetRoleByIdUseCase.execute(user.role_id)
    if ( role_data.isFailure() ) {
      switch (role_data.error.category) {
        default:
          const response :ApiError = {
            title:    "FAILED_TO_LOGIN",
            category: "SYSTEM_ERROR",
            status:   500
          }
          return res.status(500).json(response) 
      }
    }

    return res.status(201).json({
      title: "SUCCESS",
      user: {
        name:   user.name,
        email:  user.plain_email,
        role:   role_data.value.role,
      }
    })
  }
}



