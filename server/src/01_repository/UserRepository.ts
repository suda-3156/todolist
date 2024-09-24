/**
 * UserRepository
 * 
 * ユーザーの基本情報：
 *  user_id:      string
 *  name:         string  max: 32
 *  plain_email:  string  max: 128  dbではhash化して保管
 *  plain_pwd:    string  max: 32   dbではhash化して保管
 *  role_id:      number
 *  last_login:   Date
 *  updatedAt:    Date
 */

import { PrismaClient } from "@prisma/client"
import { RepositoryError } from "./RepositoryError"
import { Failure, Result, Success } from "../type"
import CryptoJS from "crypto-js"


export type UserType = {
  user_id:      string,
  name:         string,
  plain_email:  string,
  plain_pwd:    string,
  role_id:      number,
  last_login:   Date,
  updatedAt:    Date
}

type UpsertUserType = {
  user_id:      string,
  name:         string,
  plain_email:  string,
  plain_pwd:    string,
  role_id:      number,
  last_login:   Date,
}

// TODO: 消す.
// export type User_details = {
//   user_id: string,
//   name: string,
//   email: string,
//   password: string,
//   last_login: Date,
//   role: string
// }


export interface IUserRepository {
  // find
  findById: (id: string) 
    => Promise<Result<UserType, RepositoryError>>
  findByName: (name: string) 
    => Promise<Result<UserType, RepositoryError>>
  findByEmail: (email: string) 
    => Promise<Result<UserType, RepositoryError>>

  // get list
  getUserList: (skip: number, take: number) 
    => Promise<Result<UserType[], RepositoryError>>

  // upsert
  upsertUser: ({ user_id, name, plain_email, plain_pwd, role_id, last_login }: UpsertUserType) 
    => Promise<Result<UserType, RepositoryError>>
  
  // delete
  deleteUser: (user_id: string) 
    => Promise<Result<UserType, RepositoryError>>
}

export class UserRepository implements IUserRepository {
  constructor(
    private prisma: PrismaClient
  ){}

  findById = async (
    user_id: string
  ) :Promise<Result<UserType, RepositoryError>> => {
    const user_or_error = await ( async() => {
      try {
        return await this.prisma.user.findUnique({
          where: { user_id: user_id }
        })
      } catch (error) {
        return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
      }})()

    if ( user_or_error instanceof Failure ){
      return user_or_error
    }
    if ( user_or_error === null ) {
      return new Failure<RepositoryError>(new RepositoryError("RECORD_NOT_FOUND"))
    }

    const user = user_or_error

    const decodedEmail = CryptoJS.AES.decrypt(user.email, process.env.SECRET_KEY!).toString(CryptoJS.enc.Utf8)
    const decodedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY!).toString(CryptoJS.enc.Utf8)
    
    return new Success<UserType>({
      user_id:      user.user_id,
      name:         user.name,
      plain_email:  decodedEmail,
      plain_pwd:    decodedPassword,
      role_id:      user.role_id,
      last_login:   user.last_login,
      updatedAt:    user.updatedAt,
    })
  }

  findByName = async (
    name: string
  ) :Promise<Result<UserType, RepositoryError>> => {
    const user_or_error = await ( async() => {
      try {
        return await this.prisma.user.findUnique({
          where: { name: name }
        })
      } catch (error) {
        return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
      }})()

    if ( user_or_error instanceof Failure ){
      return user_or_error
    }
    if ( user_or_error === null ) {
      return new Failure<RepositoryError>(new RepositoryError("RECORD_NOT_FOUND"))
    }

    const user = user_or_error

    const decodedEmail = CryptoJS.AES.decrypt(user.email, process.env.SECRET_KEY!).toString(CryptoJS.enc.Utf8)
    const decodedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY!).toString(CryptoJS.enc.Utf8)

    return new Success<UserType>({
      user_id:      user.user_id,
      name:         user.name,
      plain_email:  decodedEmail,
      plain_pwd:    decodedPassword,
      role_id:      user.role_id,
      last_login:   user.last_login,
      updatedAt:    user.updatedAt,
    })
  }

  findByEmail = async (
    plain_email: string
  ) :Promise<Result<UserType, RepositoryError>> => {
    const encodedEmail = CryptoJS.AES.encrypt(plain_email, process.env.SECRET_KEY!).toString()

    const user_or_error = await ( async() => {
      try {
        return await this.prisma.user.findUnique({
          where: { email: encodedEmail }
        })
      } catch (error) {
        return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
      }})()

    if ( user_or_error instanceof Failure ){
      return user_or_error
    }
    if ( user_or_error === null ) {
      return new Failure<RepositoryError>(new RepositoryError("RECORD_NOT_FOUND"))
    }

    const user = user_or_error

    const decodedEmail = CryptoJS.AES.decrypt(user.email, process.env.SECRET_KEY!).toString(CryptoJS.enc.Utf8)
    const decodedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY!).toString(CryptoJS.enc.Utf8)

    return new Success<UserType>({
      user_id:      user.user_id,
      name:         user.name,
      plain_email:  decodedEmail,
      plain_pwd:    decodedPassword,
      role_id:      user.role_id,
      last_login:   user.last_login,
      updatedAt:    user.updatedAt,
    })
  }

  getUserList = async (
    skip: number,
    take: number
  ) :Promise<Result<UserType[], RepositoryError>> => {
    const rawdata_or_error = await ( async() => {
      try {
        return await this.prisma.user.findMany({
          skip: skip,
          take: take,
        })
      } catch (error) {
        return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
      }})()

    if ( rawdata_or_error instanceof Failure ){
      return rawdata_or_error
    }

    const users_list = rawdata_or_error.map((user) => {
      // decode. 
      const decodedEmail = CryptoJS.AES.decrypt(user.email, process.env.SECRET_KEY!).toString(CryptoJS.enc.Utf8)
      const decodedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY!).toString(CryptoJS.enc.Utf8)
      // 整形.
      return {
        user_id:      user.user_id,
        name:         user.name,
        plain_email:  decodedEmail,
        plain_pwd:    decodedPassword,
        role_id:      user.role_id,
        last_login:   user.last_login,
        updatedAt:    user.updatedAt,
      }
    })

    return new Success<UserType[]>(users_list)
  }

  upsertUser = async ({ 
    user_id,
    name,
    plain_pwd,
    plain_email,
    role_id,
    last_login,
  }: UpsertUserType) :Promise<Result<UserType, RepositoryError>> => {

    const encodedEmail = CryptoJS.AES.encrypt(plain_email, process.env.SECRET_KEY!).toString()
    const encodedPassword = CryptoJS.AES.encrypt(plain_pwd, process.env.SECRET_KEY!).toString()

    const user_or_error = await ( async() => {
      try {
        return await this.prisma.user.upsert({
          where: { user_id: user_id },
          create: {
            user_id:    user_id,
            name:       name,
            password:   encodedPassword,
            email:      encodedEmail,
            role_id:    role_id,
            last_login: last_login,
          },
          update: {
            name:       name,
            password:   encodedPassword,
            email:      encodedEmail,
            role_id:    role_id,
            last_login: last_login,
          }
        })
      } catch (error) {
        return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
      }})()

    if ( user_or_error instanceof Failure ){
      return user_or_error
    }

    const user = user_or_error

    const decodedEmail = CryptoJS.AES.decrypt(user.email, process.env.SECRET_KEY!).toString(CryptoJS.enc.Utf8)
    const decodedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY!).toString(CryptoJS.enc.Utf8)
    
    return new Success<UserType>({
      user_id:      user.user_id,
      name:         user.name,
      plain_email:  decodedEmail,
      plain_pwd:    decodedPassword,
      role_id:      user.role_id,
      last_login:   user.last_login,
      updatedAt:    user.updatedAt,
    })
  }

  deleteUser = async (
    user_id: string
  ) :Promise<Result<UserType, RepositoryError>> => {
    const user_or_error = await ( async() => {
      try {
        return await this.prisma.user.delete({
          where: { user_id: user_id }
        })
      } catch (error) {
        return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
      }})()

    if ( user_or_error instanceof Failure ){
      return user_or_error
    }

    const user = user_or_error

    const decodedEmail = CryptoJS.AES.decrypt(user.email, process.env.SECRET_KEY!).toString(CryptoJS.enc.Utf8)
    const decodedPassword = CryptoJS.AES.decrypt(user.password, process.env.SECRET_KEY!).toString(CryptoJS.enc.Utf8)
    
    return new Success<UserType>({
      user_id:      user.user_id,
      name:         user.name,
      plain_email:  decodedEmail,
      plain_pwd:    decodedPassword,
      role_id:      user.role_id,
      last_login:   user.last_login,
      updatedAt:    user.updatedAt,
    })
  }
}
