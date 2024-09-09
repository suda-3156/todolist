import { Request, Response } from "express";
import JWT from "jsonwebtoken"
import CryptoJS from "crypto-js";
import { prisma } from "../../index";
import { ProblemDetails, UserTokenResponse } from "../type";


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
    const response :UserTokenResponse = {
      title: "SUCCESS",
      user: {
        name: user.name,
        email: resEmail,
        role: user.role
      },
      token: {
        accessToken: accessToken
      }
    }
    return res.status(201).json(response)
  } catch (error) {
    const response :ProblemDetails = {
      title: "CANNOT_CREATE_ACCOUNT",
      detail: "Cannot create an account.",
      type: "SYSTEM_ERROR",
      status: 500,
    }
    return res.status(500).json(response)
  }
}

export const Login = async (req :Request, res :Response) => {
  const { name, password } = req.body.user
  try {
    const user = await prisma.user.findUnique({
      where: { name: name }
    })
    if( !user ) {
      const response :ProblemDetails = {
        title: "INVALID_NAME_OR_PASSWORD",
        detail: "Cannot find the user.",
        type: "UNAUTHORIZED",
        status: 401,
      }
      return res.status(401).json(response)
    }

    const decryptedPassword = CryptoJS.AES.decrypt(
      user.password,
      process.env.SECRET_KEY!
    ).toString(CryptoJS.enc.Utf8)

    if (decryptedPassword !== password) {
      const response :ProblemDetails = {
        title: "INVALID_NAME_OR_PASSWORD",
        detail: "Password dosen't match.",
        type: "UNAUTHORIZED",
        status: 401,
      }
      return res.status(401).json(response)
    }

    const resEmail = CryptoJS.AES.decrypt(user.email, process.env.SECRET_KEY!).toString(CryptoJS.enc.Utf8)
    const accessToken = JWT.sign({ id: user.id }, process.env.TOKEN_SECRET_KEY!, {
      expiresIn: "1h"    
    })

    const response :UserTokenResponse = {
      title: "SUCCESS",
      user: {
        name: user.name,
        email: resEmail,
        role: user.role
      },
      token: {
        accessToken: accessToken
      }
    }
    return res.status(201).json(response)
  } catch (error) {
    const response :ProblemDetails = {
      title: "DATABASE_ERROR",
      detail: "Cannot access to the database.",
      type: "SYSTEM_ERROR",
      status: 500,
    }
    return res.status(500).json(response)
  }
}