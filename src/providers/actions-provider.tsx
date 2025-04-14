'use client'

import {
  createContext,
  Dispatch,
  ReactNode,
  SetStateAction,
  useCallback,
  useContext,
  useState
} from 'react'

export type ActionsContextType = {
  actions: Actions
  actionsHidden: boolean
  actionsClosed: boolean
  setActions: Dispatch<SetStateAction<Actions>>
  hideActions: () => void
  showActions: () => void
  closeActions: () => void
  openActions: () => void
}

const ActionsContext = createContext<null | ActionsContextType>(null)

type ActionsProviderProps = {
  children: ReactNode
}

type Actions = 'default' | 'selecting'

const ActionsProvider = ({ children }: ActionsProviderProps) => {
  const [actions, setActions] = useState<Actions>('default')
  const [actionsHidden, setActionsHidden] = useState(false)
  const [actionsClosed, setActionsClosed] = useState(false)

  const hideActions = useCallback(
    () => setActionsHidden(true),
    [setActionsHidden]
  )

  const showActions = useCallback(
    () => setActionsHidden(false),
    [setActionsHidden]
  )

  const closeActions = useCallback(
    () => setActionsClosed(true),
    [setActionsClosed]
  )

  const openActions = useCallback(
    () => setActionsClosed(false),
    [setActionsClosed]
  )

  const value = {
    actions,
    actionsHidden,
    actionsClosed,
    setActions,
    hideActions,
    showActions,
    closeActions,
    openActions
  }

  return <ActionsContext value={value}>{children}</ActionsContext>
}

export const useActions = () => useContext(ActionsContext) as ActionsContextType

export default ActionsProvider
