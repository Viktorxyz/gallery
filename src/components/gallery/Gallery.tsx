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
import { VirtualizedListItem } from '../VirtualizedList/types'
import VirtualizedList from '../VirtualizedList/VirtualizedList'
import useWindowSize from '@/hooks/useWindowSize'

const MAX_ZOOM_LEVEL = 7
const MIN_ZOOM_LEVEL = 1

const supabase = createClient()

const Gallery = () => {
  const { media, isLoading } = useMedia()
  const { height } = useWindowSize()

  const scrollOffset = useMemo(() => -(76 + height * 0.25), [height])

  const ref = useRef(null)
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
      target: ref,
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

  if (isLoading) return <Loading />

  return (
    <VirtualizedList
      ref={ref}
      className="bg-black text-white break-inside-avoid touch-pan-y"
      Item={Item}
      overscan={4}
      length={imageRows.length}
      getItemSize={getItemSize}
      scrollOffset={scrollOffset}
    />
  )
}

export default Gallery
