import type { IDefaultApiParams } from "../api"

export interface IRestaurantGetAll extends IDefaultApiParams {
  isActive?: boolean
}

export interface IRestaurantGetCategories extends IDefaultApiParams {
  restaurantUid: string
}

export interface IRestaurantGetMenus extends IDefaultApiParams {
  restaurantUid: string
}
