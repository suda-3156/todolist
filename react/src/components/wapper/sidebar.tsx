import { motion } from "framer-motion"
import { ReactNode } from "react"


export const SidebarUtils :React.FC<{ children: ReactNode, className?: string, isOpen: boolean }> = ({ children, className, isOpen }) => {
  const variants = {
    hidden: {
      opacity: 0,
      transition: { duration: 0.3, delay: isOpen ? 0.8 : 0 }
    },
    show: {
      opacity: isOpen ? 1 : 0,
      transition: { duration: 0.3, delay: isOpen ? 0.8 : 0 }
    }
  }
  return (
    <motion.div variants={variants} initial="hidden" animate="show" className={className}>
      {children}
    </motion.div>
  )
}

export const SidebarContents :React.FC<{ children: ReactNode, isOpen: boolean}> = ({ children, isOpen }) => {
  const variants = {
    hidden: {
      x: -240,
      opacity: 0,
      transition: { duration: 0.3 , ease: 'easeOut' }
    },
    show: {
      x: isOpen ? 0 : -240,
      opacity: isOpen ? 1 : 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  }
  return (
    <motion.div variants={variants} initial="hidden" animate="show" className="flex-grow h-full py-6 pl-4 flex flex-col" >
      {children}
    </motion.div>
  )
}