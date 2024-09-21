import { IUserRepository, User_details } from "../../01_repository/UserRepository";
import { UseCaseError } from "../UseCaseError";
import { Failure, Result } from "../../type";

export class VerifyUserIdUseCaseError extends UseCaseError {}

export interface IVerifyUserIdUseCase {
  execute: (user_id :string) => Promise<Result<User_details, VerifyUserIdUseCaseError>>
}

export class VerifyUserIdUseCase implements IVerifyUserIdUseCase {
  private UR: IUserRepository

  constructor(UserRepository: IUserRepository) {
    this.UR = UserRepository
  }

  execute = async (user_id: string) :Promise<Result<User_details, VerifyUserIdUseCaseError>> => {    
    const userRes = await this.UR.findById(user_id)
    if ( userRes.isFailure() ) {
      if ( userRes.error.errorType === "RECORD_NOT_FOUND" ) {
        return new Failure<VerifyUserIdUseCaseError>(new VerifyUserIdUseCaseError("RECORD_NOT_FOUND"))
      }
      return new Failure<VerifyUserIdUseCaseError>(new VerifyUserIdUseCaseError("DB_ACCESS_ERROR"))
    }

    return userRes
  }
}