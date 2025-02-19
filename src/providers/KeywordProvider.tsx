'use client'

import useUserStore from '@/stores/userStore'
import createClient from '@/utils/supabase/client'
import React, { createContext, ReactNode, useContext, useEffect } from 'react'

type KeywordContextType = {}

const KeywordContext = createContext<KeywordContextType>(null)

type KeywordProviderProps = {
  children: ReactNode
}

const supabase = createClient()

const KeywordProvider = ({ children }: KeywordProviderProps) => {
  const { setKeyword, keywordId } = useUserStore()

  useEffect(() => {
    const checkKeyword = async () => {
      const { data, error } = await supabase
        .from('keywords')
        .select('*')
        .eq('keyword_id', keywordId)
      if (!data[0]) setKeyword({ keyword: null, keywordId: null })
    }
    if (keywordId) checkKeyword()
  }, [keywordId])

  const value = {}

  return <KeywordContext value={value}>{children}</KeywordContext>
}

export const useKeyword = () => useContext(KeywordContext)

export default KeywordProvider
