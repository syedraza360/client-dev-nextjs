import type { LocaleUpperCase } from "@/components/providers/i18n/i18n.interface"

export interface ITimestamp {
  createAt: string
  updateAt: string
}

export enum Theme {
  LIGHT = "LIGHT",
  DARK = "DARK"
}

interface ILocaleString {
  _id: string
  code: LocaleUpperCase
}

export type TypeLocaleString<PropertyName extends string, T = string> = {
  [P in PropertyName]: T
} & ILocaleString

export enum ShowMode {
  LIST = "list",
  GRID = "grid"
}
