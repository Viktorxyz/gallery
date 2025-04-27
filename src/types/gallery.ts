export type GalleryId = string
export type MediaId = string
export type UserId = string

export enum MediaMime {
  IMAGE = 'IMAGE',
  VIDEO = 'VIDEO'
}

export type MediaMetadataDto = {
  media_id: MediaId
  gallery_id: GalleryId
  user_id: UserId
  likes_count: number
  type: MediaMime
  width: number
  height: number
  aspect_ratio: number
  created_at: Date
}

export type MediaMetadata = {
  mediaId: MediaId
  galleryId: GalleryId
  userId: UserId
  username: string
  likesCount: number
  type: MediaMime
  width: number
  height: number
  aspectRatio: number
  createdAt: string
}

export type MediaClient = {
  src: string
  liked: boolean
  uploading: boolean
}

export type Media = MediaMetadata & MediaClient

export type MediaMap = Map<GalleryId, Media>

export type GalleryDto = {
  gallery_id: GalleryId
  gallery_name: string
  number_of_photos: number
  number_of_videos: number
}

export type Gallery = {
  galleryId: GalleryId
  galleryName: string
  numberOfPhotos: number
  numberOfVideos: number
}

export type RowMediaType = {
  index: number
} & Media

export type RowType = {
  aspectRatio: number
  media: RowMediaType[]
}

export type RowProps = {
  pinching: boolean
} & RowType
