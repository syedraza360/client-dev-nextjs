"use client"

import { createContext, useContext } from "react"
import type { IRestaurantContext } from "./restaurant.provider.interface"

import type {
  IDishQuery,
  TypeCategoryMap,
  TypeRestaurantContextDishes
} from "@/components/providers/restaurant/restaurant.provider.interface"
import type { ICategory } from "@/interfaces/category.interface"
import type { IDish } from "@/interfaces/dish.interface"
import type { IRestaurant } from "@/interfaces/restaurant.interface"
import { RestaurantType } from "@/interfaces/restaurant.interface"
import type { FC, PropsWithChildren } from "react"
import { useCallback, useEffect, useMemo, useState } from "react"

import { useScreenSize } from "@/hooks/useScreenSize"
import { MenuType, type IMenuWithIsActive } from "@/interfaces/menu.interface"
import gsap from "gsap"
import { ScrollTrigger } from "gsap/dist/ScrollTrigger"
import { useParams, useSearchParams } from "next/navigation"
import { filterDishes } from "./filter-dishes"

gsap.registerPlugin(ScrollTrigger)

const RestaurantContext = createContext({} as IRestaurantContext)
export const useRestaurant = () => useContext(RestaurantContext)

interface IRestaurantProvider {
  restaurant: IRestaurant
  menus: IMenuWithIsActive[]
  categories: ICategory[]
  allDishes: IDish[]
}

const RestaurantProvider: FC<PropsWithChildren<IRestaurantProvider>> = ({
  children,
  restaurant,
  menus,
  categories,
  allDishes
}) => {
  const params = useParams()
  const searchParams = useSearchParams()
  const dishId = searchParams.get("dishId")

  const { isMobile } = useScreenSize()

  const [search, setSearch] = useState("")

  const getActiveMenu = useCallback(() => {
    return menus
      .filter((menu) => menu.isActive)
      .sort((a, b) => {
        if (a.endTime && b.endTime) {
          const aTime = new Date()
          aTime.setHours(+a.endTime.split(":")[0], +a.endTime.split(":")[1], 0)
          const bTime = new Date()
          bTime.setHours(+b.endTime.split(":")[0], +b.endTime.split(":")[1], 0)
          return aTime.getTime() - bTime.getTime()
        } else if (!a.endTime && b.endTime) {
          return 1
        } else if (a.endTime && !b.endTime) {
          return -1
        } else {
          return 0
        }
      })
  }, [menus])

  const [activeMenuUid, setActiveMenuUid] = useState(
    () => getActiveMenu()[0]?.uid
  )
  const [category, setCategory] = useState("")
  const [subCategory, setSubCategory] = useState("")
  const [categoryMap, setCategoryMap] = useState<TypeCategoryMap>({})
  const [categoryMap2, setCategoryMap2] = useState<TypeCategoryMap>({})

  const [dishes, setDishes] = useState<TypeRestaurantContextDishes>({})
  const [dishQuery, setDishQuery] = useState<IDishQuery>({
    preferenceCategories: [],
    subcategories: []
  })
  const [dish, setDish] = useState<IDish | null>(null)

  const [cart, setCart] = useState<any[]>([])
  const [order, setOrder] = useState({
    note: "",
    tip: 15
  })

  useEffect(() => {
    // if there is a dishId in the url, set the dish
    if (dishId && dish?.uid !== dishId) {
      const foundDish = allDishes?.find((d) => d.uid === dishId)
      if (foundDish) {
        setDish(foundDish)
      }
    }
  }, [dishId])

  useEffect(() => {
    const dishes: TypeRestaurantContextDishes = {}
    const categoryMap: TypeCategoryMap = {}
    const categoryMap2: TypeCategoryMap = {}
    filterDishes(
      dishQuery.preferenceCategories,
      allDishes.filter((d) => d?.menu === activeMenuUid)
    )
      ?.filter((d) => {
        const find = categories
          ?.filter((c) => c.menuUid === activeMenuUid)
          .find((c) => c?.uid === d?.category)
        categoryMap[d?.category] = true
        categoryMap[d?.subcategory] = true
        if (!find) {
          return false
        }

        if (
          dishQuery?.subcategories?.length > 0 &&
          !dishQuery?.subcategories?.includes(d?.subcategory)
        ) {
          return false
        }
        if (
          !!search &&
          !d?.name?.find((d) =>
            d?.name?.toLowerCase()?.includes(search?.toLowerCase())
          )
        ) {
          return false
        }
        categoryMap2[d?.category] = true
        categoryMap2[d?.subcategory] = true
        return true
      })
      .forEach((dish) => {
        if (!dishes[dish?.category]) {
          dishes[dish?.category] = []
        }
        dishes[dish?.category].push(dish)
      })
    setDishes(dishes)
    setCategoryMap(categoryMap)
    setCategoryMap2(categoryMap2)
  }, [dishQuery, allDishes, activeMenuUid, categories, search])

  useEffect(() => {
    const cart = localStorage.getItem("cart")
    if (!!cart) {
      setCart(JSON.parse(cart))
    }
    const order = localStorage.getItem("order")
    if (!!order) {
      setOrder(JSON.parse(order))
    }
  }, [])

  useEffect(() => {
    ScrollTrigger.refresh()
  }, [restaurant?.uid, activeMenuUid, search, dishes, isMobile])

  const getSortedMenus = useCallback((menus: IMenuWithIsActive[]) => {
    return menus
      .filter(
        (menu) => menu.isActive || (!menu.isActive && menu.isShowAfterEndDate)
      )
      .sort((a) => (a.type === MenuType.DEFINED_TIMES ? -1 : 1))
      .sort((a, b) => a.sortValue - b.sortValue)
  }, [])

  const updateOrder = useCallback(
    (data: any) => {
      const d = { ...order, ...data }
      setOrder(d)
      localStorage.setItem("order", JSON.stringify(d))
    },
    [order]
  )

  const setMenu = useCallback(
    (uid: string) => {
      const firstCategory = categories
        .filter((cat) => cat.menuUid === uid)
        ?.sort((a, b) => a.sortValue - b.sortValue)[0]

      setActiveMenuUid(uid)
      setCategory(isMobile ? firstCategory.uid : "")
      setSearch("")
      setDishQuery({
        preferenceCategories: [],
        subcategories: []
      })

      setTimeout(() => {
        if (isMobile) {
          window.scrollTo(0, 0)
        } else {
          const desktopMainWindow = document.getElementById(
            "main-window-desktop"
          )
          desktopMainWindow?.scrollTo({
            top: 0,
            behavior: "smooth"
          })
        }
      }, 100)
    },
    [categories, isMobile]
  )

  const addToCart = useCallback(
    (item: any, quantity = 1) => {
      const find = cart.find((d) => d._id === item._id)
      if (find) {
        find.quantity = find.quantity + quantity
      } else {
        item.quantity = quantity
        cart.push(item)
      }
      const cartData = cart?.filter(
        (d) => d.quantity > 0 && d?.restaurantUid === params?.uid
      )
      localStorage.setItem("cart", JSON.stringify(cartData))
      setCart([...cartData])
    },
    [cart, params?.uid]
  )

  const updateCart = useCallback(
    (item: IDish, update: any) => {
      const find = cart.find((d) => d._id === item._id)
      update.variation !== undefined && (find.variation = update.variation)
      update.extras !== undefined && (find.extras = update.extras)
      update.note !== undefined && (find.note = update.note)
      localStorage.setItem("cart", JSON.stringify(cart))
      setCart([...cart])
    },
    [cart]
  )

  const getCartItem = useCallback(
    (_id: string) => cart.find((d) => d._id === _id),
    [cart]
  )

  useEffect(() => {
    document.body.classList.add(
      restaurant?.yumziProduct === RestaurantType.BROWSE
        ? "browse-view"
        : "order-view"
    )
  }, [restaurant])

  const clearCart = useCallback(() => {
    localStorage.removeItem("cart")
    localStorage.removeItem("order")
    setCart([])
    setOrder({
      note: "",
      tip: 15
    })
  }, [])

  const memorizedValue = useMemo(
    () => ({
      menus,
      activeMenuUid,
      categories,
      categoryMap,
      categoryMap2,
      restaurant,
      category,
      subCategory,
      search,
      dishes,
      allDishes,
      dishQuery,
      dish,
      order,
      cart,
      getSortedMenus,
      setActiveMenuUid,
      setCategory,
      setSubCategory,
      setSearch,
      setDishQuery,
      setDish,
      setMenu,
      addToCart,
      getCartItem,
      updateCart,
      updateOrder,
      clearCart
    }),
    [
      menus,
      activeMenuUid,
      categories,
      categoryMap,
      categoryMap2,
      restaurant,
      category,
      subCategory,
      search,
      dishes,
      allDishes,
      dishQuery,
      dish,
      cart,
      order,
      getSortedMenus,
      setMenu,
      addToCart,
      clearCart,
      updateCart,
      getCartItem,
      updateOrder
    ]
  )

  return (
    <RestaurantContext.Provider value={memorizedValue}>
      {children}
    </RestaurantContext.Provider>
  )
}

export default RestaurantProvider
