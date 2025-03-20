'use client'

import { usePinch } from '@use-gesture/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import useUserStore from '@/stores/userStore'
import { useToast } from '@/providers/ToastProvider'
import createClient from '@/utils/supabase/client'
import Row from './Row'
import generateImageRows from '@/utils/generateMediaRows'
import Header from './Header'
import Actions from './Actions'
import { useGallery } from '@/providers/GalleryProvider'

const MAX_ZOOM_LEVEL = 7
const MIN_ZOOM_LEVEL = 1

const supabase = createClient()

const Gallery = () => {
  const media = useGallery((state) => state.media)
  const setMedia = useGallery((state) => state.setMedia)
  const galleryName = useGallery((state) => state.galleryName)

  const galleryRef = useRef(null)
  const [pinching, setPinching] = useState(false)

  const { showToast } = useToast()
  const { zoomLevel, setZoomLevel, keywordId } = useUserStore()

  const imageRows = useMemo(
    // this is not being updated when media is changed!!!
    () =>
      generateImageRows(
        Array.from(media).map(([mapKey, value]) => ({
          mapKey,
          ...value
        })),
        zoomLevel
      ),
    [media, zoomLevel]
  )

  useEffect(() => {
    const setImagesWithUserData = async () => {
      const { data: userLikes } = await supabase
        .from('media_likes')
        .select('media_id')
        .eq('keyword_id', keywordId)
      for (const { media_id } of userLikes) {
        const image = media.get(media_id)
        if (image) media.set(media_id, { ...image, liked: true })
      }
      setMedia(media)
    }
    if (keywordId) setImagesWithUserData()
  }, [setMedia, keywordId])

  usePinch(
    ({ offset: [x], last }) => {
      setPinching(!last)
      const zoomLevel = MAX_ZOOM_LEVEL + MIN_ZOOM_LEVEL - x
      const rounded = Math.round(zoomLevel)
      if (last) setZoomLevel({ zoomLevel: rounded })
      else setZoomLevel({ zoomLevel: zoomLevel })
    },
    {
      target: galleryRef,
      rubberband: 0,
      from: ({ offset: [x] }) => [Math.round(x), 0],
      scaleBounds: {
        max: MAX_ZOOM_LEVEL,
        min: MIN_ZOOM_LEVEL
      }
    }
  )

  useEffect(() => {
    // new image uploaded notification
    supabase
      .channel('media')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'media'
        },
        (payload) => {
          if (payload.new.keyword_id !== keywordId) showToast()
        }
      )
      .subscribe()
  }, [keywordId, showToast])

  return (
    <>
      <Header text={galleryName} />
      <Actions text={galleryName} numberOfPhotos={0} numberOfVideos={0} />
      <div
        className="min-h-screen bg-black text-white break-inside-avoid touch-pan-y"
        ref={galleryRef}
      >
        <div className="flex flex-col">
          {imageRows.map(({ aspectRatio, media }, index) => (
            <Row
              pinching={pinching}
              aspectRatio={aspectRatio}
              media={media}
              key={index}
            />
          ))}
        </div>
      </div>
    </>
  )
}

export default Gallery
