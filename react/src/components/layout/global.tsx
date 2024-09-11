/**
 * ログイン後のナビゲーションと、メインコンポーネントを入れとく
 * nav : open close 
 */

import { useUserStore } from "@/store/userStore"
import { Outlet } from "react-router-dom"

import { ChevronsLeft, SquarePen, CircleUserRound, LogOut, CircleHelp } from "lucide-react"
import { AnimatedDiv } from "../utils/animation"

export const GlobalLayout = () => {
  return (
    <AnimatedDiv className="w-screen h-screen overflow-hidden flex justify-start">
      <Sidebar />
      <div className="h-full flex-grow overflow-auto">
        <Outlet />
      </div>
    </AnimatedDiv>
  )
}

const Sidebar = () => {
  const user = useUserStore((state) => state.user)
  return (
    <aside className="h-full w-60 p-4 flex flex-col bg-muted text-primary">
      <header className="w-full space-y-8">
        <div className="w-full flex justify-between">
          <ChevronsLeft className="hover:cursor-pointer"/>
          <SquarePen className="hover:cursor-pointer"/>
        </div>
        <div className="h-18 p-2 flex items-center space-x-4 hover:bg-primary/5 rounded-lg transition-all">
          <CircleUserRound size={48}/>
          <h1 className="text-2xl font-medium">{user?.name}</h1>
        </div>
      </header>
      <nav className="w-full inline-block space-y-1 overflow-y-auto flex-grow">
        <NavItem/>
        <NavItem/>
        <NavItem/>
        <NavItem/>
      </nav>
      <footer className="w-full h-10 flex items-center justify-end">
        <LogOut className="hover:cursor-pointer"/>
      </footer>
    </aside>
  )
}

const NavItem = () => {
  return (
    <button className="w-full h-10 p-2 flex items-center space-x-2 text-lg hover:bg-primary/5 active:bg-gray-300 rounded-lg transition-all">
      <CircleHelp size={20}/>
      <span className="font-medium">NavItem</span>
    </button>
  )
}
