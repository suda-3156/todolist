import { IUserRepository, UserType } from "../../01_repository/UserRepository";
import { UseCaseError } from "../UseCaseError";
import { Failure, Result } from "../../type";

export type LoginUser = {
  name:       string,
  plain_pwd:  string,
}

export interface ILoginUseCase {
  execute: (user: LoginUser) => Promise<Result<UserType, UseCaseError>>
}

export class LoginUseCase implements ILoginUseCase {
  constructor(
    private readonly UR: IUserRepository
  ){}

  execute = async (
    user: LoginUser
  ) :Promise<Result<UserType, UseCaseError>> => {    
    const userRes = await this.UR.findByName(user.name)

    if ( userRes.isFailure() ) {
      switch ( userRes.error.category ) {
        case "RECORD_NOT_FOUND":
          return new Failure<UseCaseError>(new UseCaseError("RECORD_NOT_FOUND"))
        default:
          return new Failure<UseCaseError>(new UseCaseError("DB_ACCESS_ERROR"))
      }
    }

    if ( userRes.value.plain_pwd !== user.plain_pwd ) {
      return new Failure<UseCaseError>(new UseCaseError("UNAUTHORIZED"))
    }

    return userRes
  }
}