import React from 'react'
import Backdrop from './backdrop'
import { IconSearch } from '@/data/icons'
import Input from './input'

type KeywordProps = {
  keyword: string
}

const Keyword = ({ keyword }: KeywordProps) => {
  return <div className="h-12">{keyword}</div>
}

type SearchProps = {
  onBlur?: () => void
}

const Search = ({ onBlur }: SearchProps) => {
  return (
    <>
      <div className="fixed top-0 px-6 mt-8 w-full z-50">
        <div className="flex justify-between">
          <Input placeholder="Search by keyword..." onBlur={onBlur} autoFocus />
          <IconSearch className="size-6 fill-neutral-400" />
        </div>
        <div className="flex flex-col mt-8 text-white">
          <Keyword keyword={'viktor'} />
          <Keyword keyword={'jea'} />
          <Keyword keyword={'troll'} />
          <Keyword keyword={'tralalaa'} />
        </div>
      </div>
      <Backdrop className="z-40" />
    </>
  )
}

export default Search
