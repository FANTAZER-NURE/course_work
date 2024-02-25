import { ApiError } from '../exceptions/ApiError.js';
import { orderService } from '../services/orderService.js';
import { ordersDescriptionService } from '../services/ordersDescriptionService.js';

const getAll = async (req, res) => {
  const { userId } = req.query;

  const orders = await orderService.getOrders({ userId });

  res.send(orders)
}

// const getById = async (req, res) => {
//   const { id } = req.params

//   const order = await orderService.getOrderById(id);

//   if (!order) {
//     throw ApiError.NotFound()
//   }

//   res.send(order)
// }

// const getByUserId = async (req, res) => {
//   const { userId } = req.query;

//   const orders = await orderService.getOrdersByUserId(userId);

//   if (!orders) {
//     throw ApiError.NotFound()
//   }

//   res.send(orders)
// }

// const create = async (req, res) => {
//   const { userId, items } = req.body;


//   if (!userId || !Array.isArray(items)) {
//     throw ApiError.BadReguest('Validation error', errors);
//   }

//   const order = await orderService.createOrder({ userId, amount: 0 });

//   if (!order) {
//     throw ApiError.BadReguest('No valid data', errors);
//   }

//   const ordersDescription = await ordersDescriptionService.createOrdersDescription(items.map(item => ({ ...item, orderId: order.id })))

//   if (!ordersDescription) {
//     throw ApiError.BadReguest('No valid data', errors);
//   }


//   console.log([...ordersDescription.map(item => item.dataValues)])
//   const amount = [...ordersDescription].reduce((sum, item) => sum + item.quantity)

//   await order.save({
//     amount,
//   })

//   console.log(amount)

//   res.send(order)
// }

// const remove = async (req, res) => {
//   const { id } = req.params;

//   const order = await orderService.getOrderById(id);

//   if (!order) {
//     throw ApiError.NotFound();
//   }

//   await orderService.removeOrder(id)


//   res.sendStatus(204);
// }

export const orderController = {
  getAll,
  // getById,
  // create,
  // remove,
  // getByUserId,
};
