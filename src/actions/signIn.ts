'use server'
import createClient from '@/utils/supabase/server'
import { redirect } from 'next/navigation'

const signIn = async (formData: FormData) => {
  const supabase = await createClient()

  const email = formData.get('email') as string
  const password = formData.get('password') as string

  await supabase.auth.signInWithPassword({
    email,
    password
  })

  redirect('/dashboard')
}

export default signIn
