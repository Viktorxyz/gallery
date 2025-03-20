import { MediaMime, RowProps } from '@/types/gallery'
import cn from '@/utils/cn'
import Image from 'next/image'
import useUserStore from '@/stores/userStore'
import MediaContainer from './MediaContainer'

const Row = ({ pinching, aspectRatio, media }: RowProps) => {
  const { zoomLevel } = useUserStore()
  const gap = (-1 / 2) * zoomLevel + 9 / 2

  return (
    <div
      className={cn(
        'flex overflow-hidden transition-all duration-300',
        pinching && 'transition-none'
      )}
      style={{
        aspectRatio
      }}
    >
      {media.map(({ src, type, ...rest }, index) => (
        <MediaContainer pinching={pinching} {...rest} key={index}>
          {type === MediaMime.IMAGE ? (
            <Image
              className="object-cover z-0"
              style={{
                padding: `${gap}px`
              }}
              src={src}
              fill
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
              alt=""
            />
          ) : (
            <video
              className="object-cover"
              style={{ padding: `${gap}px` }}
              src={src}
              autoPlay
              muted
            />
          )}
        </MediaContainer>
      ))}
    </div>
  )
}

export default Row
