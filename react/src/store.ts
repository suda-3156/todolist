import { create } from "zustand"
import { TokenType, UserType } from "@/type"
import { getTokenFromStorage, setTokenToStorage } from "./components/utils/token"

interface UserState {
  user: UserType | null
  token: TokenType | null
  setUser: (user: UserType | null) => void       //ユーザー情報を保存
  getUser:  () => void                    //ユーザー情報を取得
  setToken: (token: TokenType | null) => void    //トークンを保存
  getToken: () => void                    //トークンを取得
  resetAuth: () => void                   //ユーザー情報をトークンを削除
}

export const useUserStore = create<UserState>((set,get) => ({
  user: null,
  token: null,
  setUser: (user) => set(() => ({ user: user })),
  getUser: () => get().user,
  setToken: (token) => {
    setTokenToStorage(token ?? { accessToken: "" })
    set(() => ({ token: token }))
  },
  getToken: () => {
    set(() => ({ token: getTokenFromStorage() }))
    return get().token
  },
  resetAuth: () => set(() => ({ user: null, token: null })),
}))

interface AlertModalState {
  isOpen: boolean,
  title: string,
  message: string,
  url: string,
  isCancenable: boolean,
  openAlertModal: () => void,
  closeAlertModal: () => void,
  // resetAlertModal: () => void,
  setAlertModal: ({ title, message, url, isCancenable }: { title: string, message: string, url: string, isCancenable: boolean }) => void
}

export const useAlertModalStore = create<AlertModalState>((set) => ({
  isOpen: false,
  title: "Notification",
  message: "An unexpected error has occurred. Please try again later.",
  url: "/login",
  isCancenable: false,
  openAlertModal: () => set(() => ({ isOpen: true })),
  // TODO: titleなどリセットしたいけど、モーダル閉じる瞬間に変化するのはやだ。
  closeAlertModal: () => set(() => ({ isOpen: false/*, title: "Notification", message: "An unexpected error has occurred. Please try again later.", url: "/top"*/ })),
  // resetAlertModal: () => set(() => ({ title: "Notification", message: "An unexpected error has occurred. Please try again later.", url: "/top" })),
  setAlertModal: ({ title, message, url, isCancenable }) => set(() => ({ title: title, message: message, url: url, isCancenable: isCancenable }))
}))

interface Loading {
  isLoading: boolean,
  setIsLoading: (flg: boolean) => void
}

export const useLoading = create<Loading>((set) => ({
  isLoading: false,
  setIsLoading: (flg) => set(() => ({ isLoading: flg }))
}))