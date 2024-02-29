import {PrismaClient} from '@prisma/client'

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

export const orderService = {
  getOrders,
  getOrder,
}
