import {ApiError} from '../exceptions/ApiError'
import {customersService} from '../services/customersService'
import {usersService} from '../services/usersService'

const getAll = async (req: any, res: any) => {
  const customers = await customersService.getCustomers()

  res.json(customers)
}

const getById = async (req: any, res: any) => {
  const {id} = req.params

  const customer = await customersService.findById(+id)

  if (!customer) {
    ApiError.BadRequest('No such user')

    return
  }

  res.json(customer)
}

export const customersController = {
  getAll,
  getById,
}
