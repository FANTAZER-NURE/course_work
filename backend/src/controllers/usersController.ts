import {usersService} from '../services/usersService'

const getAll = async (req: any, res: any) => {
  const users = await usersService.getUsers()

  console.log('USERS---', users)

  res.json(users.map((user) => usersService.normalize(user)))
}

export const usersController = {
  getAll,
}
