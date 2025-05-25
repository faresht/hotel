const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:9000/api"

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
      })

      const contentType = response.headers.get("content-type")

      if (!response.ok) {
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

      if (!contentType || !contentType.includes("application/json")) {
        const responseText = await response.text()
        console.warn(`API endpoint ${endpoint} returned non-JSON response:`, {
          status: response.status,
          contentType,
          responseText: responseText.substring(0, 200) + (responseText.length > 200 ? "..." : ""),
        })
        throw new Error(`API endpoint returned ${contentType || "unknown content type"} instead of JSON`)
      }

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
      if (error instanceof TypeError && error.message.includes("fetch")) {
        throw new Error(`Cannot connect to API at ${url}. Please check if the backend is running.`)
      }

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

  async getAllUsers(page = 0, size = 10, search?: string, sortBy = "id", sortDir = "desc") {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir,
    })
    if (search) params.append("search", search)

    return this.request<{ content: any[]; totalElements: number }>(`/admin/users?${params}`)
  }

  async getAllHotels(page = 0, size = 10, search?: string, sortBy = "id", sortDir = "desc") {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
      sortBy,
      sortDir,
    })
    if (search) params.append("search", search)

    return this.request<{ content: any[]; totalElements: number }>(`/admin/hotels?${params}`)
  }

  async getAllRooms(page = 0, size = 10, search?: string, hotelId?: number) {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    })
    if (search) params.append("search", search)
    if (hotelId) params.append("hotelId", hotelId.toString())

    return this.request<{ content: any[]; totalElements: number }>(`/admin/rooms?${params}`)
  }

  async getAllBookings(page = 0, size = 10, search?: string, status?: string) {
    const params = new URLSearchParams({
      page: page.toString(),
      size: size.toString(),
    })
    if (search) params.append("search", search)
    if (status) params.append("status", status)

    return this.request<{ content: any[]; totalElements: number }>(`/admin/bookings?${params}`)
  }

  // CRUD operations for admin
  async updateUser(id: number, userData: any) {
    return this.request<any>(`/admin/users/${id}`, {
      method: "PUT",
      body: JSON.stringify(userData),
    })
  }

  async deleteUser(id: number) {
    return this.request<void>(`/admin/users/${id}`, {
      method: "DELETE",
    })
  }

  async toggleUserStatus(id: number) {
    return this.request<any>(`/admin/users/${id}/toggle-status`, {
      method: "PUT",
    })
  }

  async createHotel(hotelData: any) {
    return this.request<any>("/admin/hotels", {
      method: "POST",
      body: JSON.stringify(hotelData),
    })
  }

  async updateHotel(id: number, hotelData: any) {
    return this.request<any>(`/admin/hotels/${id}`, {
      method: "PUT",
      body: JSON.stringify(hotelData),
    })
  }

  async deleteHotel(id: number) {
    return this.request<void>(`/admin/hotels/${id}`, {
      method: "DELETE",
    })
  }

  async toggleHotelAvailability(id: number) {
    return this.request<any>(`/admin/hotels/${id}/toggle-availability`, {
      method: "PUT",
    })
  }

  async toggleHotelFeatured(id: number) {
    return this.request<any>(`/admin/hotels/${id}/toggle-featured`, {
      method: "PUT",
    })
  }

  async createRoom(roomData: any) {
    return this.request<any>("/admin/rooms", {
      method: "POST",
      body: JSON.stringify(roomData),
    })
  }

  async updateRoom(id: number, roomData: any) {
    return this.request<any>(`/admin/rooms/${id}`, {
      method: "PUT",
      body: JSON.stringify(roomData),
    })
  }

  async deleteRoom(id: number) {
    return this.request<void>(`/admin/rooms/${id}`, {
      method: "DELETE",
    })
  }

  async toggleRoomAvailability(id: number) {
    return this.request<any>(`/admin/rooms/${id}/toggle-availability`, {
      method: "PUT",
    })
  }

  async updateBookingStatus(id: number, status: string) {
    return this.request<any>(`/admin/bookings/${id}/status?status=${status}`, {
      method: "PUT",
    })
  }

  async deleteBooking(id: number) {
    return this.request<void>(`/admin/bookings/${id}`, {
      method: "DELETE",
    })
  }

  // AI Price Prediction
  async predictPrice(data: {
    hotelId: number
    roomType: string
    checkInDate: string
    checkOutDate: string
    season: string
    occupancyRate: number
    localEvents: string[]
  }) {
    return this.request<{
      predictedPrice: number
      confidence: number
      factors: any[]
      recommendations: string[]
    }>("/admin/ai/predict-price", {
      method: "POST",
      body: JSON.stringify(data),
    })
  }

  async getSeasonalTrends(hotelId?: number) {
    const params = hotelId ? `?hotelId=${hotelId}` : ""
    return this.request<any>(`/admin/ai/seasonal-trends${params}`)
  }

  async getMarketAnalysis() {
    return this.request<any>("/admin/ai/market-analysis")
  }

  // Méthode pour tester la connexion API
  async testConnection() {
    try {
      const response = await fetch(`${this.baseURL}/health`, {
        method: "GET",
        headers: {
          "Content-Type": "application/json",
        },
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
