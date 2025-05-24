const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

class ApiClient {
  private baseURL: string
  private token: string | null = null

  constructor(baseURL: string) {
    this.baseURL = baseURL
    if (typeof window !== "undefined") {
      this.token = localStorage.getItem("tunisia_stay_token")
    }
  }

  setToken(token: string) {
    this.token = token
    if (typeof window !== "undefined") {
      localStorage.setItem("tunisia_stay_token", token)
    }
  }

  clearToken() {
    this.token = null
    if (typeof window !== "undefined") {
      localStorage.removeItem("tunisia_stay_token")
    }
  }

  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${this.baseURL}${endpoint}`

    const headers: HeadersInit = {
      "Content-Type": "application/json",
      ...options.headers,
    }

    if (this.token) {
      headers.Authorization = `Bearer ${this.token}`
    }

    try {
      const response = await fetch(url, {
        ...options,
        headers,
        timeout: 10000, // 10 secondes de timeout
      })

      // Vérifier le content-type avant de parser
      const contentType = response.headers.get("content-type")

      if (!response.ok) {
        // Essayer de lire le texte d'erreur
        let errorText = `HTTP ${response.status}: ${response.statusText}`
        try {
          if (contentType?.includes("application/json")) {
            const errorData = await response.json()
            errorText = errorData.message || errorText
          } else {
            const text = await response.text()
            errorText = text || errorText
          }
        } catch (e) {
          // Ignorer les erreurs de parsing pour les erreurs HTTP
        }
        throw new Error(errorText)
      }

      // Vérifier si la réponse est du JSON
      if (!contentType || !contentType.includes("application/json")) {
        const responseText = await response.text()
        console.warn(`API endpoint ${endpoint} returned non-JSON response:`, {
          status: response.status,
          contentType,
          responseText: responseText.substring(0, 200) + (responseText.length > 200 ? "..." : ""),
        })
        throw new Error(`API endpoint returned ${contentType || "unknown content type"} instead of JSON`)
      }

      // Parser le JSON
      const text = await response.text()
      if (!text.trim()) {
        throw new Error("API returned empty response")
      }

      try {
        return JSON.parse(text)
      } catch (parseError) {
        console.error("JSON parse error:", parseError)
        console.error("Response text:", text.substring(0, 500))
        throw new Error("Invalid JSON response from API")
      }
    } catch (error) {
      // Améliorer les messages d'erreur
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(`Cannot connect to API at ${url}. Please check if the backend is running.`)
      }

      if (error.name === "AbortError") {
        throw new Error("API request timeout")
      }

      // Relancer l'erreur avec plus de contexte
      throw new Error(`API request failed: ${error.message}`)
    }
  }

  // Auth endpoints
  async login(email: string, password: string) {
    const response = await this.request<{ token: string; user: any }>("/auth/login", {
      method: "POST",
      body: JSON.stringify({ email, password }),
    })
    this.setToken(response.token)
    return response
  }

  async register(data: {
    name: string
    email: string
    password: string
    phone?: string
    address?: string
    acceptTerms: boolean
  }) {
    const response = await this.request<{ token: string; user: any }>("/auth/register", {
      method: "POST",
      body: JSON.stringify(data),
    })
    this.setToken(response.token)
    return response
  }

  // Hotel endpoints
  async getFeaturedHotels() {
    return this.request<any[]>("/hotels/featured")
  }

  async searchHotels(searchParams: {
    location?: string
    checkIn?: string
    checkOut?: string
    guests?: number
    category?: string
    minPrice?: number
    maxPrice?: number
    minRating?: number
    sortBy?: string
    page?: number
    size?: number
  }) {
    return this.request<{ content: any[]; totalElements: number }>("/hotels/search", {
      method: "POST",
      body: JSON.stringify(searchParams),
    })
  }

  async getHotelById(id: number) {
    return this.request<any>(`/hotels/${id}`)
  }

  async getHotelRooms(id: number) {
    return this.request<any[]>(`/hotels/${id}/rooms`)
  }

  async getAvailableRooms(id: number, searchParams: any) {
    return this.request<any[]>(`/hotels/${id}/rooms/available`, {
      method: "POST",
      body: JSON.stringify(searchParams),
    })
  }

  async getAllLocations() {
    return this.request<string[]>("/hotels/locations")
  }

  // Booking endpoints
  async createBooking(bookingData: {
    hotelId: number
    roomId: number
    checkInDate: string
    checkOutDate: string
    guests: number
    specialRequests?: string
    guestName?: string
    guestEmail?: string
    guestPhone?: string
  }) {
    return this.request<any>("/bookings", {
      method: "POST",
      body: JSON.stringify(bookingData),
    })
  }

  async getUserBookings() {
    return this.request<any[]>("/bookings")
  }

  async getBookingById(id: number) {
    return this.request<any>(`/bookings/${id}`)
  }

  async cancelBooking(id: number) {
    return this.request<any>(`/bookings/${id}/cancel`, {
      method: "PUT",
    })
  }

  // Notification endpoints
  async getNotifications() {
    return this.request<any[]>("/notifications")
  }

  async getUnreadCount() {
    return this.request<number>("/notifications/unread-count")
  }

  async markAsRead(id: number) {
    return this.request<void>(`/notifications/${id}/read`, {
      method: "PUT",
    })
  }

  async markAllAsRead() {
    return this.request<void>("/notifications/mark-all-read", {
      method: "PUT",
    })
  }

  // Admin endpoints
  async getAdminDashboard() {
    return this.request<any>("/admin/dashboard")
  }

  async getAllUsers(page = 0, size = 10) {
    return this.request<{ content: any[]; totalElements: number }>(`/admin/users?page=${page}&size=${size}`)
  }

  async getAllHotels(page = 0, size = 10) {
    return this.request<{ content: any[]; totalElements: number }>(`/admin/hotels?page=${page}&size=${size}`)
  }

  async getAllBookings(page = 0, size = 10) {
    return this.request<{ content: any[]; totalElements: number }>(`/admin/bookings?page=${page}&size=${size}`)
  }

  // Méthode pour tester la connexion API
  async testConnection() {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
        timeout: 5000,
      })
      return {
        success: response.ok,
        status: response.status,
        contentType: response.headers.get("content-type"),
      }
    } catch (error) {
      return {
        success: false,
        error: error.message,
      }
    }
  }
}

export const apiClient = new ApiClient(API_BASE_URL)
