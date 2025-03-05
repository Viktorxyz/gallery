'use client'
import { usePinch } from '@use-gesture/react'
import { useEffect, useMemo, useRef, useState } from 'react'
import toggleLikeAction from '@/actions/toggleLike'
import { useActions } from '@/providers/ActionsProvider'
import useUserStore from '@/stores/userStore'
import useGalleryStore from '@/stores/galleryStore'
import { useToast } from '@/providers/ToastProvider'
import { GalleryMap } from '@/types/gallery'
import createClient from '@/utils/supabase/client'
import Row from './Row'
import generateImageRows from '@/utils/generateImageRows'

type GalleryProps = {
  initialImages: GalleryMap
}

const MAX_ZOOM_LEVEL = 7
const MIN_ZOOM_LEVEL = 1

const supabase = createClient()

const Gallery = ({ initialImages }: GalleryProps) => {
  const galleryRef = useRef(null)
  const [pinching, setPinching] = useState(false)

  const { showToast } = useToast()
  const { actions, setActions } = useActions()
  const { zoomLevel, setZoomLevel, keywordId } = useUserStore()
  const { images, toggleSelect, toggleLike, setImages } = useGalleryStore()

  const imageRows = useMemo(
    () =>
      generateImageRows(
        Array.from(images ? images : initialImages).map(([mapKey, value]) => ({
          mapKey,
          ...value
        })),
        zoomLevel
      ),
    [images, zoomLevel]
  )

  useEffect(() => {
    const setImagesWithUserData = async () => {
      const { data: userLikes } = await supabase
        .from('image_likes')
        .select('image_id')
        .eq('keyword_id', keywordId)
      for (const { image_id } of userLikes) {
        const image = initialImages.get(image_id)
        if (image) initialImages.set(image_id, { ...image, liked: true })
      }
      setImages(initialImages)
    }
    if (keywordId) setImagesWithUserData()
    else setImages(initialImages)
  }, [setImages, initialImages, keywordId])

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
      .channel('images')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'images'
        },
        (payload) => {
          if (payload.new.keyword_id !== keywordId) showToast()
        }
      )
      .subscribe()
  }, [keywordId, showToast])

  return (
    <div
      className="flex-1 bg-black text-white break-inside-avoid touch-pan-y"
      ref={galleryRef}
    >
      <div className="flex flex-col">
        {imageRows.map(({ aspectRatio, images }, index) => (
          <Row
            pinching={pinching}
            aspectRatio={aspectRatio}
            images={images}
            key={index}
          />
        ))}
      </div>
    </div>
  )
}

export default Gallery
