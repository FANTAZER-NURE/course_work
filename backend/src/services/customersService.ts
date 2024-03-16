import {Customer, PrismaClient, User} from '@prisma/client'

const prisma = new PrismaClient()

const getCustomers = async () => {
  const customers = await prisma.customer.findMany()

  return customers
}

const findById = async (id: number) => {
  const customer = await prisma.customer.findUnique({
    where: {id},
  })

  return customer
}

export const customersService = {
  getCustomers,
  findById,
}
