/**
 * アラートモーダルのstore
 */

import { create } from "zustand"


interface AlertModalState {
  isOpen: boolean,
  isCancenable: boolean,
  title: string,
  message: string,
  url: string,
  okLabel: string,
  closeAlertModal: () => void,
}

export const useAlertModalStore = create<AlertModalState>((set) => ({
  isOpen: false,
  isCancenable: false,
  title: "Notification",
  message: "An unexpected error has occurred. Please try again later.",
  url: "/login",
  okLabel: "Continue",
  closeAlertModal: () => set(() => ({ isOpen: false })),
}))

type AlertMOdalCategory = 
    | "UNEXPECTED_ERROR"        // 予期せぬエラー、ユーザーはリトライするしかない
    | "VALIDATION_ERROR"        // validation error、ユーザーは入力しなおす
    | "UNAUTHORIZED"            // 認証エラー、ユーザーはログインしなおす
    | "AUTHENTICATION_FAILED"   // 権限なし、ログインしているユーザーのトップに戻る or log in page
    | "SYSTEM_ERROR"            // 予期せぬエラー、原因がわかってるから知らせてもいい、ユーザーはリトライすRU

export const handleAlertModal = 
  (category:AlertMOdalCategory, message?: string ) => {
  switch( category ) {
    case "UNEXPECTED_ERROR":
      useAlertModalStore.setState({
        isOpen: true,
        isCancenable: false,
        title: "Unexpected Error",
        message: "Something went wrong. Please refresh the page or try again later.",
        url: "/login",
        okLabel: "Back to Login Page"
      })
      return
    case "VALIDATION_ERROR":
      useAlertModalStore.setState({
        isOpen: true,
        isCancenable: false,
        title: "Validation Error",
        message: message ?? "The provided information is not valid. Please review and submit again.",
        url: "",      // 元のページに戻るのみ
        okLabel: "Close"
      })
      return
    case "UNAUTHORIZED":
      useAlertModalStore.setState({
        isOpen: true,
        isCancenable: false,
        title: "Unauthorized",
        message: "Invalid username or password. Please try again.",
        url: "/login",
        okLabel: "Login"
      })
      return
    case "AUTHENTICATION_FAILED":
      useAlertModalStore.setState({
        isOpen: true,
        isCancenable: true,     // /private/topへ遷移
        title: "Authentication Failed",
        message: "Access to this resource is restricted. Please check your permissions.",
        url: "/login",
        okLabel: "Change account",
      })
      return
    case "SYSTEM_ERROR":
      useAlertModalStore.setState({
        isOpen: true,
        isCancenable: false,
        title: "System Error",
        message: message ?? "Something went wrong. Please refresh the page or try again later.",
        url: "",          // 元のページに戻るのみ
        okLabel: "Back"
      })
      return
  }
}