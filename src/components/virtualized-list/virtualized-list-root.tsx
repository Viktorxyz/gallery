'use client'

import cn from '@/utils/cn'
import React, { createContext, useContext, useRef } from 'react'
import {
  Direction,
  VirtualizedListContextType,
  VirtualizedListRootProps
} from './types'

const VirtualizedListContext = createContext<VirtualizedListContextType | null>(
  null
)

export const VirtualizedListRoot = ({
  direction,
  style,
  className,
  children,
  ref
}: VirtualizedListRootProps) => {
  const defaultRef = useRef<HTMLDivElement>(null)
  const rootRef = ref || defaultRef

  const value: VirtualizedListContextType = {
    rootRef,
    direction
  }

  return (
    <VirtualizedListContext value={value}>
      <div
        ref={rootRef}
        className={
          direction === Direction.HORIZONTAL
            ? cn('overflow-x-scroll w-screen', className)
            : cn('overflow-y-scroll h-screen', className)
        }
        style={style}
      >
        {children}
      </div>
    </VirtualizedListContext>
  )
}

export const useVirtualizedList = () =>
  useContext(VirtualizedListContext) as VirtualizedListContextType
