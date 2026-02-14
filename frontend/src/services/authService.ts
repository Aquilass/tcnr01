import { api, saveTokens, clearTokens } from '@/services/api'
import type {
  AuthTokens,
  LoginRequest,
  RegisterRequest,
  UpdateProfileRequest,
  User,
} from '@/types'

export const authService = {
  async register(data: RegisterRequest): Promise<AuthTokens> {
    const tokens = await api.post<AuthTokens>('/auth/register', data, { skipAuth: true })
    saveTokens(tokens)
    return tokens
  },

  async login(data: LoginRequest): Promise<AuthTokens> {
    const tokens = await api.post<AuthTokens>('/auth/login', data, { skipAuth: true })
    saveTokens(tokens)
    return tokens
  },

  async getMe(): Promise<User> {
    return api.get<User>('/auth/me')
  },

  async updateProfile(data: UpdateProfileRequest): Promise<User> {
    return api.put<User>('/auth/me', data)
  },

  async changePassword(currentPassword: string, newPassword: string): Promise<void> {
    await api.post('/auth/change-password', {
      current_password: currentPassword,
      new_password: newPassword,
    })
  },

  logout(): void {
    clearTokens()
  },
}
