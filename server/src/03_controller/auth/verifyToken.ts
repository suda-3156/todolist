import { NextFunction, Request, Response } from "express"
import { decodeJWT } from "./decodeJWT"
import { ApiError } from "../type"
import { IVerifyUserIdUseCase } from "@/02_usecase/Account/VerifyUserIdUseCase"

export interface IVerifyToken {
  execute: (req: Request, res: Response, next: NextFunction)
    => Promise<Response<any, Record<string, any>> | undefined>
}


export class VerifyToken implements IVerifyToken {
  constructor(
    private readonly VerifyUserIdUseCase: IVerifyUserIdUseCase
  ){}

  execute = async (
    req:    Request,
    res:    Response,
    next:   NextFunction
  ) => {
    const jwt = decodeJWT(req)
    if ( jwt.isFailure() ) {
      return res.status(401).json({
        title:    "UNAUTHORIZED",
        category: "UNAUTHORIZED",
        message:  "You don't have any valid token.",
        status:   401
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
  
    req.body.user = user_or_error.value
    next()
  }
}
