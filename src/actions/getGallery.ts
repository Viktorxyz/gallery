'use server'

import { GalleryMetadata } from '@/types/gallery'
import createClient from '@/utils/supabase/server'

type Props = {
  galleryId: string
}

const getGallery = async ({ galleryId }: Props): Promise<GalleryMetadata> => {
  const supabase = await createClient()

  const gallery = await supabase
    .from('galleries')
    .select('gallery_name')
    .eq('gallery_id', galleryId)

  if (gallery.error) throw gallery.error

  const galleryWithCounts = await supabase
    .from('galleries_with_counts')
    .select(
      `
    number_of_images,
    number_of_videos,
    number_of_users`
    )
    .eq('gallery_id', galleryId)

  if (galleryWithCounts.error) throw galleryWithCounts.error

  return {
    galleryId,
    galleryName: gallery.data[0].gallery_name,
    numberOfImages: galleryWithCounts.data[0].number_of_images,
    numberOfVideos: galleryWithCounts.data[0].number_of_videos,
    numberOfUsers: galleryWithCounts.data[0].number_of_users
  }
}

export default getGallery
