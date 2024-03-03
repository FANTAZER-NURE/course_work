import React from 'react'
import { createRoot } from 'react-dom/client'
import './index.scss'
import App from './app/App'
import { QueryClient, QueryClientProvider } from 'react-query'
import { AuthProvider } from 'shared/components/auth/AuthContext'

const queryClient = new QueryClient()

const container = document.getElementById('root')!
const root = createRoot(container)

root.render(
  <React.StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>
        <App />
      </QueryClientProvider>
    </AuthProvider>
  </React.StrictMode>
)
