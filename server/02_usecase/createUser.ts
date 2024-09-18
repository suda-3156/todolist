/**
 * ユーザーに関する処理．
 * 認証，認可はauth仁かく．
 * ここで書くのは，login, register, list, deleteの処理．
 * よって，ほぼない．
 */

import { randomUUID } from "crypto";
import { IUserRepository } from "../01_repository/UserRepository";
import { IRoleRepository, RoleRepositoryError } from "../01_repository/RoleRepository";

// export class UserServiceError extends Error {
//   cause: string
//   detail: string

//   constructor( cause: string, detail: string ) {
//     super()
//     this.cause = cause
//     this.detail = detail
//   }

// }

type NewUser = {
  name: string,
  email: string,
  password: string,
  role: string
}

export interface ICreateUserUseCase {
  execute: (newUser: NewUser) => void
}

export class CreateUserUseCase implements ICreateUserUseCase {
  private UR: IUserRepository
  private RR: IRoleRepository

  constructor(UserRepository: IUserRepository, RoleRepository: IRoleRepository) {
    this.UR = UserRepository
    this.RR = RoleRepository
  }

  execute = async (newUser: NewUser) => {
    // roleの確認
    try {
      const role_exists = await this.RR.findByRole(newUser.role)
    } catch (error) {
      if ( error instanceof RoleRepositoryError) {
        throw new 
      }
    }


    const newId = randomUUID().toString()
    const last_login = new Date().toString()


    this.UR.upsertUser({
      id: newId,
      name: newUser.name,
      email: newUser.email,
      password: newUser.password,
      role: newUser.role
    })

  }
  

}