import { getParamsString } from "@/helpers/query-params"
import type { IDish } from "@/interfaces/dish.interface"
import { myFetch } from "../api"
import type { IDishGetAll } from "./dish.service.interface"

class DishService {
  URL = "/dish"

  async getAll({
    restaurantUid,
    isActive = true,
    limit = 100000,
    skip = 0
  }: IDishGetAll) {
    const params = getParamsString({ restaurantUid, isActive, limit, skip })

    try {
      const response = await myFetch<{ dishes: IDish[] }>(
        `${this.URL}?${params}`
      )
      return response
    } catch (e) {
      console.log(e)
      return null
    }
  }

  async getOne(uid: string) {
    try {
      const response = await myFetch<{ dishes: IDish[] }>(
        `${this.URL}?uid=${uid}`
      )
      return response
    } catch (e) {
      console.log(e)
      return null
    }
  }
}

const dishService = new DishService()
export default dishService
