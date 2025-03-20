'use client'

import { useCallback, useMemo, useRef, useState } from 'react'
import Media from './Media'
import Header from './Header'
import Mini from './Mini'
import Actions from './Actions'
import cn from '@/utils/cn'
import { useApp } from '@/providers/AppProvider'
import { useGallery } from '@/providers/GalleryProvider'

const Carousel = () => {
  const { carouselInitial } = useApp()
  const media = useGallery((state) => state.media)

  const rootRef = useRef(null)
  const [currentKey, setCurrentKey] = useState(carouselInitial)
  const current = useMemo(() => media.get(currentKey), [media, currentKey])
  const [actionsHidden, setActionsHidden] = useState(false)

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
              onChange={onChange}
              mapKey={key}
              src={src}
              type={type}
              duration={duration}
              key={index}
            />
          ))}
      </div>
      <div
        className={cn(
          'flex flex-col z-50 fixed w-full bottom-0 bg-black/75 transition-opacity duration-100 ease-linear',
          actionsHidden && 'pointer-events-none opacity-0'
        )}
      >
        <Mini current={current} media={media} onChange={onChange} />
        <Actions current={current} />
      </div>
    </>
  )
}

export default Carousel
