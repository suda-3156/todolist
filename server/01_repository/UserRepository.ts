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
  role: 
    | "USER" 
    | "ADMIN" 
    | "SUPER_ADMIN"
}

type User_details = {
  user_id: string,
  name: string,
  email: string,
  password: string,
  last_login: Date,
  role: 
    | "USER" 
    | "ADMIN" 
    | "SUPER_ADMIN"
}

type User_abstract = {
  user_id: string,
  name: string,
  last_login: Date,
  role:
    | "USER" 
    | "ADMIN" 
    | "SUPER_ADMIN"
    // MEMO: こういうことになるから，別にroleは分けんでいい
    | "NONE"
}

class UserRepositoryError extends Error {}

export interface IUserRepository {
  findById: (id: string) => Promise<User_details>
  findByName: (name: string) => Promise<User_details>
  findByEmail: (email: string) => Promise<User_details>
  userList: () => Promise<User_abstract[]>
  upsertUser: ({ user_id, name, password, email } : upsertUserType) => Promise<User_details>
  deleteUser: (user_id: string) => Promise<User_details>
}

export class UserRepository implements IUserRepository {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  findById = async (user_id: string) :Promise<User_details> => {
    const user = await this.prisma.user_info.findUnique({
      where: { user_id: user_id }
    })
    const role_data = await this.prisma.user_role.findUnique({
      where: { user_id: user_id }
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
    const user = await this.prisma.user_info.findUnique({
      where: { name: name }
    })
    if ( !user ) {
      throw new UserRepositoryError
    }

    const role_data = await this.prisma.user_role.findUnique({
      where: { user_id: user.user_id }
    })
    if ( !role_data ) {
      throw new UserRepositoryError
    }

    return {
      user_id: user.user_id,
      name: name,
      email: user.email,
      password: user.password,
      last_login: user.last_login,
      role: role_data.role
    }
  }

  findByEmail = async (email: string) :Promise<User_details> => {
    const user = await this.prisma.user_info.findUnique({
      where: { email: email }
    })
    if ( !user ) {
      throw new UserRepositoryError
    }

    const role_data = await this.prisma.user_role.findUnique({
      where: { user_id: user.user_id }
    })
    if ( !role_data ) {
      throw new UserRepositoryError
    }

    return {
      user_id: user.user_id,
      name: user.name,
      email: email,
      password: user.password,
      last_login: user.last_login,
      role: role_data.role
    }
  }

  userList = async () :Promise<User_abstract[]> => {
    const users_list = await this.prisma.user_info.findMany({
      select: {
        user_id: true,
        name: true,
        last_login: true,
      }
    })

    
    const res_list = await Promise.all(users_list.map( async (user) => {
      const user_role = await this.prisma.user_role.findUnique({
        where: { user_id: user.user_id }
      })
      if ( !user_role ) {
        throw new UserRepositoryError
      }
      return {
        user_id: user.user_id,
        name: user.name,
        last_login: user.last_login,
        role: user_role.role
      }
    }))

    return res_list
  }

  upsertUser = async ({ user_id, name, password, email, last_login, role }: upsertUserType): Promise<User_details> => {
    const user = await this.prisma.user_info.upsert({
      where: { user_id: user_id },
      create: {
        user_id: user_id,
        name: name,
        password: password,
        email: email,
        last_login: last_login,
      },
      update: {
        name: name,
        password: password,
        email: email
      }
    })

    const role_data = await this.prisma.user_role.upsert({
      where: { user_id: user.user_id },
      create: {
        user_id: user.user_id,
        role: role
      },
      update: {
        role: role,
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
    const user = await this.prisma.user_info.delete({
      where: { user_id: user_id }
    })

    const role_data = await this.prisma.user_role.delete({
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
