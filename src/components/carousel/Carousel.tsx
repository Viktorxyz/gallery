'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import Media from './Media'
import Header from './Header'
import Mini from './Mini'
import Actions from './Actions'
import cn from '@/utils/cn'
import { useApp } from '@/providers/AppProvider'
import { useGallery } from '@/providers/GalleryProvider'
import VideoControls from './VideoControls'
import { MediaMime } from '@/types/gallery'

const Carousel = () => {
  const { carouselInitial } = useApp()
  const media = useGallery((state) => state.media)
  const [muted, setMuted] = useState(true)

  const rootRef = useRef(null)
  const [currentKey, setCurrentKey] = useState(carouselInitial)
  const current = useMemo(() => media.get(currentKey), [media, currentKey])
  const [actionsHidden, setActionsHidden] = useState(false)

  const toggleMuted = useCallback(() => setMuted((prev) => !prev), [])
  const toggleActions = () => setActionsHidden((prev) => !prev)
  const onChange = useCallback(
    (key: string) => setCurrentKey(key),
    [setCurrentKey]
  )

  return (
    <>
      <Header
        text={`#${current.keyword}`}
        className={cn(
          'transition-opacity duration-100 ease-linear',
          actionsHidden && 'pointer-events-none opacity-0'
        )}
      />
      <div
        ref={rootRef}
        className="flex-1 flex gap-4 overflow-scroll snap-x snap-mandatory scrollbar-hidden"
        onClick={toggleActions}
      >
        {media &&
          Array.from(media).map(([key, { id, src, type, duration }], index) => (
            <Media
              active={current.id === id}
              rootRef={rootRef}
              muted={muted}
              toggleMuted={toggleMuted}
              onChange={onChange}
              mapKey={key}
              src={src}
              type={type}
              key={index}
              actionsHidden={actionsHidden}
            />
          ))}
      </div>
      <div
        className={cn(
          'flex flex-col z-50 fixed w-full bottom-0 transition-opacity duration-100 ease-linear',
          actionsHidden && 'pointer-events-none opacity-0'
        )}
      >
        <div className="flex flex-col bg-black/75">
          <Mini current={current} media={media} onChange={onChange} />
          <Actions current={current} />
        </div>
      </div>
    </>
  )
}

export default Carousel
