'use server'
import { createClient } from '@/utils/supabase/client'
import { v4 as uuidv4 } from 'uuid'

const supabase = createClient()

const createNewGallery = async (galleryName: string) => {
  const { error } = await supabase
    .from('galleries')
    .insert({ gallery_name: galleryName })

  if (error) return { error }
}

export default createNewGallery
