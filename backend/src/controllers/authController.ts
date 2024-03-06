import {validationResult} from 'express-validator'
import {ApiError} from '../exceptions/ApiError'
import {registerService} from '../services/registerService'
import bcrypt from 'bcrypt'
import {PrismaClient} from '@prisma/client'
import {jwtService} from '../services/jwtService'
// import { emailService } from 'src/services/emailService'
import {v4 as uuid} from 'uuid'
import {emailService} from '../services/emailService'

const prisma = new PrismaClient()

const registration = async (req: any, res: any) => {
  const {name, email, password, role, avatarUrl} = req.body

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    throw ApiError.BadReguest('Validation error', errors)
  }

  const activationToken = uuid()

  const user = await registerService.createUser(
    name,
    email,
    password,
    role,
    avatarUrl || '.',
    activationToken
  )
  await emailService.sendActivationEmail(email, activationToken)

  res.send(user)
}

const login = async (req: any, res: any) => {
  const {email, password} = req.body

  const user = await prisma.user.findUnique({
    where: {email},
  })

  console.log('login', user)
  if (!user) {
    throw ApiError.BadReguest('User with email does not exist')
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    console.log('---------invalid--------')
    throw ApiError.BadReguest('Password is wrong')
  }

  const jwtToken = await jwtService.generateAccessToken(user.id)
  console.log('1111111', jwtToken)

  res.json({message: 'Login successful', token: jwtToken})

  // const {email, password, token} = req.body

  // if (!token) {
  //   const user = await userService.getUserByEmail(email)

  //   if (!user) {
  //     throw ApiError.BadReguest('User with email does not exist')
  //   }

  //   const isPasswordValid = await bcrypt.compare(password, user.password)

  //   if (!isPasswordValid) {
  //     throw ApiError.BadReguest('Password is wrong')
  //   }

  //   if (user.activationToken) {
  //     res.statusCode = 401
  //     res.send('User no active')

  //     return
  //   }

  //   await sendAuthentication(res, user)
  // } else {
  //   const user = jwtService.validateAccessToken(token.slice(1, -1))

  //   if (!user) {
  //     throw ApiError.BadReguest('Token no valid')
  //   }
  //   res.send(user)
  // }
}

const activation = async (req: any, res: any) => {
  const {activationToken} = req.params

  const user = await prisma.user.findUnique({
    where: {
      activationToken: activationToken,
    },
  })

  if (!user) {
    res.sendStatus(404)
    return
  }

  await prisma.user.update({
    where: {id: user.id}, // Use the unique ID for accurate updates
    data: {
      activationToken: null,
    },
  })

  res.send(user)
}

export const authController = {
  registration,
  login,
  activation,
}
