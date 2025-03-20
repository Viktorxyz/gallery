'use client'

import createGalleryStore, {
  GalleryActions,
  GalleryState,
  GalleryStore
} from '@/stores/createGalleryStore'
import { GalleryType } from '@/types/gallery'
import { createContext, PropsWithChildren, useContext, useRef } from 'react'
import { useStore } from 'zustand'

const GalleryContext = createContext<GalleryStore>(null)

type GalleryProviderProps = PropsWithChildren<GalleryType>

const GalleryProvider = ({ children, ...props }: GalleryProviderProps) => {
  const storeRef = useRef<GalleryStore>(null)
  if (!storeRef.current) storeRef.current = createGalleryStore(props)

  const value = storeRef.current

  return <GalleryContext value={value}>{children}</GalleryContext>
}

export const useGallery = <T,>(
  selector: (state: GalleryState & GalleryActions) => T
): T => {
  const store = useContext(GalleryContext)
  if (!store) throw new Error('Missing GalleryProvider in the tree')
  return useStore(store, selector)
}

export default GalleryProvider
