import {Customer, PrismaClient, User} from '@prisma/client'

const prisma = new PrismaClient()

const getCustomers = async () => {
  const customers = await prisma.customer.findMany()

  console.log('----HERE-----', customers)

  return customers
}

// const findByEmail = async (email: string) => {
//   const customer = await prisma.customer.findUnique({
//     where: {email},
//   })

//   return customer
// }

export const customersService = {
  getCustomers,
}
