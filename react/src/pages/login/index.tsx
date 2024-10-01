/**
 * Login Page
 */
import { useAlertModalStore } from "@/components/features/alert-modal/alertModalStore"
import { useUserStore } from "@/components/shared/store/userStore"
import { Link, useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, FormProvider } from "react-hook-form"

import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { AnimatedDiv } from "@/components/shared/wapper/animated-div"

import { LoginAPI } from "@/api/loginApi"
import { LoginFormInputSchema, LoginFormSchema } from "./schema"



export const LoginForm = () =>  {
  const methods = useForm<LoginFormInputSchema>({
    resolver: zodResolver(LoginFormSchema),
    defaultValues: {
      name: undefined,
      password: undefined
    },
  })
  
  const { setUser } = useUserStore()
  const { setToken } = useUserStore()
  const openAlertModal = useAlertModalStore((state) => state.openAlertModal)
  const navigate = useNavigate()

  const onSubmit = async (data: LoginFormInputSchema) => {
    const Result = await LoginAPI(data)
    // 異常系
    if (Result.isFailure()) {
      switch (Result.error.category) {
        case "VALIDATION_ERROR":
          openAlertModal("VALIDATION_ERROR", Result.error.message)
          return
        case "UNAUTHORIZED":
          openAlertModal("UNAUTHORIZED", Result.error.message)
          return
        default:
          openAlertModal("UNEXPECTED_ERROR")
          return
      }
    }
    // 正常系
    setUser(Result.value.user)
    setToken(Result.value.token)
    methods.reset()
    navigate("/private/top")
  }
  return (
    <AnimatedDiv className="w-screen h-screen min-w-[500px] min-h-[380px] flex flex-col justify-center items-center space-y-4">
      <div className="flex justify-center">
        <h1 className="text-6xl font-extrabold tracking-tight text-primary">Todo List</h1>
      </div>
      <Card className="w-[500px] h-[380px] p-6">
        <CardContent >
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Login</h1>
            <p className="text-muted-foreground">Enter your username and password to access your account.</p>
          </div>
          <FormProvider {...methods}>
            <form onSubmit={methods.handleSubmit(onSubmit)} className="space-y-2">
              <div className="space-y-1">
                <Label htmlFor="username">Username</Label>
                <Input
                  id="username"
                  type="text"
                  {...methods.register("name")}
                  className={`${
                    methods.formState.errors.name ? 'border-red-600 focus-visible:ring-red-600' : ''
                  }`}
                />
                <p className="w-full h-4 text-sm text-red-600">{methods.formState.errors.name?.message ?? ""}</p>
              </div>
              <div className="space-y-1">
                <div className="flex justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Link to='/login' className="text-sm text-card-foreground hover:underline hover:cursor-pointer">
                    Forgot password?
                  </Link>
                </div>
                <Input
                  id="password"
                  type="password"
                  {...methods.register("password")}
                  className={`${
                    methods.formState.errors.password ? 'border-red-600 focus-visible:ring-red-600' : ''
                  }`}
                />
                <p className="w-full h-4 text-sm text-red-600">{methods.formState.errors.password?.message ?? ""}</p>
              </div>
              <Button type="submit" className="w-full text-card text-xl font-semibold tracking-tight">
                Login
              </Button>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
      <div className="text-center text-sm space-x-3">
        <p className="inline-block text-muted-foreground">
          Don't have an account?
        </p>
        <Link to='/sign-up' className="inline-block font-medium text-foreground hover:underline hover:cursor-pointer" >
          Sign Up
        </Link>
      </div>
    </AnimatedDiv>
  )
}
