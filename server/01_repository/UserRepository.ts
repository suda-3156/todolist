/**
 * UserRepository
 * ユーザーの基本情報：
 *  user_id, name, email, password, last_login, roleをとる
 */

import { PrismaClient } from "@prisma/client"

type upsertUserType = {
  user_id: string,
  name: string,
  password: string,
  email: string,
  last_login: Date,
  role: string
}

type User_details = {
  user_id: string,
  name: string,
  email: string,
  password: string,
  last_login: Date,
  role: string
}

class UserRepositoryError extends Error {}

export interface IUserRepository {
  findById: (id: string) => Promise<User_details>
  findByName: (name: string) => Promise<User_details>
  findByEmail: (email: string) => Promise<User_details>
  getUserList: (skip: number, take: number) => Promise<User_details[]>
  upsertUser: ({ user_id, name, password, email } : upsertUserType) => Promise<User_details>
  deleteUser: (user_id: string) => Promise<User_details>
}

export class UserRepository implements IUserRepository {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  findById = async (user_id: string) :Promise<User_details> => {
    const user = await this.prisma.user.findUnique({
      where: { user_id: user_id }
    })
    const role_data = await this.prisma.role.findUnique({
      where: { role_id: user?.role_id }
    })
    if ( !user || !role_data ) {
      throw new UserRepositoryError
    }

    return {
      user_id: user_id,
      name: user.name,
      email: user.email,
      password: user.password,
      last_login: user.last_login,
      role: role_data.role
    }
  }

  findByName = async (name: string) :Promise<User_details> => {
    const user = await this.prisma.user.findUnique({
      where: { name: name }
    })
    const role_data = await this.prisma.role.findUnique({
      where: { role_id: user?.role_id }
    })
    if ( !user || !role_data ) {
      throw new UserRepositoryError
    }

    return {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      password: user.password,
      last_login: user.last_login,
      role: role_data.role
    }
  }

  findByEmail = async (email: string) :Promise<User_details> => {
    const user = await this.prisma.user.findUnique({
      where: { email: email }
    })
    const role_data = await this.prisma.role.findUnique({
      where: { role_id: user?.role_id }
    })
    if ( !user || !role_data ) {
      throw new UserRepositoryError
    }

    return {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      password: user.password,
      last_login: user.last_login,
      role: role_data.role
    }
  }

  getUserList = async (skip: number, take: number) :Promise<User_details[]> => {
    const raw_users_list = await this.prisma.user.findMany({
      skip: skip,
      take: take,
      select: {
        user_id: true,
        name: true,
        password: true,
        email: true,
        last_login: true,
        role: {
          select: {
            role: true
          }
        }
      }
    })

    const users_list = raw_users_list.map((user) => {
      return {
        user_id: user.user_id,
        name: user.name,
        email: user.email,
        password: user.password,
        last_login: user.last_login,
        role: user.role.role
      }
    })
    
    return users_list
  }

  upsertUser = async ({ user_id, name, password, email, last_login, role }: upsertUserType): Promise<User_details> => {
    const role_data = await this.prisma.role.findFirst({
      where: { role: role }
    })

    if ( !role_data ) {
      throw new UserRepositoryError
    }

    const user = await this.prisma.user.upsert({
      where: { user_id: user_id },
      create: {
        user_id: user_id,
        name: name,
        email: email,
        password: password,
        last_login: last_login,
        role_id: role_data.role_id
      },
      update: {
        name: name,
        email: email,
        password: password,
        last_login: last_login,
        role_id: role_data.role_id
      }
    })
    
    return {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      password: user.password,
      last_login: user.last_login,
      role: role_data.role
    }
  }

  deleteUser = async (user_id: string) :Promise<User_details> => {
    const user = await this.prisma.user.findUnique({
      where: { user_id: user_id }
    })

    if ( !user ) {
      throw new UserRepositoryError
    }

    const role_data = await this.prisma.role.findFirst({
      where: { role_id: user.role_id }
    })

    if ( !role_data ) {
      throw new UserRepositoryError
    }

    await this.prisma.user.delete({
      where: { user_id: user_id }
    })

    return {
      user_id: user.user_id,
      name: user.name,
      email: user.email,
      password: user.password,
      last_login: user.last_login,
      role: role_data.role
    }
  }
}
