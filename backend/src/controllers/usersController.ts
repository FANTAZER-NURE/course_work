import {usersService} from '../services/usersService'

const getAll = async (req: any, res: any) => {
  const users = await usersService.getUsers()

  res.json(users.map((user) => usersService.normalize(user)))
}

export const usersController = {
  getAll,
}
