'use server'

import createClient from '@/utils/supabase/server'

type Props = {
  galleryId: string
}

const getGalleryMedia = async ({ galleryId }: Props) => {
  const supabase = await createClient()

  const { data, error } = await supabase.storage
    .from('galleries')
    .list(galleryId, {
      limit: 100,
      offset: 0,
      sortBy: { column: 'created_at', order: 'desc' }
    })

  return { media: data, error }
}

export default getGalleryMedia
