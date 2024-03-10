import React, { useEffect, useState } from 'react'
import { userService } from 'services/userService'
import { useQuery } from 'react-query'
import { Loader } from 'app/App'
import { getApi } from 'api/httpClient'
import { ErrorState, usePageError } from 'hooks/use-page-error'
import { TUser } from '../../../../backend/src/types/user'

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
  // const [users, setUsers] = useState<TUser[]>([])
  // const [isFetching, setIsFetching] = useState(false)

  // console.log(
  //   'PROMISE',
  //   userService.getAll().then((res) => console.log('PROMISE2', res))
  // )

  if (isFetching) {
    return <Loader />
  }

  return (
    <div className="content">
      <h1 className="title">Users</h1>

      <ul>{users?.map((user) => <li key={user.id}>{user.email}</li>)}</ul>

      {error && <p className="notification is-danger is-light">{error}</p>}
    </div>
  )
}
