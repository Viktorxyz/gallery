'use client'

import Actions from '@/components/index/Actions'
import Loading from '@/components/index/Loading'
import createClient from '@/utils/supabase/client'
import { User } from '@supabase/supabase-js'
import { useEffect, useState } from 'react'

const supabase = createClient()

function Page() {
  const [user, setUser] = useState<User>()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const getUser = async () => {
      const { data } = await supabase.auth.getUser()
      if (data.user) setUser(data.user)
      setIsLoading(false)
    }

    const { data } = supabase.auth.onAuthStateChange((_, session) => {
      setUser(session?.user)
    })

    getUser()

    return () => data.subscription.unsubscribe()
  }, [])

  const signOut = async () => await supabase.auth.signOut()

  if (isLoading) return <Loading />

  return (
    <>
      <div className="flex-1 flex text-7xl tracking-tighter items-center justify-center">
        Glimpsee
      </div>
      <Actions signOut={signOut} user={user} className="fixed p-6 bottom-0" />
    </>
  )
}

export default Page
