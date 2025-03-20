import { IconCheck, IconHeartFill } from '@/data/icons'
import useLongPress from '@/hooks/useLongPress'
import Spinner from '../Spinner'
import { useActions } from '@/providers/ActionsProvider'
import { useCallback } from 'react'
import useUserStore from '@/stores/userStore'
import cn from '@/utils/cn'
import { useApp } from '@/providers/AppProvider'
import { useGallery } from '@/providers/GalleryProvider'

const MediaContainer = ({
  aspectRatio,
  pinching,
  liked,
  selected,
  uploading,
  mapKey,
  children
}) => {
  const toggleSelect = useGallery((state) => state.toggleSelect)
  const { zoomLevel } = useUserStore()
  const { actions, setActions } = useActions()
  const { showCarousel } = useApp()

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
      {children}
    </div>
  )
}

export default MediaContainer
