import { NextFunction, Request, Response } from "express";
import JWT from "jsonwebtoken"
import { prisma } from "../../../index";


type TokenPayload = {
  id: string,
  iat: number,
  exp: number
}

const tokenDecode = (req :Request) => {
  const bearerHeader = req.headers["authorization"]
  if ( bearerHeader ) {
    const bearer = bearerHeader.split(" ")[1]
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
      return res.status(500).json({
        responseCd: "-1",
        data: {
          errors: [
            "SYSTEM_ERROR"
          ]
        }
      })
    }
    req.body.user = user
    next()
  } else {
    return res.status(401).json({
      responseCd: "1",
      data: {
        errors: [
          "AUTHENTICATION_ERROR"
        ]
      }
    })
  }
}