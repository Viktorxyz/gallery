import Actions from '@/components/gallery/Actions'
import Gallery from '@/components/gallery/Gallery'
import ActionsProvider from '@/providers/ActionsProvider'
import { GalleryImageMap } from '@/types/gallery'
import { convertArrayToObject } from '@/utils/object'
import { createClient } from '@/utils/supabase/client'

const supabase = createClient()

export default async function Page({
  params
}: {
  params: Promise<{ galleryId: string }>
}) {
  const { galleryId } = await params

  const { data: files } = await supabase.storage
    .from('galleries')
    .list(galleryId, {
      limit: 100,
      offset: 0
    })

  const { data: images } = await supabase
    .from('images')
    .select('image_id,keyword_id,likes_count')
    .eq('gallery_id', galleryId)
  const imagesObj = convertArrayToObject(images, 'image_id')

  const { data: keywords } = await supabase
    .from('keywords')
    .select('keyword_id,keyword')
    .eq('gallery_id', galleryId)
  const keywordsObj = convertArrayToObject(keywords, 'keyword_id')

  const initialImages: GalleryImageMap = new Map(
    files.map((file) => [
      file.id,
      {
        src: supabase.storage
          .from('galleries')
          .getPublicUrl(`${galleryId}/${file.name}`).data.publicUrl,
        keyword: keywordsObj[imagesObj[file.id].keyword_id].keyword,
        likes: imagesObj[file.id].likes_count,
        liked: false,
        uploading: false,
        selected: false
      }
    ])
  )

  return (
    <ActionsProvider>
      <Gallery initialImages={initialImages} />
      <Actions />
    </ActionsProvider>
  )
}
