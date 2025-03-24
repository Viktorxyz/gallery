import cn from '@/utils/cn'
import React, { ChangeEvent, DetailedHTMLProps, useMemo } from 'react'

type SliderProps = {
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  className?: string
  max?: number
  min?: number
  value?: number
} & DetailedHTMLProps<
  React.InputHTMLAttributes<HTMLInputElement>,
  HTMLInputElement
>

const Slider = ({
  onChange,
  className,
  max = 1,
  min = 0,
  value = 0,
  ...props
}: SliderProps) => {
  const percentage = useMemo(
    () => ((Math.abs(min) + value) / (Math.abs(max) + Math.abs(min))) * 100,
    [max, min, value]
  )

  return (
    <div
      className={cn(
        'relative rounded-full overflow-hidden bg-black/25',
        className
      )}
    >
      <div
        className="transition-[width] duration-300 ease-linear h-full bg-black/75 rounded-full"
        style={{
          width: `${percentage}%`
        }}
      ></div>
      <input
        step="any"
        {...props}
        min={min}
        max={max}
        value={value}
        className="slider"
        type="range"
        onChange={onChange}
      />
    </div>
  )
}

export default Slider
