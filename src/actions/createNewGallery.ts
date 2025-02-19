'use server'

import createClient from '@/utils/supabase/server'

const createNewGallery = async (galleryName: string) => {
  const supabase = await createClient()

  const { error } = await supabase
    .from('galleries')
    .insert({ gallery_name: galleryName })

  if (error) return { error }
}

export default createNewGallery
