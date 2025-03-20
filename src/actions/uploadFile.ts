'use server'
import { MediaMime } from '@/types/gallery'
import getVideoDimensionsServer from '@/utils/getVideoDimensionsServer'
import createClient from '@/utils/supabase/server'
import { imageSize } from 'image-size'
import { v4 as uuidv4 } from 'uuid'

const uploadFile = async (keywordId: string, galleryId: string, file: File) => {
  const supabase = await createClient()

  const fileName = file.name
  const fileExtension = fileName.slice(fileName.lastIndexOf('.') + 1)
  const fileUuid = uuidv4()

  const path = `${galleryId}/${fileUuid}.${fileExtension}`

  const {
    data: { id }
  } = await supabase.storage.from('galleries').upload(path, file)

  const metadata = {
    width: 0,
    height: 0,
    aspectRatio: 0,
    type: undefined,
    duration: undefined
  }
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
      media_id: id,
      gallery_id: galleryId,
      keyword_id: keywordId,
      width: metadata.width,
      height: metadata.height,
      aspect_ratio: metadata.aspectRatio,
      type: metadata.type,
      duration: metadata.duration
    })
    .select('media_id')

  return { id }
}

export default uploadFile
