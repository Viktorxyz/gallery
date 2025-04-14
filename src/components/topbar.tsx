'use client'

import { IconLeft } from '@/data/icons'
import cn from '@/utils/cn'
import { useRouter } from 'next/navigation'
import React from 'react'

type TopBarProps = {
  title?: string
  className?: string
}

const TopBar = ({ title, className }: TopBarProps) => {
  const router = useRouter()

  return (
    <header className={cn('flex items-center gap-6 text-2xl', className)}>
      <IconLeft onClick={router.back} className="fill-white" />
      <div>{title}</div>
    </header>
  )
}

export default TopBar
