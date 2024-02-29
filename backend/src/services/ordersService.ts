import {PrismaClient} from '@prisma/client'

const prisma = new PrismaClient()

const getOrders = async ({userId}) => {
  // return Order.findAll({
  //   where: {
  //     [Op.and]: [userId && {userId}],
  //   },
  // })

  const users = await prisma.order.findMany()

  return users
}

// const getOrderById = (id) => {
//   return Order.findOne({where: {id}})
// }

// const getOrdersByUserId = (userId) => {
//   return Order.findOne({where: {userId}})
// }

// const createOrder = async (orderData) => {
//   const newOrder = await Order.create(orderData)

//   return newOrder
// }

// const removeOrder = async (id) => {
//   try {
//     await Order.destroy({
//       where: {id}, // Условие для удаления объекта с определенным id
//     })
//   } catch (error) {
//     console.error(`Ошибка при удалении объекта в базе данных: ${error}`)
//     throw error
//   }
// }

export const orderService = {
  // removeOrder,
  // createOrder,
  // getOrderById,
  // getOrdersByUserId,
  getOrders,
}
