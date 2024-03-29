import {ApiError} from '../exceptions/ApiError'
import {usersService} from '../services/usersService'

const getAll = async (req: any, res: any) => {
  const users = await usersService.getUsers()

  res.json(users.map((user) => usersService.normalize(user)))
}

const getById = async (req: any, res: any) => {
  const {id} = req.params

  const user = await usersService.findById(+id)

  if (!user) {
    ApiError.BadRequest('No such user')

    return
  }

  res.json(usersService.normalize(user))
}

const deleteUser = async (req: any, res: any) => {
  const {id} = req.params

  const user = await usersService.deleteUser(+id)

  res.send(user)
}


const updateUser = async (req: any, res: any) => {
  const {id} = req.params
  const updatedUserData = req.body

  const updatedUser = await usersService.updateUser(+id, updatedUserData)

  res.json(updatedUser)
}

export const usersController = {
  getAll,
  getById,
  deleteUser,
  updateUser,
}
