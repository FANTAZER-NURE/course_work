import {PrismaClient, User} from '@prisma/client'

const prisma = new PrismaClient()

const getUsers = async () => {
  const users = await prisma.user.findMany({where: {activationToken: null}})

  return users as User[]
}

function normalize({id, email, name}: Partial<User>) {
  console.log('NORMALIZE', name)
  return {id, email, name}
}

const findByEmail = async (email: string) => {
  const user = await prisma.user.findUnique({
    where: {email},
  })

  return user
}

export const usersService = {
  getUsers,
  normalize,
  findByEmail,
}
