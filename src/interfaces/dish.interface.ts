import type { ITimestamp, TypeLocaleString } from "./common.interface"

export interface IDishExtra {
  _id: string
  name: TypeLocaleString<"name">[]
  price: number
}

export interface IDishVariation {
  _id: string
  name: TypeLocaleString<"name">[]
  price: number
}

export interface IDishRecipe {
  ingredient: string
  quantity: number
  unit: string
}

export interface IDishRecommendation {
  category: string
  dishes: string[]
}

export interface IDish extends ITimestamp {
  _id: string
  uid: string
  restaurantUid: string
  nameOrigin: string
  descriptionOrigin: string
  name: TypeLocaleString<"name">[]
  description: TypeLocaleString<"description">[]
  allergens: string[]
  preferenceCategory: string[]
  menu: string
  category: string
  subcategory: string
  price: string | number
  extras: IDishExtra[]
  variations: IDishVariation[]
  recommendations: IDishRecommendation[]
  thirsty: string
  sides: string
  dessert: string
  appetizers: string
  recipe?: IDishRecipe[]
  images: string[]
  calories: number
  carbohydrate: number
  fats: number
  protein: number
  sugar: number | null
  fattyAcids: number | null
  salt: number | null
  isPromotion?: boolean
  isActive: boolean
  short_allergens: string
  isNoAllergens: boolean
  isSpicy: boolean
  isVegetarian: boolean
  isVegan: boolean
  isDiscount: boolean
  isSugarFree: boolean
  isAlcoholFree: boolean
  isHistamineFree: boolean
  isNewDish: boolean
  reducedPrice: number
  sortValue: number
  draft: boolean
  nutritionalInfoUpdatedAt: string
}
