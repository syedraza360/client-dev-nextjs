import { useI18n } from "@/components/providers/i18n"
import { useRestaurant } from "@/components/providers/restaurant/restaurant.provider"
import ItemLoading from "@/components/screens/item/components/item-loading"
import ItemModal from "@/components/screens/item/item-modal/item-modal"
import { useFindCategory } from "@/components/screens/item/useFindCategory"
import { fixCdnUrl } from "@/helpers/fix-cnd-url"
import { formUrlQuery } from "@/helpers/query-params"
import { sortStringByAlphabet } from "@/helpers/sort-string-by-alphabet"
import { cn } from "@/helpers/utils"
import { useMounted } from "@/hooks/useMounted"
import { useScreenSize } from "@/hooks/useScreenSize"
import type { ICategory } from "@/interfaces/category.interface"
import type { IDish } from "@/interfaces/dish.interface"
import type { IRestaurantSettings } from "@/interfaces/restaurant.interface"
import { useVariables } from "@/store/use-variables"
import { useParams, useRouter } from "next/navigation"
import { Fragment, useMemo, useState, type FC } from "react"
import { createPortal } from "react-dom"
import DishLabels from "../dish-labels/dish-labels"
import ImageOrVideo from "../image-or-video/image-or-video"
import ProductPrice from "./product-price"

interface IProduct {
  type?: "small" | "responsive"
  product: IDish
  index?: number
  isFullWidth?: boolean
  restaurantSettings: IRestaurantSettings
  categories: ICategory[]
  allDishes: IDish[]
}

const Product: FC<IProduct> = ({
  type = "responsive",
  product,
  index,
  isFullWidth,
  restaurantSettings,
  categories,
  allDishes
}) => {
  const { isMobile } = useScreenSize()
  const isMounted = useMounted()

  const { push } = useRouter()
  const params = useParams()

  const [isHovering, setIsHovering] = useState(false)
  const [isDishPageLoading, setIsDishPageLoading] = useState(true)

  const { setDish } = useRestaurant()
  const i18n = useI18n()

  const { category } = useFindCategory(product, categories)

  const setDishLoadingScroll = useVariables(
    (state) => state.setDishLoadingScroll
  )

  const name = restaurantSettings.isAutoTranslate
    ? i18n.find(product.name)?.name
    : product?.nameOrigin
  const description = i18n.find(product?.description)?.description
  const splitDescription = description?.split("\r\n")

  const similarDishesLength = useMemo(() => {
    const length = allDishes.filter(
      (d) =>
        (d?.subcategory === category?.uid || d?.category === category?.uid) &&
        product?.uid !== d?.uid
    ).length

    if (length < 4) return length
    return 4
  }, [allDishes, category, product?.uid])

  const recommendations = useMemo(
    () => product.recommendations.map((rec) => rec.dishes.length),
    [product.recommendations]
  )

  const onProductClick = () => {
    if (isMobile) {
      document.body.style.overflow = "hidden"
      setIsDishPageLoading(false)
      push(`/${params.slug}/${product.uid}`)
    } else {
      const newUrl = formUrlQuery({
        params: new URL(window.location.href).searchParams.toString(),
        key: "dishId",
        value: product.uid
      })
      setDish(product)
      push(newUrl)
    }
  }

  const noImages = product?.images?.length === 0

  console.log("isDishPageLoading", isDishPageLoading)
  console.log("isMobile", isMobile)
  return (
    <div
      className={cn(
        "flex h-full",
        isFullWidth && "col-span-full",
        noImages &&
          !isFullWidth &&
          type === "responsive" &&
          "col-span-full xl:col-span-2"
      )}
    >
      {isMounted && <ItemModal key={product.uid} productId={product.uid} />}
      {!isDishPageLoading &&
        createPortal(
          <div
            key={product.uid}
            className="fixed left-0 top-0 z-[100000] max-h-full w-full overflow-auto"
            onScroll={(e) => setDishLoadingScroll(e.currentTarget.scrollTop)}
          >
            <ItemLoading
              name={name || ""}
              description={description || ""}
              price={product?.price}
              reducedPrice={product?.reducedPrice}
              isDiscount={product.isDiscount}
              currency={restaurantSettings.currency.symbol}
              showPrice={restaurantSettings.showPrice}
              showCurrency={restaurantSettings.showCurrency}
              similarDishes={similarDishesLength}
              recommendations={recommendations}
            />
          </div>,
          document.body
        )}
      <button
        className={cn(
          "relative flex w-full flex-col rounded-xl duration-300",
          noImages
            ? "tablet:h-[210px] tablet:min-h-full tablet:justify-center tablet:border tablet:border-dark-bg2 tablet:px-2 tablet:py-4 tablet:hover:justify-start"
            : "tablet:border tablet:border-transparent tablet:p-2 tablet:hover:border-dark-bg2",
          noImages &&
            type === "small" &&
            "justify-center border border-dark-bg2 px-2 py-4"
        )}
        onMouseEnter={() => setIsHovering(!isMobile ? true : false)}
        onMouseLeave={() => setIsHovering(false)}
        onClick={onProductClick}
      >
        <div
          className={cn(
            "relative w-full",
            !noImages
              ? "aspect-[3/4] overflow-hidden rounded-lg"
              : "px-2 tablet:px-3"
          )}
        >
          {!noImages && (
            <ImageOrVideo
              src={product?.images[0] || ""}
              imageProps={{
                fill: true,
                alt: "dish image",
                loading: "eager",
                fetchPriority: index && index < 10 ? "high" : "auto"
              }}
            />
          )}
        </div>
        <div
          className={cn(
            "relative z-10 flex w-full flex-col items-start px-2 duration-300 tablet:px-4",
            noImages ? "pt-2" : "flex-1 bg-white pt-4",
            isHovering &&
              !noImages &&
              "-translate-y-[76px] after:absolute after:-bottom-5 after:left-0 after:h-5 after:w-full after:bg-white after:content-['']"
          )}
        >
          <span
            className={cn(
              "line-clamp-2 text-start font-semibold uppercase",
              type === "responsive"
                ? "text-xs tablet:text-base"
                : "text-xs tablet:text-sm"
            )}
          >
            {name}
          </span>
          <DishLabels
            type={isMobile ? "small" : "big"}
            dish={product}
            className={cn(
              "mb-2 mt-1 font-normal",
              type === "responsive"
                ? "tablet:text-13"
                : "gap-1 text-10 tablet:gap-2 tablet:!text-xs"
            )}
          />
          <p
            className={cn(
              "mt-0.5 line-clamp-2 text-start !text-dark-foreground",
              type === "responsive"
                ? "text-10 leading-3 tablet:text-13 tablet:leading-135"
                : "text-10 tablet:text-xs"
            )}
          >
            {splitDescription?.map((text, index) => (
              <Fragment key={index}>
                {text}
                <br />
              </Fragment>
            ))}
          </p>
          <div className="mt-2 flex w-full items-center justify-between">
            {restaurantSettings && (
              <ProductPrice
                type={type}
                price={product?.price}
                isDiscount={product?.isDiscount}
                reducedPrice={product?.reducedPrice}
                restaurantSettings={restaurantSettings}
              />
            )}
            {!!product?.short_allergens && (
              <span
                className={cn(
                  "rounded-sm px-1 py-0.5",
                  type === "responsive"
                    ? "text-10 tablet:text-13"
                    : "text-10 tablet:text-sm"
                )}
              >
                {sortStringByAlphabet(product?.short_allergens)}
              </span>
            )}
          </div>
        </div>
        <div
          className={cn(
            "w-[calc(100%-32px)] cursor-pointer rounded bg-dark px-4 py-3 text-light duration-300 hover:bg-dark-foreground",
            type === "small" ? "text-xs" : "text-sm",
            noImages
              ? isHovering
                ? "mx-auto mt-auto h-auto opacity-100"
                : "pointer-events-none mx-auto h-0 p-0 opacity-0"
              : isHovering
                ? "absolute bottom-4 left-1/2 z-20 -translate-x-1/2 opacity-100"
                : "pointer-events-none absolute bottom-4 left-1/2 -translate-x-1/2 opacity-0"
          )}
          onClick={onProductClick}
        >
          {i18n.t("learn more")}
        </div>
      </button>
    </div>
  )
}

export default Product
