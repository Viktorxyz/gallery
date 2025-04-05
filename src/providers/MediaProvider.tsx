'use client'

import { MediaType } from '@/types/gallery'
import { useQuery } from '@tanstack/react-query'
import { createContext, PropsWithChildren, useContext } from 'react'

type MediaContextType = {
  isLoading: boolean
  media?: MediaType[]
}

const MediaContext = createContext<MediaContextType | null>(null)

type MediaProviderProps = {
  mediaPromise: Promise<MediaType[]>
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
    media: media,
    isLoading
  }

  return <MediaContext value={value}>{children}</MediaContext>
}

export const useMedia = () => useContext(MediaContext) as MediaContextType

export default MediaProvider
