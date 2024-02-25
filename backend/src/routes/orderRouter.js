import express from 'express'
import {orderController} from '../controllers/orderController.js'
import {catchError} from '../../../../../Downloads/node_auth-app/src/utils/catchError.js/index.js'

const orderRouter = new express.Router()

orderRouter.get('/orders', catchError(orderController.getAll))

// orderRouter.get('/orders/:id', catchError(orderController.getById))

// orderRouter.post('/orders', catchError(orderController.create))

// orderRouter.delete('/items/:id', catchError(orderController.remove))

export default orderRouter
