import {productsService} from '../services/productsService'

const getAll = async (req: any, res: any) => {
  const products = await productsService.getProducts()

  res.json(products)
}

export const productsController = {
  getAll,
}
