import React, { useContext, useEffect } from 'react'
import './App.scss'
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom'
import { Orders } from 'pages/orders/Orders'
import { OrderPage } from 'pages/order-page/OrderPage'
import { AuthContext } from 'shared/components/auth/AuthContext'
import { Spinner } from '@blueprintjs/core'
import { RequireAuth } from 'shared/components/auth/RequireAuth'
import { LoginPage } from 'pages/login/Login'

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
        <Route path="/" element={<RequireAuth />}>
          <Route path="orders/" element={<Orders />} />
          <Route path="orders/:id" element={<OrderPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  )
}
export default App
