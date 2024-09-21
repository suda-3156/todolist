import { IUserRepository, User_details } from "../../01_repository/UserRepository";
import { UseCaseError } from "../UseCaseError";
import { Failure, Result } from "../../type";

export class LoginUseCaseError extends UseCaseError {}

export type User = {
  name: string,
  password: string,
}

export interface ILoginUseCase {
  execute: (user: User) => Promise<Result<User_details, LoginUseCaseError>>
}

export class LoginUseCase implements ILoginUseCase {
  private UR: IUserRepository

  constructor(UserRepository: IUserRepository) {
    this.UR = UserRepository
  }

  execute = async (user: User) :Promise<Result<User_details, LoginUseCaseError>> => {    
    const userRes = await this.UR.findByName(user.name)
    if ( userRes.isFailure() ) {
      if ( userRes.error.errorType === "RECORD_NOT_FOUND") {
        return new Failure<LoginUseCaseError>(new LoginUseCaseError("RECORD_NOT_FOUND"))
      }
      return new Failure<LoginUseCaseError>(new LoginUseCaseError("DB_ACCESS_ERROR"))
    }

    if ( userRes.value.password !== user.password ) {
      return new Failure<LoginUseCaseError>(new LoginUseCaseError("UNAUTHORIZED"))
    }

    return userRes
  }
}