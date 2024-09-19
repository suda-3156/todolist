
import { Router } from "express";
import { UserController } from "../03_controller/userController";
import { CreateUserUseCase } from "../02_usecase/createUser";
import { UserRepository } from "../01_repository/UserRepository";
import { PrismaClient } from "@prisma/client";
import { RoleRepository } from "../01_repository/RoleRepository";

const router = Router()

const prisma = new PrismaClient()

const userRepository = new UserRepository(prisma)

const roleRepository = new RoleRepository(prisma)

const createUserUseCase = new CreateUserUseCase(userRepository)

const userController = new UserController(createUserUseCase)

router.post("/register",
  userController.createUser
)

// export default router


export const authRouter = Router()

authRouter.use("/auth", router)
