'use client'

import Actions from '@/components/carousel/Actions'
import Header from '@/components/carousel/Header'
import Media from '@/components/carousel/Media'
import MiniCarousel from '@/components/carousel/MiniCarousel'
import Loading from '@/components/index/Loading'
import VirtualizedList, {
  VirtualizedListItem,
  VirtualizedListRef
} from '@/components/VirtualizedList'
import { useCarousel } from '@/providers/CarouselProvider'
import { useMedia } from '@/providers/MediaProvider'
import cn from '@/utils/cn'
import { usePathname, useRouter, useSearchParams } from 'next/navigation'
import { memo, useCallback, useMemo, useRef } from 'react'

const Item = memo<VirtualizedListItem>(function Item({ index }) {
  const { media } = useMedia()

  if (!media) return <>no media</>

  const m = media[index]

  return <Media media={m} className="snap-center snap-always" />
})

function Page() {
  const { actions } = useCarousel()
  const { media, isLoading } = useMedia()
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const miniCarouselRef = useRef<VirtualizedListRef>(null)
  const carouselRef = useRef<VirtualizedListRef>(null)

  const id = searchParams.get('i') as string
  const initialId = useRef(id)
  const initialIndex = useMemo(
    () => media?.findIndex((m) => m.mediaId === initialId.current),
    [media]
  )

  const onIndexChange = useCallback(
    (index: number) => {
      if (!media) return

      const { mediaId } = media[index]
      const searchParams = new URLSearchParams({ i: mediaId })
      router.replace(pathname + '?' + searchParams.toString(), {
        scroll: false
      })
    },
    [media, pathname, router]
  )

  const onCarouselChange = useCallback(
    (index: number) => {
      console.log('carousel change', index)
      onIndexChange(index)
      miniCarouselRef.current?.scrollToItem(index, {
        behaviour: 'smooth',
        align: 'center',
        cancelOnChange: true
      })
    },
    [onIndexChange]
  )
  const onMiniCarouselChange = useCallback(
    (index: number) => {
      console.log('mini: ', index)
      onIndexChange(index)
      carouselRef.current?.scrollToItem(index, {
        behaviour: 'instant',
        align: 'start',
        cancelOnChange: true
      })
    },
    [onIndexChange]
  )

  if (isLoading) return <Loading />

  if (!media) return <div>there is media</div>

  const currIndex = media.findIndex((m) => m.mediaId === id)
  const currMedia = media[currIndex]

  return (
    <>
      <Header text={currMedia.keyword} />
      <VirtualizedList
        debugName="BIG"
        ref={carouselRef}
        initialIndex={initialIndex}
        onIndexChange={onCarouselChange}
        length={media.length}
        gap={16}
        Item={Item}
        className="snap-x snap-mandatory scrollbar-hidden"
      />
      <div
        className={cn(
          'flex flex-col z-50 fixed w-full bottom-0 transition-opacity duration-100 ease-linear',
          actions && 'pointer-events-none opacity-0'
        )}
      >
        <div className="flex flex-col bg-black/75">
          <MiniCarousel
            ref={miniCarouselRef}
            media={media}
            initialIndex={initialIndex}
            onIndexChange={onMiniCarouselChange}
          />
          <Actions current={currMedia} />
        </div>
      </div>
    </>
  )
}

export default Page
