import { useI18n } from "@/components/providers/i18n"
import { useRestaurant } from "@/components/providers/restaurant/restaurant.provider"
import Checkbox from "@/components/ui/checkbox"
import { translateFromObject } from "@/helpers/utils"
import type { IDishExtra } from "@/interfaces/dish.interface"
import type { Dispatch, FC, SetStateAction } from "react"

interface IItemExtras {
  cartItem: any
  extras: { [key: string]: string[] }
  setExtras: Dispatch<SetStateAction<{ [key: string]: string[] }>>
}

const ItemExtras: FC<IItemExtras> = (props) => {
  const { dish } = useRestaurant()
  const i18n = useI18n()

  return (
    <div className="mt-3 bg-white px-3 pb-4 pt-[18px]">
      <div className="flex items-center justify-between">
        <div className="flex flex-col gap-1">
          <p className="text-xl font-semibold text-gray-900">
            {i18n.t("Do you want extras?")}
          </p>
          <p className="mt-1 text-sm font-medium text-gray-600">
            {i18n.t("Multiple selection possible")}
          </p>
        </div>
        <div className="rounded-sm bg-gray-200 px-1.5 py-1 text-xs font-medium text-gray-800">
          optional
        </div>
      </div>
      <div>
        {dish?.extras?.map((extra, index) => (
          <ItemExtra key={index} extra={extra} {...props} />
        ))}
      </div>
    </div>
  )
}

interface IItemExtra extends IItemExtras {
  extra: IDishExtra
}

const ItemExtra: FC<IItemExtra> = ({ cartItem, extra, extras, setExtras }) => {
  const { updateCart, dish } = useRestaurant()
  const i18n = useI18n()

  const onExtraClick = () => {
    if (dish) {
      if (!!cartItem) {
        updateCart(cartItem, {
          extras: extras[dish._id]?.includes(extra._id)
            ? extras[dish._id]?.filter((d) => d !== extra._id)
            : [...(extras[dish._id] || []), extra._id]
        })
      }
      if (extras[dish._id]?.includes(extra._id)) {
        setExtras({
          ...extras,
          [dish._id]: extras[dish._id]?.filter((d) => d !== extra._id)
        })
      } else {
        setExtras({
          ...extras,
          [dish._id]: [...(extras[dish._id] || []), extra._id]
        })
      }
    }
  }

  return (
    <div className="tab-row">
      <div
        role="button"
        onClick={onExtraClick}
        className="flex items-center gap-3"
      >
        <Checkbox checked={extras[dish?._id || ""]?.includes(extra._id)} />
        <p>{translateFromObject(extra?.name, i18n.locale, "name")}</p>
      </div>
      {!!extra?.price && <p>+{extra?.price?.toFixed(2).replace(".", ",")} €</p>}
    </div>
  )
}

export default ItemExtras
