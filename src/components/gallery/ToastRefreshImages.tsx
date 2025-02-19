import React from 'react'
import IconButton from '../IconButton'
import cn from '@/utils/cn'
import { useToast } from '@/providers/ToastProvider'
import { useParams } from 'next/navigation'
import useGalleryStore from '@/stores/galleryStore'
import getGallery from '@/actions/getGallery'

type ToastRefreshImagesProps = {
  className?: string
}

const ToastRefreshImages = ({ className }: ToastRefreshImagesProps) => {
  const { hideToast } = useToast()
  const { galleryId } = useParams<{ galleryId: string }>()
  const { images: currentImages, addImages } = useGalleryStore()

  const refetchImages = async () => {
    const { gallery } = await getGallery({ galleryId })

    Array.from(currentImages.keys()).forEach((id) => {
      if (gallery.get(id) !== null) gallery.delete(id)
    })
    addImages(gallery)
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
