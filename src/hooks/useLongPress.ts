import { useEffect, useRef } from 'react'
import useWindowScroll from './useWindowScroll' // Import your scroll detection hook

type Options<T> = {
  target?: React.RefObject<T>
  delay?: number
}

export default function useLongPress<T extends HTMLElement>(
  onLongPress: () => void,
  options: Options<T> = {}
) {
  const { delay = 1500, target } = options
  const defaultRef = useRef<T | null>(null)
  const ref = target ?? defaultRef
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)
  const lastScrollY = useRef<number>(0)

  const { y: currentScrollY } = useWindowScroll()

  useEffect(() => {
    const handlePointerDown = () => {
      lastScrollY.current = currentScrollY
      timeoutRef.current = setTimeout(() => {
        if (lastScrollY.current === currentScrollY) {
          onLongPress()
        }
      }, delay)
    }

    const handlePointerUp = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }

    const handlePointerLeave = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
    }

    const currentRef = ref.current

    if (currentRef) {
      currentRef.addEventListener('pointerdown', handlePointerDown)
      currentRef.addEventListener('pointerleave', handlePointerLeave)
      window.addEventListener('pointerup', handlePointerUp)
    }

    return () => {
      if (currentRef) {
        currentRef.removeEventListener('pointerdown', handlePointerDown)
        currentRef.removeEventListener('pointerleave', handlePointerLeave)
      }
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [onLongPress, delay, target, currentScrollY, ref])

  return target
}
