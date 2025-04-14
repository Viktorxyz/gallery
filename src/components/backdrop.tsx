import React from 'react'
import cn from 'utils/cn'

type BackdropProps = {
  className?: string
}

const Backdrop = ({ className }: BackdropProps) => {
  return (
    <div
      className={cn('fixed w-screen h-screen bg-black/75 z-40', className)}
    ></div>
  )
}

export default Backdrop
