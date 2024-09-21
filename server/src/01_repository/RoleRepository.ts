

import { PrismaClient, Role } from "@prisma/client"
import { RepositoryError } from "./RepositoryError"
import { Failure, Result, Success } from "../type"

type Role_details = {
  role_id: number,
  role: string,
  updatedAt: Date
}

export interface IRoleRepository {
  findById: (role_id: number) => Promise<Result<Role_details, RepositoryError>>
  findByRole: (role: string) => Promise<Result<Role_details, RepositoryError>>
  getRoleList: () => Promise<Result<Role_details[], RepositoryError>>
  // TODO: save = upsertメソッドに変更する
  createRole: (role: string) => Promise<Result<Role_details, RepositoryError>>
  updateRole: (role_id: number, role: string ) => Promise<Result<Role_details, RepositoryError>>
  deleteRole: (role_id: number) => Promise<Result<Role_details, RepositoryError>>
}

export class RoleRepository implements IRoleRepository {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  findById = async (role_id: number) :Promise<Result<Role_details, RepositoryError>> => {
    try {
      const role_data = await this.prisma.role.findUnique({ 
        where: { role_id: role_id},
        select: {
          role_id: true,
          role: true,
          updatedAt: true
        }
      })
      if ( !role_data ) {
        return new Failure<RepositoryError>(new RepositoryError("RECORD_NOT_FOUND"))
      }
  
      return new Success<Role_details>(role_data)
    } catch (error) {
      return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
    }
  }

  findByRole = async (role: string) :Promise<Result<Role_details, RepositoryError>> => {
    try {
      const role_data = await this.prisma.role.findUnique({ 
        where: { role: role},
        select: {
          role_id: true,
          role: true,
          updatedAt: true
        }
      })
      if ( !role_data ) {
        return new Failure<RepositoryError>(new RepositoryError("RECORD_NOT_FOUND"))
      }
  
      return new Success<Role_details>(role_data)
    } catch (error) {
      return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
    }
  }

  getRoleList = async () :Promise<Result<Role_details[], RepositoryError>> => {
    try {
      const raw_role_list = await this.prisma.role.findMany({
        select: {
          role_id: true,
          role: true,
          updatedAt: true
        }
      })
      if ( !raw_role_list ) {
        return new Failure<RepositoryError>(new RepositoryError("RECORD_NOT_FOUND"))
      }
  
      return new Success<Role_details[]>(raw_role_list)
    } catch (error) {
      return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
    }
  }

  createRole = async (role: string) :Promise<Result<Role_details, RepositoryError>> => {
    try {
      const role_data = await this.prisma.role.create({
        data: {
          role: role
        },
        select: {
          role_id: true,
          role: true,
          updatedAt: true
        }
      })
  
      return new Success<Role_details>(role_data)
    } catch (error) {
      return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
    }
  }

  updateRole = async (role_id: number, role: string ) :Promise<Result<Role_details, RepositoryError>> => {
    try {
      const role_data = await this.prisma.role.update({
        where: { role_id: role_id },
        data: {
          role: role
        },
        select: {
          role_id: true,
          role: true,
          updatedAt: true
        }
      })
  
      return new Success<Role_details>(role_data)
    } catch (error) {
      return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
    }
  }

  deleteRole = async (role_id: number) :Promise<Result<Role_details, RepositoryError>> => {
    try {
      const role_data = await this.prisma.role.delete({
        where: { role_id: role_id }
      })
      
      return new Success<Role_details>(role_data)
    } catch (error) {
      return new Failure<RepositoryError>(new RepositoryError("DB_ACCESS_ERROR"))
    }
  }
}