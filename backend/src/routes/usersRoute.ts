import {Router} from 'express'
import {catchError} from '../utils/catchError'
import {orderController} from '../controllers/ordersController'
import { usersController } from '../controllers/usersController'
import { authMiddleware } from '../middlewares/authMiddlewares'

const usersRouter = Router()

usersRouter.get('/users', catchError(usersController.getAll))

export default usersRouter
