import { Request } from "express"
import JWT from "jsonwebtoken"


type TokenPayload = {
  id: string,
  iat: number,
  exp: number
}

export class TokenError extends Error {}

export const decodeJWT = (req :Request) => {
  const bearerHeader = req.headers["authorization"]
  if ( bearerHeader ) {
    const bearer = bearerHeader.split(" ")[1]
    try {
      const decodedToken = JWT.verify(bearer, process.env.TOKEN_SECRET_KEY!) as TokenPayload
      return decodedToken
    } catch (error) {
      return new TokenError
    }
  }
  return new TokenError
}
