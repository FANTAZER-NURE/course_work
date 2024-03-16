import {Router} from 'express'
import {catchError} from '../utils/catchError'
import {authMiddleware} from '../middlewares/authMiddlewares'
import {customersController} from '../controllers/customersController'

const customersRouter = Router()

customersRouter.get('/customers', authMiddleware, catchError(customersController.getAll))
customersRouter.get('/customers/:id', authMiddleware, catchError(customersController.getById))

export default customersRouter
