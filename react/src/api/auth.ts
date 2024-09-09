import { apiClient, ValidationApiError } from "./api-base"
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


export type ApiResult<T, E extends Error> = Success<T> | Failure<E>;

class Success<T> {
  readonly value: T;

  constructor(value: T) {
    this.value = value;
  }

  isSuccess(): this is Success<T> {
    return true;
  }

  isFailure(): this is Failure<Error> {
    return false;
  }
}

class Failure<E extends Error> {
  readonly error: E;

  constructor(error: E) {
    this.error = error;
  }

  isSuccess(): this is Success<unknown> {
    return false;
  }

  isFailure(): this is Failure<E> {
    return true;
  }
}


export const signUpFunc :<UserTokenResponse, ValidationApiError> = (signUpAPI , onCatch: (e :unknown) => ValidationApiError ) :ApiResult<UserTokenResponse, ValidationApiError> => {
  try {
    const value = signUpAPI()
    return new Success<T>(value)
  } catch (error) {
    return new Failure<E>(onCatch(error))
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

