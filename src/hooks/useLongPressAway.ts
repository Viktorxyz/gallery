import { useEffect, useRef } from 'react'

export default function useLongPressAway<T extends HTMLElement>(
  onPointerDown: () => void,
  onPointerUp: () => void,
  delay = 300
) {
  const ref = useRef<T | null>(null)
  const timeoutRef = useRef<NodeJS.Timeout | null>(null)

  useEffect(() => {
    const handlePointerDown = (event: PointerEvent) => {
      if (ref.current?.contains(event.target as Node)) return

      timeoutRef.current = setTimeout(() => {
        onPointerDown()
      }, delay)
    }

    const handlePointerUp = () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current)
      }
      onPointerUp()
    }

    window.addEventListener('pointerdown', handlePointerDown)
    window.addEventListener('pointerup', handlePointerUp)

    return () => {
      window.removeEventListener('pointerdown', handlePointerDown)
      window.removeEventListener('pointerup', handlePointerUp)
    }
  }, [onPointerDown, onPointerUp, delay])

  return ref
}
