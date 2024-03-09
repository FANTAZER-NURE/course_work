import { ColumnDef } from '@tanstack/react-table'
import { TOrder } from '../../../../backend/src/types/order'
import { useMemo } from 'react'

export type OrderRowType = TOrder & {
  orderPrice: number
}

const BASIC_COLUMNS: ColumnDef<OrderRowType, any>[] = [
  {
    header: 'id',
    accessorKey: 'id',
    cell: (info) => info.getValue(),
  },
  {
    header: 'Date',
    accessorKey: 'createdAt',
    cell: (info) =>
      info.getValue().toLocaleString('en-US', {
        day: '2-digit',
        month: '2-digit',
        year: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        hour12: false,
      }),
  },
  {
    header: 'Status',
    accessorKey: 'status',
    cell: (info) => info.getValue(),
  },
  {
    header: 'Manager',
    accessorKey: 'managerId',
    cell: (info) => info.getValue(),
  },
  {
    header: 'Customer',
    accessorKey: 'customerId',
    cell: (info) => info.getValue(),
  },
  {
    header: 'Full Price',
    accessorKey: 'fullPrice',
    cell: (info) => {
      const items = info.row.original.productDetails

      let price = 0

      Object.keys(items).forEach((key) => {
        price += items[key].quantity * items[key].pricePerItem
      })

      return price.toFixed(3)
    },
    // sortingFn: () => {} // TODO!
  },
  {
    header: 'Shipping address',
    accessorKey: 'shippingAddress',
    cell: (info) => info.getValue(),
  },
  {
    header: 'Shipping address',
    accessorKey: 'shippingAddress',
    cell: (info) => info.getValue(),
  },
]

export const COLUMN_KEYS: Array<keyof OrderRowType> = ['id', 'createdAt']

export function useColumnDefs() {
  const columns = useMemo(() => {
    return [...BASIC_COLUMNS]
  }, [])

  const allColumnKeys = useMemo(() => {
    return COLUMN_KEYS
  }, [])

  return { columns, allColumnKeys }
}
