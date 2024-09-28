
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
import { ClearTodoUseCase } from "@/02_usecase/Todolist/ClearTodoUseCase";
import { TodolistRepository } from "@/01_repository/TodolistRepository";
import { StyleRepository } from "@/01_repository/StyleRepository";
import { CreateTodoUseCase } from "@/02_usecase/Todolist/CreateTodoUseCase";
import { CreateTodolistUseCase } from "@/02_usecase/Todolist/CreateTodolistUseCase";
import { DeleteTodolistUseCase } from "@/02_usecase/Todolist/DeleteTodolistUseCase";
import { EditTodoUseCase } from "@/02_usecase/Todolist/EditTodoUseCase";
import { EditTodolistUseCase } from "@/02_usecase/Todolist/EditTodolistUseCase";
import { GetTodosUseCase } from "@/02_usecase/Todolist/GetTodosUseCase";
import { GetTodolistOverviewUseCase } from "@/02_usecase/Todolist/GetTodolistOverviewUseCase";
import { TodolistController } from "@/03_controller/todolistController";
import { GetStyleUseCase } from "@/02_usecase/Style/GetStyleUseCase";
import { VerifyToken } from "@/03_controller/auth/verifyToken";

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

const todolist = Router()

const todolistRepository = new TodolistRepository(prisma)
const styleRepository = new StyleRepository(prisma)

const clearTodoUseCase = new ClearTodoUseCase(todolistRepository)
const createTodoUseCase = new CreateTodoUseCase(todolistRepository)
const createTodolistUseCase = new CreateTodolistUseCase(todolistRepository)
const deleteTodolistUseCase = new DeleteTodolistUseCase(todolistRepository)
const editTodoUseCase = new EditTodoUseCase(todolistRepository)
const editTodolistUseCase = new EditTodolistUseCase(todolistRepository)
const getTodosUseCase = new GetTodosUseCase(todolistRepository)
const getTodolistOverviewUseCase = new GetTodolistOverviewUseCase(todolistRepository, userRepository)

const getStyleUseCase = new GetStyleUseCase(styleRepository)

const verifyToken = new VerifyToken(verifyUserIdUseCase)

const todolistController = new TodolistController(
  createTodoUseCase,
  createTodolistUseCase,
  getTodosUseCase,
  getTodolistOverviewUseCase,
  editTodoUseCase,
  editTodolistUseCase,
  clearTodoUseCase,
  deleteTodolistUseCase,
  getStyleUseCase
)

todolist.get("/list", verifyToken.execute, todolistController.getTodolistOverview)

todolist.post("/list", verifyToken.execute, todolistController.createTodolist)

todolist.put("/list", verifyToken.execute, todolistController.updateTodolist)

todolist.delete("/list", verifyToken.execute, todolistController.deleteTodolist)

todolist.get("/todo", verifyToken.execute, todolistController.getTodos)

todolist.post("/todo", verifyToken.execute, todolistController.createTodo)

todolist.put("/todo", verifyToken.execute, todolistController.createTodo)

todolist.delete("/todo", verifyToken.execute, todolistController.clearTodo)

export const todolistRouter = Router()

todolistRouter.use("/todolist", todolist)