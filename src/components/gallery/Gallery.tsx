'use client'
import useBoundStore from '@/stores'
import { usePinch } from '@use-gesture/react'
import { useCallback, useEffect, useRef, useState } from 'react'
import GalleryImage from './GalleryImage'
import toggleLikeAction from '@/actions/toggleLike'
import { createClient } from '@/utils/supabase/client'
import { useActions } from '@/providers/ActionsProvider'
import { convertArrayToObject } from '@/utils/object'
import { GalleryImageMap } from '@/types/gallery'

type GalleryProps = {
  initialImages: GalleryImageMap
}

const COLS = 2
const MIN_COLS = 1
const MAX_COLS = 4

const supabase = createClient()

const Gallery = ({ initialImages }: GalleryProps) => {
  const galleryRef = useRef(null)
  const [cols, setCols] = useState<number>(COLS)
  const { images, toggleLike, toggleSelect, setImages, keywordId } =
    useBoundStore((state) => state)
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
  }, [initialImages, keywordId])

  usePinch(({ offset: [s] }) => setCols(Math.ceil(MAX_COLS + MIN_COLS - s)), {
    target: galleryRef,
    scaleBounds: { min: MIN_COLS, max: MAX_COLS }
  })

  const handleSelect = (id: string) => {
    if (actions === 'default') return
    toggleSelect(id)
  }

  const startSelecting = (id: string) => {
    setActions('selecting')
    toggleSelect(id)
  }

  const handleLike = (id: string) => {
    toggleLikeAction(id, keywordId)
    toggleLike(id)
  }

  return (
    <div
      ref={galleryRef}
      className="gap-0 break-inside-avoid touch-pan-y"
      style={{
        columns: cols
      }}
    >
      {initialImages.size > 0 ? (
        images ? (
          Array.from(images.entries()).map(([id, image]) => (
            <GalleryImage
              {...image}
              onClick={() => handleSelect(id)}
              onLike={() => handleLike(id)}
              onLongPress={() => startSelecting(id)}
              key={id}
            />
          ))
        ) : (
          Array.from(initialImages.entries()).map(([id, image]) => (
            <GalleryImage
              {...image}
              onClick={() => handleSelect(id)}
              onLike={() => handleLike(id)}
              onLongPress={() => startSelecting(id)}
              key={id}
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
