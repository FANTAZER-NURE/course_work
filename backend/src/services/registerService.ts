import {PrismaClient} from '@prisma/client'
import {Role} from 'src/types/roles'
import bcryptjs from 'bcryptjs'
import {ApiError} from '../exceptions/ApiError'

const prisma = new PrismaClient()

const createUser = async (
  name?: string,
  email?: string,
  password?: string,
  role?: Role,
  avatarUrl?: string,
  activationToken?: string
) => {
  if (!name || !email || !password || !role || !avatarUrl) {
    throw ApiError.BadReguest('missing some args', {
      message: 'missing some args',
    })
  }

  if (!activationToken) {
    throw ApiError.BadReguest('no activation token', {
      message: 'no activation token',
    })
  }

  const hashedPassword = await bcryptjs.hash(password, 10)
  const user = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      role,
      avatarUrl,
      activationToken,
    },
  })

  return user
}

export const registerService = {
  createUser,
}
