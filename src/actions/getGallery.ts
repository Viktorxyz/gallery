'use server'

import { convertArrayToObject } from '@/utils/object'
import getFiles from './getFiles'
import getImages from './getImages'
import getKeywords from './getKeywords'
import { GalleryMap } from '@/types/gallery'
import createClient from '@/utils/supabase/server'

type Props = {
  galleryId: string
}

const getGallery = async ({ galleryId }: Props) => {
  const supabase = await createClient()

  const { files, error: filesError } = await getFiles({ galleryId })
  const { images, error: imagesError } = await getImages({ galleryId })
  const { keywords, error: keywordsError } = await getKeywords({ galleryId })

  const imagesObj = convertArrayToObject(images, 'image_id')

  const keywordsObj = convertArrayToObject(keywords, 'keyword_id')

  const gallery: GalleryMap = new Map(
    files.map((file) => [
      file.id,
      {
        id: file.id,
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

  return { gallery, error: filesError ?? imagesError ?? keywordsError ?? null }
}

export default getGallery
