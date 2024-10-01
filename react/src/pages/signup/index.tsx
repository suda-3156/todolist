/**
 * Sign Up Page
 */
import { useAlertModalStore } from "@/components/features/alert-modal/alertModalStore"
import { useUserStore } from "@/components/shared/store/userStore"
import { Link, useNavigate } from "react-router-dom"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, FormProvider } from "react-hook-form"

import { AnimatedDiv } from "@/components/shared/wapper/animated-div"
import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"

import { SignUpAPI } from "@/api/signUpApi"
import { SignupFormInputSchema, SignupFormSchema } from "./schema"



export const Signup = () =>  {
  const methods = useForm<SignupFormInputSchema>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
      name: undefined,
      password: undefined
    },
  })

  const { setUser } = useUserStore()
  const { setToken } = useUserStore()
  const navigate = useNavigate()
  const openAlertModal = useAlertModalStore((state) => state.openAlertModal)

  const onSubmit = async (data: SignupFormInputSchema) => {
    const Result = await SignUpAPI({...data, role: "USER"})
    // 異常系
    if (Result.isFailure()) {
      switch (Result.error.category) {
        case "VALIDATION_ERROR":
          openAlertModal("VALIDATION_ERROR", Result.error.message)
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


  // TODO: cn使う フォームコンポーネントをまとめる
  return (
    <AnimatedDiv className="w-screen h-screen min-w-[500px] min-h-[380px] flex flex-col justify-center items-center space-y-4">
      <div className="flex justify-center">
        <h1 className="text-6xl font-extrabold text-primary tracking-tight">Todo List</h1>
      </div>
      <Card className="w-[500px] h-[575px] p-6">
        <CardContent >
          <div className="space-y-2 text-center">
            <h1 className="text-3xl font-bold">Sign Up</h1>
            <p className="text-muted-foreground">Enter your username, password and email to create your account.</p>
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
                <Label htmlFor="username">Email</Label>
                <Input
                  id="email"
                  type="text"
                  {...methods.register("email")}
                  className={`${
                    methods.formState.errors.email ? 'border-red-600 focus-visible:ring-red-600' : ''
                  }`}
                />
                <p className="w-full h-4 text-sm text-red-600">{methods.formState.errors.email?.message ?? ""}</p>
              </div>
              <div className="space-y-1">
                <Label htmlFor="password">Password</Label>
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
              <div className="space-y-1">
                <Label htmlFor="password">Confirm Password</Label>
                <Input
                  id="confirmPassword"
                  type="password"
                  {...methods.register("confirmPassword")}
                  className={`${
                    methods.formState.errors.confirmPassword ? 'border-red-600 focus-visible:ring-red-600' : ''
                  }`}
                />
                <p className="w-full h-4 text-sm text-red-600">{methods.formState.errors.confirmPassword?.message ?? ""}</p>
              </div>
              <Button type="submit" className="w-full text-card text-xl font-semibold tracking-tight">
                Sign Up
              </Button>
            </form>
          </FormProvider>
        </CardContent>
      </Card>
      <div className="text-center text-sm space-x-3">
        <p className="inline-block text-muted-foreground">
          Have an account?
        </p>
        <Link to='/login' className="inline-block font-medium text-foreground hover:underline hover:cursor-pointer" >
          Login
        </Link>
      </div>
    </AnimatedDiv>
  )
}

