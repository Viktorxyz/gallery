import { RefObject, useEffect, useRef } from 'react'

const useOnStuck = <T extends HTMLElement>(
  onStuck: () => void,
  onUnstuck: () => void,
  { target, root }: { target: RefObject<T | null>; root?: RefObject<T | null> }
) => {
  const ref = useRef<T>(null)
  target ??= ref

  useEffect(() => {
    if (!target.current) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.intersectionRatio < 1) onStuck()
        else onUnstuck()
      },
      {
        root: root?.current,
        threshold: [1]
      }
    )

    observer.observe(target.current)

    return () => observer.disconnect()
  }, [onStuck, onUnstuck, root, target])

  return target
}

export default useOnStuck
