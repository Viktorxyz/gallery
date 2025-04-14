type TitleProps = {
  title?: string
  numberOfPhotos?: number
  numberOfVideos?: number
}

function Title({ title, numberOfPhotos, numberOfVideos }: TitleProps) {
  return (
    <div className="flex justify-center relative">
      <h5 className="sticky text-2xl tracking-tighter text-center content-end">
        {title}
      </h5>
      <div className="absolute text-neutral-400 text-sm bottom-0 translate-y-full">
        {numberOfPhotos} photos {numberOfVideos} videos
      </div>
    </div>
  )
}

export default Title
