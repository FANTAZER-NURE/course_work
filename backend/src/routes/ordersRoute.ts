import {Router} from 'express'
import {catchError} from '../utils/catchError'
import {orderController} from '../controllers/ordersController'
import {authMiddleware} from '../middlewares/authMiddlewares'

const orderRouter = Router()

orderRouter.get('/orders', authMiddleware, catchError(orderController.getAll))
orderRouter.get('/orders/:id', authMiddleware, catchError(orderController.getOne))
orderRouter.post('/orders/', authMiddleware, catchError(orderController.createOrder))
orderRouter.delete('/orders/:id', authMiddleware, catchError(orderController.deleteOrder))

export default orderRouter
