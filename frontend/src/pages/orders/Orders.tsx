import { ordersGetApi } from 'api/orders'
import { useQuery } from 'react-query'

interface OrdersProps {}

export const Orders = () => {
  const { data: orders } = useQuery(['orders'], async () => {
    return await ordersGetApi(`/orders` as '/orders')
  })

  console.log(orders)

  return <div>Orders</div>
}
