import React, { useCallback, useEffect, useRef, useState } from 'react'
import VideoControls from './video-controls'
import cn from '@/utils/cn'
import { useCarousel } from '@/providers/carousel-provider'

type PlayerProps = {
  src: string
  defaultPlay?: boolean
}

const Player = ({ src, defaultPlay }: PlayerProps) => {
  const { muted, actions, toggleMuted } = useCarousel()
  const videoRef = useRef<HTMLVideoElement>(null)
  const [playing, setPlaying] = useState<boolean>(false)
  const [currentTime, setCurrentTime] = useState<number>(0)

  const onTimeUpdate = useCallback(
    (e: React.SyntheticEvent<HTMLVideoElement, Event>) =>
      setCurrentTime(e.currentTarget.currentTime),
    []
  )

  const onCurrentTimeChange = useCallback((currentTime: number) => {
    if (videoRef.current) videoRef.current.currentTime = currentTime
    setCurrentTime(currentTime)
  }, [])

  const onEnded = useCallback(() => {
    setPlaying(false)
  }, [])

  const play = useCallback(() => {
    if (videoRef.current) videoRef.current.play()
    setPlaying(true)
  }, [])
  const pause = useCallback(() => {
    if (videoRef.current) videoRef.current.pause()
    setPlaying(false)
  }, [])
  const togglePlaying = useCallback(
    () => (playing ? pause() : play()),
    [pause, play, playing]
  )

  useEffect(() => {
    if (defaultPlay) play()
    else {
      if (videoRef.current) videoRef.current.currentTime = 0
      pause()
    }
  }, [defaultPlay, pause, play])

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
          actions && 'pointer-events-none opacity-0'
        )}
        currentTime={currentTime}
        onCurrentTimeChange={onCurrentTimeChange}
        duration={Math.floor(videoRef.current?.duration ?? 1)}
        muted={muted}
        playing={playing}
        toggleMuted={toggleMuted}
        togglePlaying={togglePlaying}
      />
    </>
  )
}

export default Player
