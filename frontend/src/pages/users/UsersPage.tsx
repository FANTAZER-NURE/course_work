import React, { useEffect, useState } from 'react'
import { userService } from 'services/userService'
import { useQuery } from 'react-query'
import { Loader } from 'app/App'
import { getApi } from 'api/httpClient'
import { usePageError } from 'hooks/use-page-error'
import { TUser } from '../../../../backend/src/types/user'

export const UsersPage = () => {
  // const {
  //   data: users,
  //   isFetching,
  //   status,
  // } = useQuery(['orders'], async () => {
  //   return await getApi(`/users` as '/users')
  // })

  const [error, setError] = usePageError('')
  const [users, setUsers] = useState<TUser[]>([])
  const [isFetching, setIsFetching] = useState(false)

  useEffect(() => {
    setIsFetching(true)
    userService
      .getAll()
      .then(setUsers)
      .catch((error) => {
        setError(error.message)
      })
      .finally(() => {
        setIsFetching(false)
      })
  }, [setError])

  console.log(users)

  if (isFetching) {
    return <Loader />
  }

  // if (!users) {
  //   return null
  // }

  return (
    <div className="content">
      <h1 className="title">Users</h1>

      <ul>{users?.map((user) => <li key={user.id}>{user.email}</li>)}</ul>

      {error && <p className="notification is-danger is-light">Error</p>}
    </div>
  )
}
