import { IconCheck, IconHeartFill, IconHeartOutlined } from '@/data/icons'
import useLongPress from '@/hooks/useLongPress'
import { RowProps } from '@/types/gallery'
import cn from '@/utils/cn'
import Image from 'next/image'
import Spinner from '../Spinner'
import useUserStore from '@/stores/userStore'
import { useActions } from '@/providers/ActionsProvider'
import useGalleryStore from '@/stores/galleryStore'
import { useCallback } from 'react'
import toggleLikeAction from '@/actions/toggleLike'

const ImageContainer = ({
  id,
  aspectRatio,
  pinching,
  liked,
  selected,
  uploading,
  mapKey,
  children
}) => {
  const { zoomLevel, keywordId } = useUserStore()
  const { toggleLike, toggleSelect } = useGalleryStore()
  const { setActions } = useActions()

  const like = useCallback(() => {
    toggleLikeAction(id, keywordId)
    toggleLike(mapKey)
  }, [id, mapKey, keywordId])

  const select = useCallback(() => {
    setActions('selecting')
    toggleSelect(mapKey)
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
      {children}
    </div>
  )
}

const Row = ({ pinching, aspectRatio, images }: RowProps) => {
  const { zoomLevel } = useUserStore()
  const gap = (-1 / 2) * zoomLevel + 9 / 2

  return (
    <div
      className={cn(
        'flex overflow-hidden transition-all duration-300',
        pinching && 'transition-none'
      )}
      style={{
        aspectRatio
      }}
    >
      {images.map(({ src, ...rest }, index) => (
        <ImageContainer pinching={pinching} {...rest} key={index}>
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
        </ImageContainer>
      ))}
    </div>
  )
}

export default Row
