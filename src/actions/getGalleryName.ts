import createClient from '@/utils/supabase/server'

type Params = {
  galleryId: string
}

const getGalleryName = async ({ galleryId }: Params) => {
  const supabase = await createClient()

  const { data, error } = await supabase
    .from('galleries')
    .select('gallery_name')
    .eq('gallery_id', galleryId)

  return { galleryName: data ? data[0].gallery_name : null, error }
}

export default getGalleryName
