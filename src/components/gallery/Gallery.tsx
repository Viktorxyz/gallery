'use client'
import { usePinch } from '@use-gesture/react'
import { useEffect, useRef, useState } from 'react'
import GalleryImage from './GalleryImage'
import toggleLikeAction from '@/actions/toggleLike'
import { createClient } from '@/utils/supabase/client'
import { useActions } from '@/providers/ActionsProvider'
import { GalleryImageMap } from '@/types/gallery'
import useUserStore from '@/stores/userStore'
import useGalleryStore from '@/stores/galleryStore'

type GalleryProps = {
  initialImages: GalleryImageMap
}

const COLS = 1
const MIN_COLS = 1
const MAX_COLS = 4

const supabase = createClient()

const Gallery = ({ initialImages }: GalleryProps) => {
  const galleryRef = useRef(null)
  const [cols, setCols] = useState<number>(COLS)
  const { keywordId } = useUserStore()
  const { images, toggleSelect, toggleLike, setImages } = useGalleryStore()
  const { actions, setActions } = useActions()

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

  usePinch(({ offset: [s] }) => setCols(Math.ceil(MAX_COLS + MIN_COLS - s)), {
    target: galleryRef,
    scaleBounds: { min: MIN_COLS, max: MAX_COLS }
  })

  const handleSelect = (key: string) => {
    if (actions === 'default') return
    toggleSelect(key)
  }

  const startSelecting = (key: string) => {
    setActions('selecting')
    toggleSelect(key)
  }

  const handleLike = (key: string) => {
    toggleLikeAction(images.get(key).id, keywordId)
    toggleLike(key)
  }

  return (
    <div
      ref={galleryRef}
      className="gap-0 break-inside-avoid touch-pan-y"
      style={{
        columns: cols
      }}
    >
      {initialImages?.size > 0 || images?.size > 0 ? (
        images ? (
          Array.from(images.entries()).map(([key, image]) => (
            <GalleryImage
              {...image}
              onClick={() => handleSelect(key)}
              onLike={() => handleLike(key)}
              onLongPress={() => startSelecting(key)}
              key={key}
            />
          ))
        ) : (
          Array.from(initialImages.entries()).map(([key, image]) => (
            <GalleryImage
              {...image}
              onClick={() => handleSelect(key)}
              onLike={() => handleLike(key)}
              onLongPress={() => startSelecting(key)}
              key={key}
            />
          ))
        )
      ) : (
        <div className="flex self-center justify-self-center items-end">
          <span className="text-neutral-800 text-5xl font-thin">Galerija</span>
          <span className="text-neutral-400 font-thin text-2xl">je prazna</span>
        </div>
      )}
    </div>
  )
}

export default Gallery
