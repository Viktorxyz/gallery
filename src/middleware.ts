import { NextResponse, type NextRequest } from 'next/server'
import createClient from './utils/supabase/server'

export async function middleware(req: NextRequest) {
  const supabase = await createClient()

  const {
    data: { user }
  } = await supabase.auth.getUser()

  if (req.nextUrl.pathname.startsWith('/dashboard') && !user) {
    NextResponse.redirect(new URL('/sign-in', req.url))
  }
}

export const config = {
  matcher: ['/dashboard/:path*']
}
