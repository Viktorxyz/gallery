'use client'

import { IconCheck, IconHeartFill } from '@/data/icons'
import useLongPress from '@/hooks/useLongPress'
import Spinner from '../spinner'
import { useCallback, useEffect, useState } from 'react'
import cn from '@/utils/cn'
import Image from 'next/image'
import { MediaMime, RowMediaType } from '@/types/gallery'
import VideoBadge from './video-badge'
import { usePathname, useRouter } from 'next/navigation'
import useGallery from '@/stores/galleryStore'

type MediaProps = {
  media: RowMediaType
  pinching: boolean
}

const Media = ({ media, pinching }: MediaProps) => {
  const { index, aspectRatio, uploading, liked, type, src } = media
  const router = useRouter()
  const pathname = usePathname()
  const isSelecting = useGallery((state) => state.isSelecting)
  const setIsSelecting = useGallery((state) => state.setIsSelecting)
  const selectedMedia = useGallery((state) => state.selectedMedia)
  const selectMedia = useGallery((state) => state.selectMedia)
  const deselectMedia = useGallery((state) => state.deselectMedia)

  const [selected, setSelected] = useState(selectedMedia.has(index))

  const gap = (-1 / 2) * 1 + 9 / 2 // TODO replace 1

  const select = useCallback(() => {
    if (pinching) return
    setSelected(true)
    setIsSelecting(true)
    selectMedia(index)
  }, [index, pinching, selectMedia, setIsSelecting])

  const onClick = useCallback(() => {
    if (isSelecting) {
      if (selected) {
        setSelected(false)
        deselectMedia(index)
      } else {
        setSelected(true)
        selectMedia(index)
      }
    } else {
      const searchParams = new URLSearchParams({ i: media.mediaId })
      router.push(pathname + '/carousel?' + searchParams.toString(), {
        scroll: false,
      })
    }
  }, [
    deselectMedia,
    index,
    isSelecting,
    media.mediaId,
    pathname,
    router,
    selectMedia,
    selected,
  ])

  useEffect(() => {
    if (!isSelecting) setSelected(false)
  }, [isSelecting])

  const ref = useLongPress<HTMLDivElement>(select)

  return (
    <div
      ref={ref}
      className={cn(
        'grid relative p-2 transition-[aspect-ratio] duration-300',
        pinching && 'transition-none'
        // 'border-[1px] border-green-400'
      )}
      style={{
        aspectRatio,
      }}
      onClick={onClick}
    >
      {/* <div className="absolute top-0 left-0 w-full h-full bg-blue-950"></div> */}
      {selected ? (
        <div className='z-50 flex justify-end items-end absolute inset-0 bg-black/75'>
          <IconCheck className='m-6 size-6 icon-action' />
        </div>
      ) : uploading ? (
        <Spinner className='self-center justify-self-center' />
      ) : (
        3 < 4 && // TODO
        liked && (
          <IconHeartFill className='z-10 fill-rose-500 justify-self-end' />
        )
      )}
      {type === MediaMime.IMAGE ? (
        <Image
          className='object-cover z-0 pointer-events-none'
          style={{
            padding: `${gap}px`,
          }}
          src={src}
          fill
          sizes='(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw'
          alt=''
        />
      ) : (
        <>
          <video
            className='object-cover pointer-events-none'
            style={{ padding: `${gap}px` }}
            src={src}
            muted
          />
          <VideoBadge margin={gap} />
        </>
      )}
    </div>
  )
}

export default Media
