import Galleries from '@/components/index/Galleries'
import TopBar from '@/components/TopBar'
import createClient from '@/utils/supabase/server'
import React from 'react'

const supabase = await createClient()

const Page = async () => {
  const { data, error } = await supabase
    .from('galleries')
    .select('gallery_id,gallery_name')

  const galleries = data.map((gallery) => ({
    id: gallery.gallery_id,
    name: gallery.gallery_name
  }))

  return (
    <div className="flex flex-col mx-6 mt-6">
      <TopBar title="Galleries" className="sticky top-6" />
      <Galleries galleries={galleries} />
    </div>
  )
}

export default Page
