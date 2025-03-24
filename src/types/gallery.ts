export type GalleryId = string

export type MediaId = string

export enum MediaMime {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO'
}

export type MediaType = {
  id: MediaId
  src: string
  width: number
  height: number
  aspectRatio: number
  uploading: boolean
  selected: boolean
  keyword: string
  likes: number
  liked: boolean
  type: MediaMime
  duration?: number
}

export type MediaMap = Map<GalleryId, MediaType>

export type GalleryType = {
  galleryId: GalleryId
  galleryName: string
  media: MediaMap
}

export type GalleryDto = {
  gallery_id: GalleryId
  gallery_name: string
  number_of_images: number
  number_of_videos: number
  number_of_users: number
}

export type RowMediaType = {
  mapKey: string
} & MediaType

export type RowType = {
  aspectRatio: number
  media: RowMediaType[]
}

export type RowProps = {
  pinching: boolean
} & RowType
