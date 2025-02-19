'use server'

import createClient from '@/utils/supabase/server'

const deleteGallery = async (galleryId) => {
  // listing all files
  const supabase = await createClient()

  const { data } = await supabase.storage.from('galleries').list(galleryId)
  const filesToDelete = data.map((item) => `${galleryId}/${item.name}`)
  // removing files
  await supabase.storage.from('galleries').remove(filesToDelete)
  // removing from table
  await supabase.from('galleries').delete().eq('gallery_id', galleryId)
}

export default deleteGallery
