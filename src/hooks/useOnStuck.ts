import { useEffect, useRef } from 'react'

const useOnStuck = <T extends HTMLElement>(
  onStuck: () => void,
  onUnstuck: () => void,
  { target }: { target: React.RefObject<T> }
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
  }, [onStuck, onUnstuck])

  return target
}

export default useOnStuck
