import React, { useCallback, useEffect, useRef, useState } from 'react'
import VideoControls from './VideoControls'
import cn from '@/utils/cn'

type PlayerProps = {
  src: string
  muted: boolean
  toggleMuted: () => void
  active: boolean
  actionsHidden: boolean
}

const Player = ({
  src,
  muted,
  toggleMuted,
  active,
  actionsHidden
}: PlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)

  const onTimeUpdate = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement, Event>) =>
      setCurrentTime(e.currentTarget.currentTime),
    []
  )

  const onCurrentTimeChange = useCallback((currentTime: number) => {
    videoRef.current.currentTime = currentTime
    setCurrentTime(currentTime)
  }, [])

  const onEnded = useCallback(() => {
    setPlaying(false)
  }, [])

  const play = useCallback(() => {
    videoRef.current.play()
    setPlaying(true)
  }, [])
  const pause = useCallback(() => {
    videoRef.current.pause()
    setPlaying(false)
  }, [])
  const togglePlaying = useCallback(
    () => (playing ? pause() : play()),
    [playing]
  )

  useEffect(() => {
    if (active) play()
    else {
      videoRef.current.currentTime = 0
      pause()
    }
  }, [active])

  return (
    <>
      <video
        disableRemotePlayback
        ref={videoRef}
        src={src}
        muted={muted}
        onEnded={onEnded}
        onTimeUpdate={onTimeUpdate}
      />
      <VideoControls
        className={cn(
          'transition-opacity duration-100 ease-linear absolute bottom-[132px] w-full',
          actionsHidden && 'pointer-events-none opacity-0'
        )}
        currentTime={currentTime}
        onCurrentTimeChange={onCurrentTimeChange}
        duration={Math.floor(videoRef.current?.duration) ?? 0}
        muted={muted}
        playing={playing}
        toggleMuted={toggleMuted}
        togglePlaying={togglePlaying}
      />
    </>
  )
}

export default Player
