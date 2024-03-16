import {Order} from '@prisma/client'
import {TProduct} from './product'

export type TOrder = {
  id: string
  customerId: number
  managerId: number
  status: string
  createdAt: Date
  updatedAt: Date
  shippingAddress: string
  orderPrice: number
  productDetails: {
    [key: string]: ProductDetails
  }
}

type ProductDetails = {
  id: string
  productId: string
  quantity: number
  pricePerUnit: number
  name: string
  unit: 'T' | 'L'
  product: TProduct
}
