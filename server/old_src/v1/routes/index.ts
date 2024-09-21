import { Router } from "express";
import authrouter from "./auth"
import todorouter from "./todo"

export const authRouter = Router()

authRouter.use("/auth", authrouter)

export const todoRouter = Router()

todoRouter.use("/todolist", todorouter)