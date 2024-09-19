

export type Category =
  | "DB_ACCESS_ERROR"
  | "DB_NOT_FOUND"
  | "VALIDATION_ERROR"


export class UseCaseError extends Error {
  category: Category

  constructor(category: Category, detail?: string) {
    super()
    this.category = category
    this.message = detail ?? ""
  }
}