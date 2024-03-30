"use client"

import type { IDish } from "@/interfaces/dish.interface"
import { Fragment, useEffect, type FC } from "react"
import Skeleton from "react-loading-skeleton"
import { ItemPrice } from "./item-about"

import { useI18n } from "@/components/providers/i18n"
import ArrowLeft from "public/icons/arrow-left.svg"
import ShareIcon from "public/icons/share.svg"

interface IItemLoading {
  name?: string
  description?: string
  price?: string | number
  currency?: string
  showPrice?: boolean
  showCurrency?: boolean
  reducedPrice?: string | number
  isDiscount?: boolean
  similarDishes?: number
  recommendations?: number[]
}

const ItemLoading: FC<IItemLoading> = ({
  name,
  description,
  price,
  currency,
  showPrice,
  showCurrency,
  reducedPrice,
  isDiscount,
  similarDishes,
  recommendations
}) => {
  const i18n = useI18n()

  const splitDescriptionFull = description?.split("\r\n") || []

  useEffect(() => {
    document.body.style.overflow = "auto"
  }, [])

  return (
    <div className="bg-gray-50">
      <div className="sticky left-0 top-0 z-30 flex h-14 items-center justify-between gap-4 bg-white px-3">
        <ArrowLeft className="min-h-6 min-w-6" />
        {name ? (
          <p className="overflow-hidden text-ellipsis whitespace-nowrap text-sm font-medium">
            {name}
          </p>
        ) : (
          <div className="h-4 w-2/5">
            <Skeleton className="text-sm" />
          </div>
        )}
        <ShareIcon className="min-h-6 min-w-6" />
      </div>
      <div className="sticky left-0 top-14">
        <Skeleton
          className="!z-0 aspect-[3/4] !leading-normal"
          borderRadius={0}
        />
      </div>
      <div className="sticky z-20 bg-gray-50">
        <div className="bg-white px-3 pb-4 pt-[18px]">
          <div className="h-3.5 w-2/5 animate-pulse rounded bg-[#ebebeb]" />
          {name ? (
            <p className="mt-1 text-xl font-semibold text-gray-900">{name}</p>
          ) : (
            <Skeleton className="mt-1 w-4/5 text-xl" />
          )}
          {description ? (
            <p className="mt-2 block text-sm font-light text-dark-foreground">
              {splitDescriptionFull.map((text, index, array) => (
                <Fragment key={index}>
                  {text}
                  {index !== array.length - 1 && <br />}
                </Fragment>
              ))}
            </p>
          ) : (
            <Skeleton className="mt-2 text-sm" count={2} />
          )}
          {price ? (
            <div className="mt-4">
              <ItemPrice
                dish={
                  {
                    price,
                    reducedPrice,
                    isDiscount
                  } as IDish
                }
                currency={currency || ""}
                showPrice={!!showPrice}
                showCurrency={!!showCurrency}
              />
            </div>
          ) : (
            <Skeleton className="mt-4 w-1/5 text-sm" />
          )}
        </div>
        {!!recommendations && recommendations.length > 0 && (
          <div className="mt-2 bg-white px-3 pb-4 pt-[18px]">
            <div className="text-xs font-medium uppercase text-dark-foreground">
              {i18n.t("Our recommendation")}
            </div>
            <div className="mt-2 flex flex-col gap-8">
              {recommendations.map((rec, index) => (
                <div key={index}>
                  <Skeleton className="w-2/5 text-base !leading-normal" />
                  <div className="no-scrollbar mt-4 flex w-full gap-3 overflow-y-auto">
                    {Array.from({ length: rec }).map((_, index) => (
                      <Fragment key={index}>
                        {rec > 2 ? (
                          <div className="h-full min-w-[168px]">
                            <DishSkeleton />
                          </div>
                        ) : (
                          <DishSkeleton />
                        )}
                      </Fragment>
                    ))}
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {!!similarDishes && similarDishes > 0 && (
          <div className="mt-2 bg-white px-3 pb-4 pt-[18px]">
            <Skeleton className="w-2/5 text-xs !leading-normal" />
            <Skeleton className="mt-1 w-3/5 text-xl !leading-normal" />
            <div className="mt-4 grid grid-cols-2 gap-x-3 gap-y-5">
              {Array.from({ length: similarDishes }).map((_, index) => (
                <DishSkeleton key={index} />
              ))}
            </div>
            {similarDishes === 4 && (
              <Skeleton className="mx-auto mt-8 block h-7 w-3/5 !leading-normal" />
            )}
          </div>
        )}
      </div>
    </div>
  )
}

const DishSkeleton = () => {
  return (
    <div className="flex-1">
      <div className="aspect-[3/4] w-full animate-pulse bg-[#ebebeb]" />
      <div className="mt-4 h-3 max-w-[180px] animate-pulse rounded bg-[#ebebeb]" />
      <div className="mt-1 h-3 w-[90px] animate-pulse rounded bg-[#ebebeb]" />
      <div className="mt-2 h-3 w-[40px] animate-pulse rounded bg-[#ebebeb]" />
      {/* <Skeleton width={40} className="text-xs !leading-normal" /> */}
    </div>
  )
}

export default ItemLoading
