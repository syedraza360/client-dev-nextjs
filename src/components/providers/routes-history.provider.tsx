"use client"

import { usePathname } from "next/navigation"
import type { FC, PropsWithChildren } from "react"
import { createContext, useContext, useEffect, useState } from "react"

const RoutesHistoryContext = createContext([] as string[])
export const useRoutesHistory = () => useContext(RoutesHistoryContext)

const RoutesHistoryProvider: FC<PropsWithChildren> = ({ children }) => {
  const pathname = usePathname()
  const [routes, setRoutes] = useState<string[]>([])

  useEffect(() => {
    if (!routes.some((route) => route === location.pathname)) {
      setRoutes([...routes, location.pathname])
    }
  }, [pathname, routes])

  return (
    <RoutesHistoryContext.Provider value={routes}>
      {children}
    </RoutesHistoryContext.Provider>
  )
}

export default RoutesHistoryProvider
