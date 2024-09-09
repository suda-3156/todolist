import { create } from "zustand"

export type User = {
  name: string,
  email: string,
  role: 
    | "USER"
    | "ADMIN"
} | null

export type Token = {
  accessToken: string
} | null

export type Password = {
  password: string,
  confirmPassword?: string
}

interface State {
  user: User
  token: Token
  isNoticeModalShown: boolean
  setUser: (user: User) => void       //ユーザー情報を保存
  getUser:  () => void                //ユーザー情報を取得
  setToken: (token: Token) => void    //トークンを保存
  getToken: () => void                //トークンを取得
  resetAuth: () => void                //ユーザー情報をトークンを削除
  openNoticeModal : () => void
  closeNoticeModal : () => void
}

export const useTodoListStore = create<State>((set,get) => ({
  user: null,
  token: null,
  isNoticeModalShown: false,
  setUser: (user) => set(() => ({ user: user })),
  getUser: () => get().user,
  setToken: (token) => set(() => ({ token: token })),
  getToken: () => get().token,
  resetAuth: () => set(() => ({ user: null, token: null })),
  openNoticeModal: () => set(() => ({ isNoticeModalShown: true })),
  closeNoticeModal: () => set(() => ({ isNoticeModalShown: false }))
}))