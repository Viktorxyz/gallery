'use server'

import { MediaType } from '@/types/gallery'
import { convertArrayToObject } from '@/utils/object'
import getGalleryKeywords from './getGalleryKeywords'
import getGalleryMediaMetadata from './getGalleryMediaMetadata'
import getGalleryFiles from './getGalleryFiles'
import createClient from '@/utils/supabase/server'

type Props = {
  galleryId: string
}

async function getGalleryMedia({ galleryId }: Props) {
  await new Promise((resolve) => setTimeout(resolve, 5000))
  const supabase = await createClient()
  const files = await getGalleryFiles({ galleryId })
  const mediaMetadata = await getGalleryMediaMetadata({ galleryId })
  const keywords = await getGalleryKeywords({ galleryId })

  const metadata = mediaMetadata
    ? convertArrayToObject(mediaMetadata, 'mediaId')
    : {}

  const keywordsObj = keywords
    ? convertArrayToObject(keywords, 'keyword_id')
    : {}

  const media: MediaType[] = files?.map((file) => ({
    mediaId: file.id,
    galleryId,
    src: supabase.storage
      .from('galleries')
      .getPublicUrl(`${galleryId}/${file.name}`).data.publicUrl,
    keywordId: metadata[file.id].keywordId,
    keyword: keywordsObj[metadata[file.id].keywordId].keyword,
    likesCount: metadata[file.id].likesCount,
    aspectRatio: metadata[file.id].aspectRatio,
    width: metadata[file.id].width,
    height: metadata[file.id].height,
    liked: false,
    uploading: false,
    selected: false,
    type: metadata[file.id].type,
    createdAt: Date.now(),
    duration: metadata[file.id].duration
  }))

  return media
}

export default getGalleryMedia
