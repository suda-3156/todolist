import { TokenType, UserType } from "@/type"
import { apiClient } from "./base"
import { ApiError, ValidationApiError } from "./base/type"
import { ApiResult, Failure, Success } from "./type"



/**
 * Sign Up API
 */
export type SignUpAPIRequest = {
  name: string,
  email: string,
  password: string,
  role: string
}

export type SignUpAPIResponse = {
  title: string,             
  user: UserType,
  token: TokenType
}

export const SignUpAPI = async ({ name, email, password, role } :SignUpAPIRequest) 
  :Promise<ApiResult<SignUpAPIResponse, ApiError | ValidationApiError >> => {
  try {
    const value = await apiClient.post<SignUpAPIResponse>("/auth/register", {user: { name, email, password, role }})
    return new Success<SignUpAPIResponse>(value.data)
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