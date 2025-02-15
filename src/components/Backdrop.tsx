import React from 'react'
import cn from 'utils/cn'

type BackdropProps = {
  className?: string
}

const Backdrop = ({ className }: BackdropProps) => {
  return <div className={cn('fixed inset-0 bg-black/75', className)}></div>
}

export default Backdrop
