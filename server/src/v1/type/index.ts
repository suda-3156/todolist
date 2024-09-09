
import { $Enums } from "@prisma/client"
import { ZodError } from "zod"


type ErrorType = 
  | "BAD_REQUEST"           //bad request 400
  | "UNAUTHORIZED"          //認証エラー 401
  | "AUTHENTICATION_FAILED" //権限なし 403
  | "NOT_FOUND"             //not found 404
  | "VALIDATION_ERROR"      //バリデーションエラー 422
  | "SYSTEM_ERROR"          //internal server error 500
  | "OTHERS"

type HTTPStatusCode = number

export type ProblemDetails = {
  title: string,
  detail?: string,
  type: ErrorType,
  status?: HTTPStatusCode
}

export type ValidationProblemDetails = ProblemDetails & {
  errors?: ZodError
}

export type SuccessResponse = {
  title: string,
}

export type TodoType = {
  itemId: string;
  title: string;
  completed: boolean;
  deleted: boolean;
  authorId: string;
}


export type TodoResponse = SuccessResponse & {
  todo: TodoType
}


export type TodoListResponse = SuccessResponse & {
  todolist: TodoType[]
}

export type Token = {
  token: {
    accessToken: string
  }
}

export type User = {
  user: { 
    name: string,
    email: string,
    role: $Enums.Role
  }
}

export type UserTokenResponse = SuccessResponse & Token & User

export type UserResponse = SuccessResponse & User