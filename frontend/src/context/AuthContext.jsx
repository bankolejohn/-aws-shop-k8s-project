import { createContext, useContext, useState, useCallback } from 'react'
import { usersApi } from '../api/client'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    // Persist login across page refreshes
    const saved = localStorage.getItem('shopaws_user')
    return saved ? JSON.parse(saved) : null
  })
  const [error, setError] = useState(null)

  const login = useCallback(async (email, password) => {
    setError(null)
    try {
      // Try real user-service, fall back to local mock auth
      const result = await usersApi.login({ email, password }).catch(() => null)
      const userData = result?.user || {
        id: `user-${Date.now()}`,
        email,
        firstName: email.split('@')[0],
        lastName: '',
        role: 'customer'
      }
      setUser(userData)
      localStorage.setItem('shopaws_user', JSON.stringify(userData))
      return { success: true }
    } catch (err) {
      const msg = err.message || 'Login failed'
      setError(msg)
      return { success: false, error: msg }
    }
  }, [])

  const register = useCallback(async ({ email, password, firstName, lastName }) => {
    setError(null)
    try {
      // Try real user-service registration
      await usersApi.register({ email, password, firstName, lastName }).catch(() => null)
      const userData = {
        id: `user-${Date.now()}`,
        email,
        firstName,
        lastName,
        role: 'customer'
      }
      setUser(userData)
      localStorage.setItem('shopaws_user', JSON.stringify(userData))
      return { success: true }
    } catch (err) {
      const msg = err.message || 'Registration failed'
      setError(msg)
      return { success: false, error: msg }
    }
  }, [])

  const logout = useCallback(() => {
    setUser(null)
    localStorage.removeItem('shopaws_user')
  }, [])

  return (
    <AuthContext.Provider value={{ user, error, login, register, logout, isLoggedIn: !!user }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)