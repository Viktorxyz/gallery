import { RowProps } from '@/types/gallery'
import cn from '@/utils/cn'
import Media from './Media'

const Row = ({ pinching, aspectRatio, media }: RowProps) => {
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
      {media.map((media, i) => (
        <Media media={media} pinching={pinching} key={i} />
      ))}
    </div>
  )
}

export default Row
