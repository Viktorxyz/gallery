'use client'

import { IconDownload, IconX } from '@/data/icons'
import useGallery from '@/stores/galleryStore'
import React, { useCallback } from 'react'
import { motion as m } from 'framer-motion'
import useHeader from '@/stores/headerStore'

const variants = {
  visible: {
    y: '0'
  },
  hidden: {
    y: '100%'
  }
}

function SelectActions() {
  const isSelecting = useGallery((state) => state.isSelecting)
  const selectedMedia = useGallery((state) => state.selectedMedia)
  const isActionsVisible = useHeader((state) => state.isActionsVisible)
  const resetSelectedMedia = useGallery((state) => state.resetSelectedMedia)
  const setIsSelecting = useGallery((state) => state.setIsSelecting)

  const stopSelecting = useCallback(() => {
    setIsSelecting(false)
    resetSelectedMedia()
  }, [setIsSelecting, resetSelectedMedia])

  return (
    <m.div
      className="fixed w-full bottom-0 flex justify-between py-4 px-6 bg-black"
      variants={variants}
      transition={{
        bounce: 0,
        duration: 0.3
      }}
      initial="hidden"
      animate={
        isSelecting && isActionsVisible && selectedMedia.size > 0
          ? 'visible'
          : 'hidden'
      }
    >
      <div className="flex flex-col items-center">
        <IconX className="fill-white" onClick={stopSelecting} />
        <div className="text-xs text-zinc-400">cancel</div>
      </div>
      <div className="flex flex-col items-center">
        <IconDownload className="fill-white" />
        <div className="text-xs text-zinc-400">download</div>
      </div>
    </m.div>
  )
}

export default SelectActions
