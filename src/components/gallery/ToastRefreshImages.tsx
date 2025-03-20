import React from 'react'
import IconButton from '../IconButton'
import cn from '@/utils/cn'
import { useToast } from '@/providers/ToastProvider'
import { useParams } from 'next/navigation'
import getGallery from '@/actions/getGallery'
import { useGallery } from '@/providers/GalleryProvider'

type ToastRefreshImagesProps = {
  className?: string
}

const ToastRefreshImages = ({ className }: ToastRefreshImagesProps) => {
  const media = useGallery((state) => state.media)
  const addMedia = useGallery((state) => state.addMedia)

  const { hideToast } = useToast()
  const { galleryId } = useParams<{ galleryId: string }>()

  const refetchImages = async () => {
    const { media: newMedia } = await getGallery({ galleryId })

    Array.from(media.keys()).forEach((id) => {
      if (newMedia.get(id) !== null) newMedia.delete(id)
    })
    addMedia(newMedia)
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
