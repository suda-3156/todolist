import { Router, Request, Response } from "express";
import { verifyToken } from "../midleware/auth-checkers/token";
import { prisma } from "../../index"
import { upsertItem, deleteItem } from "../controllers/todo-controllers";
import { isTodoItem } from "../midleware/validators/todo";
import { ProblemDetails, TodoListResponse } from "../type";

const router = Router()


router.post("/all", verifyToken, async (req: Request, res: Response) => {
  try {
    const data = await prisma.user.findUnique({
      where : { name : req.body.user.name },
      include: {
        todos: {
          select: {
            itemId: true,
            title: true,
            completed: true,
            deleted: true,
            authorId: true
          }
        }
      }
    })
    if (!data) {
      const response :ProblemDetails = {
        title: "DATABASE_ERROR",
        detail: "Cannot access to the database.",
        type: "SYSTEM_ERROR",
        status: 500,
      }
      return res.status(500).json(response)
    }
    const response :TodoListResponse = {
      title: "SUCCESS",
      todolist: data.todos
    }
    return res.status(200).json(response)
  } catch (error) {
    const response :ProblemDetails = {
      title: "DATABASE_ERROR",
      detail: "Cannot access to the database.",
      type: "SYSTEM_ERROR",
      status: 500,
    }
    return res.status(500).json(response)
  }
})

router.post("/upsertOne",
  verifyToken,
  isTodoItem,
  upsertItem
)

router.delete("/deleteOne",
  verifyToken,
  isTodoItem,
  deleteItem
)

export default router