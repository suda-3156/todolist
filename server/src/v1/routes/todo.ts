import { Router, Request, Response } from "express";
import { verifyToken } from "../midleware/auth-checkers/token";
import { prisma } from "../../index"
import { upsertItem, deleteItem } from "../controllers/todo-controllers";
import { isTodoItem } from "../midleware/validators/todo";

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
          }
        }
      }
    })
    if (!data) {
      return res.status(404).json({
        responseCd: "1",
        data: {
          errors: [
            "Not Found"
          ]
        }
      })
    }
    return res.status(200).json({
      responseCd: "0",
      data: {
        todos: data?.todos
      }
    })
  } catch (error) {
    return res.status(500).json({
      responseCd: "-1",
      data: {
        errors: [
          "SYSTEM_ERROR"
        ]
      }
    })
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