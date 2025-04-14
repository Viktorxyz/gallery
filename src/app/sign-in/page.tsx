'use client'

import signIn from '@/actions/sign-in'
import Button from '@/components/button'
import TopBar from '@/components/topbar'
import { useRouter } from 'next/navigation'
import { useTransition } from 'react'

function Page() {
  const router = useRouter()
  const [isPending, startTransition] = useTransition()

  const handleClick = () => {
    startTransition(async () => {
      const { url, error } = await signIn()

      if (url && !error) {
        router.push(url)
      }
    })
  }

  return (
    <>
      <TopBar title="Sign In" className="sticky top-0 p-6" />
      <div className="flex justify-center fixed bottom-0 w-full p-6">
        <Button onClick={handleClick} className="flex-1">
          {isPending ? '...' : 'Continue with Google'}
        </Button>
      </div>
    </>
  )
}

export default Page
