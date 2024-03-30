import type { ITimestamp, TypeLocaleString } from "./common.interface"

export enum MenuType {
  ALWAYS = "ALWAYS",
  DEFINED_TIMES = "DEFINED_TIMES"
}

export enum MenuFrequency {
  NO_REPEAT = "NO_REPEAT",
  DAILY = "DAILY",
  WEEKLY = "WEEKLY"
}

export interface IMenu extends ITimestamp {
  _id: string
  uid: string
  type: MenuType
  restaurantUid: string
  nameOrigin: string
  descriptionOrigin: string
  name: TypeLocaleString<"name">[]
  description: TypeLocaleString<"description">[]
  startDate: string | null
  startTime: string
  endTime: string
  isWholeDay: boolean
  frequencyType: MenuFrequency
  frequency: number
  weekdays: number[]
  endDate: string | null
  isShowAfterEndDate: boolean
  sortValue: number
}

export interface IMenuWithIsActive extends IMenu {
  isActive: boolean
}
