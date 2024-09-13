/**
 * アラートモーダルのstore
 */

import { create } from "zustand"

type AlertMOdalCategory = 
    | "UNEXPECTED_ERROR"        // 予期せぬエラー、ユーザーはリトライするしかない
    | "VALIDATION_ERROR"        // validation error、ユーザーは入力しなおす
    | "UNAUTHORIZED"            // 認証エラー、ユーザーはログインしなおす
    | "AUTHENTICATION_FAILED"   // 権限なし、ログインしているユーザーのトップに戻る or log in page
    | "SYSTEM_ERROR"            // 予期せぬエラー、原因がわかってるから知らせてもいい、ユーザーはリトライすRU

type AlertModalSettings = {
  isCancenable: boolean,
  title: string,
  message: string,
  url: string,
  okLabel: string
}

interface AlertModalState {
  isOpen: boolean,
  category:
  | "UNEXPECTED_ERROR"        // 予期せぬエラー、ユーザーはリトライするしかない
  | "VALIDATION_ERROR"        // validation error、ユーザーは入力しなおす
  | "UNAUTHORIZED"            // 認証エラー、ユーザーはログインしなおす
  | "AUTHENTICATION_FAILED"   // 権限なし、ログインしているユーザーのトップに戻る or log in page
  | "SYSTEM_ERROR"            // 予期せぬエラー、原因がわかってるから知らせてもいい、ユーザーはリトライすRU
  optionalMessage: string | null,
  closeAlertModal: () => void
  openAlertModal: ( category: AlertMOdalCategory, optionalMessage?: string ) => void
  getSettings: () => AlertModalSettings
}

export const useAlertModalStore = create<AlertModalState>((set, get) => ({
  isOpen: false,
  category: "UNEXPECTED_ERROR",
  optionalMessage: null,
  closeAlertModal: () => set(() => ({ isOpen: false })),
  openAlertModal: (category, optionalMessage) => set(() => ({ isOpen: true, category: category, optionalMessage: optionalMessage ?? null })),
  getSettings: () => {
    switch( get().category ) {
      case "UNEXPECTED_ERROR":
        return {
          isCancenable: false,
          title: "Unexpected Error",
          message: get().optionalMessage ?? "Something went wrong. Please refresh the page or try again later.",
          url: "/login",
          okLabel: "Back to Login Page"
        }
      case "VALIDATION_ERROR":
        return {
          isCancenable: false,
          title: "Validation Error",
          message: get().optionalMessage ?? "The provided information is not valid. Please review and submit again.",
          // 元のページに戻るのみ
          url: "",
          okLabel: "Close"
        }
      case "UNAUTHORIZED":
        return {
          isCancenable: false,
          title: "Unauthorized",
          message: get().optionalMessage ?? "Invalid username or password. Please try again.",
          url: "/login",
          okLabel: "Login"
        }
      case "AUTHENTICATION_FAILED":
        return {
          // /private/topへ遷移
          isCancenable: true,    
          title: "Authentication Failed",
          message: get().optionalMessage ?? "Access to this resource is restricted. Please check your permissions.",
          url: "/login",
          okLabel: "Change account",
        }
      case "SYSTEM_ERROR":
        return {
          isCancenable: false,
          title: "System Error",
          message: get().optionalMessage ?? "Something went wrong. Please refresh the page or try again later.",
          // 元のページに戻るのみ
          url: "",
          okLabel: "Back"
        }
    }
  }
}))



