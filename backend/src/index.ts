'use strict'
import express, {Application} from 'express'
import {PrismaClient} from '@prisma/client'
import orderRouter from './routes/ordersRoute'
import authRouter from './routes/authRouter'
import 'dotenv/config'
import cors from 'cors'
import usersRouter from './routes/usersRoute'
import {errorMiddleware} from './middlewares/errorMiddleware'
import cookieParser from 'cookie-parser'
import customersRouter from './routes/customersRoute'
import productsRouter from './routes/productsRoute'

const prisma = new PrismaClient()
const app: Application = express()

//use json
app.use(express.json())
app.use(cookieParser())

//cors
app.use((req, res, next) => {
  res.setHeader('Access-Control-Allow-Origin', '*')
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE')
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization')
  res.setHeader('Access-Control-Allow-Credentials', 'true')
  next()
})

app.use(
  cors({
    origin: 'http://localhost:3000',
    credentials: true,
  })
)

app.use(orderRouter)
app.use(authRouter)
app.use(usersRouter)
app.use(customersRouter)
app.use(productsRouter)
app.use(errorMiddleware)

//Start server
const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
