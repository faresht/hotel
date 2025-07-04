"use client"

import { useState, useEffect } from "react"
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  BarChart,
  Bar,
  AreaChart,
  Area,
} from "recharts"
import {
  Users,
  Hotel,
  Calendar,
  DollarSign,
  TrendingUp,
  Edit,
  Trash2,
  Search,
  MoreHorizontal,
  CheckCircle,
  XCircle,
  Star,
  Bed,
  Home,
  Brain,
  BarChart3,
  Shield,
  AlertTriangle,
  Activity,
  Zap,
} from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { Label } from "@/components/ui/label"
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@/components/ui/dropdown-menu"
import { Progress } from "@/components/ui/progress"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Navbar } from "../components/navbar"
import { useAuth } from "../contexts/auth-context"
import { useNotifications } from "../contexts/notification-context"
import { apiClient } from "@/lib/api"

interface DashboardData {
  totalUsers: number
  totalHotels: number
  totalRooms: number
  totalBookings: number
  totalRevenue: number
  monthlyBookings: number
  monthlyRevenue: number
  pendingBookings: number
  confirmedBookings: number
  cancelledBookings: number
  averageOccupancyRate: number
  averageRating: number
  topPerformingHotels: any[]
  recentActivities: any[]
}

interface User {
  id: number
  name: string
  email: string
  phone: string
  address: string
  role: string
  loyaltyLevel: string
  points: number
  enabled: boolean
  createdAt: string
  updatedAt: string
}

interface HotelType {
  id: number
  name: string
  location: string
  address: string
  description: string
  category: string
  rating: number
  reviewCount: number
  available: boolean
  featured: boolean
  phone: string
  email: string
  website: string
  createdAt: string
  updatedAt: string
}

interface Room {
  id: number
  name: string
  roomNumber: string
  description: string
  type: string
  pricePerNight: number
  capacity: number
  bedCount: number
  bedType: string
  size: number
  available: boolean
  hasBalcony: boolean
  hasSeaView: boolean
  hasKitchen: boolean
  hotel: HotelType
  createdAt: string
  updatedAt: string
}

interface Booking {
  id: number
  bookingReference: string
  checkInDate: string
  checkOutDate: string
  nights: number
  guests: number
  totalAmount: number
  originalPrice: number
  discountAmount: number
  status: string
  paymentStatus: string
  specialRequests: string
  guestName: string
  guestEmail: string
  guestPhone: string
  user: User
  hotel: HotelType
  room: Room
  createdAt: string
  updatedAt: string
}

interface PricePrediction {
  predictedPrice: number
  confidence: number
  factors: Array<{
    name: string
    impact: number
    description: string
  }>
  recommendations: string[]
}

// Données de démonstration améliorées
const monthlyData = [
  { month: "Jan", reservations: 145, revenue: 32500, occupancy: 65 },
  { month: "Fév", reservations: 152, revenue: 35200, occupancy: 68 },
  { month: "Mar", reservations: 168, revenue: 41100, occupancy: 72 },
  { month: "Avr", reservations: 181, revenue: 48300, occupancy: 78 },
  { month: "Mai", reservations: 195, revenue: 56800, occupancy: 82 },
  { month: "Jun", reservations: 217, revenue: 71200, occupancy: 89 },
  { month: "Jul", reservations: 245, revenue: 89500, occupancy: 95 },
  { month: "Aoû", reservations: 238, revenue: 87200, occupancy: 94 },
  { month: "Sep", reservations: 201, revenue: 62800, occupancy: 85 },
  { month: "Oct", reservations: 178, revenue: 48900, occupancy: 76 },
  { month: "Nov", reservations: 156, revenue: 38200, occupancy: 69 },
  { month: "Déc", reservations: 189, revenue: 52100, occupancy: 81 },
]

const categoryData = [
  { name: "5 étoiles", value: 35, color: "#ef4444", count: 45 },
  { name: "4 étoiles", value: 40, color: "#f97316", count: 52 },
  { name: "3 étoiles", value: 20, color: "#eab308", count: 26 },
  { name: "Boutique", value: 5, color: "#22c55e", count: 7 },
]

const seasonalTrends = [
  { season: "Hiver", avgPrice: 120, demand: 60, events: ["Nouvel An", "Festivals"] },
  { season: "Printemps", avgPrice: 150, demand: 75, events: ["Vacances scolaires", "Météo agréable"] },
  { season: "Été", avgPrice: 220, demand: 95, events: ["Vacances d'été", "Festivals de musique"] },
  { season: "Automne", avgPrice: 140, demand: 70, events: ["Rentrée", "Tourisme culturel"] },
]

const aiInsights = [
  {
    type: "price_optimization",
    title: "Optimisation des prix recommandée",
    description: "Augmentez les prix de 15% pour les weekends de juillet",
    impact: "+€12,500 revenus estimés",
    confidence: 87,
  },
  {
    type: "demand_forecast",
    title: "Pic de demande prévu",
    description: "Forte demande attendue pour la période 15-25 août",
    impact: "Occupancy rate: 98%",
    confidence: 92,
  },
  {
    type: "competitor_analysis",
    title: "Analyse concurrentielle",
    description: "Vos prix sont 8% inférieurs à la concurrence",
    impact: "Opportunité d'augmentation",
    confidence: 78,
  },
]

export default function AdminPage() {
  const { user, loading, hasPermission, isAdmin } = useAuth()
  const { addNotification } = useNotifications()
  const [activeTab, setActiveTab] = useState("dashboard")
  const [dashboardData, setDashboardData] = useState<DashboardData | null>(null)
  const [users, setUsers] = useState<{ content: User[]; totalElements: number }>({ content: [], totalElements: 0 })
  const [hotels, setHotels] = useState<{ content: HotelType[]; totalElements: number }>({
    content: [],
    totalElements: 0,
  })
  const [rooms, setRooms] = useState<{ content: Room[]; totalElements: number }>({ content: [], totalElements: 0 })
  const [bookings, setBookings] = useState<{ content: Booking[]; totalElements: number }>({
    content: [],
    totalElements: 0,
  })
  const [monthlyStats, setMonthlyStats] = useState<any[]>([])
  const [dataLoading, setDataLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(0)
  const [pageSize, setPageSize] = useState(10)
  const [sortBy, setSortBy] = useState("id")
  const [sortDir, setSortDir] = useState("desc")
  const [selectedFilter, setSelectedFilter] = useState("")
  const [isConnectedToAPI, setIsConnectedToAPI] = useState(false)

  // États pour les modals d'édition
  const [editingUser, setEditingUser] = useState<User | null>(null)
  const [editingHotel, setEditingHotel] = useState<HotelType | null>(null)
  const [editingRoom, setEditingRoom] = useState<Room | null>(null)
  const [editingBooking, setEditingBooking] = useState<Booking | null>(null)
  const [showCreateModal, setShowCreateModal] = useState<string | null>(null)

  // États pour l'IA
  const [pricePrediction, setPricePrediction] = useState<PricePrediction | null>(null)
  const [showPricePredictor, setShowPricePredictor] = useState(false)
  const [predictionLoading, setPredictionLoading] = useState(false)

  useEffect(() => {
    const loadData = async () => {
      if (!user || !isAdmin()) {
        setDataLoading(false)
        return
      }

      try {
        // Tester la connexion API
        const connectionTest = await apiClient.testConnection()
        console.log("API Connection test result:", connectionTest)
        setIsConnectedToAPI(connectionTest.success)

        if (connectionTest.success) {
          // Charger les vraies données depuis l'API
          try {
            await loadDashboardData()
            if (activeTab === "users") await loadUsersData()
            if (activeTab === "hotels") await loadHotelsData()
            if (activeTab === "rooms") await loadRoomsData()
            if (activeTab === "bookings") await loadBookingsData()
          } catch (apiError) {
            console.error("Error loading data from API:", apiError)
            // Only fall back to demo data if not admin or if explicitly allowed
            if (user.role !== "ADMIN") {
              loadDemoData()
            } else {
              // For admin users, show the error instead of falling back to demo data
              addNotification({
                type: "error",
                title: "Erreur de connexion API",
                message: "Impossible de charger les données depuis l'API. Veuillez vérifier votre connexion au backend.",
              })
            }
          }
        } else {
          // Only fall back to demo data if not admin or if explicitly allowed
          if (user.role !== "ADMIN") {
            loadDemoData()
          } else {
            // For admin users, show the error instead of falling back to demo data
            addNotification({
              type: "error",
              title: "Erreur de connexion API",
              message: "Impossible de se connecter à l'API. Veuillez vérifier que le backend est en cours d'exécution.",
            })
          }
        }
      } catch (error) {
        console.error("Erreur lors du chargement des données:", error)
        // Only fall back to demo data if not admin
        if (user.role !== "ADMIN") {
          loadDemoData()
        } else {
          addNotification({
            type: "error",
            title: "Erreur",
            message: "Une erreur s'est produite lors du chargement des données.",
          })
        }
      } finally {
        setDataLoading(false)
      }
    }

    if (!loading) {
      loadData()
    }
  }, [user, loading, activeTab, currentPage, pageSize, sortBy, sortDir, searchTerm, selectedFilter])

  const loadDashboardData = async () => {
    try {
      const data = await apiClient.getAdminDashboard()
      setDashboardData(data)

      // Load monthly statistics
      await loadMonthlyStats()
    } catch (error) {
      console.error("Erreur lors du chargement du dashboard:", error)
      loadDemoDashboard()
    }
  }

  const loadMonthlyStats = async () => {
    try {
      const data = await apiClient.getRevenueByMonth()
      console.log("Monthly stats data:", data)
      setMonthlyStats(data)
    } catch (error) {
      console.error("Erreur lors du chargement des statistiques mensuelles:", error)
      // Fall back to demo data
      setMonthlyStats(monthlyData)
    }
  }

  const loadUsersData = async () => {
    try {
      const data = await apiClient.getAllUsers(currentPage, pageSize, searchTerm, sortBy, sortDir)
      setUsers(data)
    } catch (error) {
      console.error("Erreur lors du chargement des utilisateurs:", error)
      loadDemoUsers()
    }
  }

  const loadHotelsData = async () => {
    try {
      const data = await apiClient.getAllHotels(currentPage, pageSize, searchTerm, sortBy, sortDir)
      console.log("Hotel data received:", data)

      // Handle both array response format and pageable response format
      if (Array.isArray(data)) {
        // API is returning an array of hotels
        setHotels({
          content: data,
          totalElements: data.length
        })
      } else if (data && data.content) {
        // API is returning a pageable object with content property
        setHotels(data)
      } else if (data && data.length === undefined) {
        // API might be returning a different format, try to adapt
        const hotelArray = Object.values(data).filter(item => 
          typeof item === 'object' && item !== null && 'id' in item
        )
        setHotels({
          content: hotelArray,
          totalElements: hotelArray.length
        })
      } else {
        // Fallback to empty state
        setHotels({
          content: [],
          totalElements: 0
        })
      }
    } catch (error) {
      console.error("Erreur lors du chargement des hôtels:", error)
      loadDemoHotels()
    }
  }

  const loadRoomsData = async () => {
    try {
      const data = await apiClient.getAllRooms(currentPage, pageSize, searchTerm, selectedFilter)
      console.log(data);
      setRooms(data)
    } catch (error) {
      console.error("Erreur lors du chargement des chambres:", error)
      loadDemoRooms()
    }
  }

  const fetchRooms = () => {
    loadRoomsData()
  }

  const loadBookingsData = async () => {
    try {
      const data = await apiClient.getAllBookings(currentPage, pageSize, searchTerm, selectedFilter)
      setBookings(data)
    } catch (error) {
      console.error("Erreur lors du chargement des réservations:", error)
      loadDemoBookings()
    }
  }

  const loadDemoData = () => {
    loadDemoDashboard()
    loadDemoUsers()
    loadDemoHotels()
    loadDemoRooms()
    loadDemoBookings()
  }

  const loadDemoDashboard = () => {
    setDashboardData({
      totalUsers: 2847,
      totalHotels: 130,
      totalRooms: 3250,
      totalBookings: 15420,
      totalRevenue: 2850000,
      monthlyBookings: 1250,
      monthlyRevenue: 285000,
      pendingBookings: 45,
      confirmedBookings: 12500,
      cancelledBookings: 2375,
      averageOccupancyRate: 78.5,
      averageRating: 4.3,
      topPerformingHotels: [
        { name: "Four Seasons Tunis", revenue: 450000, bookings: 1200 },
        { name: "Villa Didon", revenue: 380000, bookings: 950 },
        { name: "Laico Tunis", revenue: 320000, bookings: 1100 },
      ],
      recentActivities: [
        { type: "booking", message: "Nouvelle réservation - Four Seasons", time: "Il y a 5 min" },
        { type: "user", message: "Nouvel utilisateur inscrit", time: "Il y a 12 min" },
        { type: "hotel", message: "Hôtel Villa Didon mis à jour", time: "Il y a 1h" },
      ],
    })
  }

  const loadDemoUsers = () => {
    const demoUsers = Array.from({ length: pageSize }, (_, i) => ({
      id: i + 1 + currentPage * pageSize,
      name: `Utilisateur ${i + 1 + currentPage * pageSize}`,
      email: `user${i + 1 + currentPage * pageSize}@tunisiastay.com`,
      phone: `+216 ${20 + (i % 80)} ${String(Math.floor(Math.random() * 900) + 100)} ${String(Math.floor(Math.random() * 900) + 100)}`,
      address: ["Tunis", "Sousse", "Sfax", "Monastir", "Hammamet"][i % 5] + ", Tunisie",
      role: i === 0 && currentPage === 0 ? "ADMIN" : "USER",
      loyaltyLevel: ["BRONZE", "SILVER", "GOLD"][i % 3],
      points: Math.floor(Math.random() * 5000),
      enabled: Math.random() > 0.1,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    }))

    setUsers({ content: demoUsers, totalElements: 2847 })
  }

  const loadDemoHotels = () => {
    const hotelNames = [
      "Four Seasons Tunis",
      "Villa Didon",
      "Laico Tunis",
      "Mövenpick Gammarth",
      "The Residence",
      "Sheraton Tunis",
      "Golden Tulip",
      "Iberostar Averroes",
      "Hotel Majestic",
      "Concorde Green Park",
    ]

    const locations = ["Tunis", "Gammarth", "Sidi Bou Said", "Sousse", "Hammamet", "Monastir", "Sfax", "Djerba"]

    const demoHotels = Array.from({ length: Math.min(pageSize, hotelNames.length) }, (_, i) => ({
      id: i + 1 + currentPage * pageSize,
      name: hotelNames[i % hotelNames.length],
      location: locations[i % locations.length],
      address: `${i + 1} Avenue ${hotelNames[i % hotelNames.length]}, ${locations[i % locations.length]}, Tunisie`,
      description: `Magnifique hôtel situé à ${locations[i % locations.length]} offrant un service exceptionnel.`,
      category: ["FIVE_STARS", "FOUR_STARS", "THREE_STARS", "LUXURY", "BOUTIQUE"][i % 5],
      rating: Number((3.5 + Math.random() * 1.5).toFixed(1)),
      reviewCount: Math.floor(Math.random() * 500) + 50,
      available: Math.random() > 0.1,
      featured: Math.random() > 0.7,
      phone: `+216 ${70 + (i % 9)} ${String(Math.floor(Math.random() * 900) + 100)} ${String(Math.floor(Math.random() * 900) + 100)}`,
      email: `contact@${hotelNames[i % hotelNames.length].toLowerCase().replace(/\s+/g, "")}.tn`,
      website: `www.${hotelNames[i % hotelNames.length].toLowerCase().replace(/\s+/g, "")}.tn`,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    }))

    setHotels({ content: demoHotels, totalElements: 130 })
  }

  const loadDemoRooms = () => {
    const roomTypes = ["Standard", "Deluxe", "Suite", "Junior Suite", "Presidential Suite"]
    const bedTypes = ["Simple", "Double", "King", "Twin"]

    const demoRooms = Array.from({ length: pageSize }, (_, i) => ({
      id: i + 1 + currentPage * pageSize,
      name: `Chambre ${roomTypes[i % roomTypes.length]} ${i + 1}`,
      roomNumber: `${Math.floor((i + 1) / 10) + 1}${String((i + 1) % 10).padStart(2, "0")}`,
      description: `Belle chambre ${roomTypes[i % roomTypes.length].toLowerCase()} avec toutes les commodités modernes.`,
      type: roomTypes[i % roomTypes.length],
      pricePerNight: Math.floor(Math.random() * 300) + 80,
      capacity: Math.floor(Math.random() * 4) + 1,
      bedCount: Math.floor(Math.random() * 2) + 1,
      bedType: bedTypes[i % bedTypes.length],
      size: Math.floor(Math.random() * 40) + 20,
      available: Math.random() > 0.15,
      hasBalcony: Math.random() > 0.5,
      hasSeaView: Math.random() > 0.7,
      hasKitchen: Math.random() > 0.8,
      hotel: {
        id: Math.floor(i / 25) + 1,
        name: `Hôtel ${Math.floor(i / 25) + 1}`,
        location: "Tunis",
      } as HotelType,
      createdAt: new Date(Date.now() - Math.random() * 365 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    }))

    setRooms({ content: demoRooms, totalElements: 3250 })
  }

  const loadDemoBookings = () => {
    const statuses = ["PENDING", "CONFIRMED", "CANCELLED", "COMPLETED"]
    const paymentStatuses = ["PENDING", "PAID", "REFUNDED"]

    const demoBookings = Array.from({ length: pageSize }, (_, i) => ({
      id: i + 1 + currentPage * pageSize,
      bookingReference: `TN${String(Date.now() + i).slice(-8)}`,
      checkInDate: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000).toISOString().split("T")[0],
      checkOutDate: new Date(Date.now() + Math.random() * 90 * 24 * 60 * 60 * 1000 + 3 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split("T")[0],
      nights: Math.floor(Math.random() * 7) + 1,
      guests: Math.floor(Math.random() * 4) + 1,
      totalAmount: Math.floor(Math.random() * 1000) + 200,
      originalPrice: Math.floor(Math.random() * 1200) + 250,
      discountAmount: Math.floor(Math.random() * 100),
      status: statuses[i % statuses.length],
      paymentStatus: paymentStatuses[i % paymentStatuses.length],
      specialRequests: i % 3 === 0 ? "Chambre non-fumeur" : "",
      guestName: `Client ${i + 1 + currentPage * pageSize}`,
      guestEmail: `client${i + 1 + currentPage * pageSize}@email.com`,
      guestPhone: `+216 ${20 + (i % 80)} 123 456`,
      user: {
        id: i + 1,
        name: `Client ${i + 1}`,
        email: `client${i + 1}@email.com`,
      } as User,
      hotel: {
        id: Math.floor(i / 5) + 1,
        name: `Hôtel ${Math.floor(i / 5) + 1}`,
        location: "Tunis",
      } as HotelType,
      room: {
        id: i + 1,
        name: `Chambre ${i + 1}`,
        type: "Standard",
      } as Room,
      createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000).toISOString(),
      updatedAt: new Date().toISOString(),
    }))

    setBookings({ content: demoBookings, totalElements: 15420 })
  }

  const handleDeleteUser = async (id: number) => {
    try {
      if (isConnectedToAPI) {
        await apiClient.deleteUser(id)
        addNotification({
          type: "success",
          title: "Utilisateur supprimé",
          message: "L'utilisateur a été supprimé avec succès",
        })
      } else {
        setUsers((prev) => ({
          ...prev,
          content: prev.content.filter((user) => user.id !== id),
          totalElements: prev.totalElements - 1,
        }))
        addNotification({
          type: "success",
          title: "Utilisateur supprimé (Démo)",
          message: "L'utilisateur a été supprimé en mode démonstration",
        })
      }
      await loadUsersData()
    } catch (error) {
      addNotification({
        type: "error",
        title: "Erreur",
        message: "Impossible de supprimer l'utilisateur",
      })
    }
  }

  const handleConfirmBooking = async (id: number) => {
    try {
      if (isConnectedToAPI) {
        await apiClient.updateBookingStatus(id, "CONFIRMED")
        addNotification({
          type: "success",
          title: "Réservation confirmée",
          message: "La réservation a été confirmée avec succès",
        })
      } else {
        setBookings((prev) => ({
          ...prev,
          content: prev.content.map((booking) => 
            booking.id === id ? { ...booking, status: "CONFIRMED" } : booking
          ),
        }))
        addNotification({
          type: "success",
          title: "Réservation confirmée (Démo)",
          message: "La réservation a été confirmée en mode démonstration",
        })
      }
      await loadBookingsData()
    } catch (error) {
      addNotification({
        type: "error",
        title: "Erreur",
        message: "Impossible de confirmer la réservation",
      })
    }
  }

  const handleCancelBooking = async (id: number) => {
    try {
      if (isConnectedToAPI) {
        await apiClient.updateBookingStatus(id, "CANCELLED")
        addNotification({
          type: "success",
          title: "Réservation annulée",
          message: "La réservation a été annulée avec succès",
        })
      } else {
        setBookings((prev) => ({
          ...prev,
          content: prev.content.map((booking) => 
            booking.id === id ? { ...booking, status: "CANCELLED" } : booking
          ),
        }))
        addNotification({
          type: "success",
          title: "Réservation annulée (Démo)",
          message: "La réservation a été annulée en mode démonstration",
        })
      }
      await loadBookingsData()
    } catch (error) {
      addNotification({
        type: "error",
        title: "Erreur",
        message: "Impossible d'annuler la réservation",
      })
    }
  }

  const handleDeleteBooking = async (id: number) => {
    try {
      if (isConnectedToAPI) {
        await apiClient.deleteBooking(id)
        addNotification({
          type: "success",
          title: "Réservation supprimée",
          message: "La réservation a été supprimée avec succès",
        })
      } else {
        setBookings((prev) => ({
          ...prev,
          content: prev.content.filter((booking) => booking.id !== id),
          totalElements: prev.totalElements - 1,
        }))
        addNotification({
          type: "success",
          title: "Réservation supprimée (Démo)",
          message: "La réservation a été supprimée en mode démonstration",
        })
      }
      await loadBookingsData()
    } catch (error) {
      addNotification({
        type: "error",
        title: "Erreur",
        message: "Impossible de supprimer la réservation",
      })
    }
  }

  const handleToggleUserStatus = async (id: number) => {
    try {
      if (isConnectedToAPI) {
        await apiClient.toggleUserStatus(id)
      } else {
        setUsers((prev) => ({
          ...prev,
          content: prev.content.map((user) => (user.id === id ? { ...user, enabled: !user.enabled } : user)),
        }))
      }
      addNotification({
        type: "success",
        title: "Statut modifié",
        message: "Le statut de l'utilisateur a été modifié",
      })
      await loadUsersData()
    } catch (error) {
      addNotification({
        type: "error",
        title: "Erreur",
        message: "Impossible de modifier le statut",
      })
    }
  }

  const handlePredictPrice = async (data: any) => {
    setPredictionLoading(true)
    try {
      if (isConnectedToAPI) {
        const prediction = await apiClient.predictPrice(data)
        setPricePrediction(prediction)
      } else {
        // Simulation de prédiction IA
        const basePrices = { Standard: 120, Deluxe: 180, Suite: 280, "Junior Suite": 220, "Presidential Suite": 450 }
        const basePrice = basePrices[data.roomType as keyof typeof basePrices] || 150

        const seasonMultiplier =
          {
            winter: 0.8,
            spring: 1.0,
            summer: 1.4,
            autumn: 0.9,
          }[data.season] || 1.0

        const occupancyMultiplier = 1 + (data.occupancyRate - 50) / 100
        const eventMultiplier = data.localEvents.length > 0 ? 1.2 : 1.0

        const predictedPrice = Math.round(basePrice * seasonMultiplier * occupancyMultiplier * eventMultiplier)

        setPricePrediction({
          predictedPrice,
          confidence: Math.floor(Math.random() * 20) + 75,
          factors: [
            {
              name: "Saison",
              impact: Math.round((seasonMultiplier - 1) * 100),
              description: `Impact saisonnier pour ${data.season}`,
            },
            {
              name: "Taux d'occupation",
              impact: Math.round((occupancyMultiplier - 1) * 100),
              description: `Taux d'occupation actuel: ${data.occupancyRate}%`,
            },
            {
              name: "Événements locaux",
              impact: Math.round((eventMultiplier - 1) * 100),
              description:
                data.localEvents.length > 0
                  ? `${data.localEvents.length} événements détectés`
                  : "Aucun événement majeur",
            },
          ],
          recommendations: [
            predictedPrice > basePrice * 1.1
              ? "Augmentez les prix pour maximiser les revenus"
              : "Maintenez les prix actuels",
            "Surveillez la concurrence dans cette période",
            data.localEvents.length > 0
              ? "Profitez des événements locaux pour des promotions ciblées"
              : "Créez des offres spéciales pour attirer plus de clients",
          ],
        })
      }
    } catch (error) {
      addNotification({
        type: "error",
        title: "Erreur de prédiction",
        message: "Impossible de générer la prédiction de prix",
      })
    } finally {
      setPredictionLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    const statusConfig = {
      PENDING: { label: "En attente", color: "bg-yellow-100 text-yellow-800" },
      CONFIRMED: { label: "Confirmée", color: "bg-green-100 text-green-800" },
      CANCELLED: { label: "Annulée", color: "bg-red-100 text-red-800" },
      COMPLETED: { label: "Terminée", color: "bg-blue-100 text-blue-800" },
      PAID: { label: "Payé", color: "bg-green-100 text-green-800" },
      REFUNDED: { label: "Remboursé", color: "bg-gray-100 text-gray-800" },
    }

    const config = statusConfig[status as keyof typeof statusConfig] || statusConfig.PENDING
    return <Badge className={config.color}>{config.label}</Badge>
  }

  const getLoyaltyBadge = (level: string) => {
    const colors = {
      BRONZE: "border-orange-500 text-orange-700",
      SILVER: "border-gray-500 text-gray-700",
      GOLD: "border-yellow-500 text-yellow-700",
    }
    return (
      <Badge variant="outline" className={colors[level as keyof typeof colors]}>
        {level}
      </Badge>
    )
  }

  const getCategoryBadge = (category: string) => {
    const categoryLabels = {
      ONE_STAR: "1 étoile",
      TWO_STARS: "2 étoiles",
      THREE_STARS: "3 étoiles",
      FOUR_STARS: "4 étoiles",
      FIVE_STARS: "5 étoiles",
      LUXURY: "Luxe",
      BOUTIQUE: "Boutique",
    }
    return <Badge variant="outline">{categoryLabels[category as keyof typeof categoryLabels] || category}</Badge>
  }

  if (loading || dataLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement du tableau de bord administrateur...</p>
          </div>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-4 text-center">Accès Administrateur</h1>
            <p className="text-gray-600 mb-4">
              Pour accéder au tableau de bord administrateur, connectez-vous avec un compte admin.
            </p>
            <div className="bg-blue-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-blue-800 mb-2">Compte de test Admin :</h3>
              <p className="text-sm text-blue-700">Email: admin@tunisiastay.com</p>
              <p className="text-sm text-blue-700">Mot de passe: admin123</p>
            </div>
            <Button className="w-full bg-red-600 hover:bg-red-700" onClick={() => (window.location.href = "/login")}>
              Se connecter
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!isAdmin()) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 text-center">
            <Shield className="h-16 w-16 text-red-600 mx-auto mb-4" />
            <h1 className="text-2xl font-bold text-red-600 mb-4">Accès refusé</h1>
            <p className="text-gray-600 mb-4">
              Vous n'avez pas les permissions administrateur pour accéder à cette page.
            </p>
            <p className="text-sm text-gray-500 mb-4">Rôle actuel: {user.role}</p>
            <div className="space-y-2">
              <Button className="w-full bg-red-600 hover:bg-red-700" onClick={() => (window.location.href = "/")}>
                Retour à l'accueil
              </Button>
              <Button variant="outline" className="w-full" onClick={() => (window.location.href = "/login")}>
                Se connecter avec un compte admin
              </Button>
            </div>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <div className="flex items-center justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">Tableau de bord administrateur</h1>
              <p className="text-gray-600">Gérez votre plateforme TunisiaStay avec des outils avancés</p>
            </div>
            <div className="flex items-center gap-4">
              <Button variant="outline" onClick={() => setShowPricePredictor(true)} className="flex items-center gap-2">
                <Brain className="h-4 w-4" />
                Prédiction IA
              </Button>
              <div className="text-right">
                <div className="text-sm text-green-600">👤 {user.name}</div>
                <div className="text-xs text-gray-500">Administrateur</div>
              </div>
            </div>
          </div>
          <div className="mt-2 flex items-center gap-4">
            {isConnectedToAPI ? (
              <div className="flex items-center gap-2 text-sm text-green-600">
                <Activity className="h-4 w-4" />
                API Backend connectée
              </div>
            ) : (
              <div className="flex items-center gap-2 text-sm text-orange-600">
                <AlertTriangle className="h-4 w-4" />
                Mode démo - Connectez le backend pour les vraies données
              </div>
            )}
          </div>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-6">
            <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
            <TabsTrigger value="hotels">Hôtels</TabsTrigger>
            <TabsTrigger value="rooms">Chambres</TabsTrigger>
            <TabsTrigger value="bookings">Réservations</TabsTrigger>
            <TabsTrigger value="ai">IA & Analytics</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Métriques principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData?.totalUsers?.toLocaleString() || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +12% ce mois
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Hôtels</CardTitle>
                  <Hotel className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData?.totalHotels?.toLocaleString() || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +3 nouveaux
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Chambres</CardTitle>
                  <Bed className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData?.totalRooms?.toLocaleString() || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-blue-600 flex items-center">
                      <Home className="h-3 w-3 mr-1" />
                      Toutes catégories
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Réservations</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">{dashboardData?.totalBookings?.toLocaleString() || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +8% ce mois
                    </span>
                  </p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Revenus</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">€{dashboardData?.totalRevenue?.toLocaleString() || 0}</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-green-600 flex items-center">
                      <TrendingUp className="h-3 w-3 mr-1" />
                      +15% ce mois
                    </span>
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Métriques secondaires */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Taux d'occupation</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-3xl font-bold text-blue-600">{dashboardData?.averageOccupancyRate || 78.5}%</div>
                  <Progress value={dashboardData?.averageOccupancyRate || 78.5} className="mt-2" />
                  <p className="text-sm text-gray-600 mt-2">Moyenne sur 30 jours</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Note moyenne</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center">
                    <div className="text-3xl font-bold text-yellow-600">{dashboardData?.averageRating || 4.3}</div>
                    <Star className="h-6 w-6 text-yellow-400 ml-2" />
                  </div>
                  <div className="flex mt-2">
                    {[...Array(5)].map((_, i) => (
                      <Star
                        key={i}
                        className={`h-4 w-4 ${
                          i < Math.floor(dashboardData?.averageRating || 4.3)
                            ? "text-yellow-400 fill-yellow-400"
                            : "text-gray-300"
                        }`}
                      />
                    ))}
                  </div>
                  <p className="text-sm text-gray-600 mt-2">Basé sur tous les avis</p>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Activité récente</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {(
                      dashboardData?.recentActivities || [
                        { type: "booking", message: "Nouvelle réservation", time: "Il y a 5 min" },
                        { type: "user", message: "Nouvel utilisateur", time: "Il y a 12 min" },
                        { type: "hotel", message: "Hôtel mis à jour", time: "Il y a 1h" },
                      ]
                    ).map((activity, index) => (
                      <div key={index} className="flex items-center text-sm">
                        <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                        <span className="flex-1">{activity.message}</span>
                        <span className="text-gray-500">{activity.time}</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution des réservations</CardTitle>
                  <CardDescription>Réservations et taux d'occupation par mois</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <AreaChart data={monthlyStats.length > 0 ? monthlyStats : monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Area type="monotone" dataKey="reservations" stroke="#ef4444" fill="#ef444420" />
                      <Area type="monotone" dataKey="occupancy" stroke="#3b82f6" fill="#3b82f620" />
                    </AreaChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>

              <Card>
                <CardHeader>
                  <CardTitle>Répartition par catégorie</CardTitle>
                  <CardDescription>Distribution des hôtels par catégorie</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <PieChart>
                      <Pie
                        data={categoryData}
                        cx="50%"
                        cy="50%"
                        outerRadius={80}
                        fill="#8884d8"
                        dataKey="value"
                        label={({ name, value }) => `${name}: ${value}%`}
                      >
                        {categoryData.map((entry, index) => (
                          <Cell key={`cell-${index}`} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip />
                    </PieChart>
                  </ResponsiveContainer>
                </CardContent>
              </Card>
            </div>

            {/* Insights IA */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Brain className="h-5 w-5 mr-2" />
                  Insights IA
                </CardTitle>
                <CardDescription>Recommandations basées sur l'intelligence artificielle</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {aiInsights.map((insight, index) => (
                    <div key={index} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-2">
                        <h4 className="font-semibold text-sm">{insight.title}</h4>
                        <Badge variant="outline" className="text-xs">
                          {insight.confidence}% confiance
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-2">{insight.description}</p>
                      <p className="text-sm font-medium text-green-600">{insight.impact}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestion des utilisateurs</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un utilisateur..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filtrer par rôle" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tous</SelectItem>
                    <SelectItem value="USER">Utilisateurs</SelectItem>
                    <SelectItem value="ADMIN">Administrateurs</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Téléphone</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Fidélité</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.content.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="font-medium">{user.name}</span>
                              <p className="text-sm text-gray-500">{user.address}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>{user.phone}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === "ADMIN" ? "default" : "secondary"}>
                            {user.role === "ADMIN" ? "Admin" : "Utilisateur"}
                          </Badge>
                        </TableCell>
                        <TableCell>{getLoyaltyBadge(user.loyaltyLevel)}</TableCell>
                        <TableCell>{user.points}</TableCell>
                        <TableCell>
                          <Badge variant={user.enabled ? "default" : "destructive"}>
                            {user.enabled ? "Actif" : "Inactif"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => setEditingUser(user)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleToggleUserStatus(user.id)}>
                                {user.enabled ? (
                                  <XCircle className="h-4 w-4 mr-2" />
                                ) : (
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                )}
                                {user.enabled ? "Désactiver" : "Activer"}
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleDeleteUser(user.id)} className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Affichage de {currentPage * pageSize + 1} à{" "}
                {Math.min((currentPage + 1) * pageSize, users.totalElements)} sur {users.totalElements} utilisateurs
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={(currentPage + 1) * pageSize >= users.totalElements}
                >
                  Suivant
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="ai" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Intelligence Artificielle & Analytics</h2>
              <Button onClick={() => setShowPricePredictor(true)} className="bg-purple-600 hover:bg-purple-700">
                <Brain className="h-4 w-4 mr-2" />
                Nouvelle prédiction
              </Button>
            </div>

            {/* Tendances saisonnières */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <BarChart3 className="h-5 w-5 mr-2" />
                  Tendances saisonnières
                </CardTitle>
                <CardDescription>Analyse des prix et de la demande par saison</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={seasonalTrends}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="season" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="avgPrice" fill="#8884d8" name="Prix moyen (€)" />
                    <Bar dataKey="demand" fill="#82ca9d" name="Demande (%)" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Prédiction de prix */}
            {pricePrediction && (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Zap className="h-5 w-5 mr-2" />
                    Dernière prédiction de prix
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <div className="text-3xl font-bold text-green-600 mb-2">€{pricePrediction.predictedPrice}</div>
                      <div className="flex items-center mb-4">
                        <span className="text-sm text-gray-600 mr-2">Confiance:</span>
                        <Progress value={pricePrediction.confidence} className="flex-1" />
                        <span className="text-sm font-medium ml-2">{pricePrediction.confidence}%</span>
                      </div>
                      <div className="space-y-2">
                        <h4 className="font-semibold">Facteurs d'influence:</h4>
                        {pricePrediction.factors.map((factor, index) => (
                          <div key={index} className="flex justify-between items-center">
                            <span className="text-sm">{factor.name}</span>
                            <Badge variant={factor.impact > 0 ? "default" : "secondary"}>
                              {factor.impact > 0 ? "+" : ""}
                              {factor.impact}%
                            </Badge>
                          </div>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-semibold mb-2">Recommandations:</h4>
                      <ul className="space-y-2">
                        {pricePrediction.recommendations.map((rec, index) => (
                          <li key={index} className="flex items-start">
                            <div className="w-2 h-2 bg-blue-500 rounded-full mt-2 mr-2 flex-shrink-0"></div>
                            <span className="text-sm">{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="hotels" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestion des hôtels</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher un hôtel..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filtrer par catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tous</SelectItem>
                    <SelectItem value="FIVE_STARS">5 étoiles</SelectItem>
                    <SelectItem value="FOUR_STARS">4 étoiles</SelectItem>
                    <SelectItem value="THREE_STARS">3 étoiles</SelectItem>
                    <SelectItem value="LUXURY">Luxe</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => setEditingHotel({} as HotelType)}>
                  Ajouter un hôtel
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Hôtel</TableHead>
                      <TableHead>Localisation</TableHead>
                      <TableHead>Catégorie</TableHead>
                      <TableHead>Note</TableHead>
                      <TableHead>Contact</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hotels.content.map((hotel) => (
                      <TableRow key={hotel.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                              <AvatarFallback>{hotel.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="font-medium">{hotel.name}</span>
                              <p className="text-sm text-gray-500">{hotel.address}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{hotel.location}</TableCell>
                        <TableCell>{getCategoryBadge(hotel.category)}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="font-medium mr-1">{hotel.rating}</span>
                            <Star className="h-4 w-4 text-yellow-400" />
                            <span className="text-xs text-gray-500 ml-1">({hotel.reviewCount})</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>{hotel.phone}</div>
                            <div className="text-gray-500">{hotel.email}</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={hotel.available ? "default" : "destructive"}>
                            {hotel.available ? "Disponible" : "Indisponible"}
                          </Badge>
                          {hotel.featured && (
                            <Badge variant="outline" className="ml-2 bg-yellow-50 text-yellow-700 border-yellow-200">
                              Mis en avant
                            </Badge>
                          )}
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => setEditingHotel(hotel)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                {hotel.available ? (
                                  <XCircle className="h-4 w-4 mr-2" />
                                ) : (
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                )}
                                {hotel.available ? "Désactiver" : "Activer"}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Affichage de {currentPage * pageSize + 1} à{" "}
                {Math.min((currentPage + 1) * pageSize, hotels.totalElements)} sur {hotels.totalElements} hôtels
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={(currentPage + 1) * pageSize >= hotels.totalElements}
                >
                  Suivant
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="rooms" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestion des chambres</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher une chambre..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filtrer par type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tous</SelectItem>
                    <SelectItem value="SINGLE">Simple</SelectItem>
                    <SelectItem value="DOUBLE">Double</SelectItem>
                    <SelectItem value="SUITE">Suite</SelectItem>
                    <SelectItem value="FAMILY">Familiale</SelectItem>
                    <SelectItem value="DELUXE">Deluxe</SelectItem>
                  </SelectContent>
                </Select>
                <Button onClick={() => setEditingRoom({} as Room)}>
                  Ajouter une chambre
                </Button>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Chambre</TableHead>
                      <TableHead>Hôtel</TableHead>
                      <TableHead>Type</TableHead>
                      <TableHead>Prix / nuit</TableHead>
                      <TableHead>Capacité</TableHead>
                      <TableHead>Caractéristiques</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {rooms.content.map((room) => (
                      <TableRow key={room.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                              <AvatarFallback>{room.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="font-medium">{room.name}</span>
                              <p className="text-sm text-gray-500">N° {room.roomNumber}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{room.hotel?.name || "N/A"}</TableCell>
                        <TableCell>{room.type}</TableCell>
                        <TableCell>€{room.pricePerNight}</TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span>{room.capacity} personnes</span>
                            <span className="text-xs text-gray-500 ml-1">({room.bedCount} {room.bedType})</span>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="flex flex-wrap gap-1">
                            {room.hasBalcony && (
                              <Badge variant="outline" className="text-xs">Balcon</Badge>
                            )}
                            {room.hasSeaView && (
                              <Badge variant="outline" className="text-xs">Vue mer</Badge>
                            )}
                            {room.hasKitchen && (
                              <Badge variant="outline" className="text-xs">Cuisine</Badge>
                            )}
                            <Badge variant="outline" className="text-xs">{room.size} m²</Badge>
                          </div>
                        </TableCell>
                        <TableCell>
                          <Badge variant={room.available ? "default" : "destructive"}>
                            {room.available ? "Disponible" : "Indisponible"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => setEditingRoom(room)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                              <DropdownMenuItem>
                                {room.available ? (
                                  <XCircle className="h-4 w-4 mr-2" />
                                ) : (
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                )}
                                {room.available ? "Désactiver" : "Activer"}
                              </DropdownMenuItem>
                              <DropdownMenuItem className="text-red-600">
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Affichage de {currentPage * pageSize + 1} à{" "}
                {Math.min((currentPage + 1) * pageSize, rooms.totalElements)} sur {rooms.totalElements} chambres
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={(currentPage + 1) * pageSize >= rooms.totalElements}
                >
                  Suivant
                </Button>
              </div>
            </div>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestion des réservations</h2>
              <div className="flex gap-2">
                <div className="relative">
                  <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="Rechercher une réservation..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-8 w-64"
                  />
                </div>
                <Select value={selectedFilter} onValueChange={setSelectedFilter}>
                  <SelectTrigger className="w-40">
                    <SelectValue placeholder="Filtrer par statut" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="ALL">Tous</SelectItem>
                    <SelectItem value="PENDING">En attente</SelectItem>
                    <SelectItem value="CONFIRMED">Confirmées</SelectItem>
                    <SelectItem value="CANCELLED">Annulées</SelectItem>
                    <SelectItem value="COMPLETED">Terminées</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Référence</TableHead>
                      <TableHead>Client</TableHead>
                      <TableHead>Hôtel / Chambre</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Paiement</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {bookings.content.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell>
                          <div className="font-medium">{booking.bookingReference}</div>
                          <div className="text-xs text-gray-500">{new Date(booking.createdAt).toLocaleDateString()}</div>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={`/placeholder.svg?height=32&width=32`} />
                              <AvatarFallback>{booking.guestName?.charAt(0) || "G"}</AvatarFallback>
                            </Avatar>
                            <div>
                              <span className="font-medium">{booking.guestName}</span>
                              <p className="text-xs text-gray-500">{booking.guestEmail}</p>
                              <p className="text-xs text-gray-500">{booking.guestPhone}</p>
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">{booking.hotel?.name || "N/A"}</div>
                          <div className="text-sm text-gray-500">{booking.room?.name || "N/A"}</div>
                        </TableCell>
                        <TableCell>
                          <div className="text-sm">
                            <div>Arrivée: {new Date(booking.checkInDate).toLocaleDateString()}</div>
                            <div>Départ: {new Date(booking.checkOutDate).toLocaleDateString()}</div>
                            <div className="text-xs text-gray-500">{booking.nights} nuits, {booking.guests} personnes</div>
                          </div>
                        </TableCell>
                        <TableCell>
                          <div className="font-medium">€{booking.totalAmount}</div>
                          {booking.discountAmount > 0 && (
                            <div className="text-xs text-green-600">-€{booking.discountAmount} réduction</div>
                          )}
                        </TableCell>
                        <TableCell>{getStatusBadge(booking.status)}</TableCell>
                        <TableCell>{getStatusBadge(booking.paymentStatus)}</TableCell>
                        <TableCell>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm">
                                <MoreHorizontal className="h-4 w-4" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent>
                              <DropdownMenuItem onClick={() => setEditingBooking(booking)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Modifier
                              </DropdownMenuItem>
                              {booking.status === "PENDING" && (
                                <DropdownMenuItem onClick={() => handleConfirmBooking(booking.id)}>
                                  <CheckCircle className="h-4 w-4 mr-2" />
                                  Confirmer
                                </DropdownMenuItem>
                              )}
                              {(booking.status === "PENDING" || booking.status === "CONFIRMED") && (
                                <DropdownMenuItem onClick={() => handleCancelBooking(booking.id)}>
                                  <XCircle className="h-4 w-4 mr-2" />
                                  Annuler
                                </DropdownMenuItem>
                              )}
                              <DropdownMenuItem className="text-red-600" onClick={() => handleDeleteBooking(booking.id)}>
                                <Trash2 className="h-4 w-4 mr-2" />
                                Supprimer
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>

            {/* Pagination */}
            <div className="flex items-center justify-between">
              <p className="text-sm text-gray-700">
                Affichage de {currentPage * pageSize + 1} à{" "}
                {Math.min((currentPage + 1) * pageSize, bookings.totalElements)} sur {bookings.totalElements} réservations
              </p>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(Math.max(0, currentPage - 1))}
                  disabled={currentPage === 0}
                >
                  Précédent
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(currentPage + 1)}
                  disabled={(currentPage + 1) * pageSize >= bookings.totalElements}
                >
                  Suivant
                </Button>
              </div>
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* Modal de prédiction de prix */}
      {showPricePredictor && (
        <Dialog open={showPricePredictor} onOpenChange={setShowPricePredictor}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Brain className="h-5 w-5 mr-2" />
                Prédiction de prix IA
              </DialogTitle>
              <DialogDescription>Utilisez l'intelligence artificielle pour prédire le prix optimal</DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label htmlFor="hotelId">Hôtel</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un hôtel" />
                  </SelectTrigger>
                  <SelectContent>
                    {hotels.content.map((hotel) => (
                      <SelectItem key={hotel.id} value={hotel.id.toString()}>
                        {hotel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="roomType">Type de chambre</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Type de chambre" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SINGLE">Simple</SelectItem>
                    <SelectItem value="DOUBLE">Double</SelectItem>
                    <SelectItem value="SUITE">Suite</SelectItem>
                    <SelectItem value="FAMILY">Familiale</SelectItem>
                    <SelectItem value="DELUXE">Deluxe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="checkIn">Date d'arrivée</Label>
                <Input type="date" />
              </div>
              <div>
                <Label htmlFor="checkOut">Date de départ</Label>
                <Input type="date" />
              </div>
              <div>
                <Label htmlFor="season">Saison</Label>
                <Select>
                  <SelectTrigger>
                    <SelectValue placeholder="Saison" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="winter">Hiver</SelectItem>
                    <SelectItem value="spring">Printemps</SelectItem>
                    <SelectItem value="summer">Été</SelectItem>
                    <SelectItem value="autumn">Automne</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="occupancy">Taux d'occupation (%)</Label>
                <Input type="number" min="0" max="100" placeholder="75" />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setShowPricePredictor(false)}>
                Annuler
              </Button>
              <Button
                onClick={() => {
                  handlePredictPrice({
                    hotelId: 1,
                    roomType: "SINGLE",
                    checkInDate: "2024-07-15",
                    checkOutDate: "2024-07-20",
                    season: "summer",
                    occupancyRate: 85,
                    localEvents: ["Festival de musique", "Événement sportif"],
                  })
                  setShowPricePredictor(false)
                }}
                disabled={predictionLoading}
                className="bg-purple-600 hover:bg-purple-700"
              >
                {predictionLoading ? "Prédiction..." : "Prédire le prix"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal d'ajout/modification d'hôtel */}
      {editingHotel && (
        <Dialog open={!!editingHotel} onOpenChange={(open) => !open && setEditingHotel(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Hotel className="h-5 w-5 mr-2" />
                {editingHotel.id ? "Modifier l'hôtel" : "Ajouter un nouvel hôtel"}
              </DialogTitle>
              <DialogDescription>
                {editingHotel.id 
                  ? "Modifiez les informations de l'hôtel ci-dessous" 
                  : "Remplissez les informations pour ajouter un nouvel hôtel"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="name">Nom de l'hôtel</Label>
                <Input 
                  id="name" 
                  value={editingHotel.name || ''} 
                  onChange={(e) => setEditingHotel({...editingHotel, name: e.target.value})}
                  placeholder="Nom de l'hôtel"
                />
              </div>
              <div>
                <Label htmlFor="location">Localisation</Label>
                <Input 
                  id="location" 
                  value={editingHotel.location || ''} 
                  onChange={(e) => setEditingHotel({...editingHotel, location: e.target.value})}
                  placeholder="Ville, région"
                />
              </div>
              <div>
                <Label htmlFor="category">Catégorie</Label>
                <Select 
                  value={editingHotel.category || ''} 
                  onValueChange={(value) => setEditingHotel({...editingHotel, category: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner une catégorie" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="THREE_STARS">3 étoiles</SelectItem>
                    <SelectItem value="FOUR_STARS">4 étoiles</SelectItem>
                    <SelectItem value="FIVE_STARS">5 étoiles</SelectItem>
                    <SelectItem value="LUXURY">Luxe</SelectItem>
                    <SelectItem value="BOUTIQUE">Boutique</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="col-span-2">
                <Label htmlFor="address">Adresse</Label>
                <Input 
                  id="address" 
                  value={editingHotel.address || ''} 
                  onChange={(e) => setEditingHotel({...editingHotel, address: e.target.value})}
                  placeholder="Adresse complète"
                />
              </div>
              <div>
                <Label htmlFor="phone">Téléphone</Label>
                <Input 
                  id="phone" 
                  value={editingHotel.phone || ''} 
                  onChange={(e) => setEditingHotel({...editingHotel, phone: e.target.value})}
                  placeholder="+216 XX XXX XXX"
                />
              </div>
              <div>
                <Label htmlFor="email">Email</Label>
                <Input 
                  id="email" 
                  value={editingHotel.email || ''} 
                  onChange={(e) => setEditingHotel({...editingHotel, email: e.target.value})}
                  placeholder="contact@hotel.com"
                  type="email"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="website">Site web</Label>
                <Input 
                  id="website" 
                  value={editingHotel.website || ''} 
                  onChange={(e) => setEditingHotel({...editingHotel, website: e.target.value})}
                  placeholder="https://www.hotel.com"
                  type="url"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={editingHotel.description || ''} 
                  onChange={(e) => setEditingHotel({...editingHotel, description: e.target.value})}
                  placeholder="Description de l'hôtel"
                  rows={4}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="available" 
                  checked={editingHotel.available !== false}
                  onCheckedChange={(checked) => 
                    setEditingHotel({...editingHotel, available: !!checked})
                  }
                />
                <Label htmlFor="available">Disponible</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="featured" 
                  checked={editingHotel.featured === true}
                  onCheckedChange={(checked) => 
                    setEditingHotel({...editingHotel, featured: !!checked})
                  }
                />
                <Label htmlFor="featured">Mettre en avant</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingHotel(null)}>
                Annuler
              </Button>
              <Button
                onClick={() => {
                  const isNewHotel = !editingHotel.id;
                  const apiCall = isNewHotel 
                    ? apiClient.createHotel(editingHotel)
                    : apiClient.updateHotel(editingHotel.id, editingHotel);

                  apiCall.then(() => {
                    addNotification({
                      type: "success",
                      title: isNewHotel ? "Hôtel créé" : "Hôtel mis à jour",
                      message: isNewHotel 
                        ? "L'hôtel a été créé avec succès" 
                        : "L'hôtel a été mis à jour avec succès"
                    });
                    // Refresh hotels list
                    fetchHotels();
                    setEditingHotel(null);
                  }).catch(error => {
                    console.error("Error saving hotel:", error);
                    addNotification({
                      type: "error",
                      title: "Erreur",
                      message: "Une erreur est survenue lors de l'enregistrement de l'hôtel"
                    });
                  });
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                {editingHotel.id ? "Mettre à jour" : "Créer l'hôtel"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}

      {/* Modal d'ajout/modification de chambre */}
      {editingRoom && (
        <Dialog open={!!editingRoom} onOpenChange={(open) => !open && setEditingRoom(null)}>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle className="flex items-center">
                <Bed className="h-5 w-5 mr-2" />
                {editingRoom.id ? "Modifier la chambre" : "Ajouter une nouvelle chambre"}
              </DialogTitle>
              <DialogDescription>
                {editingRoom.id 
                  ? "Modifiez les informations de la chambre ci-dessous" 
                  : "Remplissez les informations pour ajouter une nouvelle chambre"}
              </DialogDescription>
            </DialogHeader>
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label htmlFor="hotel">Hôtel</Label>
                <Select 
                  value={editingRoom.hotel?.id?.toString() || ''} 
                  onValueChange={(value) => {
                    const selectedHotel = hotels.content.find(h => h.id.toString() === value);
                    setEditingRoom({...editingRoom, hotel: selectedHotel});
                  }}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un hôtel" />
                  </SelectTrigger>
                  <SelectContent>
                    {hotels.content.map((hotel) => (
                      <SelectItem key={hotel.id} value={hotel.id.toString()}>
                        {hotel.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="name">Nom de la chambre</Label>
                <Input 
                  id="name" 
                  value={editingRoom.name || ''} 
                  onChange={(e) => setEditingRoom({...editingRoom, name: e.target.value})}
                  placeholder="Nom de la chambre"
                />
              </div>
              <div>
                <Label htmlFor="roomNumber">Numéro de chambre</Label>
                <Input 
                  id="roomNumber" 
                  value={editingRoom.roomNumber || ''} 
                  onChange={(e) => setEditingRoom({...editingRoom, roomNumber: e.target.value})}
                  placeholder="101"
                />
              </div>
              <div>
                <Label htmlFor="type">Type de chambre</Label>
                <Select 
                  value={editingRoom.type || ''} 
                  onValueChange={(value) => setEditingRoom({...editingRoom, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Sélectionner un type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="SINGLE">Simple</SelectItem>
                    <SelectItem value="DOUBLE">Double</SelectItem>
                    <SelectItem value="SUITE">Suite</SelectItem>
                    <SelectItem value="FAMILY">Familiale</SelectItem>
                    <SelectItem value="DELUXE">Deluxe</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div>
                <Label htmlFor="pricePerNight">Prix par nuit (€)</Label>
                <Input 
                  id="pricePerNight" 
                  type="number"
                  value={editingRoom.pricePerNight || ''} 
                  onChange={(e) => setEditingRoom({...editingRoom, pricePerNight: parseFloat(e.target.value)})}
                  placeholder="150"
                />
              </div>
              <div>
                <Label htmlFor="capacity">Capacité (personnes)</Label>
                <Input 
                  id="capacity" 
                  type="number"
                  value={editingRoom.capacity || ''} 
                  onChange={(e) => setEditingRoom({...editingRoom, capacity: parseInt(e.target.value)})}
                  placeholder="2"
                />
              </div>
              <div>
                <Label htmlFor="size">Taille (m²)</Label>
                <Input 
                  id="size" 
                  type="number"
                  value={editingRoom.size || ''} 
                  onChange={(e) => setEditingRoom({...editingRoom, size: parseFloat(e.target.value)})}
                  placeholder="25"
                />
              </div>
              <div>
                <Label htmlFor="bedCount">Nombre de lits</Label>
                <Input 
                  id="bedCount" 
                  type="number"
                  value={editingRoom.bedCount || ''} 
                  onChange={(e) => setEditingRoom({...editingRoom, bedCount: parseInt(e.target.value)})}
                  placeholder="1"
                />
              </div>
              <div>
                <Label htmlFor="bedType">Type de lit</Label>
                <Input 
                  id="bedType" 
                  value={editingRoom.bedType || ''} 
                  onChange={(e) => setEditingRoom({...editingRoom, bedType: e.target.value})}
                  placeholder="King size"
                />
              </div>
              <div className="col-span-2">
                <Label htmlFor="description">Description</Label>
                <Textarea 
                  id="description" 
                  value={editingRoom.description || ''} 
                  onChange={(e) => setEditingRoom({...editingRoom, description: e.target.value})}
                  placeholder="Description de la chambre"
                  rows={3}
                />
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="available" 
                  checked={editingRoom.available !== false}
                  onCheckedChange={(checked) => 
                    setEditingRoom({...editingRoom, available: !!checked})
                  }
                />
                <Label htmlFor="available">Disponible</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="hasBalcony" 
                  checked={editingRoom.hasBalcony === true}
                  onCheckedChange={(checked) => 
                    setEditingRoom({...editingRoom, hasBalcony: !!checked})
                  }
                />
                <Label htmlFor="hasBalcony">Balcon</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="hasSeaView" 
                  checked={editingRoom.hasSeaView === true}
                  onCheckedChange={(checked) => 
                    setEditingRoom({...editingRoom, hasSeaView: !!checked})
                  }
                />
                <Label htmlFor="hasSeaView">Vue mer</Label>
              </div>
              <div className="flex items-center space-x-2">
                <Checkbox 
                  id="hasKitchen" 
                  checked={editingRoom.hasKitchen === true}
                  onCheckedChange={(checked) => 
                    setEditingRoom({...editingRoom, hasKitchen: !!checked})
                  }
                />
                <Label htmlFor="hasKitchen">Cuisine</Label>
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setEditingRoom(null)}>
                Annuler
              </Button>
              <Button
                onClick={() => {
                  const isNewRoom = !editingRoom.id;

                  // Ensure hotel is set
                  if (!editingRoom.hotel || !editingRoom.hotel.id) {
                    addNotification({
                      type: "error",
                      title: "Erreur",
                      message: "Veuillez sélectionner un hôtel pour cette chambre"
                    });
                    return;
                  }

                  const apiCall = isNewRoom 
                    ? apiClient.createRoom(editingRoom)
                    : apiClient.updateRoom(editingRoom.id, editingRoom);

                  apiCall.then(() => {
                    addNotification({
                      type: "success",
                      title: isNewRoom ? "Chambre créée" : "Chambre mise à jour",
                      message: isNewRoom 
                        ? "La chambre a été créée avec succès" 
                        : "La chambre a été mise à jour avec succès"
                    });
                    // Refresh rooms list
                    fetchRooms();
                    setEditingRoom(null);
                  }).catch(error => {
                    console.error("Error saving room:", error);
                    addNotification({
                      type: "error",
                      title: "Erreur",
                      message: "Une erreur est survenue lors de l'enregistrement de la chambre"
                    });
                  });
                }}
                className="bg-green-600 hover:bg-green-700"
              >
                {editingRoom.id ? "Mettre à jour" : "Créer la chambre"}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      )}
    </div>
  )
}
