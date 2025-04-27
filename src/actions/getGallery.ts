'use server'

import { Gallery } from '@/types/gallery'
import createClient from '@/utils/supabase/server'

type Props = {
  galleryId: string
}

const getGallery = async ({ galleryId }: Props): Promise<Gallery> => {
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
    number_of_photos,
    number_of_videos`
    )
    .eq('gallery_id', galleryId)

  if (galleryWithCounts.error) throw galleryWithCounts.error

  return {
    galleryId,
    galleryName: gallery.data[0].gallery_name,
    numberOfPhotos: galleryWithCounts.data[0].number_of_photos,
    numberOfVideos: galleryWithCounts.data[0].number_of_videos
  }
}

export default getGallery
