"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { apiClient } from "@/lib/api"

interface User {
  id: number
  email: string
  name: string
  role: "USER" | "ADMIN"
  loyaltyLevel: "BRONZE" | "SILVER" | "GOLD"
  points: number
  avatar?: string
  phone?: string
  address?: string
  bio?: string
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<boolean>
  register: (data: RegisterData) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

interface RegisterData {
  name: string
  email: string
  password: string
  phone?: string
  address?: string
  acceptTerms: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Vérifier si l'utilisateur est connecté au chargement
    const savedUser = localStorage.getItem("tunisiastay_user")
    const token = localStorage.getItem("tunisia_stay_token")

    if (savedUser && token) {
      setUser(JSON.parse(savedUser))
      apiClient.setToken(token)
    }
    setIsLoading(false)
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true)

    try {
      const response = await apiClient.login(email, password)
      setUser(response.user)
      localStorage.setItem("tunisiastay_user", JSON.stringify(response.user))
      setIsLoading(false)
      return true
    } catch (error) {
      console.error("Login error:", error)
      setIsLoading(false)
      return false
    }
  }

  const register = async (data: RegisterData): Promise<boolean> => {
    setIsLoading(true)

    try {
      const response = await apiClient.register(data)
      setUser(response.user)
      localStorage.setItem("tunisiastay_user", JSON.stringify(response.user))
      setIsLoading(false)
      return true
    } catch (error) {
      console.error("Register error:", error)
      setIsLoading(false)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("tunisiastay_user")
    apiClient.clearToken()
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
