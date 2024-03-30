"use client"

import ItemLoading from "@/components/screens/item/components/item-loading"
import { formUrlQuery } from "@/helpers/query-params"
import { useVariables } from "@/store/use-variables"
import { useRouter, useSearchParams } from "next/navigation"
import { useEffect, useState, type FC } from "react"
import { useShallow } from "zustand/react/shallow"

const Loading: FC = () => {
  const { replace } = useRouter()
  const searchParams = useSearchParams()

  const [dishLoadingScroll, setDishLoadingScroll] = useVariables(
    useShallow((state) => [state.dishLoadingScroll, state.setDishLoadingScroll])
  )

  const [name, setName] = useState("")
  const [description, setDescription] = useState("")
  const [price, setPrice] = useState<string | number>(0)
  const [currency, setCurrency] = useState("")
  const [showPrice, setShowPrice] = useState(false)
  const [showCurrency, setShowCurrency] = useState(false)
  const [reducedPrice, setReducedPrice] = useState(0)
  const [isDiscount, setIsDiscount] = useState(false)
  const [similarDishes, setSimilarDishes] = useState(0)
  const [recommendations, setRecommendations] = useState<number[]>([])

  useEffect(() => {
    if (dishLoadingScroll > 0) {
      setTimeout(() => {
        window.scrollTo(0, dishLoadingScroll)
      }, 0)
      setDishLoadingScroll(0)
    }
  }, [dishLoadingScroll, setDishLoadingScroll])

  useEffect(() => {
    setName(searchParams.get("name") || "")
    setDescription(searchParams.get("description") || "")
    setPrice(
      Number(searchParams.get("price")) || searchParams.get("price") || ""
    )
    setCurrency(searchParams.get("currency") || "")
    setShowPrice(searchParams.get("showPrice") === "true")
    setShowCurrency(searchParams.get("showCurrency") === "true")
    setReducedPrice(Number(searchParams.get("reducedPrice")))
    setIsDiscount(searchParams.get("isDiscount") === "true")
    setSimilarDishes(Number(searchParams.get("similarDishes")) || 0)
    setRecommendations(
      searchParams.get("recommendations")?.split(",").map(Number) || []
    )

    const newUrl = formUrlQuery({
      params: new URL(window.location.href).searchParams.toString(),
      keysToRemove: [
        "name",
        "description",
        "price",
        "currency",
        "showPrice",
        "showCurrency",
        "reducedPrice",
        "isDiscount",
        "similarDishes",
        "recommendations"
      ]
    })

    replace(newUrl, { scroll: false })
  }, [])

  return (
    <ItemLoading
      name={name}
      description={description}
      price={price}
      currency={currency}
      showPrice={showPrice}
      showCurrency={showCurrency}
      reducedPrice={reducedPrice}
      isDiscount={isDiscount}
      similarDishes={similarDishes}
      recommendations={recommendations}
    />
  )
}

export default Loading
