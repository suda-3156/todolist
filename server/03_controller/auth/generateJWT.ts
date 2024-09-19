import JWT from "jsonwebtoken"

export const generateJWT = (user_id: string) => {
  return JWT.sign({ user_id: user_id }, process.env.TOKEN_SECRET_KEY!, {
    expiresIn: "1h"
  })
}
