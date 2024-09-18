

import { PrismaClient, Role } from "@prisma/client"

type Role_details = {
  role_id: number,
  role: string,
  updatedAt: Date
}

export class RoleRepositoryError extends Error {}

export interface IRoleRepository {
  findById: (role_id: number) => Promise<Role_details>
  findByRole: (role: string) => Promise<Role_details>
  getRoleList: () => Promise<Role_details[]>
  // TODO: save = upsertメソッドに変更する
  createRole: (role: string) => Promise<Role_details>
  updateRole: (role_id: number, role: string ) => Promise<Role_details>
  deleteRole: (role_id: number) => Promise<Role_details>
}

// MEMO: roleを@uniqueに変更，DB新しくする sql書き換えてreset???
export class RoleRepository implements IRoleRepository {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  findById = async (role_id: number) :Promise<Role_details> => {
    const role = await this.prisma.role.findUnique({ 
      where: { role_id: role_id},
      select: {
        role_id: true,
        role: true,
        updatedAt: true
      }
    })

    if ( !role ) {
      throw new RoleRepositoryError
    }

    return role
  }

  findByRole = async (role: string) :Promise<Role_details> => {
    const role_data = await this.prisma.role.findUnique({ 
      where: { role: role},
      select: {
        role_id: true,
        role: true,
        updatedAt: true
      }
    })

    if ( !role_data ) {
      throw new RoleRepositoryError
    }

    return role_data
  }

  getRoleList = async () :Promise<Role_details[]> => {
    const raw_role_list = await this.prisma.role.findMany({
      select: {
        role_id: true,
        role: true,
        updatedAt: true
      }
    })

    if ( !raw_role_list ) {
      throw new RoleRepositoryError
    }

    return raw_role_list
  }

  createRole = async (role: string) :Promise<Role_details> => {
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

    return role_data
  }

  updateRole = async (role_id: number, role: string ) :Promise<Role_details> => {
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

    return role_data
  }

  deleteRole = async (role_id: number) :Promise<Role_details> => {
    const role_data = await this.prisma.role.delete({
      where: { role_id: role_id }
    })
    
    return role_data
  }
}