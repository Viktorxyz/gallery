'use client'

import { Direction } from '@/components/VirtualizedList/types'
import { RefObject, useCallback, useEffect, useRef, useState } from 'react'

type useScrollAwareProps<T> = {
  initialScroll?: number
  direction?: Direction
  target?: RefObject<T | null>
}

const useScrollAware = <T extends HTMLElement>({
  initialScroll = 0,
  direction = Direction.HORIZONTAL,
  target
}: useScrollAwareProps<T>) => {
  const [scroll, setScroll] = useState(initialScroll)
  const defaultRef = useRef<T>(null)
  const ref = target || defaultRef
  const animationFrame = useRef<number>(null)

  const onScroll = useCallback(
    (e: Event) => {
      const target = e.currentTarget as HTMLDivElement

      if (animationFrame.current) {
        cancelAnimationFrame(animationFrame.current)
      }
      animationFrame.current = requestAnimationFrame(() => {
        setScroll(
          direction === Direction.HORIZONTAL
            ? target.scrollLeft
            : target.scrollTop
        )
      })
    },
    [direction]
  )

  useEffect(() => {
    const scrollContainer = ref.current

    if (!scrollContainer) return

    setScroll(
      direction === Direction.HORIZONTAL
        ? scrollContainer.scrollLeft
        : scrollContainer.scrollTop
    )
    scrollContainer.addEventListener('scroll', onScroll)
    return () => scrollContainer.removeEventListener('scroll', onScroll)
  }, [direction, onScroll, ref])

  useEffect(() => {
    if (ref.current) {
      if (direction === Direction.HORIZONTAL)
        ref.current.scrollLeft = initialScroll
      else ref.current.scrollTop = initialScroll
    }
  }, [direction, initialScroll, ref])

  return { scroll, ref }
}

export default useScrollAware
