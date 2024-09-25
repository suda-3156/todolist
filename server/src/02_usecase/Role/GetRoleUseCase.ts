import { Failure, Result } from "@/type"
import { UseCaseError } from "../UseCaseError"
import { IRoleRepository, RoleType } from "@/01_repository/RoleRepository"



export interface IGetRoleUseCase {
  execute: (role: string) 
    => Promise<Result<RoleType, UseCaseError>>
}

export class GetRoleUseCase implements IGetRoleUseCase {
  constructor(
    private readonly RR: IRoleRepository
  ){}

  execute = async (
    role:  string,
  ) :Promise<Result<RoleType, UseCaseError>> => {
    const roleRes = await this.RR.findByRole(role)
    
    if ( roleRes.isFailure() ) {
      switch ( roleRes.error.category ) {
        case "RECORD_NOT_FOUND":
          return new Failure<UseCaseError>(new UseCaseError("RECORD_NOT_FOUND"))
        default:
          return new Failure<UseCaseError>(new UseCaseError("DB_ACCESS_ERROR"))
      }
    }

    return roleRes
  }
}