import { ordersGetApi } from 'api/orders'
import { useQuery } from 'react-query'
import styles from './Orders.module.scss'
import { Button } from '@blueprintjs/core'
import { Table, isAccessorColumn } from 'shared/table/Table'
import { useMemo } from 'react'
import { OrderRowType, useColumnDefs } from './use-column-defs'
import { Order } from '../../../../backend/src/types/order'
import { makeOrderRow } from './utils/makeOrderRow'

const MOCK_ORDERS = [
  {
    id: '1',
    customerId: '123',
    managerId: '456',
    status: 'pending',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '123 Main St, Springfield, IL 62704',
    productDetails: {
      '1': {
        id: '1',
        name: 'Apple',
        quantity: 2,
        units: 't',
        pricePerUnit: 1.99,
      },
      '2': {
        id: '2',
        name: 'Banana',
        quantity: 3,
        units: 'l',
        pricePerUnit: 0.99,
      },
    },
  },
  {
    id: '2',
    customerId: '789',
    managerId: '456',
    status: 'completed',
    createdAt: new Date(),
    updatedAt: new Date(),
    shippingAddress: '456 Elm St, Chicago, IL 60604',
    productDetails: {
      '1': {
        id: '3',
        name: 'Orange',
        quantity: 4,
        units: 't',
        pricePerUnit: 2.99,
      },
      '2': {
        id: '4',
        name: 'Grapes',
        quantity: 5,
        units: 'l',
        pricePerUnit: 1.49,
      },
    },
  },
  // Add more orders here...
] as Order[]

export const Orders = () => {
  const { data: orders, isFetching } = useQuery(['orders'], async () => {
    return await ordersGetApi(`/orders` as '/orders')
  })

  const { columns } = useColumnDefs()

  const accessorColumns = useMemo(() => {
    return columns.filter(isAccessorColumn)
  }, [columns])

  const rows = useMemo(() => {
    if (!orders) {
      return []
    }

    const data: OrderRowType[] = []
    const rows = MOCK_ORDERS?.map((order) => makeOrderRow(order))
    // const filteredRows = filterPlayer(selectedFilterText, rows)

    data.push(...rows)

    return data
  }, [orders])

  if (orders) {
    console.log(orders[0].productDetails)
  }

  if (!orders) {
    return null
  }

  return (
    <div className={styles.wrapper}>
      Orders <Button>AAA</Button>
      <Table data={rows} columns={accessorColumns} theme="light" isLoading={isFetching} />
    </div>
  )
}
