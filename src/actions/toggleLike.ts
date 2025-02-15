'use server'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

const toggleLike = async (imageId: string, keywordId: string) => {
  const { data: like } = await supabase
    .from('image_likes')
    .select('image_id')
    .eq('image_id', imageId)
    .eq('keyword_id', keywordId)

  const action = like.length > 0 // true=-1 false=+1

  if (action)
    await supabase
      .from('image_likes')
      .delete()
      .eq('image_id', imageId)
      .eq('keyword_id', keywordId)
  else
    await supabase.from('image_likes').insert({
      image_id: imageId,
      keyword_id: keywordId
    })

  const {
    data: [{ likes_count }]
  } = await supabase
    .from('images')
    .select('likes_count')
    .eq('image_id', imageId)

  await supabase
    .from('images')
    .update({ likes_count: action ? likes_count - 1 : likes_count + 1 })
    .eq('image_id', imageId)
}

export default toggleLike
