'use server'

import createClient from '@/utils/supabase/server'

async function signIn() {
  const supabase = await createClient()
  try {
    const { data, error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: {
        redirectTo: `${process.env.SITE_URL}/auth/callback`
      }
    })

    if (error) throw error

    return {
      url: data.url,
      error
    }
  } catch (error) {
    return {
      error
    }
  }
}

export default signIn
