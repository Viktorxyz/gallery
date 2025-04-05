'use client'

import { usePinch } from '@use-gesture/react'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import useUserStore from '@/stores/userStore'
import { useToast } from '@/providers/ToastProvider'
import createClient from '@/utils/supabase/client'
import generateImageRows from '@/utils/generateMediaRows'
import { useMedia } from '@/providers/MediaProvider'
import Loading from '../index/Loading'
import Row from './Row'
import VirtualizedList, {
  Direction,
  VirtualizedListItem
} from '../VirtualizedList'

const MAX_ZOOM_LEVEL = 7
const MIN_ZOOM_LEVEL = 1

const supabase = createClient()

const Gallery = () => {
  const { media, isLoading } = useMedia()

  const galleryRef = useRef(null)
  const [pinching, setPinching] = useState(false)

  const { showToast } = useToast()
  const { zoomLevel, setZoomLevel, keywordId } = useUserStore()

  const rowMedia = useMemo(
    () => (media ? media.map((m, index) => ({ index, ...m })) : []),
    [media]
  )
  const imageRows = useMemo(
    () => generateImageRows(rowMedia, zoomLevel),
    [rowMedia, zoomLevel]
  )

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
      .channel('media_metadata')
      .on(
        'postgres_changes',
        {
          event: 'INSERT',
          schema: 'public',
          table: 'media_metadata'
        },
        (payload) => {
          if (payload.new.keyword_id !== keywordId) showToast()
        }
      )
      .subscribe()
  }, [keywordId, showToast])

  const Item = memo<VirtualizedListItem>(function Item({ index }) {
    const { media, aspectRatio } = imageRows[index]

    return <Row media={media} aspectRatio={aspectRatio} pinching={pinching} />
  })

  const getItemSize = useCallback(
    (index: number) => {
      return 360 / imageRows[index].aspectRatio
    },
    [imageRows]
  )

  return (
    <div
      className="flex min-h-screen bg-black text-white break-inside-avoid touch-pan-y"
      ref={galleryRef}
    >
      {isLoading ? (
        <Loading />
      ) : (
        // <div className="flex-1 flex flex-col">
        //   {imageRows.map(({ media, aspectRatio }, index) => (
        //     <Row
        //       media={media}
        //       aspectRatio={aspectRatio}
        //       pinching={pinching}
        //       key={index}
        //     />
        //   ))}
        // </div>
        <VirtualizedList
          Item={Item}
          overscan={2}
          length={imageRows.length}
          getItemSize={getItemSize}
          direction={Direction.VERTICAL}
        />
      )}
    </div>
  )
}

export default Gallery
