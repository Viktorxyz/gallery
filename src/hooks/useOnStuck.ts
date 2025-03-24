import { RefObject, useEffect, useRef } from 'react'

const useOnStuck = <T extends HTMLElement>(
  onStuck: () => void,
  onUnstuck: () => void,
  { target }: { target: RefObject<T | null> }
) => {
  const ref = useRef<T>(null)
  target ||= ref

  useEffect(() => {
    if (!target.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 1) onStuck()
        else onUnstuck()
      },
      {
        threshold: [1]
      }
    )

    observer.observe(target.current)

    return () => observer.disconnect()
  }, [onStuck, onUnstuck, target])

  return target
}

export default useOnStuck
