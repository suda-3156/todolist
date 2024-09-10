/**
 * Verify Token Api
 */

import { UserType } from "@/type"
import { ApiError, ValidationApiError } from "./base/type"
import { ApiResult, Failure, Success } from "./type"
import { apiClient } from "./base"

// TODO: reflesh tokenとか、verify時にtokenを新しくするかとかはあとで

export type VerifyTokenAPIRequest = null

export type VerifyTokenAPIResponse = {
  title: string,
  user: UserType
}

export const VerifyTokenAPI = async () 
  :Promise<ApiResult<VerifyTokenAPIResponse, ApiError | ValidationApiError >> => {
  try {
    const value = await apiClient.post<VerifyTokenAPIResponse>("/auth/verify")
    return new Success<VerifyTokenAPIResponse>(value.data)
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