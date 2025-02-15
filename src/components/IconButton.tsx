import * as icons from '@/data/icons'
import { Icon } from '@/types/icons'
import cn from '@/utils/cn'
import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'

type IconButtonProps = {
  icon: Icon
  className?: string
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

const IconButton = ({ icon, className, ...props }: IconButtonProps) => {
  const Icon = icons[icon]
  return (
    <button
      className={cn(
        'flex justify-center items-center bg-white size-12 rounded-full',
        className
      )}
      {...props}
    >
      <Icon className={cn('size-6 icon-on-action')} />
    </button>
  )
}

export default IconButton
