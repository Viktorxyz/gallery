import { IconMute, IconPause, IconPlay, IconVolume } from '@/data/icons'
import cn from '@/utils/cn'
import formatTime from '@/utils/formatTime'
import { ChangeEvent } from 'react'
import Slider from '../Slider'

type VideoControlsProps = {
  duration: number
  currentTime: number
  playing: boolean
  muted: boolean
  onCurrentTimeChange: (currentTime: number) => void
  togglePlaying: () => void
  toggleMuted: () => void
  className?: string
}

const VideoControls = ({
  duration,
  currentTime,
  playing,
  muted,
  onCurrentTimeChange,
  togglePlaying,
  toggleMuted,
  className
}: VideoControlsProps) => {
  const onSliderChange = (e: ChangeEvent<HTMLInputElement>) =>
    onCurrentTimeChange(duration * parseFloat(e.target.value))

  return (
    <div
      onClick={(e) => e.stopPropagation()}
      className={cn('flex gap-2 p-4', className)}
    >
      <button
        onClick={togglePlaying}
        className="flex items-center justify-center size-8 bg-black/75 rounded-full"
      >
        {playing ? (
          <IconPause className="scale-75 fill-white" />
        ) : (
          <IconPlay className="scale-75 fill-white" />
        )}
      </button>
      <div className="flex-1 flex justify-between px-3 relative items-center gap-2 h-8 rounded-full">
        <span className="z-10 text-sm select-none pointer-events-none">
          {formatTime(Math.floor(currentTime))}
        </span>
        <Slider
          value={currentTime / duration}
          onChange={onSliderChange}
          className="absolute w-full h-full left-0"
        />
        <span className="z-10 text-sm text-neutral-400 select-none pointer-events-none">
          {formatTime(duration)}
        </span>
      </div>
      <button
        onClick={toggleMuted}
        className="flex items-center justify-center size-8 bg-black/75 rounded-full"
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
