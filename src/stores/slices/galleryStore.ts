import { GalleryImageMap } from '@/types/gallery'
import { enableMapSet } from 'immer'
import { StateCreator } from 'zustand'
import { immer } from 'zustand/middleware/immer'

enableMapSet()

export type GalleryState = {
  images: GalleryImageMap
}

export type GalleryActions = {
  toggleLike: (id: string) => void
  toggleSelect: (id: string) => void
  setImages: (images: GalleryImageMap) => void
  addImages: (images: GalleryImageMap) => void
}

export type GallerySlice = GalleryState & GalleryActions

export const defaultInitState: GalleryState = {
  images: new Map()
}

const createGallerySlice: StateCreator<
  GallerySlice,
  [],
  [['zustand/immer', never]]
> = immer((set) => ({
  ...defaultInitState,

  toggleLike: (id) =>
    set((state) => {
      const image = state.images.get(id)
      if (image) {
        image.liked = !image.liked
        image.likes += image.liked ? 1 : -1
      }
    }),

  toggleSelect: (id) =>
    set((state) => {
      const image = state.images.get(id)
      if (image) image.selected = !image.selected
    }),

  setImages: (images) => set({ images }),

  addImages: (newImages) =>
    set((state) =>
      newImages.forEach((image, id) => state.images.set(id, image))
    )
}))

export default createGallerySlice
