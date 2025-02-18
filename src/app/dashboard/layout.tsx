import createClient from '@/utils/supabase/server'
import { redirect } from 'next/navigation'
import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

const layout = async ({ children }: Props) => {
  const supabase = await createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (!user) redirect('/sign-in')

  return children
}

export default layout
