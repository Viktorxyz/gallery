'use server'

import { convertArrayToObject } from '@/utils/object'
import { GalleryType, MediaMap } from '@/types/gallery'
import createClient from '@/utils/supabase/server'
import getGalleryName from './getGalleryName'
import getGalleryKeywords from './getGalleryKeywords'
import getGalleryMedia from './getGalleryMedia'
import getGalleryMediaMetadata from './getGalleryMediaMetadata'

type Props = {
  galleryId: string
}

const getGallery = async ({ galleryId }: Props): Promise<GalleryType> => {
  const supabase = await createClient()

  const { media } = await getGalleryMedia({ galleryId })
  const { mediaMetadata } = await getGalleryMediaMetadata({ galleryId })
  const { keywords } = await getGalleryKeywords({ galleryId })
  const { galleryName } = await getGalleryName({ galleryId })

  const metadata = mediaMetadata
    ? convertArrayToObject(mediaMetadata, 'media_id')
    : {}

  const keywordsObj = keywords
    ? convertArrayToObject(keywords, 'keyword_id')
    : {}

  const mediaMap: MediaMap = new Map(
    media.map((file) => [
      file.id,
      {
        id: file.id,
        src: supabase.storage
          .from('galleries')
          .getPublicUrl(`${galleryId}/${file.name}`).data.publicUrl,
        keyword: keywordsObj[metadata[file.id].keyword_id].keyword,
        likes: metadata[file.id].likes_count,
        aspectRatio: metadata[file.id].aspect_ratio,
        width: metadata[file.id].width,
        height: metadata[file.id].height,
        liked: false,
        uploading: false,
        selected: false,
        type: metadata[file.id].type,
        duration: metadata[file.id].duration
      }
    ])
  )

  return {
    media: mediaMap,
    galleryId,
    galleryName
  }
}

export default getGallery
