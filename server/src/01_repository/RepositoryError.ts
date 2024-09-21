

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

