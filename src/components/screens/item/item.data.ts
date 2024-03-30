import type { IDish } from "@/interfaces/dish.interface"

interface IRecommendation {
  label: string
  value: keyof Pick<IDish, "thirsty" | "appetizers" | "sides" | "dessert">
}

export const OUR_RECOMMENDATION: IRecommendation[] = [
  { label: "Beverages", value: "thirsty" },
  { label: "Appetizers", value: "appetizers" },
  { label: "Side dishes", value: "sides" },
  { label: "Dessert", value: "dessert" }
]
