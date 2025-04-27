import Actions from '@/components/index/actions'
import Authentication from '@/components/index/authentication'
import { getUserWithRoles, hasPermission } from '@/lib/auth'
import Link from 'next/link'

async function Page() {
  const user = await getUserWithRoles()

  return (
    <>
      <div className="sticky top-0 flex flex-col p-6 items-end">
        <div className="flex justify-end gap-6">
          {hasPermission(user, 'galleries', 'read') && (
            <Link href="/dashboard">Dashboard</Link>
          )}
          <Authentication />
        </div>
      </div>
      <div className="fixed bottom-0 w-full h-[60vh] flex flex-col justify-between">
        <h1 className="text-6xl tracking-tighter text-center">Glimpsee</h1>
        <Actions />
      </div>
    </>
  )
}

export default Page
