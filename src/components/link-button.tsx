import cn from '@/utils/cn'
import Link, { LinkProps } from 'next/link'
import { PropsWithChildren } from 'react'

type LinkButtonProps = PropsWithChildren<LinkProps & { className?: string }>

function LinkButton({ children, className, ...props }: LinkButtonProps) {
  return (
    <Link
      {...props}
      className={cn(
        'flex items-center justify-center bg-white h-16 text-black rounded-full text-nowrap px-5',
        className
      )}
    >
      {children}
    </Link>
  )
}

export default LinkButton
