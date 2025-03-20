'use server'

import createClient from '@/utils/supabase/server'

type Props = {
  galleryId: string
}

const getGalleryKeywords = async ({ galleryId }: Props) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('keywords')
    .select('keyword_id,keyword')
    .eq('gallery_id', galleryId)

  return { keywords: data, error }
}

export default getGalleryKeywords
