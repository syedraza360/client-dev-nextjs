import type { IDish } from "@/interfaces/dish.interface"

export const filterDishes = (filters: string[], dishes: IDish[]) => {
  return dishes.filter((dish) => {
    if (
      filters.includes("VEGETARIAN") &&
      !(dish.isVegetarian || dish.isVegan)
    ) {
      return false
    }

    if (
      filters.includes("VEGAN") &&
      !filters.includes("VEGETARIAN") &&
      !dish.isVegan
    ) {
      return false
    }

    if (filters.includes("SUGAR-FREE") && !dish.isSugarFree) {
      return false
    }

    if (filters.includes("ALCOHOL-FREE") && !dish.isAlcoholFree) {
      return false
    }

    if (filters.includes("NUT-FREE") && dish.allergens.includes("peanuts")) {
      return false
    }

    if (filters.includes("LACTOSE-FREE") && dish.allergens.includes("milk")) {
      return false
    }

    if (filters.includes("GLUTEN-FREE") && dish.allergens.includes("gluten")) {
      return false
    }

    if (filters.includes("HISTAMINE-FREE") && !dish.isHistamineFree) {
      return false
    }

    if (filters.includes("SPICY") && !dish.isSpicy) {
      return false
    }

    if (filters.includes("NEW") && !dish.isNewDish) {
      return false
    }

    if (filters.includes("OFFER") && !dish.isDiscount) {
      return false
    }

    if (filters.includes("POPULAR") && !dish.isPromotion) {
      return false
    }

    return true
  })
}
