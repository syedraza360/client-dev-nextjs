import { cn } from "@/helpers/utils"
import type { IRestaurantSettings } from "@/interfaces/restaurant.interface"
import type { FC } from "react"

interface IProductPrice {
  type: "small" | "responsive"
  price: string | number
  reducedPrice: string | number
  isDiscount: boolean
  restaurantSettings: IRestaurantSettings
}

const ProductPrice: FC<IProductPrice> = ({
  type,
  restaurantSettings,
  ...props
}) => {
  const settings = restaurantSettings

  const currency = settings.currency.symbol

  const price = props.price?.toString().includes("-")
    ? props.price
    : Number(props.price).toFixed(2).replace(".", ",")
  const reducedPrice = Number(props?.reducedPrice).toFixed(2).replace(".", ",")

  if (!settings.showPrice || !props.price) return null
  return (
    <p
      className={cn(
        "flex flex-wrap gap-1 font-semibold",
        type === "responsive"
          ? "text-xs tablet:text-base"
          : "text-10 tablet:text-sm"
      )}
    >
      {props?.isDiscount ? (
        <>
          <span className="text-red">
            {settings.showCurrency && currency} {reducedPrice}
          </span>
          <span className="text-[#9B9B9B] line-through">
            {settings.showCurrency && currency} {price}
          </span>
        </>
      ) : (
        <span>
          {settings.showCurrency && currency} {price}
        </span>
      )}
    </p>
  )
}

export default ProductPrice
