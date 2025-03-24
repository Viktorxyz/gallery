'use client'

import IconButton from '../IconButton'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Button from '../Button'
import createClient from '@/utils/supabase/client'
import cn from '@/utils/cn'

const supabase = createClient()

type ActionsProps = {
  className?: string
}

const Actions = ({ className }: ActionsProps) => {
  const router = useRouter()
  const [user, setUser] = useState(null)

  const signOut = async () => await supabase.auth.signOut()

  useEffect(() => {
    const getUser = async () => {
      const {
        data: { user }
      } = await supabase.auth.getUser()
      setUser(user)
    }

    const {
      data: { subscription }
    } = supabase.auth.onAuthStateChange((_event, session) => {
      setUser(session?.user || null)
    })

    getUser()

    return () => subscription.unsubscribe()
  }, [setUser])

  return (
    <div className={cn('flex items-end w-full', className)}>
      {user && <Button onClick={signOut}>Sign Out</Button>}
      <IconButton
        onClick={() => router.push('/dashboard')}
        icon="IconArrowRight"
        className="ml-auto"
      />
    </div>
  )
}

export default Actions
