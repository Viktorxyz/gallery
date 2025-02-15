export type GalleryImage = {
  src: string
  uploading: boolean
  selected: boolean
  keyword: string
  likes: number
  liked: boolean
}

export type GalleryId = string

export type GalleryImageMap = Map<GalleryId, GalleryImage>
