import { GalleryType, MediaMap, MediaType } from '@/types/gallery'
import { enableMapSet } from 'immer'
import { createStore } from 'zustand'
import { immer } from 'zustand/middleware/immer'

enableMapSet()

export type GalleryState = GalleryType

export type GalleryActions = {
  toggleLike: (key: string) => void
  toggleSelect: (key: string) => void
  toggleUploading: (key: string) => void
  setSingleMedia: (key: string, mediaProps?: Partial<MediaType>) => void
  setMedia: (media: MediaMap) => void
  addMedia: (media: MediaMap) => void
}

export type GalleryStore = ReturnType<typeof createGalleryStore>

const defaultInitState: GalleryState = {
  galleryName: '',
  galleryId: '',
  media: new Map()
}

const createGalleryStore = (initProps?: Partial<GalleryType>) =>
  createStore<GalleryState & GalleryActions>()(
    immer((set) => ({
      ...defaultInitState,
      ...initProps,
      toggleLike: (key) =>
        set((state) => {
          const image = state.media.get(key)
          if (image) {
            image.liked = !image.liked
            image.likes += image.liked ? 1 : -1
          }
        }),

      toggleSelect: (key) =>
        set((state) => {
          const image = state.media.get(key)
          if (image) image.selected = !image.selected
        }),

      toggleUploading: (key) =>
        set((state) => {
          const image = state.media.get(key)
          if (image) image.uploading = !image.uploading
        }),

      setSingleMedia: (key, imageProps) =>
        set((state) => {
          const image = state.media.get(key)
          if (image) state.media.set(key, { ...image, ...imageProps })
        }),

      setMedia: (media) => set({ media }),

      addMedia: (newImages) =>
        set((state) => ({ media: new Map([...newImages, ...state.media]) }))
    }))
  )

export default createGalleryStore
