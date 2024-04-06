import {ApiError} from '../exceptions/ApiError'
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
  console.log('---here-----')

  console.log(customerId)
  console.log(shippingAddress)
  console.log(managerId)
  console.log(items)

  if (!items.length) {
    ApiError.NotFound()
    return
  }

  const orders = await orderService.createOrder(customerId, shippingAddress, items, managerId)

  res.send(orders)
}

const deleteOrder = async (req: any, res: any) => {
  const {id} = req.params

  const order = await orderService.deleteOrder(+id)

  res.send(order)
}

const updateOrder = async (req: any, res: any) => {
  const {id} = req.params
  const updatedOrderData = req.body

  const updatedOrder = await orderService.updateOrder(+id, updatedOrderData)

  res.json(updatedOrder)
}

export const orderController = {
  getAll,
  getOne,
  createOrder,
  deleteOrder,
  updateOrder,
}
