import { createContext, useContext, useEffect, useState } from 'react'
import { getToken, setToken } from '../api/client.js'
import * as authApi from '../api/auth.js'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!getToken()) {
      setLoading(false)
      return
    }
    authApi
      .me()
      .then(setUser)
      .catch(() => setToken(null))
      .finally(() => setLoading(false))
  }, [])

  const login = async (email, password) => {
    const loggedInUser = await authApi.login(email, password)
    setUser(loggedInUser)
    return loggedInUser
  }

  const register = async (name, email, password, passwordConfirmation) => {
    const newUser = await authApi.register(name, email, password, passwordConfirmation)
    setUser(newUser)
    return newUser
  }

  const logout = async () => {
    await authApi.logout()
    setUser(null)
  }

  const value = {
    user,
    loading,
    isAuthenticated: !!user,
    isAdmin: user?.role === 'admin',
    isEmployee: user?.role === 'employe',
    isStaff: user?.role === 'admin' || user?.role === 'employe',
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  return useContext(AuthContext)
}
