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
      'media_id,user_id,gallery_id,likes_count,width,height,aspect_ratio,type,created_at'
    )
    .eq('gallery_id', galleryId)

  if (error) throw error

  const mediaMetadata: MediaMetadata[] = data.map((m) => ({
    mediaId: m.media_id,
    userId: m.user_id,
    username: 'username',
    galleryId: m.gallery_id,
    likesCount: m.likes_count,
    type: m.type,
    width: m.width,
    height: m.height,
    aspectRatio: m.aspect_ratio,
    createdAt: m.created_at
  }))

  return mediaMetadata
}

export default getGalleryMediaMetadata
