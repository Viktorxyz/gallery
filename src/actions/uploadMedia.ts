'use server'
import { GalleryId, MediaMetadata, MediaMime } from '@/types/gallery'
import getImageDimensions from '@/utils/getImageDimensions'
import getVideoDimensionsServer from '@/utils/getVideoDimensionsServer'
import createClient from '@/utils/supabase/server'
import { v4 as uuidv4 } from 'uuid'

export type UploadMediaProps = {
  galleryId: GalleryId
  file: File
}

const uploadMedia = async ({ galleryId, file }: UploadMediaProps) => {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthenticated')

  const fileName = file.name
  const fileExtension = fileName.slice(fileName.lastIndexOf('.') + 1)
  const fileUuid = uuidv4()

  const path = `${galleryId}/${fileUuid}.${fileExtension}`

  const { data, error } = await supabase.storage
    .from('galleries')
    .upload(path, file)

  if (error) throw error

  const mediaId = data.id

  const metadata: Partial<MediaMetadata> = {}
  if (file.type.startsWith('image')) {
    const { width, height } = await getImageDimensions(file)
    metadata.width = width
    metadata.height = height
    metadata.aspectRatio = width / height
    metadata.type = MediaMime.IMAGE
  } else if (file.type.startsWith('video')) {
    const { width, height } = await getVideoDimensionsServer(file)
    metadata.width = width
    metadata.height = height
    metadata.aspectRatio = width / height
    metadata.type = MediaMime.VIDEO
  }

  await supabase.from('media_metadata').insert({
    media_id: mediaId,
    user_id: user.id,
    gallery_id: galleryId,
    width: metadata.width,
    height: metadata.height,
    aspect_ratio: metadata.aspectRatio,
    type: metadata.type
  })

  return { mediaId }
}

export default uploadMedia
