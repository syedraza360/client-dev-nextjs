import type { Locale } from "@/components/providers/i18n/i18n.interface"
import type { ITimestamp, TypeLocaleString } from "./common.interface"

export enum RestaurantType {
  BROWSE = "BROWSE",
  ORDER = "ORDER"
}

export interface IRestaurantAddress {
  country: string
  city: string
  street: string
  zip: string
}

export interface IRestaurantSettings {
  isAutoTranslate: boolean
  guestsDefaultLanguage: Locale
  showPrice: boolean
  showCurrency: boolean
  currency: {
    code: string
    symbol: string
  }
}

export interface IRestaurant<RS = string> extends ITimestamp {
  uid: string
  userId: string
  plainPassword?: string
  password: string
  name: string
  descriptionOrigin: string
  description: TypeLocaleString<"description">
  phoneNumber?: string
  address: IRestaurantAddress
  slug: string
  coverImage?: {
    mobile?: string
    desktop?: string
  }
  logoImage?: {
    mobile?: string
    desktop?: string
  }
  recentSearches: RS[]
  yumziProduct: RestaurantType
  tags: string[]
  settings: IRestaurantSettings
}
