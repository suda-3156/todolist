/**
 * RoleRepository
 * 
 * ロールの基本情報：
 *  role_id:    number
 *  role:       string  max: 32
 *  updatedAt:  Date
 */

import { PrismaClient } from "@prisma/client"
import { RepositoryError } from "./RepositoryError"
import { Failure, Result, Success } from "@/type"


export type RoleType = {
  role_id:    number,
  role:       string,
  updatedAt:  Date,
}


export interface IRoleRepository {
  // find
  findById: (role_id: number)
    => Promise<Result<RoleType, RepositoryError>>
  findByRole: (role: string)
    => Promise<Result<RoleType, RepositoryError>>
  
  // get list
  getRoleList: (skip: number, take: number) 
    => Promise<Result<RoleType[], RepositoryError>>
  
  // upsert
  // MEMO: save = upsertメソッドに変更する いや、updateの必要ないかも.
  createRole: (role: string)
    => Promise<Result<RoleType, RepositoryError>>
  // updateRole: (role_id: number, role: string )
  //   => Promise<Result<RoleType, RepositoryError>>
  
  // delete
  deleteRole: (role_id: number)
    => Promise<Result<RoleType, RepositoryError>>
}

export class RoleRepository implements IRoleRepository {
  constructor(
    private prisma: PrismaClient
  ){}

  findById = async (
    role_id: number
  ) :Promise<Result<RoleType, RepositoryError>> => {
    const role_or_error = await ( async() => {
      try {
        return await this.prisma.role.findUnique({
          where: { role_id: role_id },
          select: {
            role_id:    true,
            role:       true,
            updatedAt:  true,
          }
        })
      } catch (error) {
        return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
      }})()  
  
    if ( role_or_error instanceof Failure ){
      return role_or_error
    }
    if ( role_or_error === null ) {
      return new Failure<RepositoryError>(new RepositoryError("RECORD_NOT_FOUND"))
    }


    return new Success<RoleType>(role_or_error)
  }

  findByRole = async (
    role: string
  ) :Promise<Result<RoleType, RepositoryError>> => {
    const role_or_error = await ( async() => {
      try {
        return await this.prisma.role.findUnique({
          where: { role: role },
          select: {
            role_id:    true,
            role:       true,
            updatedAt:  true,
          }
        })
      } catch (error) {
        return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
      }})()  
  
    if ( role_or_error instanceof Failure ){
      return role_or_error
    }
    if ( role_or_error === null ) {
      return new Failure<RepositoryError>(new RepositoryError("RECORD_NOT_FOUND"))
    }

    return new Success<RoleType>(role_or_error)
  }

  getRoleList = async (
    skip: number,
    take: number,
  ) :Promise<Result<RoleType[], RepositoryError>> => {
    const roles_or_error = await ( async() => {
      try {
        return await this.prisma.role.findMany({
          skip: skip,
          take: take,
          select: {
            role_id:    true,
            role:       true,
            updatedAt:  true,
          }
        })
      } catch (error) {
        return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
      }})()  
  
    if ( roles_or_error instanceof Failure ){
      return roles_or_error
    }

    return new Success<RoleType[]>(roles_or_error)
  }

  createRole = async (
    role: string
  ) :Promise<Result<RoleType, RepositoryError>> => {
    const role_or_error = await ( async() => {
      try {
        return await this.prisma.role.create({
          data: {
            role: role,
          },
          select: {
            role_id:    true,
            role:       true,
            updatedAt:  true,
          }
        })
      } catch (error) {
        return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
      }})()  
  
    if ( role_or_error instanceof Failure ){
      return role_or_error
    }

    return new Success<RoleType>(role_or_error)
  }

  deleteRole = async (
    role_id: number
  ) :Promise<Result<RoleType, RepositoryError>> => {
    const role_or_error = await ( async() => {
      try {
        return await this.prisma.role.delete({
          where: { role_id: role_id },
          select: {
            role_id:    true,
            role:       true,
            updatedAt:  true,
          }
        })
      } catch (error) {
        return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
      }})()  
  
    if ( role_or_error instanceof Failure ){
      return role_or_error
    }

    return new Success<RoleType>(role_or_error)
  }
}