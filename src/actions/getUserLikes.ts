import { UserId } from '@/types/gallery'
import createClient from '@/utils/supabase/server'

async function getUserLikes({ userId }: { userId: UserId }) {
  const supabase = await createClient()
  const { data, error } = await supabase
    .from('media_likes')
    .select('media_id')
    .eq('user_id', userId)

  if (error) throw error

  return data.map(({ media_id }) => media_id)
}

export default getUserLikes
