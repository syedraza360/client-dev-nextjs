import { useI18n } from "@/components/providers/i18n"
import { useRestaurant } from "@/components/providers/restaurant/restaurant.provider"
import Checkbox from "@/components/ui/checkbox"
import { translateFromObject } from "@/helpers/utils"
import type { IDishVariation } from "@/interfaces/dish.interface"
import type { Dispatch, FC, SetStateAction } from "react"

interface IItemVariations {
  cartItem: any
  variationSelected: { [key: string]: string | undefined }
  setVariationSelected: Dispatch<
    SetStateAction<{ [key: string]: string | undefined }>
  >
}

const ItemVariations: FC<IItemVariations> = (props) => {
  const { dish } = useRestaurant()

  const i18n = useI18n()

  return (
    <div className="mt-3 bg-white px-3 pb-4 pt-[18px]">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-xl font-semibold text-gray-900">
            {i18n.t("Variations")}
          </p>
          <p className="mt-1 text-sm font-medium text-gray-600">
            {i18n.t("Choose 1 out")}
          </p>
        </div>
        <div className="rounded-sm bg-gray-900 px-1.5 py-1 text-xs font-medium text-white">
          {i18n.t("required")}
        </div>
      </div>
      <div>
        {dish?.variations?.map((variation, index) => (
          <ItemVariation key={index} variation={variation} {...props} />
        ))}
      </div>
    </div>
  )
}

interface IItemVariation extends IItemVariations {
  variation: IDishVariation
}

const ItemVariation: FC<IItemVariation> = ({
  variation,
  cartItem,
  variationSelected,
  setVariationSelected
}) => {
  const i18n = useI18n()
  const { dish, updateCart } = useRestaurant()

  const onVariationClick = () => {
    const dishId = dish?._id || ""

    if (!!cartItem) {
      updateCart(cartItem, {
        variation:
          variation._id === variationSelected[dishId] ? null : variation._id
      })
    }
    if (variation._id === variationSelected[dishId]) {
      setVariationSelected((d) => ({
        ...d,
        [dishId]: undefined
      }))
    } else {
      setVariationSelected((d) => ({
        ...d,
        [dishId]: variation._id
      }))
    }
  }

  return (
    <div className="tab-row">
      <div
        role="button"
        onClick={onVariationClick}
        className="flex items-center gap-3"
      >
        <Checkbox
          checked={variation._id === variationSelected[dish?._id || ""]}
        />
        <p>{translateFromObject(variation?.name, i18n.locale, "name")}</p>
      </div>
      {!!variation?.price && (
        <p>+{variation?.price?.toFixed(2).replace(".", ",")} €</p>
      )}
    </div>
  )
}

export default ItemVariations
