'use client'

import useHeader from '@/stores/headerStore'
import cn from '@/utils/cn'
import React, { PropsWithChildren } from 'react'

function ActionsHeaderContainer({ children }: PropsWithChildren) {
  const isTitleVisible = useHeader((state) => state.isTitleVisible)

  return (
    <div
      className={cn(
        'flex flex-col transition-opacity',
        isTitleVisible && 'opacity-0'
      )}
    >
      {children}
    </div>
  )
}

export default ActionsHeaderContainer
