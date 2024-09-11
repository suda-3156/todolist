/**
 * Protected Route
 * 認証済みの場合のみ閲覧できるページにかぶせる
 */
import { VerifyTokenAPI } from "@/api/verifyTokenApi"
import { useUserStore } from "@/store/userStore"
import { handleAlertModal } from "@/store/alertModalStore"
import { FC, useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { Loading } from "../modules/loading"

interface ProtectedRouteProps {
  redirectTo: string
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ redirectTo }) => {
  const { setUser, setToken, user } = useUserStore()
  const resetAuth = useUserStore((state) => state.resetAuth) 
  //TODO: このページだけのローディングを使っているのよくない気がする
  const [ isThisLoading, setIsThisLoading ] = useState(true)

  useEffect(() => {
    const verify = async () => {
      setIsThisLoading(true)
      const Result = await VerifyTokenAPI()
      if (Result.isFailure()) {
        switch (Result.error.category) {
          case "AUTHENTICATION_FAILED":
            handleAlertModal("AUTHENTICATION_FAILED")
            resetAuth()
            setIsThisLoading(false)
            return
          default:
            handleAlertModal("UNEXPECTED_ERROR")
            resetAuth()
            setIsThisLoading(false)
            return
        }
      }
      setUser(Result.value.user)
      setIsThisLoading(false)
    }
    verify()
  },[resetAuth, setIsThisLoading, setToken, setUser])


  if ( isThisLoading ) {
    return <Loading />
  }

  return !user ? (
    <Navigate to={redirectTo} replace />
  ) : (
    <Outlet />
  )
}