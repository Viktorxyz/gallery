'use server'

import { GalleryDto } from '@/types/gallery'
import { convertArrayToObject } from '@/utils/object'
import createClient from '@/utils/supabase/server'

async function getGalleries() {
  const supabase = await createClient()

  const galleries = await supabase.from('galleries').select(`
    gallery_id,
    gallery_name`)

  const galleries_with_counts = await supabase.from('galleries_with_counts')
    .select(`
    gallery_id,
    number_of_photos,
    number_of_videos`)

  const galleriesWithCountsObj = convertArrayToObject(
    galleries_with_counts.data ?? [],
    'gallery_id'
  )

  const data = galleries?.data?.map(({ gallery_id, gallery_name }) => ({
    gallery_id,
    gallery_name,
    ...galleriesWithCountsObj[gallery_id]
  }))

  return {
    galleries: data as GalleryDto[],
    error: galleries.error ?? galleries_with_counts.error
  }
}

export default getGalleries
