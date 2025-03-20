'use server'

import createClient from '@/utils/supabase/server'

const createGallery = async (galleryName: string) => {
  const supabase = await createClient()

  const { error } = await supabase
    .from('galleries')
    .insert({ gallery_name: galleryName })

  if (error) return { error }
}

export default createGallery
