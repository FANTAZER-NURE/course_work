import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

const getOrders = async () => {

  const orders = await prisma.order.findMany()

  return orders
}


export const orderService = {
  getOrders,
}
