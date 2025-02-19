'use client'

import useUserStore from '@/stores/userStore'
import createClient from '@/utils/supabase/client'
import React, { createContext, ReactNode, useContext, useEffect } from 'react'

type KeywordContextType = object

const KeywordContext = createContext<KeywordContextType>(null)

type KeywordProviderProps = {
  children: ReactNode
}

const supabase = createClient()

const KeywordProvider = ({ children }: KeywordProviderProps) => {
  const { reset, keywordId } = useUserStore()

  useEffect(() => {
    const checkKeyword = async () => {
      const { data } = await supabase
        .from('keywords')
        .select('*')
        .eq('keyword_id', keywordId)
      if (!data[0]) reset()
    }
    if (keywordId) checkKeyword()
  }, [keywordId, reset])

  const value = {}

  return <KeywordContext value={value}>{children}</KeywordContext>
}

export const useKeyword = () => useContext(KeywordContext)

export default KeywordProvider
