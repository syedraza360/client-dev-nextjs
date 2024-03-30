import { useI18n } from "@/components/providers/i18n"
import { useRestaurant } from "@/components/providers/restaurant/restaurant.provider"
import ItemLoading from "@/components/screens/item/components/item-loading"
import { useFindCategory } from "@/components/screens/item/useFindCategory"
import ImageOrVideo from "@/components/ui/image-or-video/image-or-video"
import { cn } from "@/helpers/utils"
import type { ICategory } from "@/interfaces/category.interface"
import type { IDish } from "@/interfaces/dish.interface"
import { useVariables } from "@/store/use-variables"
import { useRouter } from "next/navigation"
import {
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type FC
} from "react"
import { createPortal } from "react-dom"
import Highlighter from "react-highlight-words"
import { HiOutlineChevronLeft } from "react-icons/hi"
import { IoCloseCircleOutline } from "react-icons/io5"
import { useShallow } from "zustand/react/shallow"

interface IOptionsSearch {
  isShow: boolean
  setIsShow: (value: boolean) => void
}

const OptionsSearch: FC<IOptionsSearch> = ({ isShow, setIsShow }) => {
  const inputRef = useRef<HTMLInputElement>(null)

  const { searchDishId, searchDishText, setSearchDishId, setSearchDishText } =
    useVariables(useShallow((state) => state))

  const { search, setSearch } = useRestaurant()
  const i18n = useI18n()

  const isText = search.length > 0

  useLayoutEffect(() => {
    if (searchDishText && !isShow) {
      setSearch(searchDishText)
      setSearchDishText("")
      setIsShow(true)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchDishText])

  useEffect(() => {
    if (searchDishId && isShow) {
      const dish = document.getElementById(`search-dish-${searchDishId}`)

      if (dish) {
        dish.scrollIntoView({ block: "center" })
      }

      setSearchDishId(null)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isShow])

  const handleSearch = (value: string) => {
    setSearch(value)
  }

  return createPortal(
    <div
      autoFocus
      className={cn(
        "fixed left-0 top-0 z-[1000] h-full w-full overflow-y-auto bg-white pt-[67px]",
        isShow ? "opacity-100" : "pointer-events-none opacity-0"
      )}
    >
      <div className="fixed left-0 top-0 z-10 flex w-full items-center gap-2 border-b border-b-black/5 bg-white p-4 pb-3 duration-300">
        <button
          className="flex h-6 w-6 items-center justify-center"
          onClick={() => {
            handleSearch("")
            setIsShow(false)
          }}
        >
          <HiOutlineChevronLeft size={20} className="text-black/70" />
        </button>
        <div className="relative flex-1">
          {/* To trigger auto focus */}
          {isShow && (
            <input
              ref={inputRef}
              type="text"
              autoFocus
              value={search}
              onChange={(e) => handleSearch(e.target.value)}
              className="h-[38px] w-full rounded-[28px] bg-dark-bg2 px-3.5 text-11 font-medium text-black/60 placeholder:text-black/60"
              placeholder={i18n.t("Search for article")}
            />
          )}
          <button
            className={cn(
              "absolute right-3.5 top-1/2 -translate-y-1/2 duration-100",
              !isText && "pointer-events-none opacity-0"
            )}
            onClick={() => {
              handleSearch("")
              inputRef.current?.focus()
            }}
          >
            <IoCloseCircleOutline size={20} className="text-black/70" />
          </button>
        </div>
      </div>
      <Categories />
    </div>,
    document.body
  )
}

const Categories = () => {
  const { categories, categoryMap2 } = useRestaurant()

  return (
    <div className="flex flex-col gap-4 p-4">
      {categories
        ?.filter((d) => !!categoryMap2[d.uid])
        ?.sort((a, b) => a.sortValue - b.sortValue)
        ?.map((category, index) => (
          <Category key={index} category={category} />
        ))}
    </div>
  )
}

interface ICategoryProps {
  category: ICategory
}

const Category: FC<ICategoryProps> = ({ category }) => {
  const { search, dishes, restaurant } = useRestaurant()

  const i18n = useI18n()

  const subCategories = category.subCategories?.map((sub) => sub.uid)

  const dishesWithoutSubCategory = useMemo(() => {
    return dishes[category.uid]?.filter((dish) => {
      const dishName = restaurant?.settings.isAutoTranslate
        ? i18n.find(dish.name)?.name
        : dish?.nameOrigin

      return (
        !subCategories.includes(dish.subcategory) &&
        search.length > 0 &&
        dishName?.toLowerCase().includes(search.toLowerCase())
      )
    })
  }, [
    category.uid,
    dishes,
    subCategories,
    search,
    restaurant?.settings.isAutoTranslate,
    i18n
  ])

  const dishesWithSubCategory = useMemo(() => {
    const filteredDishes = dishes[category.uid]?.filter((dish) =>
      subCategories.includes(dish.subcategory)
    )

    return category.subCategories.map((sub) => {
      const dishes = filteredDishes?.filter((dish) => {
        const dishName = restaurant?.settings.isAutoTranslate
          ? i18n.find(dish.name)?.name
          : dish?.nameOrigin

        return (
          dish.subcategory === sub.uid &&
          search.length > 0 &&
          dishName?.toLowerCase().includes(search.toLowerCase())
        )
      })

      return {
        name: i18n.find(sub.item)?.subCategory,
        dishes
      }
    })
  }, [
    category.uid,
    category.subCategories,
    dishes,
    subCategories,
    restaurant?.settings.isAutoTranslate,
    search,
    i18n
  ])

  return (
    <div>
      {dishesWithoutSubCategory.length > 0 && (
        <>
          <p className="font-semibold text-black">
            {i18n.find(category?.title)?.title}
          </p>
          <ul className="mt-4 flex flex-col gap-1">
            {dishesWithoutSubCategory.map((item, index) => (
              <li key={index}>
                <Dish item={item} />
              </li>
            ))}
          </ul>
        </>
      )}
      <ul className="flex flex-col gap-4">
        {dishesWithSubCategory.map((subCategory, index) =>
          subCategory.dishes.length > 0 ? (
            <li key={index}>
              <p className="font-semibold text-black">{subCategory.name}</p>{" "}
              <ul className="mt-4 flex flex-col gap-1">
                {subCategory.dishes.map((item, index) => (
                  <li key={index}>
                    <Dish item={item} />
                  </li>
                ))}
              </ul>
            </li>
          ) : null
        )}
      </ul>
    </div>
  )
}

interface IDishProps {
  item: IDish
}

const Dish: FC<IDishProps> = ({ item }) => {
  const [isDishPageLoading, setIsDishPageLoading] = useState(false)

  const [setSearchDishId, setSearchDishText] = useVariables((state) => [
    state.setSearchDishId,
    state.setSearchDishText
  ])

  const { push } = useRouter()
  const { search, restaurant, allDishes, categories } = useRestaurant()

  const i18n = useI18n()

  const restaurantSettings = restaurant?.settings

  const name = restaurant?.settings.isAutoTranslate
    ? i18n.find(item.name)?.name
    : item?.nameOrigin
  const description = i18n.find(item?.description)?.description
  const { category } = useFindCategory(item, categories)

  const similarDishesLength = useMemo(() => {
    const length = allDishes.filter(
      (d) =>
        (d?.subcategory === category?.uid || d?.category === category?.uid) &&
        item?.uid !== d?.uid
    ).length

    if (length < 4) return length
    return 4
  }, [allDishes, category, item?.uid])

  const recommendations = useMemo(
    () => item.recommendations.map((rec) => rec.dishes.length),
    [item.recommendations]
  )

  const onDishClick = async () => {
    document.body.style.overflow = "hidden"
    setIsDishPageLoading(true)
    setSearchDishText(search)
    setSearchDishId(item.uid)
    push(
      `/${restaurant?.slug}/${item.uid}?name=${name}&description=${description}&price=${item.price}&currency=${restaurantSettings?.currency?.symbol}&reducedPrice=${item.reducedPrice}&showPrice=${restaurantSettings?.showPrice}&showCurrency=${restaurantSettings?.showCurrency}&isDiscount=${item.isDiscount}&similarDishes=${similarDishesLength}&recommendations=${recommendations.join(",")}`
    )
  }

  return (
    <div
      onClick={onDishClick}
      id={`search-dish-${item.uid}`}
      className="flex items-center gap-4 py-1"
    >
      {isDishPageLoading &&
        createPortal(
          <div
            key={item.uid}
            className="fixed left-0 top-0 z-[100000] h-full w-full bg-white"
          >
            <ItemLoading
              name={name || ""}
              description={description || ""}
              price={item?.price || 0}
              reducedPrice={item?.reducedPrice || 0}
              isDiscount={item.isDiscount}
            />
          </div>,
          document.body
        )}
      <div className="relative h-12 w-12">
        <ImageOrVideo
          key={item?.images[0]}
          src={item?.images[0]}
          imageProps={{
            fill: true,
            alt: "dish image",
            className: "rounded"
          }}
          videoProps={{
            className: "rounded"
          }}
        />
      </div>
      <Highlighter
        className="text-xs"
        highlightClassName="font-bold !bg-transparent"
        searchWords={[search]}
        autoEscape={true}
        textToHighlight={i18n.find(item.name)?.name || ""}
      />
    </div>
  )
}

export default OptionsSearch
