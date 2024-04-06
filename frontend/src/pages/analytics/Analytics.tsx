import { Spinner } from '@blueprintjs/core'
import { getApi } from 'api/httpClient'
import { OrdersChart } from 'pages/charts/OrdersChart'
import { SalesByProductChart } from 'pages/charts/SalesByProductChart'
import { SalesRevenueChart } from 'pages/charts/SalesRevenueChart'
import { useContext, useMemo } from 'react'
import { useQuery } from 'react-query'
import { AuthContext } from 'shared/components/auth/AuthContext'
import { VerticalSpacing } from 'shared/ui/VerticalSpacing'
import styles from './Analytics.module.scss'
import { CustomersChart } from 'pages/charts/CustomersChart'

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

  const { data: customers, isFetching: isFetchingCustomers } = useQuery(
    ['customers', users],
    async () => {
      return await getApi(`/customers`)
    },
    {
      staleTime: 60_000,
      keepPreviousData: true,
    }
  )

  const managers = useMemo(() => {
    return users?.filter((user) => user.role === 'manager')
  }, [users])

  if (isFetchingOrders || isFetchingCustomers) {
    return <Spinner />
  }

  if (!orders || !customers) {
    return <div>no orders</div>
  }

  return (
    <div className={styles.wrapper}>
      <SalesRevenueChart managers={managers} orders={orders} />
      <VerticalSpacing size="xlarge" />
      <SalesByProductChart managers={managers} orders={orders} />
      <VerticalSpacing size="xlarge" />
      <OrdersChart managers={managers} orders={orders} />
      <VerticalSpacing size="xlarge" />
      <CustomersChart customers={customers} orders={orders} />
    </div>
  )
}
