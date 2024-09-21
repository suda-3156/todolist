

export type Category =
  | "DB_ACCESS_ERROR"
  | "RECORD_NOT_FOUND"
  | "VALIDATION_ERROR"
  | "UNAUTHORIZED"


export class UseCaseError extends Error {
  category: Category

  constructor(category: Category, detail?: string) {
    super()
    this.category = category
    this.message = detail ?? ""
  }
}