/**
 * エラーレスポンスの型
*/
import { ZodError } from "zod"



export type ApiErrorCategory = 
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


export class ApiError extends Error {
  title: string
  category: ApiErrorCategory
  status?: number
  constructor({title, message, category, status}:ApiErrorType) {
    super(message)
    this.title = title
    this.category = category
    this.status = status
  }
}

export class ValidationApiError extends ApiError {
  errors?: ZodError
  constructor({title, message, status, errors}: ValidationApiErrorType){
    super({title, message, category: "VALIDATION_ERROR", status})
    this.errors = errors
  }
}