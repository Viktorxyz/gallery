import { MediaMime } from '@/types/gallery'
import cn from '@/utils/cn'
import Image from 'next/image'
import { RefObject, useEffect, useRef } from 'react'

type ThumbnailProps = {
  src: string
  type: MediaMime
  mapKey: string
  rootRef: RefObject<HTMLDivElement | null>
  aspectRatio: number
  active: boolean
  initial: boolean
  onChange: (mapKey: string) => void
}

const Thumbnail = ({
  src,
  type,
  mapKey,
  aspectRatio,
  active,
  onChange
}: ThumbnailProps) => {
  const ref = useRef<HTMLDivElement>(null)

  const handleClick = () => {
    onChange(mapKey)
    ref.current?.scrollIntoView({
      behavior: 'smooth',
      block: 'center',
      inline: 'center'
    })
  }

  useEffect(() => {
    if (active)
      ref.current?.scrollIntoView({
        behavior: 'smooth',
        block: 'center',
        inline: 'center'
      })
  }, [active])

  // useEffect(() => {
  //   if (!rootRef.current) return

  //   const observer = new IntersectionObserver(
  //     ([entry]) => {
  //       if (entry.isIntersecting) onChange(mapKey)
  //     },
  //     {
  //       root: rootRef.current,
  //       rootMargin: '0px -50% 0px -50%',
  //       threshold: 0
  //     }
  //   )

  //   observer.observe(ref.current)

  //   return () => observer.disconnect()
  // }, [rootRef.current, ref.current])

  return (
    <div
      ref={ref}
      className={cn(
        'relative h-12 snap-center transition-[height] duration-150',
        active && 'h-full'
      )}
      style={{
        aspectRatio
      }}
      onClick={handleClick}
    >
      {type === MediaMime.IMAGE ? (
        <Image src={src} fill alt="" sizes="(max-width: 768px) 168px" />
      ) : (
        <video src={`${src}#t=0.1`} />
      )}
    </div>
  )
}

export default Thumbnail
