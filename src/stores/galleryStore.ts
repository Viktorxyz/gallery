import { GalleryImage, GalleryImageMap } from '@/types/gallery'
import { enableMapSet } from 'immer'
import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'

enableMapSet()

export type GalleryState = {
  images: GalleryImageMap
}

export type GalleryActions = {
  toggleLike: (key: string) => void
  toggleSelect: (key: string) => void
  toggleUploading: (key: string) => void
  setImage: (key: string, imageProps?: Partial<GalleryImage>) => void
  setImages: (images: GalleryImageMap) => void
  addImages: (images: GalleryImageMap) => void
}

export type GalleryStore = GalleryState & GalleryActions

export const defaultInitState: GalleryState = {
  images: null
}

const useGalleryStore = create<GalleryStore>()(
  immer((set) => ({
    ...defaultInitState,

    toggleLike: (key) =>
      set((state) => {
        const image = state.images.get(key)
        if (image) {
          image.liked = !image.liked
          image.likes += image.liked ? 1 : -1
        }
      }),

    toggleSelect: (key) =>
      set((state) => {
        const image = state.images.get(key)
        if (image) image.selected = !image.selected
      }),

    toggleUploading: (key) =>
      set((state) => {
        const image = state.images.get(key)
        if (image) image.uploading = !image.uploading
      }),

    setImage: (key, imageProps) =>
      set((state) => {
        const image = state.images.get(key)
        if (image) state.images.set(key, { ...image, ...imageProps })
      }),

    setImages: (images) => set({ images }),

    addImages: (newImages) =>
      set((state) => ({ images: new Map([...newImages, ...state.images]) }))
  }))
)

export default useGalleryStore
