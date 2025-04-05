import { RowProps } from '@/types/gallery'
import cn from '@/utils/cn'
import Media from './Media'

const Row = ({ pinching, aspectRatio, media }: RowProps) => {
  return (
    <div
      className={cn(
        'flex overflow-hidden transition-[aspect-ratio] duration-[3000ms]'
        // pinching && 'transition-none'
      )}
      style={{
        aspectRatio
      }}
    >
      {media.map((media, index) => (
        <Media media={media} pinching={pinching} key={index} />
      ))}
    </div>
  )
}

export default Row
