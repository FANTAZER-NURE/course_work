import {customersService} from '../services/customersService'
import {usersService} from '../services/usersService'

const getAll = async (req: any, res: any) => {
  const customers = await customersService.getCustomers()

  res.json(customers)
}

export const customersController = {
  getAll,
}
