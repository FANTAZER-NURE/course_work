import { usePageError } from 'hooks/use-page-error'
import React, { useEffect, useState } from 'react'
import { userService } from 'services/userService'
import { TUser } from '../../../../backend/src/types/user'

export const UsersPage = () => {
  const [error, setError] = usePageError('')
  const [users, setUsers] = useState<TUser[]>([])

  useEffect(() => {
    userService
      .getAll()
      .then((res) => setUsers(res.data))
      .catch((error) => {
        setError(error.message)
      })
  }, [])

  console.log(users)

  return (
    <div className="content">
      <h1 className="title">Users</h1>

      <ul>
        {users.map((user) => (
          <li key={user.id}>{user.email}</li>
        ))}
      </ul>

      {error && <p className="notification is-danger is-light">{error}</p>}
    </div>
  )
}
