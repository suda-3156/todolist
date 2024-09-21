import { randomUUID } from "crypto";
import { IUserRepository, User_details } from "../../01_repository/UserRepository";
// import { IRoleRepository } from "../01_repository/RoleRepository";
import { UseCaseError } from "../UseCaseError";
import { Failure, Result } from "../../type";

export class CreateUserUseCaseError extends UseCaseError {}

export type NewUser = {
  name: string,
  email: string,
  password: string,
  role: string
}

export interface ICreateUserUseCase {
  execute: (newUser: NewUser) => Promise<Result<User_details, CreateUserUseCaseError>>
}

export class CreateUserUseCase implements ICreateUserUseCase {
  private UR: IUserRepository
  // private RR: IRoleRepository

  constructor(UserRepository: IUserRepository/* , RoleRepository: IRoleRepository */) {
    this.UR = UserRepository
    // this.RR = RoleRepository
  }

  execute = async (newUser: NewUser) :Promise<Result<User_details, CreateUserUseCaseError>> => {
    const nameExists = await this.UR.findByName(newUser.name)
    if ( nameExists.isFailure() ) {
      return new Failure<CreateUserUseCaseError>(new CreateUserUseCaseError("DB_ACCESS_ERROR"))
    }
    if ( nameExists.value ) {
      return new Failure<CreateUserUseCaseError>(new CreateUserUseCaseError("VALIDATION_ERROR", "This username is already used."))
    }
    
    const emailExists = await this.UR.findByName(newUser.email)
    if ( emailExists.isFailure() ) {
      return new Failure<CreateUserUseCaseError>(new CreateUserUseCaseError("DB_ACCESS_ERROR"))
    }
    if ( emailExists.value ) {
      return new Failure<CreateUserUseCaseError>(new CreateUserUseCaseError("VALIDATION_ERROR", "This email is already used."))
    }

    const newId = randomUUID().toString()
    const last_login = new Date()
    
    // roleの存在確認はどうせ中でやる
    const userRes = await this.UR.upsertUser({
      ...newUser,
      user_id: newId,
      last_login: last_login
    })
    if ( userRes.isFailure() ) {
      return new Failure<CreateUserUseCaseError>(new CreateUserUseCaseError("DB_ACCESS_ERROR"))
    }

    return userRes
  }
}