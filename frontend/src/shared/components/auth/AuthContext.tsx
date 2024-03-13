import React, { useCallback, useMemo, useState } from 'react'
import { accessTokenService } from 'services/accessTokenService'
import { authService } from 'services/authService'
import { TUser } from '../../../../../backend/src/types/user'
import { getApi } from 'api/httpClient'

export const AuthContext = React.createContext<{
  isChecked: boolean
  user: TUser | null
  users: TUser[]
  checkAuth: () => void
  logout: () => void
  login: ({ email, password }: { email: string; password: string }) => Promise<void>
  activate: (activationToken: string) => Promise<void>
}>({
  isChecked: false,
  user: null,
  users: [],
  checkAuth: () => {},
  logout: () => {},
  login: ({ email, password }) => {
    return new Promise(() => {})
  },
  activate(activationToken) {
    return new Promise(() => {})
  },
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<TUser | null>(null)
  const [users, setUsers] = useState<TUser[]>([])
  const [isChecked, setChecked] = useState(false)

  const activate = useCallback(async (activationToken: string) => {
    const { accessToken, user } = await authService.activate(activationToken)

    accessTokenService.save(accessToken)
    setUser(user)
  }, [])

  const checkAuth = useCallback(async () => {
    try {
      const { token, user } = await authService.refresh()
      const users = await getApi('/users')

      accessTokenService.save(token)
      setUser(user)
      setUsers(users)
    } catch (error) {
      console.log('User is not authentincated')
    } finally {
      setChecked(true)
    }
  }, [])

  const login = useCallback(async ({ email, password }: { email: string; password: string }) => {
    const { accessToken, user } = await authService.login({ email, password })

    accessTokenService.save(accessToken)
    setUser(user)
  }, [])

  const logout = useCallback(async () => {
    await authService.logout()

    accessTokenService.remove()
    setUser(null)
  }, [])

  const value = useMemo(
    () => ({
      isChecked,
      user,
      users,
      checkAuth,
      activate,
      login,
      logout,
    }),
    [isChecked, user, users, checkAuth, activate, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
