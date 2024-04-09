import { AccessorKeyColumnDef, Row } from '@tanstack/react-table'
import { TOrder } from '../../../../backend/src/types/order'
import { useMemo } from 'react'
import { TUser } from '../../../../backend/src/types/user'
import React from 'react'
import { TCustomer } from '../../../../backend/src/types/customer'
import { Link } from 'react-router-dom'
import { numberWithSpaces } from 'utils/numberWithSpaces'

export type OrderRowType = TOrder & {
  orderPrice: number
}

export const COLUMN_KEYS: Array<keyof OrderRowType> = ['id', 'createdAt']

export function useOrdersColumnDefs(managers: TUser[], customers: TCustomer[]) {
  const columns = useMemo<AccessorKeyColumnDef<OrderRowType, any>[]>(() => {
    return [
      {
        header: 'id',
        accessorKey: 'id',
        cell: (info) => info.getValue(),
      },
      {
        header: 'Дата',
        accessorKey: 'createdAt',
        cell: (info) => {
          const date = new Date(info.getValue())

          return date.toLocaleString('en-GB', {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
          })
        },
      },
      {
        header: 'Статус',
        accessorKey: 'status',
        cell: (info) => info.getValue(),
      },
      {
        header: 'Менеджер',
        accessorKey: 'managerId',
        cell: (info) => {
          const managerId = info.getValue()

          const manager = managers?.find((iter) => iter.id === managerId)

          if (!manager) {
            return '-'
          }

          return <Link to={`../users/${manager.id}`}>{manager.name}</Link>
        },
      },
      {
        header: 'Замовник',
        accessorKey: 'customerId',
        cell: (info) => {
          const customerId = info.getValue()

          const customer = customers?.find((iter) => iter.id === customerId)

          if (!customer) {
            return '-'
          }

          return customer.name
        },
      },
      {
        header: 'Замовлення',
        accessorKey: 'productDetails',
        cell: ({ row, getValue }) => {
          const items = row.original.productDetails
          return (
            <div style={{ height: 'fit-content' }}>
              {items.map((item) => {
                return (
                  <div key={item.id}>
                    {item.product.name}: {item.quantity}т (
                    {numberWithSpaces(item.pricePerUnit * item.quantity)} грн)
                  </div>
                )
              })}
            </div>
          )
        },
      },
      {
        header: 'Ціна',
        accessorKey: 'pricePerUnit',
        cell: ({ row, getValue }) => {
          const items = row.original.productDetails
          return (
            <div style={{ height: 'fit-content' }}>
              {items.map((item) => {
                return (
                  <div key={item.id}>
                    {item.product.name}: {numberWithSpaces(item.pricePerUnit)} грн/т
                  </div>
                )
              })}
            </div>
          )
        },
        enableSorting: false,
      },

      {
        header: 'Повна ціна (грн)',
        accessorKey: 'fullPrice',
        cell: (info) => {
          const items = info.row.original.productDetails

          let price = 0

          items.forEach((item) => {
            price += item.quantity * item.pricePerUnit
          })

          return numberWithSpaces(price)
        },
        sortingFn: (rowA: Row<OrderRowType>, rowB: Row<OrderRowType>) => {
          const itemsA = rowA.original.productDetails
          const itemsB = rowB.original.productDetails

          let priceA = 0
          let priceB = 0

          itemsA.forEach((item) => {
            priceA += item.quantity * item.pricePerUnit
          })

          itemsB.forEach((item) => {
            priceB += item.quantity * item.pricePerUnit
          })

          return priceB < priceA ? 1 : priceA > priceB ? -1 : 0
        },
      },
      {
        header: 'Адреса доставки',
        accessorKey: 'shippingAddress',
        cell: (info) => info.getValue(),
      },
    ]
  }, [customers, managers])

  const allColumnKeys = useMemo(() => {
    return COLUMN_KEYS
  }, [])

  return { columns, allColumnKeys }
}
