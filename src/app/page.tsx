import Actions from '@/components/index/actions'
import Authentication from '@/components/index/authentication'
import createClient from '@/utils/supabase/server'
import Link from 'next/link'

async function Page() {
  const supabase = await createClient()
  const {
    data: { user }
  } = await supabase.auth.getUser()
  const { data: roleData } = await supabase
    .from('user_roles')
    .select('role')
    .eq('user_id', user?.id)

  return (
    <>
      <div className="sticky top-0 flex flex-col p-6 items-end">
        <div className="flex justify-end gap-6">
          {roleData?.find(({ role }) => role === 'ADMIN') && (
            <Link href="/dashboard">Dashboard</Link>
          )}
          <Authentication initialUser={user} />
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
