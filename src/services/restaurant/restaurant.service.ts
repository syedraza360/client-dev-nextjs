import { getParamsString } from "@/helpers/query-params"
import type { ICategory } from "@/interfaces/category.interface"
import { IMenuWithIsActive } from "@/interfaces/menu.interface"
import type { IRestaurant } from "@/interfaces/restaurant.interface"
import { myFetch } from "../api"
import type {
  IRestaurantGetAll,
  IRestaurantGetCategories,
  IRestaurantGetMenus
} from "./restaurant.service.interface"

class RestaurantService {
  URL = "/restaurant"
  MENU_URL = "/menu"
  CATEGORY_URL = "/category"

  async getAll({
    isActive = true,
    limit = 100000,
    skip = 0
  }: IRestaurantGetAll) {
    const params = getParamsString({ isActive, limit, skip })

    try {
      const response = await myFetch<{ restaurants: IRestaurant[] }>(
        `${this.URL}?${params}`
      )
      return response
    } catch (e) {
      console.log(e)
      return null
    }
  }

  async getOne(slug: string) {
    try {
      const response = await myFetch<{ restaurants: IRestaurant[] }>(
        `${this.URL}?slug=${slug}`
      )
      return response
    } catch (e) {
      console.log(e)
      return null
    }
  }

  async getCategories({
    restaurantUid,
    limit = 1000,
    skip = 0
  }: IRestaurantGetCategories) {
    const params = getParamsString({ restaurantUid, limit, skip })

    try {
      const response = await myFetch<{ categories: ICategory[] }>(
        `${this.CATEGORY_URL}?${params}`
      )
      return response
    } catch (e) {
      console.log(e)
      return null
    }
  }

  async getMenus({
    restaurantUid,
    limit = 100000,
    skip = 0
  }: IRestaurantGetMenus) {
    const params = getParamsString({ restaurantUid, limit, skip })

    try {
      const response = await myFetch<{ menus: IMenuWithIsActive[] }>(
        `${this.MENU_URL}?${params}`
      )
      return response
    } catch (e) {
      console.log(e)
      return null
    }
  }
}

const restaurantService = new RestaurantService()
export default restaurantService
