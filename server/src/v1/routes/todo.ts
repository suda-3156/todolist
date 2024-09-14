import { Router, Request, Response } from "express";
import { verifyToken } from "../midleware/auth-checkers/token";
import { prisma } from "../../index"
import { upsertItem, deleteItem } from "../controllers/todo-controllers";
import { isTodoItem } from "../midleware/validators/todo";
import { ApiErrorType, TodoListResponse } from "../type";

const router = Router()


router.post("/all", verifyToken, async (req: Request, res: Response) => {
  try {
    const todolist_ids = await prisma.user.findUnique({
      where : { name : req.body.user.name },
      include: {
        todolist: {
          select: {
            todolist_id: true,
            todolist_title: true,
            createdAt: true,
            updatedAt: true,
          }
        }
      }
    })

    const data = todolist_ids?.todolist.map(async(todolist) => {
      await prisma.todolist.findUnique({
        where: { todolist_id: todolist.todolist_id },
        include: {
          todoitem: {
            select: {
              todo_id: true,
              todo_title: true,
              completed: true,
              deleted: true,
              createdAt: true,
              updatedAt: true,
            }
          }
        }
      })
    })

    if (!data) {
      const response :ApiErrorType = {
        title: "DATABASE_ERROR",
        message: "Cannot access to the database.",
        category: "SYSTEM_ERROR",
        status: 500,
      }
      return res.status(500).json(response)
    }

    const response :TodoListResponse = {
      title: "SUCCESS",
      todolist: data.todolist
    }
    return res.status(200).json(response)
  } catch (error) {
    const response :ApiErrorType = {
      title: "DATABASE_ERROR",
      message: "Cannot access to the database.",
      category: "SYSTEM_ERROR",
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