import { ZodError } from "zod"



type ApiErrorCategory = 
  | "BAD_REQUEST"           //bad request, parameter error 400
  | "UNAUTHORIZED"          //認証エラー 401
  | "AUTHENTICATION_FAILED" //権限なし 403
  | "NOT_FOUND"             //not found 404
  | "VALIDATION_ERROR"      //バリデーションエラー 422
  | "SYSTEM_ERROR"          //internal server error 500
  | "UNKNOWN_ERROR"         //不明なエラー 500にする

type HTTPStatusCode = number

export interface ApiError {
  title: string,
  message?: string,
  category: ApiErrorCategory,
  status?: HTTPStatusCode 
}

export interface ParamsApiError extends ApiError {
  // TODO: string[] とかの比較的プリミティブな型にする
  errors?: ZodError
}