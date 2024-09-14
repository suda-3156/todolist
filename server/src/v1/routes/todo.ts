import { Router, Request, Response } from "express";
import { verifyToken } from "../midleware/auth-checkers/token";
import { prisma } from "../../index"
import { upsertItem, deleteItem } from "../controllers/todo-controllers";
import { isTodoItem } from "../midleware/validators/todo";
import { ApiErrorType } from "../type";

const router = Router()


router.post("/all", verifyToken, async (req: Request, res: Response) => {
  const todolists = await prisma.user.findUnique({
    where: { name: req.body.user.name },
    select: {
      todolist: {
        where: {
          author_id: req.body.user.id
        },
        select: {
          todolist_title: true,
          todolist_id: true,
          todoitem: {
            where: {
              author_id: req.body.user.id
            },
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
      }
    }
  })
  // try {


  //   if (!data) {
  //     const response :ApiErrorType = {
  //       title: "DATABASE_ERROR",
  //       message: "Cannot access to the database.",
  //       category: "SYSTEM_ERROR",
  //       status: 500,
  //     }
  //     return res.status(500).json(response)
  //   }

  //   const response :TodoListResponse = {
  //     title: "SUCCESS",
  //     todolist: data.todolist
  //   }
  //   return res.status(200).json(response)
  // } catch (error) {
  //   const response :ApiErrorType = {
  //     title: "DATABASE_ERROR",
  //     message: "Cannot access to the database.",
  //     category: "SYSTEM_ERROR",
  //     status: 500,
  //   }
  //   return res.status(500).json(response)
  // }
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