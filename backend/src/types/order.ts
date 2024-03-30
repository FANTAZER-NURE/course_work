import {Order} from '@prisma/client'
import {TProduct} from './product'

export type TOrder = {
  id: string
  customerId: number
  managerId: number
  status: 'created' | 'loading' | 'shipping' | 'shipped' | 'done'
  createdAt: Date
  updatedAt: Date
  shippingAddress: string
  orderPrice: number
  productDetails: ProductDetails[]
}

export type ProductDetails = {
  id: string
  quantity: number
  pricePerUnit: number
  product: TProduct
}
