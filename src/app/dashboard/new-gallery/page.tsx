import Form from '@/components/new-gallery/Form'
import TopBar from '@/components/TopBar'

const Page = () => {
  return (
    <div className="flex flex-col mx-6 mt-6">
      <TopBar title="New gallery" />
      <Form />
    </div>
  )
}

export default Page
