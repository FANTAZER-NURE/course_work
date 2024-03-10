import React, { useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import { Loader } from 'app/App'
import { getApi } from 'api/httpClient'
import { ErrorState, usePageError } from 'hooks/use-page-error'
import { TUser } from '../../../../backend/src/types/user'
import { Spinner } from '@blueprintjs/core'

export const UsersPage = () => {
  const { data: users, isFetching } = useQuery(
    ['orders'],
    async () => {
      return await getApi(`/users` as '/users')
    },
    {
      onError: (e) => {
        setError(e as ErrorState)
      },
    }
  )

  const [error, setError] = usePageError('')

  if (isFetching) {
    return <Spinner />
  }

  return (
    <div className="content">
      <h1 className="title">Users</h1>

      <ul>{users?.map((user) => <li key={user.id}>{user.email}</li>)}</ul>

      {error && <p className="notification is-danger is-light">{error}</p>}
    </div>
  )
}
