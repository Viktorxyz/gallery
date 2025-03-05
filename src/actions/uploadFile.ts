'use server'
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

  const arrayBuffer = await file.arrayBuffer()
  const uint8Array = new Uint8Array(arrayBuffer)
  const { width, height } = imageSize(uint8Array)

  await supabase
    .from('images')
    .insert({
      image_id: id,
      gallery_id: galleryId,
      keyword_id: keywordId,
      width,
      height,
      aspect_ratio: width / height
    })
    .select('image_id')

  return { id }
}

export default uploadFile
