import { randomUUID } from "crypto";
import { IUserRepository, UserType } from "../../01_repository/UserRepository";
import { UseCaseError } from "../UseCaseError";
import { Failure, Result } from "../../type";

export type NewUser = {
  name:         string,
  plain_email:  string,
  plain_pwd:    string,
  role_id:      number,
}

export interface ICreateUserUseCase {
  execute: (newUser: NewUser) => Promise<Result<UserType, UseCaseError>>
}

export class CreateUserUseCase implements ICreateUserUseCase {
  constructor(
    private readonly UR: IUserRepository,
  ){}

  execute = async (
    newUser: NewUser
  ) :Promise<Result<UserType, UseCaseError>> => {

    const nameExists = await this.UR.findByName(newUser.name)
    if ( nameExists.isFailure() ) {
      return new Failure<UseCaseError>(new UseCaseError("DB_ACCESS_ERROR"))
    }
    if ( nameExists.value ) {
      return new Failure<UseCaseError>(new UseCaseError("VALIDATION_ERROR", "This name is already used."))
    }
    
    const emailExists = await this.UR.findByEmail(newUser.plain_email)
    if ( emailExists.isFailure() ) {
      return new Failure<UseCaseError>(new UseCaseError("DB_ACCESS_ERROR"))
    }
    if ( emailExists.value ) {
      return new Failure<UseCaseError>(new UseCaseError("VALIDATION_ERROR", "This email is already used."))
    }

    // roleが存在するかはパラメータチェック、コントローラーでやる.
    // なぜなら、serverでは基本的にUserTypeで扱うと決めたから、roleを使うのはfrontend側なので、コントローラーの役割.
    const newId = randomUUID().toString()
    const last_login = new Date()

    const userRes = await this.UR.upsertUser({
      ...newUser,
      user_id:    newId,
      last_login: last_login,
    })
    if ( userRes.isFailure() ) {
      return new Failure<UseCaseError>(new UseCaseError("DB_ACCESS_ERROR"))
    }

    return userRes
  }
}