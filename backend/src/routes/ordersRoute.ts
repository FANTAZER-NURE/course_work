import {Router} from 'express'
import {catchError} from '../utils/catchError'
import {orderController} from '../controllers/ordersController'

const orderRouter = Router()

orderRouter.get('/orders', catchError(orderController.getAll))
orderRouter.get('/orders/:id', catchError(orderController.getOne))

export default orderRouter
