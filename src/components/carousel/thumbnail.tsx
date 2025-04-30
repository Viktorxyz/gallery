import { MediaMime, Media } from '@/types/gallery'
import cn from '@/utils/cn'
import Image from 'next/image'

type ThumbnailProps = {
  media: Media
  onClick: () => void
  className?: string
}

const Thumbnail = ({ media, onClick, className }: ThumbnailProps) => {
  return (
    <div
      className={cn(
        'relative h-12 transition-[height] duration-150 rounded-xs overflow-hidden',
        className
      )}
      style={{
        aspectRatio: media.aspectRatio,
      }}
      onClick={onClick}
    >
      {media.type === MediaMime.IMAGE ? (
        <Image src={media.src} fill alt='' sizes='(max-width: 768px) 168px' />
      ) : (
        <video src={`${media.src}#t=0.1`} />
      )}
    </div>
  )
}

export default Thumbnail
