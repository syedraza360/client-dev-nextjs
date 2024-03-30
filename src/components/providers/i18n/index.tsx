"use client"

import { getTranslations } from "@/helpers/utils"
import { useLocale } from "next-intl"
import type { FC, PropsWithChildren } from "react"
import { createContext, useContext, useEffect } from "react"
import type { II18nContext } from "./i18n.interface"
import { Locale } from "./i18n.interface"
import translations from "./translations.json"

const I18nContext = createContext({} as II18nContext)
export const useI18n = () => useContext(I18nContext)

const languages = translations?.map((d) => ({
  name: d.name,
  locale: d.locale as Locale,
  flag: d.flag,
  rtl: !!d.rtl
}))

export const I18nProvider: FC<PropsWithChildren> = ({ children }) => {
  const locale = useLocale() as Locale

  const yumzi = getTranslations()

  useEffect(() => {
    const language = languages.find((d) => d.locale === locale)
    if (!!language) {
      if (language?.rtl) {
        document.documentElement.dir = "rtl"
      } else {
        document.documentElement.dir = "ltr"
      }
    }
  }, [locale])

  const trans = yumzi.system
  const t: II18nContext["t"] = (key) => from(trans[key]) || key

  const from: II18nContext["from"] = (obj) => {
    return typeof obj === "object" ? obj[locale] || obj[Locale.DE] : obj
  }

  const find: II18nContext["find"] = (obj) => {
    return obj?.find((d) => d.code?.toLowerCase() === locale)
  }

  const value = {
    locale,
    languages,
    from,
    find,
    t
  }

  return <I18nContext.Provider value={value}>{children}</I18nContext.Provider>
}
export default I18nProvider
