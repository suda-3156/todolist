import { Router, Request, Response } from "express";
import * as userController from "../controllers/user-controllers"
import * as tokenHandler from "../midleware/auth-checkers/token"
import CryptoJS from "crypto-js"
import { isUserRegister, isUserLogin } from "../midleware/validators/user";

const router = Router()

router.post("/register",
  isUserRegister,
  userController.Register
)

router.post("/login",
  isUserLogin,
  userController.Login
)

// TODO: ログアウトは、クライアント側でローカルストレージからトークン削除、ステートからユーザー情報削除でおｋ？
// client でやればいいだけ？
// router.post("/logout", (req: Request, res: Response) => {
//   res.
// })

router.post("/verify",
  tokenHandler.verifyToken,
  (req: Request, res: Response) => {
    const resEmail = CryptoJS.AES.decrypt(req.body.user.email, process.env.SECRET_KEY!).toString(CryptoJS.enc.Utf8)
    return res.status(201).json({
      responseCd: "0",
      data: {
        user: {
          name: req.body.user.name,
          email: resEmail,
          role: req.body.user.role
        }
      }
    })
  }
)

export default router