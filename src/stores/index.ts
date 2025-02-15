import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import createUserSlice, { UserSlice } from './slices/userStore'
import createGallerySlice, { GallerySlice } from './slices/galleryStore'

const useBoundStore = create<UserSlice & GallerySlice>()(
  persist(
    (...a) => ({
      ...createUserSlice(...a),
      ...createGallerySlice(...a)
    }),
    { name: 'bound-store' }
  )
)

export default useBoundStore
