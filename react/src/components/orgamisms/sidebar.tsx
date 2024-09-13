
import { motion } from "framer-motion"
import { CircleUserRound, LogOut, SquarePen } from "lucide-react"

import { useSidebarState } from "@/store/sidebarStore"
import { useUserStore } from "@/store/userStore"

import { SidebarContents, SidebarItem, SidebarUtils } from "../wapper/sidebar"
import { SidebarOpener } from "../molcules/sidebar-opener"


export const Sidebar = () => {

  const user = useUserStore((state) => state.user)
  const toggleSidebar = useSidebarState((state) => state.toggleSidebar)
  const isOpen = useSidebarState((state) => state.isOpen)


  return (
    <motion.div
      transition={{ duration: 0.3, ease: 'easeInOut' }}
      animate={{ width: isOpen ? 250 : 40 }}
      className="h-full flex bg-muted text-foreground"
    >
      <SidebarContents isOpen={isOpen}>
        <SidebarUtils isOpen={isOpen}>
          <div className="w-full flex justify-end">
            <SquarePen className="hover:cursor-pointer text-primary" />
          </div>
        </SidebarUtils>
        <SidebarItem isOpen={isOpen} className="w-full mt-4">
          <div className="h-18 p-2 flex items-center space-x-4 hover:bg-primary/10 rounded-lg transition-all">
            <CircleUserRound size={48} />
            <h1 className="text-2xl font-medium hover:cursor-default">{user?.name}</h1>
          </div>
        </SidebarItem>
        <SidebarItem isOpen={isOpen} className="w-full h-10 flex items-center p-2 hover:bg-primary/10 rounded-lg transition-all" num={1}>
          <p>testasdfasdfasdfasdfaasdfa</p>
        </SidebarItem>
        <SidebarItem isOpen={isOpen} className="w-full h-10 flex items-center p-2 hover:bg-primary/10 rounded-lg transition-all" num={2}>
          <p>test</p>
        </SidebarItem>
        <SidebarItem isOpen={isOpen} className="w-full h-10 flex items-center p-2 hover:bg-primary/10 rounded-lg transition-all" num={3}>
          <p>test</p>
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