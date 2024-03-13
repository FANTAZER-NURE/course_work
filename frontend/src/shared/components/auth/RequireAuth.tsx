import { Navigate, Outlet, useLocation } from 'react-router-dom'
import React, { useContext } from 'react'
import { Spinner } from '@blueprintjs/core'
import { AuthContext } from './AuthContext'
import { Loader } from '../../../app/App'
import { Header } from 'shared/ui/Header'

export const RequireAuth = () => {
  const { isChecked, user } = useContext(AuthContext)

  const location = useLocation()

  if (!isChecked) {
    return (
      <>
        <Loader />
      </>
    )
  }

  if (!user) {
    return (
      <>
        <Navigate to="/login" state={{ from: location }} replace />
      </>
    )
  }

  return (
    <div>
      <Header />
      <Outlet />
    </div>
  )
}
