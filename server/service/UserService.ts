import { User } from "@prisma/client"
import { PrismaClient } from "@prisma/client"
import { IUserRepository } from "../01_repository/UserRepository"

export interface IUserService {
  register

}

export class UserServide implements IUserService {
  private userRepository: IUserRepository

  constructor(userRepository: IUserRepository) {
    this.userRepository= userRepository
  }

  findById = async (id: string) :Promise<User | null> => {
    const user = await this.prisma.user.findUnique({
      where: { id: id }
    })
    return user
  }

}
