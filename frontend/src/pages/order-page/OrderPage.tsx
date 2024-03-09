import { Spinner } from '@blueprintjs/core'
import { ordersGetApi } from 'api/httpClient'
import { Loader } from 'app/App'
import { useQuery } from 'react-query'
import { useParams } from 'react-router'

interface OrderPageProps {}

export const OrderPage: React.FC<OrderPageProps> = () => {
  const { id } = useParams()

  const { data: order, isFetching } = useQuery(['order'], async () => {
    return await ordersGetApi(`/orders/${id}` as '/orders/:id')
  })

  console.log(order)

  if (isFetching) {
    return <Loader />
  }

  return <>ORDER {order?.id}</>
}
