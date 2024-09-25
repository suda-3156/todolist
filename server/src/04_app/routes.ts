
import { Router } from "express";
import { UserController } from "../03_controller/userController";
import { CreateUserUseCase } from "../02_usecase/Account/CreateUserUseCase";
import { UserRepository } from "../01_repository/UserRepository";
import { PrismaClient } from "@prisma/client";
import { LoginUseCase } from "../02_usecase/Account/LoginUseCase";
import { VerifyUserIdUseCase } from "../02_usecase/Account/VerifyUserIdUseCase";
import { GetRoleUseCase } from "@/02_usecase/Role/GetRoleUseCase";
import { RoleRepository } from "@/01_repository/RoleRepository";
import { GetRoleByIdUseCase } from "@/02_usecase/Role/GetRoleByIdUseCase";

const auth = Router()

// deta access
const prisma = new PrismaClient()

// repository
const userRepository = new UserRepository(prisma)
const roleRepository = new RoleRepository(prisma)

// use case
const createUserUseCase = new CreateUserUseCase(userRepository)
const loginUseCase = new LoginUseCase(userRepository)
const verifyUserIdUseCase = new VerifyUserIdUseCase(userRepository)
const getRoleUseCase = new GetRoleUseCase(roleRepository)
const getRoleByIdUseCase = new GetRoleByIdUseCase(roleRepository)

// controller
const userController = new UserController(createUserUseCase,loginUseCase,verifyUserIdUseCase,getRoleUseCase,getRoleByIdUseCase)

auth.post("/register",
  userController.createUser
)
auth.post("/login",
  userController.login
)
auth.post("/verify",
  userController.authenticate
)

export const authRouter = Router()

authRouter.use("/auth", auth)
