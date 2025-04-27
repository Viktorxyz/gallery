'use client'

import { IconOptions } from '@/data/icons'
import { MouseEvent, useCallback, useState } from 'react'
import Link from 'next/link'
import useClickAway from '@/hooks/useClickAway'
import cn from '@/utils/cn'
import deleteGallery from '@/actions/deleteGallery'
import { GalleryId } from '@/types/gallery'

type RowProps = {
  index: number
  galleryId: GalleryId
  galleryName: string
  numberOfPhotos: number
  numberOfVideos: number
}

function Row({
  index,
  galleryId,
  galleryName,
  numberOfPhotos,
  numberOfVideos
}: RowProps) {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)
  const closeOptions = useCallback(() => setIsOptionsOpen(false), [])
  const optionsRef = useClickAway<HTMLDivElement>(closeOptions)
  const openOptions = (e: MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    setIsOptionsOpen(true)
  }

  return (
    <div className="flex">
      <Link href={`gallery/${galleryId}`} className="flex flex-1">
        <div className="w-6 text-neutral-400">{index}.</div>
        <div className="flex-1 text-nowrap overflow-hidden text-ellipsis">
          {galleryName}
        </div>
        <div className="flex-1 text-center">
          {numberOfPhotos + numberOfVideos}
        </div>
        <div className="flex-1 text-end">/</div>
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
              onClick={() => deleteGallery(galleryId)}
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
