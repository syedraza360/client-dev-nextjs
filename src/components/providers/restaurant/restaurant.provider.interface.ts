import type { ICategory } from "@/interfaces/category.interface"
import type { IDish } from "@/interfaces/dish.interface"
import type { IMenuWithIsActive } from "@/interfaces/menu.interface"
import type { IRestaurant } from "@/interfaces/restaurant.interface"
import type { Dispatch, SetStateAction } from "react"

export interface IDishQuery {
  preferenceCategories: string[]
  subcategories: string[]
}

export type TypeCategoryMap = { [key: string]: boolean }

export type TypeRestaurantContextDishes = { [key: string]: IDish[] }

export interface IRestaurantContext {
  menus: IMenuWithIsActive[]
  activeMenuUid: string
  categories: ICategory[]
  categoryMap: TypeCategoryMap
  categoryMap2: TypeCategoryMap
  restaurant: IRestaurant | null
  category: string
  subCategory: string
  search: string
  dishes: TypeRestaurantContextDishes
  allDishes: IDish[]
  dishQuery: IDishQuery
  dish: IDish | null
  cart: any[]
  order: any
  getSortedMenus: (menus: IMenuWithIsActive[]) => IMenuWithIsActive[]
  setActiveMenuUid: Dispatch<SetStateAction<string>>
  setSearch: Dispatch<SetStateAction<string>>
  setDishQuery: Dispatch<SetStateAction<IDishQuery>>
  setDish: Dispatch<SetStateAction<IDish | null>>
  setMenu: (uid: string) => void
  addToCart: (item: any, quantity: number) => void
  getCartItem: (_id: string) => any
  updateCart: (item: IDish, update: any) => void
  setCategory: Dispatch<SetStateAction<string>>
  setSubCategory: Dispatch<SetStateAction<string>>
  updateOrder: (data: any) => void
  clearCart: () => void
}
