import {Customer, Order, PrismaClient} from '@prisma/client'
import {ApiError} from '../exceptions/ApiError'
import {TProduct} from '../types/product'
import {TOrder} from '../types/order'

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

  // const productDetails: Record<
  //   string,
  //   {
  //     quantity: string
  //     pricePerUnit: string
  //     product: TProduct | null
  //     unit: 'L' | 'T'
  //   }
  // > = {}
  // items.map((item, i) => {
  //   productDetails[i + 1] = item
  // })

  const order = prisma.order.create({
    data: {
      customerId: parseInt(customerId),
      shippingAddress: shippingAddress,
      managerId,
      status: 'created',
      productDetails: items,
    },
  })

  return order
}

const deleteOrder = async (id: number) => {
  const order = await prisma.order.findUnique({
    where: {
      id: id,
    },
  })

  if (!order) {
    ApiError.BadRequest('No such order')
  }

  await prisma.order.delete({
    where: {
      id: id,
    },
  })

  return order
}

const updateOrder = async (id: number, updatedOrderData: Partial<Omit<TOrder, 'id'>>) => {
  const updatedOrder = await prisma.order.update({
    where: {id},
    data: updatedOrderData,
  })

  if (!updatedOrder) {
    ApiError.BadRequest('No such order')
  }

  return updatedOrder
}

export const orderService = {
  getOrders,
  getOrder,
  createOrder,
  deleteOrder,
  updateOrder,
}
