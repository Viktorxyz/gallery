import { create } from 'zustand'

type GalleryState = {
  isSelecting: boolean
  selectedMedia: Set<number>
}

type GalleryActions = {
  setIsSelecting: (value: boolean) => void
  selectMedia: (index: number) => void
  deselectMedia: (index: number) => void
  resetSelectedMedia: () => void
}

type GalleryStore = GalleryState & GalleryActions

const useGallery = create<GalleryStore>((set) => ({
  selectedMedia: new Set([]),
  isSelecting: false,
  resetSelectedMedia: () => set({ selectedMedia: new Set([]) }),
  setIsSelecting: (value) => set(() => ({ isSelecting: value })),
  selectMedia: (index) =>
    set((state) => {
      const selectedMedia = new Set(state.selectedMedia)
      selectedMedia.add(index)
      return { selectedMedia }
    }),
  deselectMedia: (index) =>
    set((state) => {
      const selectedMedia = new Set(state.selectedMedia)
      selectedMedia.delete(index)
      return { selectedMedia }
    })
}))

export default useGallery
