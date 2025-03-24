import { useEffect, useRef } from 'react'

const useClickAway = <T extends HTMLElement>(
  callback?: (e: MouseEvent) => void
) => {
  const ref = useRef<T | null>(null)

  useEffect(() => {
    const listener = (e: MouseEvent) => {
      if (!ref || !ref.current || ref.current.contains(e.target as Node)) {
        return
      }
      if (callback) callback(e)
    }
    document.addEventListener('mousedown', listener)
    return () => {
      document.removeEventListener('mousedown', listener)
    }
  }, [ref, callback])

  return ref
}

export default useClickAway
