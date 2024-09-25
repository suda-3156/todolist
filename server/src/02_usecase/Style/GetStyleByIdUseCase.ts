import { Failure, Result } from "@/type"
import { UseCaseError } from "../UseCaseError"
import { IStyleRepository, StyleType } from "@/01_repository/StyleRepository"



export interface IGetStyleByIdUseCase {
  execute: (style_id: string) 
    => Promise<Result<StyleType, UseCaseError>>
}

export class GetStyleByIdUseCase implements IGetStyleByIdUseCase {
  constructor(
    private readonly SR: IStyleRepository
  ){}

  execute = async (
    style_id:  string,
  ) :Promise<Result<StyleType, UseCaseError>> => {
    const styleRes = await this.SR.findByStyle(style_id)
    
    if ( styleRes.isFailure() ) {
      switch ( styleRes.error.category ) {
        case "RECORD_NOT_FOUND":
          return new Failure<UseCaseError>(new UseCaseError("RECORD_NOT_FOUND"))
        default:
          return new Failure<UseCaseError>(new UseCaseError("DB_ACCESS_ERROR"))
      }
    }

    return styleRes
  }
}