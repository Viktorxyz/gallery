import { ReactNode } from 'react'
import ReactQueryProvider from './react-query-provider'
import AuthProvider from './auth-provider'
import { getUserWithRoles } from '@/lib/auth'

async function Providers({ children }: { children: ReactNode }) {
  const user = await getUserWithRoles()
  return (
    <ReactQueryProvider>
      <AuthProvider user={user}>{children}</AuthProvider>
    </ReactQueryProvider>
  )
}

export default Providers
