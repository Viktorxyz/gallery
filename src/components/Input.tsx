'use client'
import cn from '@/utils/cn'
import React, { DetailedHTMLProps, InputHTMLAttributes } from 'react'

type InputVariant = 'transparent' | 'line'

type InputProps = {
  variant?: InputVariant
  onChange?: (value: string) => void
  className?: string
  error?: string
} & Omit<
  DetailedHTMLProps<InputHTMLAttributes<HTMLInputElement>, HTMLInputElement>,
  'onChange'
>

const Input = ({
  variant = 'transparent',
  onChange,
  className,
  error,
  ...props
}: InputProps) => {
  return (
    <div className="flex flex-col gap-2">
      {error && <div className="text-error">{error}</div>}
      <input
        className={cn(
          'placeholder:text-neutral-400 outline-0 border-0 text-white w-full h-12 px-4',
          variant === 'line' && 'border-b-[1px]',
          className
        )}
        onChange={(e) => onChange && onChange(e.target.value)}
        {...props}
      />
    </div>
  )
}

export default Input
