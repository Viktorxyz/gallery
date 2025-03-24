import { IconCheck, IconHeartFill } from '@/data/icons'
import useLongPress from '@/hooks/useLongPress'
import Spinner from '../Spinner'
import { useActions } from '@/providers/ActionsProvider'
import { useCallback } from 'react'
import useUserStore from '@/stores/userStore'
import cn from '@/utils/cn'
import { useApp } from '@/providers/AppProvider'
import { useGallery } from '@/providers/GalleryProvider'
import Image from 'next/image'
import { MediaMime, RowMediaType } from '@/types/gallery'
import VideoBadge from './VideoBadge'

type MediaProps = {
  media: RowMediaType
  pinching: boolean
}

const Media = ({ media, pinching }: MediaProps) => {
  const {
    aspectRatio,
    selected,
    uploading,
    liked,
    type,
    src,
    mapKey,
    duration
  } = media
  const { showCarousel } = useApp()
  const { zoomLevel } = useUserStore()
  const { actions, setActions } = useActions()

  const toggleSelect = useGallery((state) => state.toggleSelect)
  const gap = (-1 / 2) * zoomLevel + 9 / 2

  const select = useCallback(() => {
    setActions('selecting')
    toggleSelect(mapKey)
  }, [mapKey])

  const onClick = useCallback(() => {
    if (actions === 'selecting') toggleSelect(mapKey)
    else showCarousel({ scrollTo: mapKey })
  }, [mapKey])

  const ref = useLongPress<HTMLDivElement>(select)

  return (
    <div
      ref={ref}
      className={cn(
        'grid relative p-2',
        !pinching && 'transition-[aspect-ratio] duration-300'
      )}
      style={{
        aspectRatio
      }}
      onClick={onClick}
    >
      {selected ? (
        <div className="flex justify-end items-end absolute inset-0 bg-black/75">
          <IconCheck className="m-6 size-6 icon-action" />
        </div>
      ) : uploading ? (
        <Spinner className="self-center justify-self-center" />
      ) : (
        zoomLevel < 4 &&
        liked && (
          <IconHeartFill className="z-10 fill-rose-500 justify-self-end" />
        )
      )}
      {type === MediaMime.IMAGE ? (
        <Image
          className="object-cover z-0"
          style={{
            padding: `${gap}px`
          }}
          src={src}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          alt=""
        />
      ) : (
        <>
          <video
            className="object-cover"
            style={{ padding: `${gap}px` }}
            src={src}
            autoPlay
            muted
          />
          <VideoBadge margin={gap} />
        </>
      )}
    </div>
  )
}

export default Media
