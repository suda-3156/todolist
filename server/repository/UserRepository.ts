import { Prisma, User } from "@prisma/client"
import { PrismaClient } from "@prisma/client"
import { DefaultArgs } from "@prisma/client/runtime/library"

export interface IUserRepository {
  findById: (id: string) => Promise<User | null>
  findByName: (name: string) => Promise<User | null>
}

export class UserRepository implements IUserRepository {
  private prisma: PrismaClient

  constructor(prisma: PrismaClient) {
    this.prisma = prisma
  }

  findById = async (id: string) :Promise<User | null> => {
    const user = await this.prisma.user.findUnique({
      where: { id: id }
    })
    return user
  }

  findByName = async (name: string) :Promise<User | null> => {
    const user = await this.prisma.user.findUnique({
      where: { name: name }
    })
    return user
  }

  }

  // findById: (id: string) => {
  //   return await prisma.user.findUnique({

  //   })
  // }
// }