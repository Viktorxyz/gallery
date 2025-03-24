'use client'

import ToastRefreshImages from '@/components/gallery/ToastRefreshImages'
import {
  createContext,
  ReactNode,
  useCallback,
  useContext,
  useState
} from 'react'

export type ToastContextType = {
  toastHidden: boolean
  showToast: () => void
  hideToast: () => void
}

const ToastContext = createContext<null | ToastContextType>(null)

type ToastProviderProps = {
  children: ReactNode
}

const ToastProvider = ({ children }: ToastProviderProps) => {
  const [toastHidden, setToastHidden] = useState(true)

  const showToast = useCallback(() => setToastHidden(false), [setToastHidden])
  const hideToast = useCallback(() => setToastHidden(true), [setToastHidden])

  const value = {
    toastHidden,
    showToast,
    hideToast
  }

  return (
    <ToastContext value={value}>
      {children}
      {!toastHidden && <ToastRefreshImages />}
    </ToastContext>
  )
}

export const useToast = () => useContext(ToastContext)

export default ToastProvider
