'use strict'
import express, {Application} from 'express'
import {PrismaClient} from '@prisma/client'
import orderRouter from './routes/ordersRoute'
import authRouter from './routes/authRouter'
import 'dotenv/config'
import cors from 'cors'

const prisma = new PrismaClient()
const app: Application = express()

//use json
app.use(express.json())

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

//test api with error handling
app.get('/test', (req, res, next) => {
  try {
    res.status(200).json({message: 'Success!'})
  } catch (err) {
    next(err)
  }
})

app.use(orderRouter)
app.use(authRouter)

//Start server
const PORT = process.env.PORT || 4000
app.listen(PORT, () => console.log(`Server running on port ${PORT}`))
