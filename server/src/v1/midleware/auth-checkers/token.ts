import { NextFunction, Request, Response } from "express";
import JWT from "jsonwebtoken"
import { prisma } from "../../../index";
import { ApiErrorType } from "../../type";

type TokenPayload = {
  id: string,
  iat: number,
  exp: number
}

const tokenDecode = (req :Request) => {
  const bearerHeader = req.headers["authorization"]
  console.log(bearerHeader)
  console.log(req.headers)
  if ( bearerHeader ) {
    const bearer = bearerHeader.split(" ")[1]
    console.log(bearer)
    try {
      const decodedToken = JWT.verify(bearer, process.env.TOKEN_SECRET_KEY!) as TokenPayload
      return decodedToken
    } catch (error) {
      return false
    }
  } else { return false }
}

export const verifyToken = async (req: Request, res: Response, next: NextFunction) => {
  const tokenDecoded = tokenDecode(req)
  if( tokenDecoded ) {
    const user = await prisma.user.findUnique({
      where: { id: tokenDecoded.id }
    })
    if ( !user ) {
      const response :ApiErrorType = {
        title: "USER_NOT_FOUND",
        message: "Cannot find user with given id.",
        category: "SYSTEM_ERROR",
        status: 500
      }
      return res.status(500).json(response)
    }
    req.body.user = user
    next()
  } else {
    const response :ApiErrorType = {
      title: "USER_NOT_FOUND",
      message: "Cannot find user with given id.",
      category: "AUTHENTICATION_FAILED",
      status: 401
    }
    return res.status(401).json(response)
  }
}