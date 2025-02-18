import { IconSearch } from '@/data/icons'
import React, { RefObject, useCallback } from 'react'
import cn from '@/utils/cn'
import NewGallery from './NewGallery'

type ActionsProps = {
  searchRef: RefObject<HTMLInputElement>
  className?: string
}

const Actions = ({ searchRef, className }: ActionsProps) => {
  const focusSearch = useCallback(() => searchRef.current.focus(), [searchRef])

  return (
    <div
      className={cn(
        'flex h-20 gap-12 items-center justify-end bg-black',
        className
      )}
    >
      <IconSearch onClick={focusSearch} className="size-6 icon-action" />
      <NewGallery />
    </div>
  )
}

export default Actions
