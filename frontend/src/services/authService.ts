import { authGetApi, authPostApi } from 'api/auth'

function register({
  email,
  password,
  name,
  role,
}: {
  email: string
  password: string
  name: string
  role: string
}) {
  return authPostApi('/register' as '/register', { email, password, name, role })
}

function login({ email, password }: { email: string; password: string }) {
  return authPostApi('/login' as '/login', { email, password })
}

function logout() {
  return authPostApi('/logout' as '/logout')
}

function activate(activationToken: string) {
  return authGetApi(`/activate/${activationToken}` as '/activate/:activationToken')
}

function refresh() {
  return authGetApi('/refresh' as '/refresh')
}

export const authService = { register, login, logout, activate, refresh }
