import { Request, Response } from "express"
import JWT from "jsonwebtoken"
import { Failure, Result, Success } from "../../type"


type TokenPayload = {
  user_id: string,
  iat: number,
  exp: number
}

export class TokenError extends Error {}

const decodeJWT = (req :Request) :Result<TokenPayload, TokenError>=> {
  const bearerHeader = req.headers["authorization"]
  if ( bearerHeader ) {
    const bearer = bearerHeader.split(" ")[1]
    try {
      const decodedToken = JWT.verify(bearer, process.env.TOKEN_SECRET_KEY!) as TokenPayload
      return new Success<TokenPayload>(decodedToken)
    } catch (error) {
      return new Failure<TokenError>(new TokenError)
    }
  }
  return new Failure<TokenError>(new TokenError)
}
