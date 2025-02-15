import cn from '@/utils/cn'
import React from 'react'

type TopBarProps = {
  title?: string
  className?: string
}

const TopBar = ({ title, className }: TopBarProps) => {
  return <div className={cn('text-2xl', className)}>{title}</div>
}

export default TopBar
