'use client'

import { createClient } from '@/utils/supabase/client'
import IconButton from '../IconButton'
import { useRouter } from 'next/navigation'
import { useEffect, useState } from 'react'
import Button from '../Button'

const Actions = () => {
  const router = useRouter()
  const supabase = createClient()
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
  }, [supabase.auth, setUser])

  return (
    <div className="flex items-end fixed p-6 bottom-0 w-full">
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
