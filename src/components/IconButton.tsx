import * as icons from '@/data/icons'
import { Icon } from '@/types/icons'
import cn from '@/utils/cn'
import React, { ButtonHTMLAttributes, DetailedHTMLProps } from 'react'

type IconButtonVariant = 'md' | 'sm'

type IconButtonColor = 'black' | 'white'

type IconButtonProps = {
  variant?: IconButtonVariant
  color?: IconButtonColor
  icon: Icon
  className?: string
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

const IconButton = ({
  variant = 'md',
  color = 'white',
  icon,
  className,
  ...props
}: IconButtonProps) => {
  const Icon = icons[icon]
  return (
    <button
      className={cn(
        'flex justify-center items-center rounded-full',
        variant === 'md' && 'size-12',
        variant === 'sm' && 'size-8',
        color === 'black' && 'bg-black',
        color === 'white' && 'bg-white',
        className
      )}
      {...props}
    >
      <Icon
        className={cn(
          variant === 'md' && 'size-6',
          variant === 'sm' && 'scale-75',
          color === 'black' && 'icon-action',
          color === 'white' && 'icon-on-action'
        )}
      />
    </button>
  )
}

export default IconButton
