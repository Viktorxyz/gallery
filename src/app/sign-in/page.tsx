import signIn from '@/actions/signIn'
import IconButton from '@/components/IconButton'
import Input from '@/components/Input'
import TopBar from '@/components/TopBar'
import React from 'react'

const page = () => {
  return (
    <div className="flex flex-col m-6">
      <TopBar title="Sign In" />
      <form action={signIn} className="flex-1 flex flex-col justify-end gap-16">
        <div className="flex flex-col gap-6">
          <Input name="email" variant="line" placeholder="email" />
          <Input
            name="password"
            variant="line"
            placeholder="password"
            type="password"
          />
        </div>
        <IconButton
          type="submit"
          className="w-max text-black px-5 gap-2 self-end"
          icon="IconCheck"
        />
      </form>
    </div>
  )
}

export default page
