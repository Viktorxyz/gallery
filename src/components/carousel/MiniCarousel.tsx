import { MediaType } from '@/types/gallery'
import VirtualizedList, {
  VirtualizedListItem,
  VirtualizedListRef
} from '../VirtualizedList'
import { useMedia } from '@/providers/MediaProvider'
import Thumbnail from './Thumbnail'
import { memo, RefObject, useCallback } from 'react'

const carouselHeight = 48

type MiniCarouselProps = {
  media: MediaType[]
  initialIndex?: number
  onIndexChange: (index: number) => void
  ref: RefObject<VirtualizedListRef>
}

const Item = memo<VirtualizedListItem>(function Item({
  index,
  virtualizedListRef
}) {
  const { media } = useMedia()

  if (!media) return <>no media</>

  const m = media[index]

  const onClick = () => {
    if (!virtualizedListRef?.current) return
    console.log('onClick', index)
    virtualizedListRef.current.scrollToItem(index, {
      align: 'center',
      behaviour: 'smooth',
      cancelOnChange: false
    })
  }

  return (
    <Thumbnail
      media={m}
      className="snap-center snap-normal"
      onClick={onClick}
    />
  )
})

function MiniCarousel({
  media,
  initialIndex,
  onIndexChange,
  ref
}: MiniCarouselProps) {
  const getItemSize = useCallback(
    (index: number) => {
      const { aspectRatio } = media[index]
      return carouselHeight * aspectRatio
    },
    [media]
  )

  return (
    <VirtualizedList
      ref={ref}
      Item={Item}
      length={media.length}
      getItemSize={getItemSize}
      initialIndex={initialIndex}
      onIndexChange={onIndexChange}
      overscan={10}
      gap={4}
      scrollOffset={getItemSize(0) / 2}
      className="mt-1 scrollbar-hidden snap-x snap-mandatory"
      style={{
        height: carouselHeight,
        paddingLeft: `calc(50% - ${getItemSize(0) / 2}px)`,
        paddingRight: `calc(50% - ${getItemSize(media.length - 1) / 2}px)`
      }}
    />
  )
}

export default MiniCarousel
