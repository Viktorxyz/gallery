'use server'

import createClient from '@/utils/supabase/server'

type Props = {
  galleryId: string
}

const getGalleryMediaMetadata = async ({ galleryId }: Props) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('media_metadata')
    .select(
      'media_id,keyword_id,likes_count,width,height,aspect_ratio,type,duration'
    )
    .eq('gallery_id', galleryId)

  return { mediaMetadata: data, error }
}

export default getGalleryMediaMetadata
