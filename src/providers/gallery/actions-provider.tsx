import React, { createContext, useContext, useRef } from 'react'
import { useStore } from 'zustand'

interface ActionsProps {
  selected: number[]
}

const ActionsContext = createContext<ActionsStore>()

const ActionsProvider = ({ children, ...props }: ActionsProviderProps) => {
  const storeRef = useRef<ActionsStore>()

  if (!storeRef.current) storeRef.current = createActionsStore(props)

  return <ActionsContext value={storeRef.current}>{children}</ActionsContext>
}

export function useActions<T>(selector: (state: ActionsStore) => T): T {
  const store = useContext(ActionsContext)
  if (!store) throw new Error('Missing ActionsProvider in the tree')
  return useStore(store, selector)
}

export default ActionsProvider
