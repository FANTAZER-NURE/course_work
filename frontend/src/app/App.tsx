import React, { useContext, useEffect } from 'react'
import './App.scss'
import '@fortawesome/fontawesome-free/css/all.min.css'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Orders } from 'pages/orders/Orders'
import { OrderPage } from 'pages/order-page/OrderPage'
import { AuthContext } from 'shared/components/auth/AuthContext'
import { RequireAuth } from 'shared/components/auth/RequireAuth'
import { LoginPage } from 'pages/login/Login'
import { Register } from 'pages/register/Register'
import { AccountActivationPage } from 'pages/register/AccountActivationPage'
import { Spinner } from '@blueprintjs/core/lib/esm/components/spinner/spinner'
import { UsersPage } from 'pages/users/UsersPage'

export const Loader = () => (
  <div className="loader-wrapper">
    <div className="loader is-loading"></div>
  </div>
)

const App = () => {
  const { isChecked, user, logout, checkAuth } = useContext(AuthContext)

  useEffect(() => {
    checkAuth()
  }, [checkAuth])

  if (!isChecked) {
    return <Spinner />
  }

  return (
    <BrowserRouter>
      <Routes>
        <Route path="*" element={<div>Page not found</div>} />
        <Route path="/login" element={<LoginPage />} />
        {/* <Route path="/" element={<RequireAuth />}>
          <Route path="orders/" element={<Orders />} />
          <Route path="orders/:id" element={<OrderPage />} />
        </Route> */}

        <Route path="/" element={<Navigate to="orders/" />} />
        <Route path="orders/:id" element={<OrderPage />} />
        <Route path="register" element={<Register />} />
        <Route path="activate/:activationToken" element={<AccountActivationPage />} />
        <Route path="/" element={<RequireAuth />}>
          <Route path="users" element={<UsersPage />} />
          <Route path="orders/" element={<Orders />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
export default App
