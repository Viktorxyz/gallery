export type GalleryId = string

export type GalleryImage = {
  id: GalleryId
  src: string
  width: number
  height: number
  aspectRatio: number
  uploading: boolean
  selected: boolean
  keyword: string
  likes: number
  liked: boolean
}

export type GalleryMap = Map<GalleryId, GalleryImage>

export type RowType = {
  aspectRatio: number
  images: GalleryImage[]
}

export type RowProps = {
  pinching: boolean
} & RowType
