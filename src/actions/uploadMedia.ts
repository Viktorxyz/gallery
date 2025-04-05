'use server'
import { GalleryId, KeywordId, MediaMetadata, MediaMime } from '@/types/gallery'
import getVideoDimensionsServer from '@/utils/getVideoDimensionsServer'
import createClient from '@/utils/supabase/server'
import { imageSize } from 'image-size'
import { v4 as uuidv4 } from 'uuid'

export type UploadMediaProps = {
  keywordId: KeywordId
  galleryId: GalleryId
  file: File
}

const uploadMedia = async ({
  keywordId,
  galleryId,
  file
}: UploadMediaProps) => {
  const supabase = await createClient()

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
    const arrayBuffer = await file.arrayBuffer()
    const uint8Array = new Uint8Array(arrayBuffer)
    const { width, height } = imageSize(uint8Array)
    metadata.width = width
    metadata.height = height
    metadata.aspectRatio = width / height
    metadata.type = MediaMime.IMAGE
  } else if (file.type.startsWith('video')) {
    const { width, height, duration } = await getVideoDimensionsServer(file)
    metadata.width = width
    metadata.height = height
    metadata.aspectRatio = width / height
    metadata.duration = duration
    metadata.type = MediaMime.VIDEO
  }

  await supabase
    .from('media_metadata')
    .insert({
      media_id: mediaId,
      gallery_id: galleryId,
      keyword_id: keywordId,
      width: metadata.width,
      height: metadata.height,
      aspect_ratio: metadata.aspectRatio,
      type: metadata.type,
      duration: metadata.duration
    })
    .select('media_id')

  return { mediaId }
}

export default uploadMedia
