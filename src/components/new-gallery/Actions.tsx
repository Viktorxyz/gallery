import { IconX } from '@/data/icons'
import React from 'react'
import IconButton from '../IconButton'
import cn from '@/utils/cn'
import { useRouter } from 'next/navigation'

type ActionsProps = {
  className?: string
}

const Actions = ({ className }: ActionsProps) => {
  const router = useRouter()

  return (
    <div
      className={cn(
        'flex h-20 items-center justify-between bg-black',
        className
      )}
    >
      <IconX onClick={() => router.back()} className="size-6 icon-action" />
      <IconButton type="submit" icon="IconCheck" />
    </div>
  )
}

export default Actions
