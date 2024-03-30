"use client"

import { useI18n } from "@/components/providers/i18n"
import { cn, getTranslations } from "@/helpers/utils"
import type { IDish } from "@/interfaces/dish.interface"
import Image from "next/image"
import type { FC } from "react"

interface IDishLabels {
  dish: IDish
  type?: "small" | "big"
  className?: string
}

const DishLabels: FC<IDishLabels> = ({ type = "big", dish, className }) => {
  const filters = getTranslations().filters

  const i18n = useI18n()

  const getFilter = (value: string) => {
    return filters.find((filter) => filter.value === value)!.name
  }

  const iconHeight = type === "small" ? 10 : 14

  if (
    !dish.isDiscount &&
    !dish.isNewDish &&
    !dish.isVegan &&
    !dish.isVegetarian &&
    !dish.isSpicy &&
    !dish.isPromotion &&
    !dish.isSugarFree &&
    !dish.isAlcoholFree &&
    !dish.isHistamineFree
  )
    return null
  return (
    <div
      className={cn(
        "flex flex-wrap items-center font-light text-dark-foreground [&>p]:flex [&>p]:items-center [&>p]:gap-1",
        type === "small"
          ? "gap-1.5 gap-y-0.5 text-10"
          : "gap-x-3 gap-y-2 text-sm",
        className
      )}
    >
      {dish.isDiscount && (
        <p className="text-red">
          -{" "}
          {(
            ((+dish?.price - (+dish?.reducedPrice || 0)) / +dish?.price) *
            100
          )?.toFixed(0)}
          %
        </p>
      )}
      {dish.isNewDish && (
        <p>
          <Image
            src="/icons/labels/new.svg"
            alt="new"
            width={type === "small" ? 21.024 : 29.434}
            height={iconHeight}
          />
          <span>{i18n.from(getFilter("NEW"))}</span>
        </p>
      )}
      {dish.isVegan && (
        <p>
          <Image
            src="/icons/labels/vegan.svg"
            alt="new"
            width={type === "small" ? 7.052 : 9.873}
            height={iconHeight}
          />
          <span>{i18n.from(getFilter("VEGAN"))}</span>
        </p>
      )}
      {!dish.isVegan && dish.isVegetarian && (
        <p>
          <Image
            src="/icons/labels/vegetarian.svg"
            alt="new"
            width={14.214}
            height={iconHeight}
          />
          <span>{i18n.from(getFilter("VEGETARIAN"))}</span>
        </p>
      )}
      {dish.isSpicy && (
        <p>
          <Image
            src="/icons/labels/spicy.svg"
            alt="new"
            width={type === "small" ? 8.142 : 9.998}
            height={iconHeight}
          />
          <span>{i18n.from(getFilter("SPICY"))}</span>
        </p>
      )}
      {dish.isPromotion && (
        <p>
          <Image
            src="/icons/labels/popular.svg"
            alt="new"
            width={type === "small" ? 10.491 : 14.687}
            height={iconHeight}
          />
          <span>{i18n.from(getFilter("POPULAR"))}</span>
        </p>
      )}
      {dish.isSugarFree && (
        <p>
          <Image
            src="/icons/labels/sugar-free.svg"
            alt="new"
            width={type === "small" ? 11.033 : 14.033}
            height={iconHeight}
          />
          <span>{i18n.from(getFilter("SUGAR-FREE"))}</span>
        </p>
      )}
      {dish.isAlcoholFree && (
        <p>
          <Image
            src="/icons/labels/alcohol-free.svg"
            alt="new"
            width={type === "small" ? 7.248 : 12.248}
            height={iconHeight}
          />
          <span>{i18n.from(getFilter("ALCOHOL-FREE"))}</span>
        </p>
      )}
      {dish.isHistamineFree && (
        <p>
          <Image
            src="/icons/labels/histamine-free.svg"
            alt="new"
            width={type === "small" ? 8.502 : 14.502}
            height={iconHeight}
          />
          <span>{i18n.from(getFilter("HISTAMINE-FREE"))}</span>
        </p>
      )}
    </div>
  )
}

export default DishLabels
