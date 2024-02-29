import {Router} from 'express'
import {catchError} from '../utils/catchError'
import {orderController} from '../controllers/ordersController'

const orderRouter = Router()

// const handleOrdersGet = catchError(orderController.getAll)

const catchErrorMiddleware = catchError(orderController.getAll)

// Register the middleware within the router
orderRouter.use(catchErrorMiddleware)

// Define the route using the middleware
orderRouter.get('/orders', (req: Request, res: Response, next: Function) => {
  // ... route logic here
})

orderRouter.get('/orders', (req: Request, res: Response, next: Function) => {
  catchError(orderController.getAll)(req, res, next)
  orderController.getAll(req, res)
})

// orderRouter.get('/orders/:id', catchError(orderController.getById))

// orderRouter.post('/orders', catchError(orderController.create))

// orderRouter.delete('/items/:id', catchError(orderController.remove))

export default orderRouter
