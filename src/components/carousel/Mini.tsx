import React, { useEffect, useRef, useState } from 'react'
import CarouselPadding from './Padding'
import Thumbnail from './Thumbnail'
import { MediaMap, MediaType } from '@/types/gallery'

type MiniCarouselProps = {
  current?: MediaType
  media: MediaMap
  onChange: (id: string) => void
}

const Mini = ({ current, media, onChange }: MiniCarouselProps) => {
  const [initial, setInitial] = useState(true)
  const rootRef = useRef<HTMLDivElement>(null)

  useEffect(() => setInitial(false), [])

  return (
    <div
      ref={rootRef}
      className="flex items-center w-full gap-1 h-14 mt-1 overflow-scroll snap-x snap-mandatory scrollbar-hidden"
    >
      <CarouselPadding />
      {media &&
        Array.from(media).map(
          ([key, { id, src, aspectRatio, type }], index) => (
            <Thumbnail
              initial={initial}
              src={src}
              mapKey={key}
              aspectRatio={aspectRatio}
              active={current?.id === id}
              onChange={onChange}
              rootRef={rootRef}
              key={index}
              type={type}
            />
          )
        )}
      <CarouselPadding />
    </div>
  )
}

export default Mini
