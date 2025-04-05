import React from 'react'
import IconButton from '../IconButton'
import cn from '@/utils/cn'
import { ToastContextType, useToast } from '@/providers/ToastProvider'

type ToastRefreshImagesProps = {
  className?: string
}

const ToastRefreshImages = ({ className }: ToastRefreshImagesProps) => {
  const { hideToast } = useToast() as ToastContextType

  const refetchImages = async () => {
    // const { media: newMedia } = await getGallery({ galleryId })

    // Array.from(media.keys()).forEach((id) => {
    //   if (newMedia.get(id) !== null) newMedia.delete(id)
    // })
    // add newMedia
    hideToast()
  }

  return (
    <IconButton
      onClick={refetchImages}
      variant="sm"
      color="black"
      icon="IconRotateRight"
      className={cn(
        'fixed outline-1 outline-white bottom-28 right-6',
        className
      )}
    />
  )
}

export default ToastRefreshImages
