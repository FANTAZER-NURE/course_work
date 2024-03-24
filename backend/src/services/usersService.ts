import {PrismaClient, User} from '@prisma/client'
import {ApiError} from '../exceptions/ApiError'
import { TUser } from 'src/types/user'

const prisma = new PrismaClient()

const getUsers = async () => {
  const users = await prisma.user.findMany({where: {activationToken: null}})

  return users as User[]
}

function normalize({id, email, name, role}: Partial<User>) {
  return {id, email, name, role}
}

const findByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {email},
  })

  return user
}

const findById = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: {id},
  })

  console.log(user)

  return user
}

const deleteUser = async (id: number) => {
  const user = await prisma.user.findUnique({
    where: {
      id: id,
    },
  })

  if (!user) {
    ApiError.BadRequest('No such user')
  }

  await prisma.user.delete({
    where: {
      id: id,
    },
  })

  return user
}


const updateUser = async (id: number, updatedOrderData: {
  name: string,
  email: string,
  role: TUser['role']
}) => {
  const updatedUser = await prisma.user.update({
    where: {id},
    data: updatedOrderData,
  })

  if (!updatedUser) {
    ApiError.BadRequest('No such order')
  }

  return updatedUser
}

export const usersService = {
  getUsers,
  normalize,
  findByEmail,
  findById,
  deleteUser,
  updateUser,
}
