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

  console.log(req.body)

  const orders = await orderService.createOrder(customerId, shippingAddress, items, managerId)

  res.send(orders)
}

export const orderController = {
  getAll,
  getOne,
  createOrder,
}
