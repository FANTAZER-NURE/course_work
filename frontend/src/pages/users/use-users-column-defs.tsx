import { AccessorKeyColumnDef } from '@tanstack/react-table'
import { TUser } from '../../../../backend/src/types/user'
import { useMemo } from 'react'
import React from 'react'
import { Avatar } from 'shared/ui/Avatar'
import { Tag } from '@blueprintjs/core'
import { FlexContainer } from 'shared/ui/FlexContainer'
import { ROLE_INTENTS_MAP } from 'constants/role-intent'
import { TOrder } from '../../../../backend/src/types/order'
import { Link } from 'react-router-dom'
import styles from './use-users.column-defs.module.scss'

export type UserRowType = TUser & {
  id: string
  orders?: TOrder[]
}

export const COLUMN_KEYS: Array<keyof UserRowType> = ['id']

export function useUsersColumnDefs(orders: TOrder[]) {
  const columns = useMemo<AccessorKeyColumnDef<UserRowType, any>[]>(() => {
    return [
      {
        header: '',
        accessorKey: 'avatarUrl',
        cell: (info) => {
          return <Avatar rounded url={info.getValue()} width={20} height={20} />
        },
        enableSorting: false,
      },
      {
        header: 'Імʼя',
        accessorKey: 'name',
        cell: (info) => info.getValue(),
      },
      {
        header: 'Пошта',
        accessorKey: 'email',
        cell: (info) => info.getValue(),
      },
      {
        header: 'Активні замовлення',
        accessorKey: 'orders',
        cell: (info) => {
          const value = (info.getValue() as 'admin') || 'director' || 'manager'

          const order = orders.filter((iter) => iter.managerId === info.row.original.id)

          return (
            <Link to="../orders" className={styles.orderLink}>
              <p>{order.length}</p>
            </Link>
          )
        },
      },
      {
        header: 'Роль',
        accessorKey: 'role',
        cell: (info) => {
          const value = (info.getValue() as 'admin') || 'director' || 'manager'

          return (
            <FlexContainer centered>
              <Tag intent={ROLE_INTENTS_MAP[value]}>{value}</Tag>
            </FlexContainer>
          )
        },
      },
    ]
  }, [orders])

  const allColumnKeys = useMemo(() => {
    return COLUMN_KEYS
  }, [])

  return { columns, allColumnKeys }
}
