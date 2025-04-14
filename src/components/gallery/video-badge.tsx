import { IconPlay } from '@/data/icons'

type VideoBadgeProps = {
  margin?: number
}

const VideoBadge = ({ margin = 0 }: VideoBadgeProps) => {
  return (
    <div
      className="flex items-center z-50 absolute bg-black/35 rounded-md size-6"
      style={{
        bottom: margin + 4,
        left: margin + 4
      }}
    >
      <IconPlay className="fill-white scale-50" />
      <span className="text-xs"></span>
    </div>
  )
}

export default VideoBadge
