import { Category } from "@/type"

export class RepositoryError extends Error {
  category: Category

  constructor(category :Category){
    super()
    this.category = category
  }
}

