"use client"

import { QueryClient, QueryClientProvider } from "@tanstack/react-query"

import type { FC, PropsWithChildren } from "react"
import I18nProvider from "./i18n"
import RoutesHistoryProvider from "./routes-history.provider"

const queryClient = new QueryClient()

const Providers: FC<PropsWithChildren> = ({ children }) => {
  return (
    <QueryClientProvider client={queryClient}>
      <I18nProvider>
        <RoutesHistoryProvider>{children}</RoutesHistoryProvider>
      </I18nProvider>
    </QueryClientProvider>
  )
}

export default Providers
