'use client'

import { MediaMime, MediaType } from '@/types/gallery'
import Image from 'next/image'
import Player from './player'
import cn from '@/utils/cn'

type MediaProps = {
  media: MediaType
  current?: boolean
  className?: string
}

const Media = ({ media, current = false, className }: MediaProps) => {
  return (
    <div
      className={cn(
        'relative min-w-screen h-screen break-inside-avoid',
        className
      )}
    >
      {media.type === MediaMime.IMAGE ? (
        <Image src={media.src} fill alt="" className="object-contain" />
      ) : (
        <Player src={media.src} defaultPlay={current} />
      )}
    </div>
  )
}

export default Media
