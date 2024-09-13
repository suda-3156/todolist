import { motion } from "framer-motion"
import { ChevronsRight } from "lucide-react"


export const SidebarOpener :React.FC<{ isOpen: boolean, toggleSidebar: () => void }> = ({ isOpen, toggleSidebar }) => {
  const variants = {
    hidden: {
      x: 0,
      transition: { duration: 0.3 , ease: 'easeInOut' }
    },
    show: {
      x: isOpen ? 0 : -215,
      transition: { duration: 0.3, ease: 'easeInOut' },
    }
  }

  return (
    <motion.div variants={variants} initial="hidden" animate="show" className="w-full h-screen flex items-center">
      <ChevronsRight className={`transition-transform duration-700 text-primary hover:cursor-pointer ${isOpen? "-rotate-180" : ""}`}  onClick={toggleSidebar}/>
    </motion.div>
  )
}