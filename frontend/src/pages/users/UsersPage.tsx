import React, { useCallback, useContext, useEffect, useMemo, useState } from 'react'
import { useQuery } from 'react-query'
import { Loader } from 'app/App'
import { getApi } from 'api/httpClient'
import { ErrorState, usePageError } from 'hooks/use-page-error'
import { TUser } from '../../../../backend/src/types/user'
import { Button, Intent, Spinner } from '@blueprintjs/core'
import { FlexContainer } from 'shared/ui/FlexContainer'
import { Table, isAccessorColumn } from 'shared/table/Table'
import styles from './UsersPage.module.scss'
import classNames from 'classnames'
import { UserRowType, useUsersColumnDefs } from './use-users-column-defs'
import { useNavigate } from 'react-router'
import { AuthContext } from 'shared/components/auth/AuthContext'
import { VerticalSpacing } from 'shared/ui/VerticalSpacing'

export const UsersPage = () => {
  const { data: users, isFetching } = useQuery(
    ['users'],
    async () => {
      return await getApi(`/users` as '/users')
    },
    {
      onError: (e) => {
        setError(e as ErrorState)
      },
    }
  )

  const { data: orders } = useQuery(['orders'], async () => {
    return await getApi(`/orders`)
  })

  const { user } = useContext(AuthContext)

  const [error, setError] = usePageError('')

  const { columns } = useUsersColumnDefs(orders || [])

  const visibleColumns = useMemo(() => {
    if (user!.role === 'admin' || user!.role === 'director') {
      return columns
    }

    if (user!.role === 'manager') {
      return columns.filter((iter) => iter.accessorKey !== 'role' && iter.accessorKey !== 'orders')
    }

    return columns
  }, [columns, user])

  const visibleUsers = useMemo(() => {
    if (!users) {
      return []
    }
    if (user!.role === 'admin') {
      return users
    }
    if (user!.role === 'director') {
      return users.filter((iter) => iter.role !== 'admin' && iter.id !== user?.id)
    }
    if (user!.role === 'manager') {
      return users.filter((iter) => iter.role === 'manager' && iter.id !== user?.id)
    }

    return users
  }, [user, users])

  const accessorColumns = useMemo(() => {
    return visibleColumns.filter(isAccessorColumn)
  }, [visibleColumns])

  const navigate = useNavigate()

  const redirectToNewPage = useCallback(
    (value: string) => {
      navigate(`/users/${value}`)
    },
    [navigate]
  )

  if (isFetching) {
    return <Spinner />
  }

  return (
    <FlexContainer column centered className={classNames(styles.wrapper)}>
      <h1 className="title">Users</h1>

      {user!.role === 'admin' ? <Button intent={Intent.PRIMARY}>Create User</Button> : null}

      <VerticalSpacing />

      <FlexContainer centeredX className={styles.tableWrapper}>
        <Table
          data={visibleUsers as UserRowType[]}
          columns={accessorColumns}
          theme="light"
          isLoading={isFetching}
          redirectToNewPage={redirectToNewPage}
          redirectColumns={['name']}
        />
      </FlexContainer>
    </FlexContainer>
  )
}
