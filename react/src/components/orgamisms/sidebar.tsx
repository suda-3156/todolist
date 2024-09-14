
import { motion } from "framer-motion"
import { CircleUserRound, LogOut, SquarePen, ListTodo } from "lucide-react"

import { useSidebarState } from "@/store/sidebarStore"
import { useUserStore } from "@/store/userStore"

import { SidebarContents, SidebarUtils } from "../wapper/sidebar"
import { SidebarOpener } from "../molcules/sidebar-opener"
import { SidebarItem } from "../molcules/sidebar-item"


export const Sidebar = () => {

  const user = useUserStore((state) => state.user)
  const toggleSidebar = useSidebarState((state) => state.toggleSidebar)
  const isOpen = useSidebarState((state) => state.isOpen)


  return (
    <motion.div
      transition={{ duration: 0.3, ease: 'easeOut' }}
      animate={{ width: isOpen ? 250 : 40 }}
      className="h-full flex bg-muted text-foreground"
    >
      <SidebarContents isOpen={isOpen}>
        <SidebarUtils isOpen={isOpen}>
          <div className="w-full flex justify-end">
            <SquarePen className="hover:cursor-pointer text-primary" />
          </div>
        </SidebarUtils>
        <SidebarItem isOpen={isOpen} link="/private/top" className="mt-4 mb-3 h-18 space-x-4 focus-within:ring-1 focus-within:ring-ring">
          <CircleUserRound size={48} />
          <p className="text-2xl font-medium">{user?.name}</p>
        </SidebarItem>
        <SidebarItem isOpen={isOpen} num={1} link="/private/todolist" >
          <ListTodo />
          Todo list
        </SidebarItem>
        <SidebarUtils isOpen={isOpen} className="mt-auto">
          <footer className="w-full h-10 flex items-center justify-end text-primary">
            <LogOut className="hover:cursor-pointer" />
          </footer>
        </SidebarUtils>
      </SidebarContents>
      <SidebarOpener isOpen={isOpen} toggleSidebar={toggleSidebar}/>
    </motion.div>
  )
}