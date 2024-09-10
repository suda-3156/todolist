import { ApiResult, Failure, Success } from "@/components/utils/ApiResult"
import { apiClient, DetailedApiError, UnknownApiError, ValidationApiError } from "./api-base"
import { UserResponse, UserTokenResponse } from "./type"

export type LoginAPIRequest = {
  name: string,
  password: string
}

export type SignUpAPIRequest = {
  name: string,
  email: string,
  password: string
}


export const loginAPI = async ({ name, password } :LoginAPIRequest) :Promise<UserTokenResponse> => {
  const response = await apiClient.post<UserTokenResponse>("/auth/login", {user: { name, password }})
  return response.data
}

export const signUpAPI = async ({ name, email, password } :SignUpAPIRequest) :Promise<UserTokenResponse> => {
  const response = await apiClient.post<UserTokenResponse>("/auth/register", {user: { name, email, password }})
  return response.data
}

export class UnknownSystemError extends Error {}

export const SignUp = async ({ name, email, password } :SignUpAPIRequest) :Promise<ApiResult<
  UserTokenResponse,
  ValidationApiError | DetailedApiError | UnknownApiError | UnknownSystemError
>> => {
  try {
    const value = await apiClient.post<UserTokenResponse>("/auth/register", {user: { name, email, password }})
    return new Success<UserTokenResponse>(value.data)
  } catch (error) {
    if (error instanceof ValidationApiError) return new Failure<ValidationApiError>(error)
    if (error instanceof DetailedApiError) return new Failure<DetailedApiError>(error)
    if (error instanceof UnknownApiError) return new Failure<UnknownApiError>(error)
    return new Failure<UnknownSystemError>(new UnknownSystemError("Unknown System error"))
  }
}

















// const signOutAPI :SignAPI["signOutAPI"] = async () :Promise<OnlyMessage> => {
//   const response = await apiClient.post("/auth/sign-out")
//   console.log(response.data.message)
//   return response.data
// }

export const verifyAPI = async () :Promise<UserResponse> => {
  const response = await apiClient.post<UserResponse>("/auth/verify")
  return response.data
}

