import React from 'react'
import './index.scss'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Orders } from 'pages/orders/Orders'

const App = () => {
  console.log('here')
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Orders />} />
        <Route path="*" element={<div>Page not found</div>} />
      </Routes>
    </BrowserRouter>
  )
}
export default App
