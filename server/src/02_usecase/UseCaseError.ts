import { Category } from "../type"


export class UseCaseError extends Error {
  category: Category

  constructor(category: Category, detail?: string) {
    super()
    this.category = category
    this.message = detail ?? ""
  }
}