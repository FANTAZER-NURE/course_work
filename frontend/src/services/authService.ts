import { authGetApi, authHttp, authPostApi } from 'api/auth'

function register({ email, password }: { email: string; password: string }) {
  return authPostApi('/registration' as '/registration', { email, password })
}

function login({ email, password }: { email: string; password: string }) {
  return authPostApi('/login' as '/login', { email, password })
}

function logout() {
  return authPostApi('/logout' as '/logout')
}

function activate(activationToken: string) {
  return authGetApi(`/activation/${activationToken}` as '/activation/:activationToken')
}

function refresh() {
  return authGetApi('/refresh' as '/refresh')
}

export const authService = { register, login, logout, activate, refresh }
