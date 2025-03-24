'use client'

import { use } from 'react'
import Row from './Row'
import { GalleryDto, GalleryMetadata } from '@/types/gallery'
import { PostgrestError } from '@supabase/supabase-js'
import cn from '@/utils/cn'

type GalleriesProps = {
  galleriesPromise: Promise<{
    galleries: GalleryDto[]
    error: PostgrestError | null
  }>
  className?: string
}

const Galleries = ({ className, galleriesPromise }: GalleriesProps) => {
  const { galleries } = use(galleriesPromise)

  const mapped: GalleryMetadata[] = galleries.map((gallery) => ({
    galleryId: gallery.gallery_id,
    galleryName: gallery.gallery_name,
    numberOfImages: gallery.number_of_images,
    numberOfVideos: gallery.number_of_videos,
    numberOfUsers: gallery.number_of_users
  }))

  return (
    <div className={cn('flex flex-col flex-1 gap-8 pb-6', className)}>
      {mapped.map((gallery, i) => (
        <Row gallery={gallery} index={i + 1} key={i} />
      ))}
    </div>
  )
}

export default Galleries
