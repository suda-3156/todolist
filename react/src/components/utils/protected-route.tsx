/**
 * Protected Route
 * 認証済みの場合のみ閲覧できるページにかぶせる
 */
import { VerifyTokenAPI } from "@/api/verifyTokenApi"
import { useUserStore } from "@/store/userStore"
import { useAlertModalStore } from "@/store/alertModalStore"
import { FC, useEffect, useState } from "react"
import { Navigate, Outlet } from "react-router-dom"
import { Loading } from "../modules/login"

interface ProtectedRouteProps {
  redirectTo: string
}

export const ProtectedRoute: FC<ProtectedRouteProps> = ({ redirectTo }) => {
  const { setAlertModal, openAlertModal } = useAlertModalStore()
  const { setUser, setToken, user } = useUserStore()
  //TODO: このページだけのローディングを使っているのよくない気がする
  const [ isThisLoading, setIsThisLoading ] = useState(true)

  useEffect(() => {
    const verify = async () => {
      setIsThisLoading(true)
      const Result = await VerifyTokenAPI()
      if (Result.isFailure()) {
        switch (Result.error.category) {
          case "AUTHENTICATION_FAILED":
            setAlertModal({ title: "Authentication Failed", message: "You're not logged in. Please login.", url: "/login", isCancenable: false })
            openAlertModal()
            setUser(null)
            setToken(null)
            setIsThisLoading(false)
            return
          default:
            setAlertModal({ title: "System Error", message: "Something went wrong. Try again later.", url: "/login", isCancenable: false })
            openAlertModal()
            setUser(null)
            setToken(null)
            setIsThisLoading(false)
            return
        }
      }
      setUser(Result.value.user)
      setIsThisLoading(false)
    }
    verify()
  },[openAlertModal, setAlertModal, setIsThisLoading, setToken, setUser])


  if ( isThisLoading ) {
    return <Loading />
  }

  return !user ? (
    <Navigate to={redirectTo} replace />
  ) : (
    <Outlet />
  )
}