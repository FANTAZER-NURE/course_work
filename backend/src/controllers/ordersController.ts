import { orderService } from "../services/ordersService"

const getAll = async (req: any, res: any) => {
  const {userId} = req.query

  const orders = await orderService.getOrders()

  res.send(orders)
}


export const orderController = {
  getAll,
}
