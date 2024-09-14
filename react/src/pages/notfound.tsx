import { AnimatedDiv } from "@/components/wapper/animated-div"
import { Link } from "react-router-dom"

export const Notfound = () => {
  return (
    <AnimatedDiv className="w-screen h-screen flex flex-col justify-center items-center gap-y-5">
      <h1 className="scroll-m-20 text-6xl font-extrabold tracking-tight text-primary">Not Found</h1>
      <Link to="/login" className="scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0">
        Redirect to Login page.
      </Link>
    </AnimatedDiv>
  )
}
