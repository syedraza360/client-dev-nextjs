export interface ICartContext {
  items: any[]
  addItem: (item: any) => void
  removeItem: (item: any) => void
  getQuantity: (item: any) => number
}
