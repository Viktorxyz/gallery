'use client'

import { ReactNode } from 'react'
import { createPortal } from 'react-dom'
import { AnimatePresence, motion } from 'framer-motion'

type DrawerProps = {
  isOpen: boolean
  onClickAway?: () => void
  children: ReactNode
}

function Drawer({ isOpen, onClickAway, children }: DrawerProps) {
  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          onClick={onClickAway}
          className='fixed w-screen h-screen bg-black/75 z-50 top-0'
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <motion.div
            className='fixed bottom-0 w-full rounded-t-4xl bg-zinc-900'
            initial={{ y: '100%' }}
            animate={{ y: 0 }}
            exit={{ y: '100%' }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>,
    document.body
  )
}

export default Drawer
