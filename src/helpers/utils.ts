import type {
  Locale,
  LocaleUpperCase
} from "@/components/providers/i18n/i18n.interface"
import yumzi from "@/data/yumzi.json"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export const translateFromObject = (
  obj: any,
  lang: Locale | LocaleUpperCase,
  value = "value"
) => {
  if (typeof obj === "string") {
    return obj
  }
  if (Array.isArray(obj)) {
    return (
      obj.find((o) => o.code?.toLowerCase() === lang?.toLowerCase())?.[value] ||
      ""
    )
  }
  if (typeof obj === "object") {
    return obj[lang] || ""
  }
  return ""
}

export const getTranslations = () => {
  return yumzi
}

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
