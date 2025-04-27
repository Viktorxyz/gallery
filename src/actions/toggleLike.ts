'use server'

import createClient from '@/utils/supabase/server'

export type ToggleLikeProps = {
  mediaId: string
}

const toggleLike = async ({ mediaId }: ToggleLikeProps) => {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Unauthenticated')

  const { data: like, error: mediaLikesError } = await supabase
    .from('media_likes')
    .select('media_id')
    .eq('media_id', mediaId)
    .eq('user_id', user.id)

  if (mediaLikesError) throw mediaLikesError

  const action = like.length > 0 // true=-1 false=+1

  if (action)
    await supabase
      .from('media_likes')
      .delete()
      .eq('media_id', mediaId)
      .eq('user_id', user.id)
  else
    await supabase.from('media_likes').insert({
      media_id: mediaId,
      user_id: user.id
    })

  const { data, error: mediaMetadataError } = await supabase
    .from('media_metadata')
    .select('likes_count')
    .eq('media_id', mediaId)

  if (mediaMetadataError) throw mediaMetadataError

  const likes_count = data[0].likes_count

  await supabase
    .from('media_metadata')
    .update({ likes_count: action ? likes_count - 1 : likes_count + 1 })
    .eq('media_id', mediaId)
}

export default toggleLike
