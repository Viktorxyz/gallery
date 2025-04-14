'use client'

import createClient from '@/utils/supabase/client'
import React from 'react'

function SignOutButton() {
  const supabase = createClient()

  return <div onClick={() => supabase.auth.signOut()}>Sign Out</div>
}

export default SignOutButton
