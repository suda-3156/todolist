import { create } from "zustand"
import { TokenType, UserType } from "@/type"
import { getTokenFromStorage, setTokenToStorage } from "../lib/token"
// import { LoginFormInputSchema } from "@/pages/login/schema"
// import { LoginAPI } from "@/api/loginApi"
// import { handleAlertModal } from "./alertModalStore"


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
  setToken: (token: TokenType | null) => void         //トークンを保存 // TODO: verifyするたびに、レスポンスに新しいアクセストークンを渡すべき？トークンとユーザーを別でセットする場合ってそんなにあるかな
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
  resetAuth: () => {
    setTokenToStorage({ accessToken: "" })
    set(() => ({ user: null, token: null }))
  },
}))


// export const LoginFunc = async (data: LoginFormInputSchema) => {
//   const Result = await LoginAPI(data)
//   // 異常系
//   if (Result.isFailure()) {
//     switch (Result.error.category) {
//       case "VALIDATION_ERROR":
//         handleAlertModal("VALIDATION_ERROR",Result.error.message)
//         return
//       case "UNAUTHORIZED":
//         handleAlertModal("UNAUTHORIZED")
//         return
//       default:
//         handleAlertModal("UNEXPECTED_ERROR")
//         return
//     }
//   }
//   // 正常系
//   console.log("success")
//   useUserStore.setState({ user: Result.value.user })
//   setTokenToStorage(Result.value.token ?? { accessToken: "" })
//   useUserStore.setState({ token: Result.value.token })
// }

// export const LogoutFunc