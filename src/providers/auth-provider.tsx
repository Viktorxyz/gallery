'use client'

import { UserWithRoles } from '@/types/auth'
import createClient from '@/utils/supabase/client'
import { AuthError } from '@supabase/supabase-js'
import {
  createContext,
  PropsWithChildren,
  useCallback,
  useContext,
  useEffect,
  useState
} from 'react'

type AuthContextType = {
  user: UserWithRoles | null
  signOut: () => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType | null>(null)

type AuthProviderProps = PropsWithChildren<{
  user: UserWithRoles | null
}>

function AuthProvider({ children, user: initialUser }: AuthProviderProps) {
  const supabase = createClient()
  const [user, setUser] = useState<UserWithRoles | null>(initialUser)

  const signOut = useCallback(
    async () => await supabase.auth.signOut(),
    [supabase.auth]
  )

  useEffect(() => {
    const { data } = supabase.auth.onAuthStateChange((event) => {
      if (event === 'SIGNED_OUT') {
        setUser(null)
      }
    })

    return () => data.subscription.unsubscribe()
  }, [supabase.auth])

  const value: AuthContextType = {
    user,
    signOut
  }

  return <AuthContext value={value}>{children}</AuthContext>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) throw new Error('Missing AuthProvider!')
  return context
}

export default AuthProvider
