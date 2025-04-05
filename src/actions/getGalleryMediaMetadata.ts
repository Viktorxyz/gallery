'use server'

import { MediaMetadata } from '@/types/gallery'
import createClient from '@/utils/supabase/server'

type Props = {
  galleryId: string
}

const getGalleryMediaMetadata = async ({
  galleryId
}: Props): Promise<MediaMetadata[]> => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('media_metadata')
    .select(
      'media_id,keyword_id,likes_count,width,height,aspect_ratio,type,duration'
    )
    .eq('gallery_id', galleryId)

  if (error) throw error

  const mediaMetadata: MediaMetadata[] = data.map((m) => ({
    mediaId: m.media_id,
    galleryId,
    keywordId: m.keyword_id,
    width: m.width,
    height: m.height,
    aspectRatio: m.aspect_ratio,
    likesCount: m.likes_count,
    type: m.type,
    duration: m.duration,
    createdAt: Date.now()
  }))

  return mediaMetadata
}

export default getGalleryMediaMetadata
