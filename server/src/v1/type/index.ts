
import { $Enums } from "@prisma/client"
import { ZodError } from "zod"


type ApiErrorCategory = 
  | "BAD_REQUEST"           //bad request 400
  | "UNAUTHORIZED"          //認証エラー 401
  | "AUTHENTICATION_FAILED" //権限なし 403
  | "NOT_FOUND"             //not found 404
  | "VALIDATION_ERROR"      //バリデーションエラー 422
  | "SYSTEM_ERROR"          //internal server error 500
  | "UNKNOWN_ERROR"         //不明なエラー

type HTTPStatusCode = number

export type ApiErrorType = {
  title: string,                // Validation errorなどの場合、titleにどの項目のエラーなのかをかく
  message?: string,
  category: ApiErrorCategory,   // categoryによってエラーを分類する
  status?: HTTPStatusCode
}

export type ValidationApiErrorType = ApiErrorType & {
  errors?: ZodError
}

// export type TodoType = {
//   itemId: string;
//   title: string;
//   completed: boolean;
//   deleted: boolean;
//   authorId: string;
// }

// export type TodoList = {
//   todolist_id: string,
//   todolist_title: string,
//   createdAt: Date,
//   updatedAt: Date,
//   todoitems: Todoitem[]
// }

// export type Todoitem = {
//   todo_id: string,
//   todo_title: string,
//   completed: boolean,
//   deleted: boolean,
//   createdAt: Date,
//   updatedAt: Date,
// }

// export type Token = {
//   token: {
//     accessToken: string
//   }
// }

// export type User = {
//   user: { 
//     name: string,
//     email: string,
//     role: $Enums.Role
//   }
// }

// export type UserTokenResponse = {
//   title: string
// } & Token & User

// export type UserResponse = {
//   title: string
// } & User