import {orderService} from '../services/ordersService'

const getAll = async (req: any, res: any) => {
  const orders = await orderService.getOrders()

  res.send(orders)
}

const getOne = async (req: any, res: any) => {
  const {id} = req.params

  const orders = await orderService.getOrder(+id)

  res.send(orders)
}

const createOrder = async (req: any, res: any) => {
  const {customerId, shippingAddress, items, managerId} = req.body

  const orders = await orderService.createOrder(customerId, shippingAddress, items, managerId)

  res.send(orders)
}

const deleteOrder = async (req: any, res: any) => {
  const {id} = req.params

  console.log('here', id)

  const order = await orderService.deleteOrder(+id)

  res.send(order)
}

export const orderController = {
  getAll,
  getOne,
  createOrder,
  deleteOrder,
}
