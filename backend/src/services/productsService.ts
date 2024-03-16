import {PrismaClient, User} from '@prisma/client'

const prisma = new PrismaClient()

const getProducts = async () => {
  const products = await prisma.product.findMany()

  return products
}

export const productsService = {
  getProducts,
}
