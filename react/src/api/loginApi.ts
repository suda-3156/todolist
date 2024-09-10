import { TokenType, UserType } from "@/type"
import { apiClient } from "./base"
import { ApiError, ValidationApiError } from "./base/type"
import { ApiResult, Failure, Success } from "./type"



/**
 * Login API
 */
export type LoginAPIRequest = {
  name: string,
  password: string
}

export type LoginAPIResponse = {
  title: string,             //TODO: サーバー側も変更する  categoryはsuccessしかないのでtitleのままでいい
  user: UserType,
  token: TokenType
}

export const LoginAPI = async ({ name, password } :LoginAPIRequest) 
  :Promise<ApiResult<LoginAPIResponse, ApiError | ValidationApiError >> => {
  try {
    const value = await apiClient.post<LoginAPIResponse>("/auth/login", {user: { name, password }})
    return new Success<LoginAPIResponse>(value.data)
  } catch (error) {
    if ( error instanceof ApiError) {
      return new Failure<ApiError>(error)
    }
    if ( error instanceof ValidationApiError) {
      return new Failure<ValidationApiError>(error)
    }
    return new Failure<ApiError>(new ApiError({ category: "UNKNOWN_ERROR", title: "UNKNOWN_ERROR" }))
  }
}