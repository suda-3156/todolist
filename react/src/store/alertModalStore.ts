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
interface AlertModalState {
  isOpen: boolean,
  // isCancenable: boolean,
  // title: string,
  // message: string,
  // url: string,
  // okLabel: string,
  category:
  | "UNEXPECTED_ERROR"        // 予期せぬエラー、ユーザーはリトライするしかない
  | "VALIDATION_ERROR"        // validation error、ユーザーは入力しなおす
  | "UNAUTHORIZED"            // 認証エラー、ユーザーはログインしなおす
  | "AUTHENTICATION_FAILED"   // 権限なし、ログインしているユーザーのトップに戻る or log in page
  | "SYSTEM_ERROR"            // 予期せぬエラー、原因がわかってるから知らせてもいい、ユーザーはリトライすRU
  closeAlertModal: () => void
  openAlertModal: ( category: AlertMOdalCategory ) => void
  get
}

export const useAlertModalStore = create<AlertModalState>((set, get) => ({
  isOpen: false,
  category: "UNEXPECTED_ERROR",
  closeAlertModal: () => set(() => ({ isOpen: false })),
  openAlertModal: (category) => set(() => ({ isOpen: true, category: category })),
  getDetail: () => {
    switch( get().category ) {
      case "UNEXPECTED_ERROR":
        return {
          isCancenable: false,
          title: "Unexpected Error",
          message: "Something went wrong. Please refresh the page or try again later.",
          url: "/login",
          okLabel: "Back to Login Page"
        }
      case "VALIDATION_ERROR":
        return {
          isCancenable: false,
          title: "Validation Error",
          message: message ?? "The provided information is not valid. Please review and submit again.",
          url: "",      // 元のページに戻るのみ
          okLabel: "Close"
        }
      case "UNAUTHORIZED":
        return {
          isCancenable: false,
          title: "Unauthorized",
          message: "Invalid username or password. Please try again.",
          url: "/login",
          okLabel: "Login"
        }
      case "AUTHENTICATION_FAILED":
        return {
          isCancenable: true,     // /private/topへ遷移
          title: "Authentication Failed",
          message: "Access to this resource is restricted. Please check your permissions.",
          url: "/login",
          okLabel: "Change account",
        }
      case "SYSTEM_ERROR":
        return {
          isCancenable: false,
          title: "System Error",
          message: message ?? "Something went wrong. Please refresh the page or try again later.",
          url: "",          // 元のページに戻るのみ
          okLabel: "Back"
        }
    }
  }
}))



