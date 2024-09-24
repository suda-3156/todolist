import { IUserRepository, UserType } from "../../01_repository/UserRepository";
import { UseCaseError } from "../UseCaseError";
import { Failure, Result } from "../../type";

export interface IVerifyUserIdUseCase {
  execute: (user_id :string) => Promise<Result<UserType, UseCaseError>>
}

export class VerifyUserIdUseCase implements IVerifyUserIdUseCase {
  constructor(
    private readonly UR: IUserRepository
  ){}

  execute = async (
    user_id: string
  ) :Promise<Result<UserType, UseCaseError>> => {
    const userRes = await this.UR.findById(user_id)

    if ( userRes.isFailure() ) {
      switch ( userRes.error.category ) {
        case "RECORD_NOT_FOUND":
          return new Failure<UseCaseError>(new UseCaseError("RECORD_NOT_FOUND"))
        default:
          return new Failure<UseCaseError>(new UseCaseError("DB_ACCESS_ERROR"))
      }
    }

    return userRes
  }
}