import { NextFunction, Request, Response } from "express";
import JWT from "jsonwebtoken"
import { prisma } from "../../../index";
import { ProblemDetails } from "../../type";

type TokenPayload = {
  id: string,
  iat: number,
  exp: number
}

const tokenDecode = (req :Request) => {
  const bearerHeader = req.headers["Authorization"]
  if ( bearerHeader ) {
    const bearer = bearerHeader[0].split(" ")[1]
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
      const response :ProblemDetails = {
        title: "USER_NOT_FOUND",
        detail: "Cannot find user with given id.",
        type: "SYSTEM_ERROR",
        status: 500
      }
      return res.status(500).json(response)
    }
    req.body.user = user
    next()
  } else {
    const response :ProblemDetails = {
      title: "USER_NOT_FOUND",
      detail: "Cannot find user with given id.",
      type: "AUTHENTICATION_FAILED",
      status: 401
    }
    return res.status(401).json(response)
  }
}