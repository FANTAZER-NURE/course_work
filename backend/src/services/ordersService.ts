import {Customer, PrismaClient} from '@prisma/client'
import {ApiError} from '../exceptions/ApiError'
import {TProduct} from '../types/product'

const prisma = new PrismaClient()

const getOrders = async () => {
  const orders = await prisma.order.findMany()

  return orders
}

const getOrder = async (id: number) => {
  const orders = await prisma.order.findUnique({
    where: {
      id: id,
    },
  })

  return orders
}

const createOrder = async (
  customerId: string,
  shippingAddress: string,
  items: {
    quantity: string
    pricePerUnit: string
    product: TProduct | null
    unit: 'L' | 'T'
  }[],
  managerId: number
) => {
  const customer = prisma.customer.findUnique({
    where: {
      id: +customerId,
    },
  })

  if (!customer) {
    ApiError.BadRequest('No such customer')
  }

  const productDetails: Record<
    string,
    {
      quantity: string
      pricePerUnit: string
      product: TProduct | null
      unit: 'L' | 'T'
    }
  > = {}
  items.map((item, i) => {
    productDetails[i + 1] = item
  })

  const order = prisma.order.create({
    data: {
      customerId: parseInt(customerId),
      shippingAdress: shippingAddress,
      managerId,
      status: 'created',
      productDetails,
    },
  })

  return order
}

export const orderService = {
  getOrders,
  getOrder,
  createOrder,
}
