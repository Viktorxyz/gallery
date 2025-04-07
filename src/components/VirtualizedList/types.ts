import {
  ComponentType,
  CSSProperties,
  PropsWithChildren,
  RefObject
} from 'react'

export enum Direction {
  VERTICAL = 'VERTICAL',
  HORIZONTAL = 'HORIZONTAL'
}

export type VirtualizedListRootProps = PropsWithChildren<{
  direction: Direction
  ref?: RefObject<HTMLDivElement | null>
  className?: string
  style?: CSSProperties
}>

export type VirtualizedListContextType = {
  rootRef: RefObject<HTMLDivElement | null>
  direction: Direction
}

export type VirtualizedListRef = {
  scrollToItem: (index: number, options?: Partial<ScrollToItemOptions>) => void
  scroll: (value: number) => void
  scrollPercentage: (percentage: number) => void
} | null

export type VirtualizedListItem = {
  index: number
  virtualizedListRef?: RefObject<VirtualizedListRef>
}

export type VirtualizedListProps = {
  debugName?: string
  length: number
  Item: ComponentType<VirtualizedListItem>
  ref?: RefObject<HTMLDivElement | null>
  direction?: Direction
  rootRef?: RefObject<HTMLDivElement | null>
  listRef?: RefObject<VirtualizedListRef>
  initialIndex?: number
  align?: Align
  onIndexChange?: (index: number) => void
  onScrollChange?: (scroll: number) => void
  onScrollPercentageChange?: (percentage: number) => void
  itemSize?: number
  getItemSize?: (index: number) => number
  overscan?: number
  gap?: number
  className?: string
  style?: CSSProperties
  scrollOffset?: number
}

export type Align = 'center' | 'end' | 'start'

export type Behaviour = 'smooth' | 'instant'

export type ScrollToItemOptions = {
  behaviour: Behaviour
  align?: Align
  cancelOnChange: boolean
}
