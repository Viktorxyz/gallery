'use server'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

const createKeyword = async (galleryId: string, keyword: string) => {
  const { data, error } = await supabase
    .from('keywords')
    .insert({ gallery_id: galleryId, keyword })
    .select('keyword_id')

  if (error) return { error }

  return { keywordId: data[0].keyword_id, error }
}

export default createKeyword
