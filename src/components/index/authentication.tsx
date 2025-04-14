'use client'

import { useEffect, useState } from 'react'
import SignOutButton from './sign-out-button'
import Link from 'next/link'
import { User } from '@supabase/supabase-js'
import createClient from '@/utils/supabase/client'

type AuthenticationProps = {
  initialUser: User | null
}

function Authentication({ initialUser }: AuthenticationProps) {
  const supabase = createClient()
  const [user, setUser] = useState(initialUser)

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === 'INITIAL_SESSION') {
        if (session?.user) setUser(session.user)
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })

    return () => data.subscription.unsubscribe()
  }, [supabase.auth])

  if (user) return <SignOutButton />
  else return <Link href="/sign-in">Sign In</Link>
}

export default Authentication
