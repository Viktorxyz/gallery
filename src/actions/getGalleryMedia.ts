'use server'

import { convertArrayToObject } from '@/utils/object'
import getGalleryMediaMetadata from './getGalleryMediaMetadata'
import getGalleryFiles from './getGalleryFiles'
import createClient from '@/utils/supabase/server'
import { Media } from '@/types/gallery'
import getUserLikes from './getUserLikes'

type Props = {
  galleryId: string
}

async function getGalleryMedia({ galleryId }: Props) {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()
  const userLikes = new Set(
    user ? await getUserLikes({ userId: user?.id }) : []
  )
  const files = await getGalleryFiles({ galleryId })
  const mediaMetadata = await getGalleryMediaMetadata({ galleryId })

  const metadata = mediaMetadata
    ? convertArrayToObject(mediaMetadata, 'mediaId')
    : {}

  const media: Media[] = files?.map((file) => ({
    mediaId: file.id,
    userId: metadata[file.id].userId,
    username: metadata[file.id].username,
    galleryId: metadata[file.id].galleryId,
    liked: userLikes.has(file.id),
    src: supabase.storage
      .from('galleries')
      .getPublicUrl(`${galleryId}/${file.name}`).data.publicUrl,
    likesCount: metadata[file.id].likesCount,
    aspectRatio: metadata[file.id].aspectRatio,
    width: metadata[file.id].width,
    height: metadata[file.id].height,
    uploading: false,
    type: metadata[file.id].type,
    createdAt: metadata[file.id].createdAt
  }))

  return media
}

export default getGalleryMedia
