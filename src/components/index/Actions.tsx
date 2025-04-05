'use client'

import IconButton from '../IconButton'
import { useRouter } from 'next/navigation'
import Button from '../Button'
import cn from '@/utils/cn'
import { User } from '@supabase/supabase-js'

type ActionsProps = {
  user?: User
  signOut: () => void
  className?: string
}

function Actions({ user, signOut, className }: ActionsProps) {
  const router = useRouter()

  return (
    <div className={cn('flex justify-between w-full', className)}>
      {user && <Button onClick={signOut}>Sign Out</Button>}
      <div></div>
      <IconButton
        onClick={() => router.push('/dashboard')}
        icon="IconArrowRight"
      />
    </div>
  )
}

export default Actions
