
import { Router } from "express";
import { UserController } from "../03_controller/userController";
import { CreateUserUseCase } from "../02_usecase/Account/CreateUserUseCase";
import { UserRepository } from "../01_repository/UserRepository";
import { PrismaClient } from "@prisma/client";
// import { RoleRepository } from "../01_repository/RoleRepository";
import { LoginUseCase } from "../02_usecase/Account/LoginUseCase";
import { VerifyUserIdUseCase } from "../02_usecase/Account/VerifyUserIdUseCase";

const router = Router()

// deta access
const prisma = new PrismaClient()

// repository
const userRepository = new UserRepository(prisma)
// const roleRepository = new RoleRepository(prisma)

// use case
const createUserUseCase = new CreateUserUseCase(userRepository)
const loginUseCase = new LoginUseCase(userRepository)
const verifyUserIdUseCase = new VerifyUserIdUseCase(userRepository)

// controller
const userController = new UserController(createUserUseCase,loginUseCase,verifyUserIdUseCase)

router.post("/register",
  userController.createUser
)
router.post("/login",
  userController.login
)
router.post("/verify",
  userController.authenticate
)

export const authRouter = Router()

authRouter.use("/auth", router)
