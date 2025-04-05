export type GalleryId = string
export type MediaId = string
export type KeywordId = string

export enum MediaMime {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO'
}

export type MediaMetadataDto = {
  gallery_id: GalleryId
  media_id: MediaId
  keyword_id: KeywordId
  likes_count: number
  width: number
  height: number
  aspect_ratio: number
  type: MediaMime
  duration: number
  created_at: Date
}

export type MediaMetadata = {
  galleryId: GalleryId
  mediaId: MediaId
  keywordId: KeywordId
  likesCount: number
  width: number
  height: number
  aspectRatio: number
  type: MediaMime
  duration?: number
  createdAt: unknown
}

export type MediaClient = {
  src: string
  keyword: string
  uploading: boolean
  selected: boolean
  liked: boolean
}

export type MediaType = MediaMetadata & MediaClient

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

export type GalleryMetadata = {
  galleryId: GalleryId
  galleryName: string
  numberOfImages: number
  numberOfVideos: number
  numberOfUsers: number
}

export type RowMediaType = {
  index: number
} & MediaType

export type RowType = {
  aspectRatio: number
  media: RowMediaType[]
}

export type RowProps = {
  pinching: boolean
} & RowType
