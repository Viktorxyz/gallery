import cn from '@/utils/cn'
import React from 'react'

type HeaderProps = {
  text?: string
  className?: string
}

const Header = ({ text, className }: HeaderProps) => {
  return (
    <header
      className={cn(
        'z-50 fixed w-full top-0 p-6 text-center text-sm bg-black/75',
        className
      )}
    >
      {text}
    </header>
  )
}

export default Header
