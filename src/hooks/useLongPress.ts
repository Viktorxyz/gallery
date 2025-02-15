import { useEffect, useRef } from 'react'

export default function useLongPress<T extends HTMLElement>(
  onLongPress: () => void,
  delay = 1500
) {
  const ref = useRef<T | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handlePointerDown = () => {
      timeoutRef.current = setTimeout(() => {
        onLongPress()
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
  }, [onLongPress, delay])

  return ref
}
