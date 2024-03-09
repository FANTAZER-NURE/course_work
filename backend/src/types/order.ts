import {Order} from '@prisma/client'

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
  orderId: string
  productId: string
  quantity: number
  pricePerItem: number
}
