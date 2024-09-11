import { create } from "zustand"
import { TokenType, UserType } from "@/type"
import { getTokenFromStorage, setTokenToStorage } from "../components/utils/token"


/**
 * //TODO
 * storeを丸ごと参照すると内部のstateの更新による再レンダリングが発生する
 * 不要な再レンダリングを防ぐためにはstateごとの指定が必要
 * stateの不要な再生成を防ぐためにuseCallbackでメモ化することが推奨されている
 * 
 * らしいです
 */
interface UserState {
  user: UserType | null
  token: TokenType | null
  setUser: (user: UserType | null) => void            //ユーザー情報を保存
  setToken: (token: TokenType | null) => void         //トークンを保存
  getToken: () => TokenType | null                    //トークンを取得
  resetAuth: () => void                               //ユーザー情報をトークンを削除 // TODO: storageからも消すように直す
}

export const useUserStore = create<UserState>((set,get) => ({
  user: null,
  token: null,
  setUser: (user) => {
    set(() => ({ user: user }))
  },
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



interface Loading {
  isLoading: boolean,
  setIsLoading: (flg: boolean) => void
}

export const useLoading = create<Loading>((set) => ({
  isLoading: false,
  setIsLoading: (flg) => set(() => ({ isLoading: flg }))
}))