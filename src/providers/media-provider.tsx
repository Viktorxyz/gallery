'use client'

import { Media } from '@/types/gallery'
import { useQuery } from '@tanstack/react-query'
import { createContext, PropsWithChildren, useContext } from 'react'

type MediaContextType = {
  isLoading: boolean
  media?: Media[]
}

const MediaContext = createContext<MediaContextType | null>(null)

type MediaProviderProps = {
  mediaPromise: Promise<Media[]>
}

function MediaProvider({
  children,
  mediaPromise
}: PropsWithChildren<MediaProviderProps>) {
  const { data: media, isLoading } = useQuery({
    queryFn: () => mediaPromise,
    queryKey: ['media']
  })

  const value = {
    media,
    isLoading
  }

  return <MediaContext value={value}>{children}</MediaContext>
}

export const useMedia = () => useContext(MediaContext) as MediaContextType

export default MediaProvider
