'use client'

import useScrollAware from '@/hooks/useScrollAware'
import useWindowSize from '@/hooks/useWindowSize'
import cn from '@/utils/cn'
import {
  ComponentType,
  CSSProperties,
  RefObject,
  useCallback,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'

export enum Direction {
  VERTICAL = 'VERTICAL',
  HORIZONTAL = 'HORIZONTAL'
}

type Align = 'center' | 'end' | 'start'

type Behaviour = 'smooth' | 'instant'

type ScrollToItemOptions = {
  behaviour: Behaviour
  align: Align
  cancelOnChange: boolean
}

const defaultScrollToItemOptions: ScrollToItemOptions = {
  align: 'center',
  behaviour: 'instant',
  cancelOnChange: false
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

type VirtualizedListProps = {
  debugName?: string
  length: number
  Item: ComponentType<VirtualizedListItem>
  ref?: RefObject<VirtualizedListRef>
  initialIndex?: number
  onIndexChange?: (index: number) => void
  onScrollChange?: (scroll: number) => void
  onScrollPercentageChange?: (percentage: number) => void
  itemSize?: number
  getItemSize?: (index: number) => number
  direction?: Direction
  overscan?: number
  gap?: number
  className?: string
  style?: CSSProperties
  scrollOffset?: number
}

function findFirstVisibleItem(
  scroll: number,
  positions: number[],
  length: number,
  scrollOffset: number
) {
  let k = 0
  for (let b = Math.trunc(length / 2); b >= 1; b = Math.trunc(b / 2)) {
    while (k + b < length && positions[k + b] <= scroll + scrollOffset) k += b
  }
  return k
}

function findLastVisibleItem(
  positions: number[],
  firstVisibleItem: number,
  length: number,
  containerSize: number
) {
  let lastVisibleItem
  for (
    lastVisibleItem = firstVisibleItem;
    lastVisibleItem < length;
    lastVisibleItem++
  ) {
    if (
      positions[lastVisibleItem] >
      positions[firstVisibleItem] + containerSize
    ) {
      return lastVisibleItem
    }
  }
  return lastVisibleItem
}

function getScrollPercentage(
  scroll: number,
  scrollSize: number,
  clientSize: number
) {
  return scroll / (scrollSize - clientSize)
}

function getAlignmentOffset(itemSize: number, align: Align) {
  if (align === 'center') return itemSize / 2
  else if (align === 'end') return itemSize
  else return 0
}

function VirtualizedList({
  length,
  Item,
  ref,
  initialIndex = 0,
  onScrollChange,
  onScrollPercentageChange,
  onIndexChange,
  itemSize,
  getItemSize,
  direction = Direction.HORIZONTAL,
  overscan = 2,
  gap = 0,
  className,
  scrollOffset = 0,
  style
}: VirtualizedListProps) {
  const initialIndexRef = useRef(initialIndex)

  const { width, height } = useWindowSize()
  itemSize = itemSize ?? (direction === Direction.HORIZONTAL ? width : height)

  const [index, setIndex] = useState(() => initialIndexRef.current)
  const [scrollToItemTriggered, setScrollToItemTriggered] = useState(false)

  const positions = useMemo(() => {
    if (!getItemSize) return undefined

    const positions = [0]
    for (let i = 1; i < length; i++) {
      positions.push(positions[i - 1] + getItemSize(i - 1) + gap)
    }
    return positions
  }, [gap, getItemSize, length])

  const initialScroll = useRef(
    positions
      ? positions[initialIndexRef.current]
      : (itemSize + gap) * initialIndexRef.current
  )

  const { scroll, ref: rootRef } = useScrollAware<HTMLDivElement>({
    initialScroll: initialScroll.current,
    direction
  })

  const listSize = useMemo(
    () =>
      positions && getItemSize
        ? positions[length - 1] + getItemSize(length - 1)
        : (itemSize + gap) * length - gap,
    [gap, getItemSize, itemSize, length, positions]
  )

  const firstVisibleItem = useMemo(
    () =>
      positions
        ? findFirstVisibleItem(scroll, positions, length, scrollOffset)
        : Math.round(scroll / (itemSize + gap)),
    [positions, scroll, length, scrollOffset, itemSize, gap]
  )

  const firstItem = Math.max(0, firstVisibleItem - overscan)
  const lastVisibleItem = useMemo(
    () =>
      positions
        ? findLastVisibleItem(
            positions,
            firstVisibleItem,
            length,
            direction === Direction.HORIZONTAL ? width : height
          )
        : firstVisibleItem +
          (direction === Direction.HORIZONTAL
            ? Math.floor(width / itemSize)
            : Math.floor(height / itemSize)),
    [direction, firstVisibleItem, height, itemSize, length, positions, width]
  )
  const lastItem = Math.min(length - 1, lastVisibleItem + overscan)

  const visibleItemsCount = lastItem - firstItem + 1
  const translate = positions
    ? positions[firstItem]
    : (itemSize + gap) * firstItem

  useImperativeHandle(
    ref,
    () => ({
      scroll: (value) => {
        if (!rootRef.current) return

        if (direction === Direction.HORIZONTAL)
          rootRef.current.scrollLeft = value
        else rootRef.current.scrollTop = value
      },
      scrollPercentage: (percentage) => {
        if (!rootRef.current) return

        const scroll =
          direction === Direction.HORIZONTAL
            ? (rootRef.current.scrollWidth - rootRef.current.clientWidth) *
              percentage
            : (rootRef.current.scrollHeight - rootRef.current.clientHeight) *
              percentage
        if (direction === Direction.HORIZONTAL)
          rootRef.current.scrollLeft = scroll
        else rootRef.current.scrollTop = scroll
      },
      scrollToItem: (index, options) => {
        if (!rootRef.current) return

        const { align, behaviour, cancelOnChange } = {
          ...defaultScrollToItemOptions,
          ...options
        }

        if (!cancelOnChange && onIndexChange) onIndexChange(index)
        setScrollToItemTriggered(true)
        setIndex(index)

        const alignmentOffset = getAlignmentOffset(
          getItemSize ? getItemSize(index) : itemSize,
          align
        )

        const scroll = positions
          ? positions[index] + alignmentOffset - scrollOffset
          : index * (itemSize + gap) + alignmentOffset - scrollOffset

        rootRef.current.style.scrollBehavior = behaviour

        if (direction === Direction.HORIZONTAL)
          rootRef.current.scrollLeft = scroll
        else rootRef.current.scrollTop = scroll
      }
    }),
    [
      direction,
      gap,
      getItemSize,
      itemSize,
      onIndexChange,
      positions,
      rootRef,
      scrollOffset
    ]
  )

  const visibleItems = useMemo(
    () =>
      new Array(visibleItemsCount)
        .fill(null)
        .map((_, index) => (
          <Item
            key={index + firstItem}
            index={index + firstItem}
            virtualizedListRef={ref}
          />
        )),
    [Item, firstItem, ref, visibleItemsCount]
  )

  const onScroll = useCallback(
    (e: React.UIEvent<HTMLDivElement, UIEvent>) => {
      const scroll =
        direction === Direction.HORIZONTAL
          ? e.currentTarget.scrollLeft
          : e.currentTarget.scrollTop

      if (onScrollChange) onScrollChange(scroll)
      if (onScrollPercentageChange)
        onScrollPercentageChange(
          getScrollPercentage(
            scroll,
            direction === Direction.HORIZONTAL
              ? e.currentTarget.scrollWidth
              : e.currentTarget.scrollHeight,
            direction === Direction.HORIZONTAL
              ? e.currentTarget.clientWidth
              : e.currentTarget.clientHeight
          )
        )
      if (scrollToItemTriggered) {
        if (firstVisibleItem === index) setScrollToItemTriggered(false)
      } else if (firstVisibleItem !== index) {
        if (onIndexChange) onIndexChange(firstVisibleItem)
        setIndex(firstVisibleItem)
      }
    },
    [
      direction,
      firstVisibleItem,
      index,
      onIndexChange,
      onScrollChange,
      onScrollPercentageChange,
      scrollToItemTriggered
    ]
  )

  return (
    <div
      style={style}
      ref={rootRef}
      className={
        direction === Direction.HORIZONTAL
          ? cn('flex-1 overflow-x-scroll w-screen', className)
          : cn('flex-1 overflow-y-scroll h-screen', className)
      }
      onScroll={onScroll}
    >
      <div
        style={
          direction === Direction.HORIZONTAL
            ? {
                width: `${listSize}px`
              }
            : {
                height: `${listSize}px`
              }
        }
      >
        <div
          style={
            direction === Direction.HORIZONTAL
              ? {
                  display: 'flex',
                  flexDirection: 'row',
                  transform: `translateX(${translate}px)`,
                  width: 'max-content',
                  gap
                }
              : {
                  display: 'flex',
                  flexDirection: 'column',
                  transform: `translateY(${translate}px)`,
                  height: 'max-content',
                  gap
                }
          }
        >
          {visibleItems}
        </div>
      </div>
    </div>
  )
}

export default VirtualizedList
