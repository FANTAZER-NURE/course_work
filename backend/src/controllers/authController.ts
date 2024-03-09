import {validationResult} from 'express-validator'
import {ApiError} from '../exceptions/ApiError'
import {registerService} from '../services/registerService'
import bcrypt from 'bcrypt'
import {PrismaClient} from '@prisma/client'
import {jwtService} from '../services/jwtService'
// import { emailService } from 'src/services/emailService'
import {v4 as uuid} from 'uuid'
import {emailService} from '../services/emailService'
import {usersService} from '../services/usersService'

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

  const user = await usersService.findByEmail(email)

  console.log('login', user)
  if (!user) {
    throw ApiError.BadReguest('User with email does not exist, or wrong password')
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    console.log('---------invalid--------')
    throw ApiError.BadReguest('Password is wrong')
  }

  const normalizedUser = usersService.normalize(user)

  const accessToken = jwtService.sign(normalizedUser)

  res.send({
    user: normalizedUser,
    accessToken,
  })

  // res.json({message: 'Login successful', token: jwtToken})
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
