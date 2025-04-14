import * as icons from '@/data/icons'
import { Icon } from '@/types/icons'
import cn from '@/utils/cn'
import React, {
  ButtonHTMLAttributes,
  DetailedHTMLProps,
  ReactNode
} from 'react'

type ButtonVariant = 'sm' | 'md' | 'lg'

type ButtonProps = {
  children: ReactNode
  variant?: ButtonVariant
  iconStart?: Icon
  iconEnd?: Icon
  className?: string
} & DetailedHTMLProps<
  ButtonHTMLAttributes<HTMLButtonElement>,
  HTMLButtonElement
>

const Button = ({
  children,
  variant = 'sm',
  iconStart,
  iconEnd,
  className,
  ...props
}: ButtonProps) => {
  const IconStart = iconStart ? icons[iconStart] : null
  const IconEnd = iconEnd ? icons[iconEnd] : null

  return (
    <button
      className={cn(
        'flex items-center gap-2 bg-white text-black rounded-full text-nowrap px-5',
        variant === 'sm' && 'h-12',
        variant === 'md' && 'h-16',
        className
      )}
      {...props}
    >
      <div className="flex justify-start w-full">
        {iconStart && <IconStart className="icon-on-action" />}
      </div>
      {children}
      <div className="flex justify-end w-full">
        {iconEnd && <IconEnd className="icon-on-action" />}
      </div>
    </button>
  )
}

export default Button
