import { ProductDetails } from '../../backend/src/types/order'
import { getApi, postApi } from './api/httpClient'
const mangerIds = ['3', '5', '6', '7']

const items: ProductDetails[] = [
  { id: '1', product: { id: 1, name: 'A95' }, quantity: 5, pricePerUnit: 50000 },
  { id: '2', product: { id: 2, name: 'A92' }, quantity: 5, pricePerUnit: 45000 },
  { id: '3', product: { id: 3, name: 'Дизель' }, quantity: 5, pricePerUnit: 48000 },
]

async function createOrders(number: number) {
  const customers = await getApi(`/customers`)

  const customerIds = customers.map((iter) => iter.id)
  const customerAddress = customers.map((iter) => iter.shippindAdress)

  for (let i = 0; i < number; i++) {
    const customerIndex = i % customerIds.length
    const customerId = customerIds[customerIndex]
    const shippingAddress = customerAddress[customerIndex]
    const managerId = +mangerIds[customerIndex]

    await postApi('/orders', {
      customerId,
      shippingAddress,
      items: items,
      managerId,
    })
  }
}

createOrders(1)
