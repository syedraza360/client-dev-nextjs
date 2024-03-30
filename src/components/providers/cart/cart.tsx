import type { FC, PropsWithChildren } from "react"
import { createContext, useContext, useState } from "react"
import type { ICartContext } from "./cart.interface"

const CartContext = createContext({} as ICartContext)
export const useCart = () => useContext(CartContext)

const CartProvider: FC<PropsWithChildren> = ({ children }) => {
  const [items, setItems] = useState<any[]>([])

  const addItem = (item: any) => {
    const find = items.find((d) => d.id === item.id)
    if (find) {
      find.quantity = find.quantity + 1
    } else {
      item.quantity = 1
      items.push(item)
    }
    setItems([...items])
  }

  const removeItem = (item: any) => {
    const find = items.find((d) => d.id === item.id)
    if (find) {
      find.quantity = find.quantity - 1
      if (find.quantity === 0) {
        items.splice(items.indexOf(find), 1)
      }
    }
    setItems([...items])
  }

  const getQuantity = (item: any) => {
    const find = items.find((d) => d.id === item.id)
    if (find) {
      return find.quantity
    }
    return 0
  }

  const values = {
    items,
    addItem,
    removeItem,
    getQuantity
  }

  return <CartContext.Provider value={values}>{children}</CartContext.Provider>
}

export default CartProvider
