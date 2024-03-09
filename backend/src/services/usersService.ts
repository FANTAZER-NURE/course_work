import {PrismaClient, User} from '@prisma/client'

const prisma = new PrismaClient()

const getUsers = async () => {
  const users = await prisma.user.findMany({where: {activationToken: null}})

  console.log(users)

  return users as User[]
}

function normalize({id, email}: Partial<User>) {
  return {id, email}
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
