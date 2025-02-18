export type GalleryId = string

export type GalleryImage = {
  id: GalleryId
  src: string
  uploading: boolean
  selected: boolean
  keyword: string
  likes: number
  liked: boolean
}

export type GalleryImageMap = Map<GalleryId, GalleryImage>
