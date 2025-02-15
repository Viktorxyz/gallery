import { ReactNode } from 'react'

const Main = ({ children }: { children: ReactNode }) => {
  return (
    <main className="grid min-h-screen relative bg-black font-extralight text-white">
      {children}
    </main>
  )
}

export default Main
