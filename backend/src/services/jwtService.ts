import { User } from '@prisma/client'
import jwt from 'jsonwebtoken'

function sign(user: Partial<User>) {
  return jwt.sign(user, process.env.JWT_KEY || '', {expiresIn: '1m'})
}

function verify(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_KEY || '')
  } catch (error) {
    console.log(error)
    return null
  }
}

function signRefresh(user: Partial<User>) {
  return jwt.sign(user, process.env.JWT_REFRESH_KEY || '')
}

function verifyRefresh(token: string) {
  try {
    return jwt.verify(token, process.env.JWT_REFRESH_KEY || '')
  } catch (error) {
    return null
  }
}


export const jwtService = {
  sign,
  verify,
  signRefresh,
  verifyRefresh,
}
