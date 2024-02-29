import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './app'
import { QueryClient, QueryClientProvider } from 'react-query'

const queryClient = new QueryClient()

const container = document.getElementById('root')!
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <QueryClientProvider client={queryClient}>
      <App />
    </QueryClientProvider>
  </React.StrictMode>
)
