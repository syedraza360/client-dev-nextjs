import type { ITimestamp, TypeLocaleString } from "./common.interface"

export interface ISubCategory {
  item: TypeLocaleString<"subCategory">[]
  nameOrigin: string
  uid: string
  sortValue: number
}

export interface ICategory extends ITimestamp {
  _id: string
  uid: string
  sortValue: number
  restaurantUid: string
  menuUid: string
  mainCategory: string
  titleOrigin: string
  descriptionOrigin: string
  title: TypeLocaleString<"title">[]
  description: TypeLocaleString<"description">[]
  subCategories: ISubCategory[]
}
