import React from 'react'
import IconButton from '../IconButton'
import cn from '@/utils/cn'
import { useToast } from '@/providers/ToastProvider'
import { createClient } from '@/utils/supabase/client'
import { useParams } from 'next/navigation'
import { convertArrayToObject } from '@/utils/object'
import { GalleryImageMap } from '@/types/gallery'
import useGalleryStore from '@/stores/galleryStore'

type ToastRefreshImagesProps = {
  className?: string
}

const supabase = createClient()

const ToastRefreshImages = ({ className }: ToastRefreshImagesProps) => {
  const { hideToast } = useToast()
  const { galleryId } = useParams<{ galleryId: string }>()
  const { images: currentImages, addImages } = useGalleryStore()

  const refetchImages = async () => {
    const { data: files } = await supabase.storage
      .from('galleries')
      .list(galleryId, {
        limit: 100,
        offset: 0,
        sortBy: { column: 'created_at', order: 'desc' }
      })

    const { data: images } = await supabase
      .from('images')
      .select('image_id,keyword_id,likes_count')
      .eq('gallery_id', galleryId)
    const imagesObj = convertArrayToObject(images, 'image_id')

    const { data: keywords } = await supabase
      .from('keywords')
      .select('keyword_id,keyword')
      .eq('gallery_id', galleryId)
    const keywordsObj = convertArrayToObject(keywords, 'keyword_id')

    const fetchedImages: GalleryImageMap = new Map(
      files.map((file) => [
        file.id,
        {
          id: file.id,
          src: supabase.storage
            .from('galleries')
            .getPublicUrl(`${galleryId}/${file.name}`).data.publicUrl,
          keyword: keywordsObj[imagesObj[file.id].keyword_id].keyword,
          likes: imagesObj[file.id].likes_count,
          liked: false,
          uploading: false,
          selected: false
        }
      ])
    )

    Array.from(currentImages.keys()).forEach((id) => {
      if (fetchedImages.get(id) !== null) fetchedImages.delete(id)
    })
    addImages(fetchedImages)
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
