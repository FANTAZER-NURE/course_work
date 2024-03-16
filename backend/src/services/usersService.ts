import {PrismaClient, User} from '@prisma/client'

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

export const usersService = {
  getUsers,
  normalize,
  findByEmail,
  findById,
}
