/**
 * Protected Route
 * 認証済みの場合のみ閲覧できるページにかぶせる
 */
import { VerifyTokenAPI } from "@/api/verifyTokenApi"
import { useAlertModalStore, useLoading, useUserStore } from "@/store"
import { FC, useEffect } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { Loading } from "../modules/login"

interface ProtectedRouteProps {
  redirectTo: string
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ redirectTo }) => {
  const { setAlertModal, openAlertModal } = useAlertModalStore()
  const { setUser, setToken, user } = useUserStore()
  const { isLoading, setIsLoading } = useLoading()

  useEffect(() => {
    const verify = async () => {
      setIsLoading(true)
      const Result = await VerifyTokenAPI()
      if (Result.isFailure()) {
        switch (Result.error.category) {
          case "AUTHENTICATION_FAILED":
            setAlertModal({ title: "Authentication Failed", message: "You're not logged in. Please login.", url: "/login", isCancenable: false })
            openAlertModal()
            setUser(null)
            setToken(null)
            setIsLoading(false)
            return
          default:
            setAlertModal({ title: "System Error", message: "Something went wrong. Try again later.", url: "/login", isCancenable: false })
            openAlertModal()
            setUser(null)
            setToken(null)
            setIsLoading(false)
            return
        }
      }
      setUser(Result.value.user)
      setIsLoading(false)
    }
    verify()
  },[openAlertModal, setAlertModal, setIsLoading, setToken, setUser])


  if ( isLoading ) {
    return <Loading />
  }

  return !user ? (
    <Navigate to={redirectTo} replace />
  ) : (
    <Outlet />
  )
}