/**
 * ユーザーに関する処理．
 * 認証，認可はauth仁かく．
 * ここで書くのは，login, register, list, deleteの処理．
 * よって，ほぼない．
 */

import { randomUUID } from "crypto";
import { IUserRepository, User_details } from "../01_repository/UserRepository";
// import { IRoleRepository } from "../01_repository/RoleRepository";
import { UseCaseError } from "./UseCaseError";
import { DBAccessError } from "../01_repository/RepositoryError";

export class CreateUserUseCaseError extends UseCaseError {}

export type NewUser = {
  name: string,
  email: string,
  password: string,
  role: string
}

export interface ICreateUserUseCase {
  execute: (newUser: NewUser) => Promise<User_details | CreateUserUseCaseError>
}

export class CreateUserUseCase implements ICreateUserUseCase {
  private UR: IUserRepository
  // private RR: IRoleRepository

  constructor(UserRepository: IUserRepository/* , RoleRepository: IRoleRepository */) {
    this.UR = UserRepository
    // this.RR = RoleRepository
  }

  execute = async (newUser: NewUser) :Promise<User_details | CreateUserUseCaseError> => {
    // roleの確認
    // await this.RR.findByRole(newUser.role)
    //   .catch((error) => {
    //     if (error instanceof DBAccessError) {
    //       throw new CreateUserUseCaseError("DB_ACCESS_ERROR")
    //     }
    //     throw new CreateUserUseCaseError("DB_NOT_FOUND", "role not found")
    //   })

    const nameExists = await this.UR.findByName(newUser.name)
    if ( nameExists ) {
      return new CreateUserUseCaseError("VALIDATION_ERROR", "This username is already used.")
    }
    
    const emailExists = await this.UR.findByName(newUser.email)
    if ( emailExists ) {
      return new CreateUserUseCaseError("VALIDATION_ERROR", "This email is already used.")
    }

    const newId = randomUUID().toString()
    const last_login = new Date()
    
    // roleの存在確認はどうせ中でやる
    const userRes = await this.UR.upsertUser({
      user_id: newId,
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      role: newUser.role,
      last_login: last_login
    })
    .catch((error) => {
      if (error instanceof DBAccessError) {
        return new CreateUserUseCaseError("DB_ACCESS_ERROR")
      }
      return new CreateUserUseCaseError("DB_NOT_FOUND", "role not found")
    })

    return userRes
  }
}