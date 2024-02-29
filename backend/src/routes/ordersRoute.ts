import {Router} from 'express'
import {catchError} from '../utils/catchError'
import {orderController} from '../controllers/ordersController'

const orderRouter = Router()

orderRouter.get('/orders', catchError(orderController.getAll))

export default orderRouter
