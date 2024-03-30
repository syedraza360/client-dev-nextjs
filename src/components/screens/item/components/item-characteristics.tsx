import { useI18n } from "@/components/providers/i18n"
import Drawer from "@/components/ui/drawer/drawer"
import type { IDish } from "@/interfaces/dish.interface"
import Image from "next/image"
import { useState, type FC } from "react"

interface IItemCharacteristics {
  dish: IDish
}

const ItemCharacteristics: FC<IItemCharacteristics> = ({ dish }) => {
  const [isOpen, setIsOpen] = useState(false)

  const i18n = useI18n()

  const date = new Date(dish?.nutritionalInfoUpdatedAt)
    .toLocaleDateString()
    .replace(/\//g, ".")

  const getGrams = (value?: number | null) => {
    return !!value ? `${value.toFixed(1)}g` : "0g"
  }

  const getCalories = (value?: number) => {
    return !!value
      ? `${(value * 4.184).toFixed(1)} kJ (${value.toFixed(1)} kcal)`
      : "0 kJ (0 kcal)"
  }

  return (
    <div
      style={{
        display:
          !!dish?.calories ||
          !!dish?.fats ||
          !!dish?.carbohydrate ||
          !!dish?.protein ||
          !!dish?.sugar ||
          !!dish?.fattyAcids
            ? "block"
            : "none"
      }}
      className="mt-2 bg-white px-3 pb-4 pt-[18px] tablet:mt-0 tablet:p-8"
    >
      <div className="flex items-center justify-between">
        <p className="text-xs font-medium uppercase text-dark-foreground">
          {i18n.t("Estimated guidelines")}
        </p>
        <button
          className="tablet:pointer-events-none tablet:hidden"
          onClick={() => setIsOpen(true)}
        >
          <Image
            alt="info"
            src="/icons/info-circle.svg"
            width={15}
            height={15}
          />
        </button>
        <CharacteristicsInfo
          isOpen={isOpen}
          setIsOpen={setIsOpen}
          date={date}
        />
      </div>
      <p className="mt-1 text-xl font-semibold">
        {" "}
        {i18n.t("Nutritional values per portion")}
      </p>
      <div className="mt-2">
        <div className="tab-row">
          <div>{i18n.t("energy")}</div>
          <div>{getCalories(dish?.calories)}</div>
        </div>
        <div className="tab-row-with-sub">
          <div className="flex items-center justify-between">
            <div>{i18n.t("Fat")}</div>
            <div>{getGrams(dish?.fats)}</div>
          </div>
          <p className="flex items-center justify-between pl-2 text-xs tablet:text-sm">
            <span>{i18n.t("Of which saturated fatty acids")}</span>
            <span>{getGrams(dish?.fattyAcids)}</span>
          </p>
        </div>
        <div className="tab-row-with-sub">
          <div className="flex items-center justify-between">
            <div>{i18n.t("carbohydrates")}</div>
            <div>{getGrams(dish?.carbohydrate)}</div>
          </div>
          <p className="flex items-center justify-between pl-2 text-xs tablet:text-sm">
            <span>{i18n.t("Of which sugar")}</span>
            <span>{getGrams(dish?.sugar)}</span>
          </p>
        </div>
        <div className="tab-row">
          <div>{i18n.t("protein")}</div>
          <div>{getGrams(dish?.protein)}</div>
        </div>
        <div className="tab-row">
          <div>{i18n.t("salt")}</div>
          <div>{getGrams(dish?.salt)}</div>
        </div>
      </div>
      <div className="mt-4 hidden tablet:block">
        <LastUpdatedAt date={date} />
      </div>
    </div>
  )
}

interface ICharacteristicsInfo {
  isOpen: boolean
  setIsOpen: (open: boolean) => void
  date: string
}

const CharacteristicsInfo: FC<ICharacteristicsInfo> = ({
  isOpen,
  setIsOpen,
  date
}) => {
  const i18n = useI18n()

  return (
    <Drawer
      isOpen={isOpen}
      title={i18n.t("Nutritional information")}
      setIsOpen={setIsOpen}
    >
      <div className="mt-6">
        <LastUpdatedAt date={date} />
      </div>
    </Drawer>
  )
}

interface ILastUpdatedAt {
  date: string
}

const LastUpdatedAt: FC<ILastUpdatedAt> = ({ date }) => {
  const i18n = useI18n()

  return (
    <p className="text-xs font-light text-black">
      <span>
        {i18n.t(
          "Despite careful processing, all information is provided without guarantee and is subject to legal changes"
        )}
      </span>
      <br />
      <br className="tablet:hidden" />
      <span>
        {i18n.t("Last update")} <span className="font-semibold">{date}</span>
      </span>
    </p>
  )
}

export default ItemCharacteristics
