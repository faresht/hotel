"use client"

import type React from "react"
import { createContext, useContext, useState, useEffect } from "react"
import { apiClient } from "../../lib/api"

interface User {
  id: number
  name: string
  email: string
  phone?: string
  address?: string
  bio?: string
  avatar?: string
  role: "USER" | "ADMIN"
  loyaltyLevel: "BRONZE" | "SILVER" | "GOLD"
  points: number
  enabled: boolean
  createdAt: string
  permissions?: string[]
}

interface AuthContextType {
  user: User | null
  loading: boolean
  login: (email: string, password: string) => Promise<boolean>
  register: (data: any) => Promise<boolean>
  logout: () => void
  loginWithSocial: (provider: "google" | "facebook") => Promise<boolean>
  updateProfile: (data: Partial<User>) => Promise<boolean>
  hasPermission: (permission: string) => boolean
  isAdmin: () => boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

// Données de démonstration pour les utilisateurs
const demoUsers = [
  {
    id: 1,
    name: "Sophie Martin",
    email: "sophie.martin@example.com",
    phone: "+216 20 123 456",
    address: "Tunis, Tunisie",
    bio: "Voyageuse passionnée",
    avatar: "/placeholder.svg?height=100&width=100",
    role: "USER" as const,
    loyaltyLevel: "GOLD" as const,
    points: 2500,
    enabled: true,
    createdAt: "2023-03-15T10:00:00Z",
    permissions: ["booking.create", "booking.view", "profile.edit"],
  },
  {
    id: 2,
    name: "Administrateur TunisiaStay",
    email: "admin@tunisiastay.com",
    phone: "+216 70 123 456",
    address: "Tunis, Tunisie",
    bio: "Administrateur de la plateforme TunisiaStay",
    avatar: "/placeholder.svg?height=100&width=100",
    role: "ADMIN" as const,
    loyaltyLevel: "GOLD" as const,
    points: 10000,
    enabled: true,
    createdAt: "2023-01-01T10:00:00Z",
    permissions: [
      "admin.dashboard",
      "admin.users.view",
      "admin.users.edit",
      "admin.users.delete",
      "admin.hotels.view",
      "admin.hotels.edit",
      "admin.hotels.delete",
      "admin.hotels.create",
      "admin.rooms.view",
      "admin.rooms.edit",
      "admin.rooms.delete",
      "admin.rooms.create",
      "admin.bookings.view",
      "admin.bookings.edit",
      "admin.bookings.delete",
      "admin.analytics.view",
      "admin.ai.access",
      "admin.settings.edit",
    ],
  },
  {
    id: 3,
    name: "Utilisateur Test",
    email: "user@tunisiastay.com",
    phone: "+216 25 123 456",
    address: "Sousse, Tunisie",
    bio: "Utilisateur de test",
    avatar: "/placeholder.svg?height=100&width=100",
    role: "USER" as const,
    loyaltyLevel: "SILVER" as const,
    points: 1200,
    enabled: true,
    createdAt: "2023-06-01T10:00:00Z",
    permissions: ["booking.create", "booking.view", "profile.edit"],
  },
]

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem("tunisia_stay_token")
      const savedUser = localStorage.getItem("tunisia_stay_user")

      if (token && savedUser) {
        try {
          const userData = JSON.parse(savedUser)
          setUser(userData)
          apiClient.setToken(token)
        } catch (error) {
          console.error("Erreur lors de la restauration de la session:", error)
          localStorage.removeItem("tunisia_stay_token")
          localStorage.removeItem("tunisia_stay_user")
        }
      }
      setLoading(false)
    }

    initAuth()
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      // For admin account, always try to use the real API
      if (email === "admin@tunisiastay.com") {
        try {
          const response = await apiClient.login(email, password)
          setUser(response.user)
          localStorage.setItem("tunisia_stay_user", JSON.stringify(response.user))
          return true
        } catch (apiError) {
          console.error("Failed to login admin with API:", apiError)
          throw new Error("Admin login requires a connection to the backend API")
        }
      }

      // For non-admin accounts, try API first then fallback to demo
      try {
        const response = await apiClient.login(email, password)
        setUser(response.user)
        localStorage.setItem("tunisia_stay_user", JSON.stringify(response.user))
        return true
      } catch (apiError) {
        console.log("API non disponible, utilisation des comptes de démonstration")
      }

      // Fallback vers les comptes de démonstration (only for non-admin accounts)
      const demoUser = demoUsers.find((u) => u.email === email)

      if (demoUser) {
        // Vérifier le mot de passe (mots de passe de démonstration)
        const validPasswords = {
          "sophie.martin@example.com": "password123",
          "admin@tunisiastay.com": "admin123",
          "user@tunisiastay.com": "user123",
        }

        if (validPasswords[email as keyof typeof validPasswords] === password) {
          const token = `demo_token_${Date.now()}`
          setUser(demoUser)
          localStorage.setItem("tunisia_stay_token", token)
          localStorage.setItem("tunisia_stay_user", JSON.stringify(demoUser))
          apiClient.setToken(token)
          return true
        }
      }

      return false
    } catch (error) {
      console.error("Erreur lors de la connexion:", error)
      return false
    }
  }

  const register = async (data: any): Promise<boolean> => {
    try {
      // Always try to use the real API for registration
      try {
        const response = await apiClient.register(data)
        setUser(response.user)
        localStorage.setItem("tunisia_stay_user", JSON.stringify(response.user))
        return true
      } catch (apiError) {
        // Only allow demo registration if not trying to create an admin account
        if (data.email?.includes("admin")) {
          console.error("Admin registration requires a connection to the backend API")
          throw new Error("Admin registration requires a connection to the backend API")
        }
        console.log("API non disponible, création d'un compte de démonstration")
      }

      // Fallback vers la création d'un compte de démonstration
      const newUser: User = {
        id: Date.now(),
        name: data.name,
        email: data.email,
        phone: data.phone || "",
        address: data.address || "",
        bio: "",
        avatar: "/placeholder.svg?height=100&width=100",
        role: "USER",
        loyaltyLevel: "BRONZE",
        points: 100, // Points de bienvenue
        enabled: true,
        createdAt: new Date().toISOString(),
        permissions: ["booking.create", "booking.view", "profile.edit"],
      }

      const token = `demo_token_${Date.now()}`
      setUser(newUser)
      localStorage.setItem("tunisia_stay_token", token)
      localStorage.setItem("tunisia_stay_user", JSON.stringify(newUser))
      apiClient.setToken(token)
      return true
    } catch (error) {
      console.error("Erreur lors de l'inscription:", error)
      return false
    }
  }

  const logout = () => {
    setUser(null)
    localStorage.removeItem("tunisia_stay_token")
    localStorage.removeItem("tunisia_stay_user")
    apiClient.clearToken()
  }

  const loginWithSocial = async (provider: "google" | "facebook"): Promise<boolean> => {
    try {
      // Simulation de connexion sociale
      const socialUser: User = {
        id: Date.now(),
        name: `Utilisateur ${provider}`,
        email: `user.${provider}@example.com`,
        phone: "+216 20 000 000",
        address: "Tunisie",
        bio: `Connecté via ${provider}`,
        avatar: "/placeholder.svg?height=100&width=100",
        role: "USER",
        loyaltyLevel: "BRONZE",
        points: 100,
        enabled: true,
        createdAt: new Date().toISOString(),
        permissions: ["booking.create", "booking.view", "profile.edit"],
      }

      const token = `demo_token_${provider}_${Date.now()}`
      setUser(socialUser)
      localStorage.setItem("tunisia_stay_token", token)
      localStorage.setItem("tunisia_stay_user", JSON.stringify(socialUser))
      apiClient.setToken(token)
      return true
    } catch (error) {
      console.error(`Erreur lors de la connexion ${provider}:`, error)
      return false
    }
  }

  const updateProfile = async (data: Partial<User>): Promise<boolean> => {
    try {
      if (user) {
        const updatedUser = { ...user, ...data }
        setUser(updatedUser)
        localStorage.setItem("tunisia_stay_user", JSON.stringify(updatedUser))
        return true
      }
      return false
    } catch (error) {
      console.error("Erreur lors de la mise à jour du profil:", error)
      return false
    }
  }

  const hasPermission = (permission: string): boolean => {
    if (!user) return false
    if (user.role === "ADMIN") return true // Les admins ont toutes les permissions
    return user.permissions?.includes(permission) || false
  }

  const isAdmin = (): boolean => {
    return user?.role === "ADMIN" || false
  }

  const value = {
    user,
    loading,
    login,
    register,
    logout,
    loginWithSocial,
    updateProfile,
    hasPermission,
    isAdmin,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
