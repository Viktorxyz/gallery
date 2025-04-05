import React from 'react'

type HeaderProps = {
  text?: string
  numberOfImages?: number
  numberOfVideos?: number
}

const Header = ({ text, numberOfImages, numberOfVideos }: HeaderProps) => {
  return (
    <div className="relative flex flex-col items-center justify-center h-[25vh] min-h-48">
      <div className="flex justify-center relative">
        <h5 className="sticky text-2xl tracking-tighter text-center content-end">
          {text}
        </h5>
        <div className="absolute text-neutral-400 text-sm bottom-0 translate-y-full">
          {numberOfImages} photos {numberOfVideos} videos
        </div>
      </div>
      <div className="absolute inset-0 bg-gradient-to-t from-black from-10% to-40% to-black/0"></div>
    </div>
  )
}

export default Header
