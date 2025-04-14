'use client'

import { IconOptions } from '@/data/icons'
import { MouseEvent, useCallback, useState } from 'react'
import Link from 'next/link'
import useClickAway from '@/hooks/useClickAway'
import cn from '@/utils/cn'
import deleteGallery from '@/actions/deleteGallery'
import { GalleryMetadata } from '@/types/gallery'

type RowProps = {
  gallery: GalleryMetadata
  index: number
}

function Row({ gallery, index }: RowProps) {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)
  const closeOptions = useCallback(() => setIsOptionsOpen(false), [])
  const optionsRef = useClickAway<HTMLDivElement>(closeOptions)
  const openOptions = (e: MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    setIsOptionsOpen(true)
  }

  return (
    <div className="flex">
      <Link href={`gallery/${gallery.galleryId}`} className="flex flex-1">
        <div className="w-6 text-neutral-400">{index}.</div>
        <div className="flex-1 text-nowrap overflow-hidden text-ellipsis">
          {gallery.galleryName}
        </div>
        <div className="flex-1 text-center">
          {gallery.numberOfPhotos + gallery.numberOfVideos}
        </div>
        <div className="flex-1 text-end">{gallery.numberOfUsers}</div>
      </Link>
      <div className="relative ml-6">
        <IconOptions
          onClick={openOptions}
          className={cn(
            'size-6 icon-action justify-self-end',
            isOptionsOpen && 'outline-1'
          )}
        />
        {isOptionsOpen && (
          <div
            ref={optionsRef}
            className="flex flex-col items-end gap-8 p-6 bg-black border-[1px] absolute w-max right-full top-full"
          >
            <span
              onClick={() => deleteGallery(gallery.galleryId)}
              className="underline"
            >
              delete
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

export default Row
