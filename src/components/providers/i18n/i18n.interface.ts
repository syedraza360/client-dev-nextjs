import type yumzi from "../../../data/yumzi.json"

export interface II18nContextLanguage {
  name: string
  locale: Locale
  flag: string
  rtl: boolean
}

export interface II18nContext {
  locale: Locale
  languages: II18nContextLanguage[]
  from: (obj: TypeI18nVariants | string) => string
  find: <T extends { code: LocaleUpperCase }>(obj: T[]) => T | undefined
  t: (key: TypeI18nVariantsSystem) => string
}

export type TypeI18nVariants = {
  [key in Locale]: string
}

export type TypeI18nVariantsSystem = keyof typeof yumzi.system

export enum Locale {
  DE = "de",
  EN = "en",
  ES = "es",
  AR = "ar",
  ZH = "zh",
  IT = "it",
  FR = "fr",
  RU = "ru"
}

export enum LocaleUpperCase {
  DE = "DE",
  EN = "EN",
  ES = "ES",
  AR = "AR",
  ZH = "ZH",
  IT = "IT",
  FR = "FR",
  RU = "RU"
}
