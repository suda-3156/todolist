import { TokenType } from "@/type"


export const getTokenFromStorage = () :TokenType => {
  const accessToken = localStorage.getItem("accessToken") ?? ""
  return { accessToken: accessToken } 
}

export const setTokenToStorage = (token: TokenType) => {
  localStorage.setItem("accessToken", token.accessToken)
}