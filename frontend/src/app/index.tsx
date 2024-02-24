import React from 'react'
import './index.scss'
import { BrowserRouter, Route, Routes } from 'react-router-dom'
import { Gym } from '../pages/gym'
import { Money } from '../pages/money'
import { Calories } from '../pages/calories'
import { Home } from 'pages/home'

const App = () => {
  console.log('here')
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="*" element={<div>Page not found</div>} />
        <Route path="gym" element={<Gym />} />
        <Route path="calories/" element={<Calories />} />
        <Route path="money/" element={<Money />} />
      </Routes>
    </BrowserRouter>
  )
}
export default App
