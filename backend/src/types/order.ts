export type Order = {
  id: string
  customerId: string
  managerId: string
  status: string
  createdAt: Date
  updatedAt: Date
  shippingAddress: string
  productDetails: {
    [key: string]: ProductDetails // {"1": {...}, "2": {...}}
  }
}

type ProductDetails = {
  id: string
  name: string
  quantity: number
  units: 't' | 'l'
  pricePerUnit: number
}
