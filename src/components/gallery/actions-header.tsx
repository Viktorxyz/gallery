import React from 'react'

type ActionsHeaderProps = {
  title?: string
  numberOfPhotos?: number
  numberOfVideos?: number
}

function ActionsHeader({
  title,
  numberOfPhotos,
  numberOfVideos
}: ActionsHeaderProps) {
  return (
    <>
      <div>{title}</div>
      <div className="text-xs text-zinc-400">
        {numberOfPhotos} photos {numberOfVideos} videos
      </div>
    </>
  )
}

export default ActionsHeader
