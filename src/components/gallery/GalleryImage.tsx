import { IconCheck, IconHeartOutlined, IconHeartFill } from '@/data/icons'
import useLongPress from '@/hooks/useLongPress'
import Spinner from '../Spinner'
import { useOptimistic, useTransition } from 'react'
import { type GalleryImage } from '@/types/gallery'

type GalleryImageProps = GalleryImage & {
  onLike: () => void
  onClick: () => void
  onLongPress: () => void
}

const GalleryImage = ({
  src,
  keyword,
  likes,
  onLike,
  onClick,
  onLongPress,
  selected,
  uploading,
  liked
}: GalleryImageProps) => {
  const [isPending, startTransition] = useTransition()
  const [optimisticLikes, setOptimisticLikes] = useOptimistic<number>(likes)
  const ref = useLongPress<HTMLDivElement>(onLongPress)

  const handleOnLike = () => {
    startTransition(() => {
      setOptimisticLikes(liked ? optimisticLikes - 1 : optimisticLikes + 1)
    })
    onLike()
  }

  return (
    <div className="relative" onClick={onClick} ref={ref}>
      <img className="pointer-events-none" src={src} />
      {selected ? (
        <div className="flex justify-end items-end absolute inset-0 bg-black/75">
          <IconCheck className="m-6 size-6 icon-action" />
        </div>
      ) : (
        <div className="flex flex-col items-end absolute inset-0 p-6 text-sm">
          {uploading && <Spinner />}
          <div className="flex justify-between w-full mt-auto">
            <p>#{keyword}</p>
            <div className="flex items-center gap-1" onClick={handleOnLike}>
              {liked ? (
                <IconHeartFill className="size-6 fill-red-600" />
              ) : (
                <IconHeartOutlined className="size-6 icon-action" />
              )}

              <p className="select-none">{optimisticLikes}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default GalleryImage
