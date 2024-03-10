import {cookie, validationResult} from 'express-validator'
import {ApiError} from '../exceptions/ApiError'
import {registerService} from '../services/registerService'
import bcrypt from 'bcrypt'
import {PrismaClient, User} from '@prisma/client'
import {jwtService} from '../services/jwtService'
// import { emailService } from 'src/services/emailService'
import {v4 as uuid} from 'uuid'
import {emailService} from '../services/emailService'
import {usersService} from '../services/usersService'
import {JwtPayload} from 'jsonwebtoken'

const prisma = new PrismaClient()

const registration = async (req: any, res: any) => {
  const {name, email, password, role, avatarUrl} = req.body

  const errors = validationResult(req)

  if (!errors.isEmpty()) {
    throw ApiError.BadRequest('Validation error', errors)
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

  if (!user) {
    throw ApiError.BadRequest('User with email does not exist, or wrong password')
  }

  const isPasswordValid = await bcrypt.compare(password, user.password)

  if (!isPasswordValid) {
    throw ApiError.BadRequest('Password is wrong')
  }
  generateTokens(res, user)
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

async function refresh(req: any, res: any) {
  const {refreshToken} = req.cookies
  const userData = jwtService.verifyRefresh(refreshToken)

  if (!userData) {
    throw ApiError.Unauthorized()
  }

  generateTokens(res, userData)
}

const logout = (req: any, res: any) => {
  res.clearCookie('refreshToken')
  res.sendStatus(204)
}

export const authController = {
  registration,
  login,
  activation,
  refresh,
  logout,
}

function generateTokens(res: any, user: string | JwtPayload | null) {
  const normalizedUser = usersService.normalize(user as User)

  const access = jwtService.sign(normalizedUser)
  const refresh = jwtService.signRefresh(normalizedUser)

  res.cookie('refreshToken', refresh, {
    maxAge: 30 * 24 * 60 * 60 * 1000,
    HttpOnly: true,
  })

  res.send({
    user: normalizedUser,
    token: access,
  })
}
