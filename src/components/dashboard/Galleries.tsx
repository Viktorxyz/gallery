'use client'
import { IconOptions } from '@/data/icons'
import React, { MouseEvent, useCallback, useRef, useState } from 'react'
import Actions from './Actions'
import Input from '../Input'
import Link from 'next/link'
import useClickAway from '@/hooks/useClickAway'
import cn from '@/utils/cn'
import deleteGallery from '@/actions/deleteGallery'

type GalleryRowProps = {
  index: number
  id: string
  name: string
  items: number
  users: number
}

const GalleryRow = ({ index, id, name, items, users }: GalleryRowProps) => {
  const [isOptionsOpen, setIsOptionsOpen] = useState(false)
  const closeOptions = useCallback(() => setIsOptionsOpen(false), [])
  const optionsRef = useClickAway<HTMLDivElement>(closeOptions)
  const openOptions = (e: MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.stopPropagation()
    setIsOptionsOpen(true)
  }

  return (
    <div className="flex">
      <Link href={id} className="flex flex-1">
        <div className="w-6 text-neutral-400">{index}.</div>
        <div className="flex-1 text-nowrap overflow-hidden text-ellipsis">
          {name}
        </div>
        <div className="flex-1 text-center">{items}</div>
        <div className="flex-1 text-end">{users}</div>
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
            <span onClick={() => deleteGallery(id)} className="underline">
              delete
            </span>
          </div>
        )}
      </div>
    </div>
  )
}

const Galleries = ({ galleries }) => {
  const searchRef = useRef<HTMLInputElement>(null)
  return (
    <>
      <div className="sticky pt-8 top-0 bg-black">
        <Input
          ref={searchRef}
          variant="line"
          placeholder="search by name/id/number..."
        />
        <div className="flex text-neutral-400 pt-16 pb-12 sticky bg-black">
          <div className="w-6">#</div>
          <div className="flex-1">name</div>
          <div className="flex-1 text-center">items</div>
          <div className="flex-1 text-end">users</div>
          <div className="w-12"></div>
        </div>
      </div>
      <div className="flex flex-col flex-1 gap-8 pb-6">
        {galleries.map((gallery, index) => (
          <GalleryRow index={index + 1} {...gallery} key={index} />
        ))}
      </div>
      <Actions searchRef={searchRef} className="sticky bottom-0" />
    </>
  )
}

export default Galleries
