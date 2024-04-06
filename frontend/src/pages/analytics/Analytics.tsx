import { Spinner } from '@blueprintjs/core'
import { getApi } from 'api/httpClient'
import { SalesByProductChart } from 'pages/charts/SalesByProductChart'
import { SalesRevenueChart } from 'pages/charts/SalesRevenueChart'
import { useContext, useMemo } from 'react'
import { useQuery } from 'react-query'
import { AuthContext } from 'shared/components/auth/AuthContext'

interface AnalyticsProps {}

export const Analytics: React.FC<AnalyticsProps> = () => {
  const { users } = useContext(AuthContext)

  const { data: orders, isFetching: isFetchingOrders } = useQuery(
    ['orders', users],
    async () => {
      return await getApi(`/orders`)
    },
    {
      staleTime: 60_000,
      keepPreviousData: true,
    }
  )

  const managers = useMemo(() => {
    return users?.filter((user) => user.role === 'manager')
  }, [users])

  if (isFetchingOrders) {
    return <Spinner />
  }

  if (!orders) {
    return <div>no orders</div>
  }

  return (
    <div>
      <SalesRevenueChart managers={managers} orders={orders} />
      <SalesByProductChart managers={managers} orders={orders} />
    </div>
  )
}
