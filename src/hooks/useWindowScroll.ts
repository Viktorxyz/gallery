import { useEffect, useState } from 'react'

const useWindowScroll = () => {
  const [x, setX] = useState<number>(0)
  const [y, setY] = useState<number>(0)

  useEffect(() => {
    const listener = () => {
      setX(window.scrollX)
      setY(window.scrollY)
    }
    window.addEventListener('scroll', listener)
    return () => window.removeEventListener('scroll', listener)
  }, [])

  return { x, y }
}

export default useWindowScroll
