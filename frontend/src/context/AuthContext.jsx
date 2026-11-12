import { createContext, useCallback, useEffect, useState } from 'react'
import {
  getCurrentSession,
  loginUser,
  logoutUser,
  registerUser,
} from '../services/authService'

export const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null)
  const [token, setToken] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const session = getCurrentSession()
    if (session) {
      setUser(session.user)
      setToken(session.token)
    }
    setIsLoading(false)
  }, [])

  const login = useCallback(async (email, password) => {
    const session = loginUser(email, password)
    setUser(session.user)
    setToken(session.token)
    return session.user
  }, [])

  const register = useCallback(async (userData) => {
    const session = registerUser(userData)
    setUser(session.user)
    setToken(session.token)
    return session.user
  }, [])

  const logout = useCallback(() => {
    logoutUser()
    setUser(null)
    setToken(null)
  }, [])

  const value = {
    user,
    token,
    isAuthenticated: Boolean(user && token),
    isLoading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

