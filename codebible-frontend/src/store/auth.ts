import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface User {
  id: string
  username: string
  email: string
  nickname: string | null
  avatar: string | null
  role: string
  lastLoginAt: string | null
  createdAt: string
  updatedAt: string
}

interface AuthState {
  user: User | null
  token: string | null
  isAuthenticated: boolean
  isLoading: boolean
  
  setUser: (user: User) => void
  setToken: (token: string) => void
  login: (user: User, token: string) => void
  logout: () => void
  setLoading: (loading: boolean) => void
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      isLoading: false,

      setUser: (user) => set({ user }),
      setToken: (token) => set({ token }),
      
      login: (user, token) => set({
        user,
        token,
        isAuthenticated: true
      }),
      
      logout: () => set({
        user: null,
        token: null,
        isAuthenticated: false
      }),
      
      setLoading: (loading) => set({ isLoading: loading })
    }),
    {
      name: 'codebible-auth-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated
      })
    }
  )
)
