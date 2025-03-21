import { IconMute, IconPause, IconPlay, IconVolume } from '@/data/icons'
import cn from '@/utils/cn'
import formatTime from '@/utils/formatTime'

type VideoControlsProps = {
  duration: number
  currentTime: number
  playing: boolean
  muted: boolean
  togglePlaying: () => void
  toggleMuted: () => void
  className?: string
}

const VideoControls = ({
  duration,
  currentTime,
  playing,
  muted,
  togglePlaying,
  toggleMuted,
  className
}: VideoControlsProps) => {
  return (
    <div className={cn('grid grid-cols-[1fr_min-content_1fr] p-4', className)}>
      <div
        onClick={(e) => {
          e.stopPropagation()
          togglePlaying()
        }}
        className="col-start-2 flex pl-2 pr-3 items-center gap-2 h-8 bg-black/75 rounded-full"
      >
        {playing ? (
          <IconPause className="scale-75 fill-white" />
        ) : (
          <IconPlay className="scale-75 fill-white" />
        )}

        <div className="flex items-center gap-px select-none">
          <span className="text-sm">{formatTime(currentTime)}</span>
          <span>/</span>
          <span className="text-sm text-neutral-400">
            {formatTime(duration)}
          </span>
        </div>
      </div>
      <button
        onClick={(e) => {
          e.stopPropagation()
          toggleMuted()
        }}
        className="col-start-3 justify-self-end flex items-center justify-center size-8 bg-black/75 rounded-full"
      >
        {muted ? (
          <IconMute className="scale-75 fill-white" />
        ) : (
          <IconVolume className="scale-75 fill-white" />
        )}
      </button>
    </div>
  )
}

export default VideoControls
