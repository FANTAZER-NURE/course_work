import {Router} from 'express'
import {catchError} from '../utils/catchError'
import {authMiddleware} from '../middlewares/authMiddlewares'
import { productsController } from '../controllers/productsController'

const productsRouter = Router()

productsRouter.get('/products', authMiddleware, catchError(productsController.getAll))

export default productsRouter
