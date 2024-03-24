import {Router} from 'express'
import {catchError} from '../utils/catchError'
import { usersController } from '../controllers/usersController'
import { authMiddleware } from '../middlewares/authMiddlewares'

const usersRouter = Router()

usersRouter.get('/users', authMiddleware,catchError(usersController.getAll))
usersRouter.get('/users/:id', authMiddleware, catchError(usersController.getById))
usersRouter.delete('/users/:id', authMiddleware, catchError(usersController.deleteUser))

export default usersRouter
