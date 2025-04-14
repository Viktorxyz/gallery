'use client'

import useWindowSize from '@/hooks/useWindowSize'
import {
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useRef,
  useState
} from 'react'
import { useVirtualizedList } from './virtualized-list-root'
import { Direction, ScrollToItemOptions, VirtualizedListProps } from './types'
import {
  findFirstVisibleItem,
  findLastVisibleItem,
  getAlignmentOffset,
  getScrollPercentage
} from './utils'
import cn from '@/utils/cn'

const defaultScrollToItemOptions: ScrollToItemOptions = {
  behaviour: 'instant',
  cancelOnChange: false
}

function VirtualizedList({
  debugName,
  length,
  Item,
  ref,
  rootRef,
  listRef,
  direction,
  initialIndex,
  align = 'start',
  onScrollChange,
  onScrollPercentageChange,
  onIndexChange,
  itemSize,
  getItemSize,
  overscan = 2,
  gap = 0,
  className,
  scrollOffset = 0,
  style
}: VirtualizedListProps) {
  const context = useVirtualizedList()

  const defaultRootRef = useRef<HTMLDivElement>(null)
  rootRef = rootRef ?? context?.rootRef ?? defaultRootRef
  direction = direction ?? context?.direction ?? Direction.HORIZONTAL

  const initialIndexRef = useRef(initialIndex ?? 0)

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
    positions && getItemSize
      ? positions[initialIndexRef.current] +
          getAlignmentOffset(getItemSize(index), align) -
          scrollOffset
      : (itemSize + gap) * initialIndexRef.current +
          getAlignmentOffset(itemSize, align) -
          scrollOffset
  )

  const getFirstVisibleItem = useCallback(
    (scroll: number) =>
      positions
        ? findFirstVisibleItem(
            Math.max(scroll + scrollOffset, 0), // getScrollWithOffset()
            positions,
            length
          )
        : Math.round(Math.max(scroll + scrollOffset, 0) / (itemSize + gap)), // getScrollWithOffset()
    [positions, scrollOffset, length, itemSize, gap]
  )

  const listSize = useMemo(
    () =>
      positions && getItemSize
        ? positions[length - 1] + getItemSize(length - 1)
        : (itemSize + gap) * length - gap,
    [gap, getItemSize, itemSize, length, positions]
  )

  const [scroll, setScroll] = useState<number>(initialScroll.current)
  const [firstVisibleItem, setFirstVisibleItem] = useState<number>(() =>
    getFirstVisibleItem(scroll)
  )

  const firstItem = Math.max(0, firstVisibleItem - overscan)

  const lastVisibleItem = useMemo(
    () =>
      positions
        ? findLastVisibleItem(
            positions,
            firstVisibleItem,
            length,
            direction === Direction.HORIZONTAL
              ? Math.min(width, width + scrollOffset + scroll) // getContainerSize()
              : Math.min(height, height + scrollOffset + scroll) // getContainerSize()
          )
        : firstVisibleItem +
          (direction === Direction.HORIZONTAL
            ? Math.floor(
                Math.min(width, width + scrollOffset + scroll) / itemSize // getContainerSize()
              )
            : Math.floor(
                Math.min(height, height + scrollOffset + scroll) / itemSize // getContainerSize()
              )),
    [
      direction,
      firstVisibleItem,
      height,
      itemSize,
      length,
      positions,
      scroll,
      scrollOffset,
      width
    ]
  )
  const lastItem = Math.min(length - 1, lastVisibleItem + overscan)

  const visibleItemsCount = lastItem - firstItem + 1

  const translate = positions
    ? positions[firstItem]
    : (itemSize + gap) * firstItem

  useImperativeHandle(
    listRef,
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
        const target = rootRef.current
        if (!target) return

        const finalOptions = {
          align,
          ...defaultScrollToItemOptions,
          ...options
        }

        if (!finalOptions.cancelOnChange && onIndexChange) onIndexChange(index)
        setScrollToItemTriggered(true)
        setIndex(index)

        const alignmentOffset = getAlignmentOffset(
          getItemSize ? getItemSize(index) : itemSize,
          finalOptions.align
        )

        const scroll = positions
          ? positions[index] + alignmentOffset - scrollOffset
          : index * (itemSize + gap) + alignmentOffset - scrollOffset

        const prevBehaviour = target.style.scrollBehavior
        target.style.scrollBehavior = finalOptions.behaviour

        if (direction === Direction.HORIZONTAL) target.scrollLeft = scroll
        else target.scrollTop = scroll

        target.style.scrollBehavior = prevBehaviour
      }
    }),
    [
      align,
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
            virtualizedListRef={listRef}
          />
        )),
    [Item, firstItem, listRef, visibleItemsCount]
  )

  const animationFrame = useRef<number>(null)

  const onScroll = useCallback(
    (e: Event) => {
      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current)
      }
      animationFrame.current = requestAnimationFrame(() => {
        const target = e.target as HTMLDivElement

        const scroll =
          direction === Direction.HORIZONTAL
            ? target.scrollLeft
            : target.scrollTop
        setScroll(scroll)

        if (onScrollChange) onScrollChange(scroll)
        if (onScrollPercentageChange)
          onScrollPercentageChange(
            getScrollPercentage(
              scroll,
              direction === Direction.HORIZONTAL
                ? target.scrollWidth
                : target.scrollHeight,
              direction === Direction.HORIZONTAL
                ? target.clientWidth
                : target.clientHeight
            )
          )

        const firstVisibleItem = getFirstVisibleItem(scroll)
        setFirstVisibleItem(firstVisibleItem)

        if (scrollToItemTriggered) {
          if (firstVisibleItem === index) setScrollToItemTriggered(false)
        } else if (firstVisibleItem !== index) {
          if (onIndexChange) onIndexChange(firstVisibleItem)
          setIndex(firstVisibleItem)
        }
      })
    },
    [
      direction,
      getFirstVisibleItem,
      index,
      onIndexChange,
      onScrollChange,
      onScrollPercentageChange,
      scrollToItemTriggered
    ]
  )

  useEffect(() => {
    const target = rootRef.current

    if (!target) return

    const prevBehaviour = target.style.scrollBehavior
    target.style.scrollBehavior = 'instant'

    if (direction === Direction.HORIZONTAL)
      target.scrollLeft = initialScroll.current
    else target.scrollTop = initialScroll.current

    target.style.scrollBehavior = prevBehaviour
  }, [debugName, direction, initialScroll, rootRef])

  useEffect(() => {
    const target = rootRef.current
    if (!target) return

    target.addEventListener('scroll', onScroll)
    return () => target.removeEventListener('scroll', onScroll)
  }, [onScroll, rootRef])

  if (!context)
    return (
      <div
        ref={rootRef}
        className={
          direction === Direction.HORIZONTAL
            ? cn('overflow-x-scroll w-screen', className)
            : cn('overflow-y-scroll h-screen', className)
        }
        style={style}
      >
        <div
          ref={ref}
          className={className}
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

  return (
    <div
      ref={ref}
      className={className}
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
  )
}

export default VirtualizedList
