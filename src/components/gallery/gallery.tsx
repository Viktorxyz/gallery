'use client'

import { usePinch } from '@use-gesture/react'
import { memo, useCallback, useEffect, useMemo, useRef, useState } from 'react'
import createClient from '@/utils/supabase/client'
import generateImageRows from '@/utils/generateMediaRows'
import { useMedia } from '@/providers/media-provider'
import Loading from '../index/loading'
import Row from './row'
import { VirtualizedListItem } from '../virtualized-list/types'
import VirtualizedList from '../virtualized-list/virtualized-list'
import useWindowSize from '@/hooks/useWindowSize'

const MAX_ZOOM_LEVEL = 5
const MIN_ZOOM_LEVEL = 1

const supabase = createClient()

const Gallery = () => {
  const { media, isLoading } = useMedia()

  const { height } = useWindowSize()
  const [zoomLevel, setZoomLevel] = useState(5)

  const scrollOffset = useMemo(() => -(76 + height * 0.25), [height])

  const ref = useRef(null)
  const [pinching, setPinching] = useState(false)

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
      if (last) setZoomLevel(rounded)
      else setZoomLevel(zoomLevel)
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
          console.log(payload.new)
          // if (payload.new.user_id !== keywordId)
          //   console.log('show refresh toast')
        }
      )
      .subscribe()
  }, [])

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

  if (media && media.length == 0) return <div>There is no media</div>

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
