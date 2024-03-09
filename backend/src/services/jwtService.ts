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
    console.log(error)
    return null
  }
}

// function generateAccessToken(user: User) {
//   console.log('here', process.env.JWT_ACCESS_SECRET)
//   return jwt.sign(user, process.env.JWT_ACCESS_SECRET || '', {expiresIn: '1d'})
// }

// function generateRefreshToken(user: any) {
//   return jwt.sign(user, process.env.JWT_REFRESH_SECRET || '', {expiresIn: '14d'})
// }

// function validateAccessToken(token: any) {
//   try {
//     return jwt.verify(token, process.env.JWT_ACCESS_SECRET || '')
//   } catch (error) {
//     console.log(error)
//     return null
//   }
// }

// function validateRefreshToken(token: any) {
//   try {
//     return jwt.verify(token, process.env.JWT_REFRESH_SECRET || '')
//   } catch (error) {
//     return null
//   }
// }

export const jwtService = {
  // validateAccessToken,
  // generateAccessToken,
  // generateRefreshToken,
  // validateRefreshToken,
  sign,
  verify,
  signRefresh,
  verifyRefresh,
}
