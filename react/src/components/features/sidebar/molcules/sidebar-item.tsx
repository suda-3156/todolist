import { cn } from "@/components/shared/lib/utils"
import { motion } from "framer-motion"
import { ReactNode } from "react"
import { Link } from "react-router-dom"



export const SidebarItem :React.FC<{
  children: ReactNode, 
  className?: string, 
  isOpen: boolean, 
  num?: number,
  link: string,
}> = ({ children, className, isOpen, num, link }) => {
  const delay = 0.3 + (num ?? 0) * 0.1
  const variants = {
    hidden: {
      x: -250,
       opacity: 0,
       transition: { duration: 0.3, delay: delay, ease: [0.42, 0, 1, 1] }
    },
    show: {
      x: isOpen ? 0 : -250,
      opacity: isOpen ? 1 : 0,
      transition: { duration: 0.3, delay: delay, ease: [0.42, 0, 1, 1]}
    }
  }
  return (
    <motion.div variants={variants} initial="hidden" animate="show" className={cn("w-full h-10 hover:bg-primary/10 rounded-lg transition-all overflow-hidden focus-within:ring-1 focus-within:ring-ring", className)}>
      <Link to={link} className="w-full h-full rounded-lg focus-visible:outline-none flex justify-start items-center gap-x-2 p-2">
        {children}
      </Link>
    </motion.div>
  )
}