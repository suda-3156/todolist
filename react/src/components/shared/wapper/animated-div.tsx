/**
 * fade in animation for pages
 */
import React, { ReactNode } from 'react';
import { motion } from 'framer-motion';

const pageVariants = {
  initial: {
    opacity: 0,
  },
  in: {
    opacity: 1,
  },
  out: {
    opacity: 0,
  },
};

const pageTransition = {
  type: 'tween',
  ease: 'easeOut',
};

export const AnimatedDiv :React.FC<{
  children: ReactNode,
  className?: string,
  onClick?: () => void 
}> = ({ children, className, onClick }) => {
  return (
    <motion.div
      initial="initial"
      animate="in"
      exit="out"
      variants={pageVariants}
      transition={pageTransition}
      className={className}
      onClick={onClick}
    >
      {children}
    </motion.div>
  )
}
