import type { IDefaultApiParams } from "../api"

export interface IDishGetAll extends IDefaultApiParams {
  isActive?: boolean
  restaurantUid: string
}
