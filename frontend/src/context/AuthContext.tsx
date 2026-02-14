import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from 'react'
import { useQueryClient } from '@tanstack/react-query'
import { authService } from '@/services/authService'
import { getAccessToken, clearTokens } from '@/services/api'
import type { User, LoginRequest, RegisterRequest } from '@/types'

interface AuthContextType {
  user: User | null
  isLoading: boolean
  isAuthenticated: boolean
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  refreshUser: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: ReactNode }) {
  const queryClient = useQueryClient()
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  const refreshUser = useCallback(async () => {
    try {
      const userData = await authService.getMe()
      setUser(userData)
    } catch {
      setUser(null)
      clearTokens()
    }
  }, [])

  useEffect(() => {
    const token = getAccessToken()
    if (token) {
      refreshUser().finally(() => setIsLoading(false))
    } else {
      setIsLoading(false)
    }
  }, [refreshUser])

  const login = useCallback(
    async (data: LoginRequest) => {
      await authService.login(data)
      await refreshUser()
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
    [refreshUser, queryClient]
  )

  const register = useCallback(
    async (data: RegisterRequest) => {
      await authService.register(data)
      await refreshUser()
      queryClient.invalidateQueries({ queryKey: ['cart'] })
    },
    [refreshUser, queryClient]
  )

  const logout = useCallback(() => {
    authService.logout()
    setUser(null)
    queryClient.invalidateQueries({ queryKey: ['cart'] })
  }, [queryClient])

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        register,
        logout,
        refreshUser,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within AuthProvider')
  }
  return context
}
