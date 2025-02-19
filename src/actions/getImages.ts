'use server'

import createClient from '@/utils/supabase/server'

type Props = {
  galleryId: string
}

const getImages = async ({ galleryId }: Props) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('images')
    .select('image_id,keyword_id,likes_count')
    .eq('gallery_id', galleryId)

  return { images: data, error }
}

export default getImages
