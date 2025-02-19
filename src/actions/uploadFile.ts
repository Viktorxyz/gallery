'use server'
import createClient from '@/utils/supabase/server'
import supabasePromise from '@/utils/supabase/server'
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

  await supabase
    .from('images')
    .insert({
      image_id: id,
      gallery_id: galleryId,
      keyword_id: keywordId
    })
    .select('image_id')

  return { id }
}

export default uploadFile
