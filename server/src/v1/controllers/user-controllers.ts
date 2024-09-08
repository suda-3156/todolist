import { Request, Response } from "express";
import JWT from "jsonwebtoken"
import CryptoJS from "crypto-js";
import { prisma } from "../../index";


export const Register = async (req :Request, res: Response) => {
  const { name, password, email } = req.body.user

  try {
    const encryptedPassword = CryptoJS.AES.encrypt(password, process.env.SECRET_KEY!).toString()
    const encryptedEmail = CryptoJS.AES.encrypt(email, process.env.SECRET_KEY!).toString()
    const newId = crypto.randomUUID().toString()
    const user = await prisma.user.create({
      data: {
        id: newId,
        name: name,
        password: encryptedPassword,
        email: encryptedEmail
      }
    })
    const accessToken = JWT.sign({ id: user.id }, process.env.TOKEN_SECRET_KEY!, {
      expiresIn: "1h"
    })
    const resEmail = CryptoJS.AES.decrypt(user.email, process.env.SECRET_KEY!).toString(CryptoJS.enc.Utf8)
    return res.status(201).json({
      responseCd: "0",
      data: {
        user: {
          name: user.name,
          email: resEmail,
          role: user.role
        },
        token: {
          accessToken: accessToken
        }
      }
    })
  } catch (error) {
    res.status(500).json({
      responseCd: "-1",
      data: {
        errors: ["SYSTEM_ERROR"]
      }
    })
  }
}

export const Login = async (req :Request, res :Response) => {
  const { name, password } = req.body.user
  try {
    const user = await prisma.user.findUnique({
      where: { name: name }
    })
    if( !user ) {
      return res.status(401).json({
        responseCd: "1",
        data: {
          errors: ["INVALID_USERNAME_OR_PASSWORD"]
        }
      })
    }

    const decryptedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.SECRET_KEY!
    ).toString(CryptoJS.enc.Utf8)

    if (decryptedPassword !== password) {
      return res.status(401).json({
        responseCd: "1",
        data: {
          errors: ["INVALID_USERNAME_OR_PASSWORD"]
        }
      })
    }

    const resEmail = CryptoJS.AES.decrypt(user.email, process.env.SECRET_KEY!).toString(CryptoJS.enc.Utf8)
    const accessToken = JWT.sign({ id: user.id }, process.env.TOKEN_SECRET_KEY!, {
      expiresIn: "1h"    
    })

    return res.status(201).json({
      responseCd: "0",
      data: {
        user: {
          name: user.name,
          email: resEmail,
          role: user.role
        },
        token: {
          accessToken: accessToken
        }
      }
    })
  } catch (error) {
    return res.status(500).json({
      responseCd: "-1",
      message: "SYSTEM_ERROR"
    })
  }
}