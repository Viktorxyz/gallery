'use client'

import SignOutButton from './sign-out-button'
import Link from 'next/link'
import { useAuth } from '@/providers/auth-provider'

function Authentication() {
  const { user } = useAuth()

  if (user) return <SignOutButton />
  else return <Link href="/sign-in">Sign In</Link>
}

export default Authentication
