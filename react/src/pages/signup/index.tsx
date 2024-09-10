import {
  Card,
  CardContent,
} from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Link, useNavigate } from "react-router-dom"
import { SignupFormInputSchema, SignupFormSchema } from "./schema"
import { zodResolver } from "@hookform/resolvers/zod"
import { useForm, FormProvider } from "react-hook-form"
import { AnimatedDiv } from "@/components/utils/animation"
import { SignUp, signUpAPI, UnknownSystemError } from "@/api/auth"
import { useTodoListStore } from "@/components/store"
import { DetailedApiError, UnknownApiError, ValidationApiError } from "@/api/api-base"

export const Signup = () =>  {

  return (
    <AnimatedDiv className="w-screen h-screen min-w-[500px] min-h-[380px] flex flex-col justify-center items-center space-y-4">
      <div className="flex justify-center">
        <h1 className="text-5xl font-extrabold text-primary">Todo List</h1>
      </div>
      <SignupForm />
      <div className="text-center text-sm space-x-3">
        <p className="inline-block text-muted-foreground">
          Have an account?
        </p>
        <Link to='/login' className="inline-block font-medium text-primary hover:underline hover:cursor-pointer" >
          Login
        </Link>
      </div>
    </AnimatedDiv>
  )
}


const SignupForm = () => {
  const { setUser } = useTodoListStore()
  const { setToken } = useTodoListStore()
  const navigate = useNavigate()

  const methods = useForm<SignupFormInputSchema>({
    resolver: zodResolver(SignupFormSchema),
    defaultValues: {
        name: undefined,
        password: undefined
    },
  })

  // const onSubmit = async (data: SignupFormInputSchema) => {
  //   try {
  //     const result = await signUpAPI({ name: data.name, email: data.email, password: data.password })
  //     setUser(result.user)
  //     setToken(result.token)
  //     navigate("/top")
  //   } catch (error) {
  //     if (error instanceof ValidationApiError) {
  //       switch (error.type) {
  //         case "VALIDATION_ERROR":
  //           alert(error.message)
  //           return
  //         default:
  //           alert("try again")
  //           return
  //       }
  //     }
  //     alert("unknown error")
  //   } finally {
  //     methods.reset()
  //   }
  // }

  const onSubmit = async (data: SignupFormInputSchema) => {
    const Result = await SignUp(data)
    if (Result.isFailure()) {
      return alert("_ERROR")
    }
    

  }
  // TODO: cn使う
  return (
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
            <Button type="submit" className="w-full">
              Sign Up
            </Button>
          </form>
        </FormProvider>
      </CardContent>
    </Card>
  )
}