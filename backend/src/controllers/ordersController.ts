import {orderService} from '../services/ordersService'

const getAll = async (req: any, res: any) => {
  const orders = await orderService.getOrders()

  res.send(orders)
}

const getOne = async (req: any, res: any) => {
  const {id} = req.params

  console.log(id)
  console.log(req)

  const orders = await orderService.getOrder(+id)

  res.send(orders)
}

export const orderController = {
  getAll,
  getOne,
}
