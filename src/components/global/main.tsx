import { ReactNode } from 'react'

const Main = ({ children }: { children: ReactNode }) => {
  return (
    <main className="flex flex-col relative min-h-screen bg-black text-white">
      {children}
    </main>
  )
}

export default Main
