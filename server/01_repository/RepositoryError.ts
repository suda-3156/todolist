

export type ErrorType = 
  | "DB_ACCESS_ERROR"
  | "RECORD_NOT_FOUND"

export class RepositoryError extends Error {
  errorType: ErrorType

  constructor(errorType :ErrorType){
    super()
    this.errorType = errorType
  }
}

type ErrorResult<T> = {
  isError: () => true
  isSuccess: () => false
  error: T
}

type SuccessResult<T> = {
  isSuccess: () => true
  isError: () => false
  value: T
}

export type Result<T = unknown, R = unknown> = SuccessResult<T> | ErrorResult<R>