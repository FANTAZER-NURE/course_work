import React, { useCallback, useMemo, useState } from 'react'
import { accessTokenService } from 'services/accessTokenService'
import { authService } from 'services/authService'

export const AuthContext = React.createContext<{
  isChecked: boolean
  user: any
  checkAuth: () => void
  logout: () => void
  login: ({ email, password }: { email: string; password: string }) => Promise<void>
}>({
  isChecked: false,
  user: null,
  checkAuth: () => {},
  logout: () => {},
  login: ({ email, password }) => {
    return new Promise(() => {})
  },
})

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState(null)
  const [isChecked, setChecked] = useState(true)

  const activate = useCallback(async (activationToken: string) => {
    const { accessToken, user } = await authService.activate(activationToken)

    accessTokenService.save(accessToken)
    setUser(user)
  }, [])

  const checkAuth = useCallback(async () => {
    try {
      const { accessToken, user } = await authService.refresh()

      accessTokenService.save(accessToken)
      setUser(user)
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
      checkAuth,
      activate,
      login,
      logout,
    }),
    [isChecked, user, checkAuth, activate, login, logout]
  )

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}
