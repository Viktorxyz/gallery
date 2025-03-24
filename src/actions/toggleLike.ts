'use server'

import createClient from '@/utils/supabase/server'

const toggleLike = async (mediaId: string, keywordId: string) => {
  const supabase = await createClient()

  const { data: like, error: mediaLikesError } = await supabase
    .from('media_likes')
    .select('media_id')
    .eq('media_id', mediaId)
    .eq('keyword_id', keywordId)

  if (mediaLikesError) return { error: mediaLikesError }

  const action = like.length > 0 // true=-1 false=+1

  if (action)
    await supabase
      .from('media_likes')
      .delete()
      .eq('media_id', mediaId)
      .eq('keyword_id', keywordId)
  else
    await supabase.from('media_likes').insert({
      media_id: mediaId,
      keyword_id: keywordId
    })

  const { data, error: mediaMetadataError } = await supabase
    .from('media_metadata')
    .select('likes_count')
    .eq('media_id', mediaId)

  if (mediaMetadataError) return { error: mediaMetadataError }

  const likes_count = data[0].likes_count

  await supabase
    .from('media_metadata')
    .update({ likes_count: action ? likes_count - 1 : likes_count + 1 })
    .eq('media_id', mediaId)
}

export default toggleLike
