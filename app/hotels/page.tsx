"use client"

import { useState, useMemo, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import {
  Search,
  Filter,
  Star,
  Heart,
  MapPin,
  Wifi,
  Car,
  Utensils,
  Waves,
  SlidersHorizontal,
  Calendar,
  Users,
  Loader,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog"
import { Navbar } from "../components/navbar"
import { Footer } from "../components/footer"
import { useAuth } from "../contexts/auth-context"
import { useNotifications } from "../contexts/notification-context"
import { apiClient } from "@/lib/api"

// Fallback data in case API is not available
const fallbackHotels = [
  {
    id: 1,
    name: "Hôtel Laico Tunis",
    location: "Tunis Centre",
    price: 120,
    originalPrice: 150,
    rating: 4.5,
    reviews: 324,
    image: "/placeholder.svg?height=200&width=300",
    amenities: ["wifi", "parking", "restaurant", "pool"],
    category: "FOUR_STARS",
    available: true,
    description: "Hôtel moderne au cœur de Tunis avec vue panoramique",
    rooms: [
      { id: 1, name: "Chambre Standard", price: 120, capacity: 2, available: true },
      { id: 2, name: "Chambre Deluxe", price: 180, capacity: 2, available: true },
    ],
  },
  {
    id: 2,
    name: "Four Seasons Tunis",
    location: "Gammarth",
    price: 280,
    originalPrice: 320,
    rating: 4.8,
    reviews: 156,
    image: "/placeholder.svg?height=200&width=300",
    amenities: ["wifi", "beach", "spa", "golf"],
    category: "FIVE_STARS",
    available: true,
    description: "Luxe et élégance face à la Méditerranée",
    rooms: [
      { id: 3, name: "Suite Deluxe", price: 280, capacity: 2, available: true },
      { id: 4, name: "Suite Présidentielle", price: 450, capacity: 4, available: true },
    ],
  },
  {
    id: 3,
    name: "Villa Didon",
    location: "Sidi Bou Said",
    price: 350,
    originalPrice: 400,
    rating: 4.9,
    reviews: 89,
    image: "/placeholder.svg?height=200&width=300",
    amenities: ["wifi", "sea-view", "spa", "restaurant"],
    category: "LUXURY",
    available: true,
    description: "Villa de charme avec vue mer exceptionnelle",
    rooms: [
      { id: 5, name: "Villa Standard", price: 350, capacity: 2, available: true },
      { id: 6, name: "Villa Premium", price: 500, capacity: 4, available: false },
    ],
  },
  {
    id: 4,
    name: "Hôtel Bellevue",
    location: "Sousse",
    price: 85,
    originalPrice: 100,
    rating: 4.2,
    reviews: 267,
    image: "/placeholder.svg?height=200&width=300",
    amenities: ["wifi", "pool", "restaurant"],
    category: "THREE_STARS",
    available: true,
    description: "Confort et convivialité au centre de Sousse",
    rooms: [
      { id: 7, name: "Chambre Standard", price: 85, capacity: 2, available: true },
      { id: 8, name: "Chambre Familiale", price: 120, capacity: 4, available: true },
    ],
  },
  {
    id: 5,
    name: "Resort Djerba",
    location: "Djerba",
    price: 180,
    originalPrice: 220,
    rating: 4.6,
    reviews: 445,
    image: "/placeholder.svg?height=200&width=300",
    amenities: ["wifi", "beach", "pool", "spa"],
    category: "FOUR_STARS",
    available: true,
    description: "Resort tout inclus sur la plage de Djerba",
    rooms: [
      { id: 9, name: "Chambre Resort", price: 180, capacity: 2, available: true },
      { id: 10, name: "Suite Resort", price: 250, capacity: 3, available: true },
    ],
  },
  {
    id: 6,
    name: "Riad Hammamet",
    location: "Hammamet",
    price: 95,
    originalPrice: 120,
    rating: 4.3,
    reviews: 198,
    image: "/placeholder.svg?height=200&width=300",
    amenities: ["wifi", "pool", "spa"],
    category: "BOUTIQUE",
    available: true,
    description: "Riad authentique dans la médina de Hammamet",
    rooms: [
      { id: 11, name: "Chambre Riad", price: 95, capacity: 2, available: true },
      { id: 12, name: "Suite Riad", price: 140, capacity: 2, available: true },
    ],
  },
]

const amenityIcons = {
  wifi: <Wifi className="h-4 w-4" />,
  parking: <Car className="h-4 w-4" />,
  restaurant: <Utensils className="h-4 w-4" />,
  pool: <Waves className="h-4 w-4" />,
  beach: <Waves className="h-4 w-4" />,
  spa: <Star className="h-4 w-4" />,
  golf: <Star className="h-4 w-4" />,
  "sea-view": <MapPin className="h-4 w-4" />,
}

const amenityLabels = {
  wifi: "WiFi gratuit",
  parking: "Parking",
  restaurant: "Restaurant",
  pool: "Piscine",
  beach: "Accès plage",
  spa: "Spa",
  golf: "Golf",
  "sea-view": "Vue mer",
}

export default function HotelsPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { addNotification } = useNotifications()

  const [searchTerm, setSearchTerm] = useState(searchParams.get("location") || "")
  const [priceRange, setPriceRange] = useState([0, 500])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("rating")
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])
  const [selectedHotel, setSelectedHotel] = useState<any>(null)
  const [bookingData, setBookingData] = useState({
    checkIn: searchParams.get("checkIn") || "",
    checkOut: searchParams.get("checkOut") || "",
    guests: Number.parseInt(searchParams.get("guests") || "2"),
    selectedRoom: null as any,
  })

  // State for price prediction
  const [predictedPrices, setPredictedPrices] = useState<Record<number, number>>({})
  const [loadingPredictions, setLoadingPredictions] = useState<Record<number, boolean>>({})
  const [predictionErrors, setPredictionErrors] = useState<Record<number, string>>({})

  // API state
  const [hotels, setHotels] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [apiConnected, setApiConnected] = useState(false)

  // Fetch hotels from API
  useEffect(() => {
    const fetchHotels = async () => {
      setLoading(true)
      setError(null)

      try {
        // Test API connection
        const connectionTest = await apiClient.testConnection()
        setApiConnected(connectionTest.success)

        if (connectionTest.success) {
          // Fetch featured hotels from API
          const response = await apiClient.getFeaturedHotels()
          setHotels(response || [])
        } else {
          // Use fallback data if API is not connected
          console.log("API not connected, using fallback data")
          setHotels(fallbackHotels)
        }
      } catch (err) {
        console.error("Error fetching hotels:", err)
        setError("Impossible de charger les hôtels. Utilisation des données de démonstration.")
        setHotels(fallbackHotels)
      } finally {
        setLoading(false)
      }
    }

    fetchHotels()
  }, [])

  // Load favorites from localStorage
  useEffect(() => {
    const savedFavorites = localStorage.getItem("tunisia_stay_favorites")
    if (savedFavorites) {
      setFavorites(JSON.parse(savedFavorites))
    }
  }, [])

  // Filter hotels locally for amenities and availability
  // Most other filtering is done on the server side
  const filteredAndSortedHotels = useMemo(() => {
    if (!hotels || hotels.length === 0) return []

    return hotels.filter((hotel) => {
      // Filter by amenities (not handled by API)
      const matchesAmenities =
        selectedAmenities.length === 0 || 
        selectedAmenities.every((amenity) => hotel.amenities && hotel.amenities.includes(amenity))

      // Filter by availability (may be handled by API)
      const matchesAvailability = !showAvailableOnly || hotel.available

      return matchesAmenities && matchesAvailability
    })
  }, [hotels, selectedAmenities, showAvailableOnly])

  const toggleFavorite = (hotelId: number) => {
    const newFavorites = favorites.includes(hotelId)
      ? favorites.filter((id) => id !== hotelId)
      : [...favorites, hotelId]

    setFavorites(newFavorites)
    localStorage.setItem("tunisia_stay_favorites", JSON.stringify(newFavorites))

    addNotification({
      type: "success",
      title: favorites.includes(hotelId) ? "Retiré des favoris" : "Ajouté aux favoris",
      message: `L'hôtel a été ${favorites.includes(hotelId) ? "retiré de" : "ajouté à"} vos favoris`,
    })
  }

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) => (prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]))
  }

  const handleBookNow = (hotel: any) => {
    if (!user) {
      addNotification({
        type: "error",
        title: "Connexion requise",
        message: "Veuillez vous connecter pour effectuer une réservation",
      })
      router.push("/login")
      return
    }
    setSelectedHotel(hotel)
  }

  const handleRoomSelection = (room: any) => {
    setBookingData({ ...bookingData, selectedRoom: room })
  }

  const getPredictedPrice = async (roomId: number) => {
    if (loadingPredictions[roomId]) return

    setLoadingPredictions(prev => ({ ...prev, [roomId]: true }))
    setPredictionErrors(prev => ({ ...prev, [roomId]: "" }))

    try {
      if (!apiConnected) {
        // Simulate API call in demo mode with a random price adjustment
        await new Promise(resolve => setTimeout(resolve, 1000))
        const room = selectedHotel.rooms.find((r: any) => r.id === roomId)
        if (room) {
          const basePrice = room.price
          const adjustment = (Math.random() * 0.3) - 0.15 // -15% to +15%
          const predictedPrice = Math.round(basePrice * (1 + adjustment))
          setPredictedPrices(prev => ({ ...prev, [roomId]: predictedPrice }))
        }
      } else {
        // Real API call
        const response = await apiClient.predictRoomPrice(roomId)
        setPredictedPrices(prev => ({ ...prev, [roomId]: response.predictedPrice }))
      }
    } catch (err) {
      console.error("Error predicting price:", err)
      setPredictionErrors(prev => ({ ...prev, [roomId]: "Erreur lors de la prédiction" }))
    } finally {
      setLoadingPredictions(prev => ({ ...prev, [roomId]: false }))
    }
  }

  const proceedToPayment = () => {
    if (!bookingData.checkIn || !bookingData.checkOut || !bookingData.selectedRoom) {
      addNotification({
        type: "error",
        title: "Informations manquantes",
        message: "Veuillez sélectionner les dates et une chambre",
      })
      return
    }

    const params = new URLSearchParams({
      hotelId: selectedHotel.id.toString(),
      roomId: bookingData.selectedRoom.id.toString(),
      checkIn: bookingData.checkIn,
      checkOut: bookingData.checkOut,
      guests: bookingData.guests.toString(),
    })

    router.push(`/payment?${params.toString()}`)
  }

  const FilterContent = () => (
    <div className="space-y-6">
      {/* Prix */}
      <div>
        <Label className="text-base font-medium">Prix par nuit</Label>
        <div className="mt-2">
          <Slider value={priceRange} onValueChange={setPriceRange} max={500} step={10} className="w-full" />
          <div className="flex justify-between text-sm text-gray-500 mt-1">
            <span>{priceRange[0]}€</span>
            <span>{priceRange[1]}€</span>
          </div>
        </div>
      </div>

      {/* Catégorie */}
      <div>
        <Label className="text-base font-medium">Catégorie</Label>
        <Select value={selectedCategory} onValueChange={setSelectedCategory}>
          <SelectTrigger className="mt-2">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">Toutes catégories</SelectItem>
            <SelectItem value="3-stars">3 étoiles</SelectItem>
            <SelectItem value="4-stars">4 étoiles</SelectItem>
            <SelectItem value="5-stars">5 étoiles</SelectItem>
            <SelectItem value="luxury">Luxe</SelectItem>
            <SelectItem value="boutique">Boutique</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Équipements */}
      <div>
        <Label className="text-base font-medium">Équipements</Label>
        <div className="mt-2 space-y-2">
          {Object.entries(amenityLabels).map(([key, label]) => (
            <div key={key} className="flex items-center space-x-2">
              <Checkbox id={key} checked={selectedAmenities.includes(key)} onCheckedChange={() => toggleAmenity(key)} />
              <Label htmlFor={key} className="text-sm">
                {label}
              </Label>
            </div>
          ))}
        </div>
      </div>

      {/* Disponibilité */}
      <div className="flex items-center space-x-2">
        <Checkbox id="available" checked={showAvailableOnly} onCheckedChange={setShowAvailableOnly} />
        <Label htmlFor="available">Disponible uniquement</Label>
      </div>
    </div>
  )

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* En-tête */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-4">Hôtels en Tunisie</h1>
          <p className="text-gray-600">
            Découvrez {filteredAndSortedHotels.length} hôtels correspondant à vos critères
          </p>
        </div>

        {/* Barre de recherche et filtres */}
        <div className="bg-white p-6 rounded-lg shadow-sm mb-8">
          <div className="flex flex-col lg:flex-row gap-4">
            {/* Recherche */}
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher par nom d'hôtel ou destination..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-2">
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="date"
                  value={bookingData.checkIn}
                  onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                  className="pl-10"
                  min={new Date().toISOString().split("T")[0]}
                />
              </div>
              <div className="relative">
                <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  type="date"
                  value={bookingData.checkOut}
                  onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                  className="pl-10"
                  min={bookingData.checkIn || new Date().toISOString().split("T")[0]}
                />
              </div>
            </div>

            {/* Voyageurs */}
            <div className="w-full lg:w-32">
              <Select
                value={bookingData.guests.toString()}
                onValueChange={(value) => setBookingData({ ...bookingData, guests: Number.parseInt(value) })}
              >
                <SelectTrigger>
                  <Users className="h-4 w-4 mr-2" />
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1</SelectItem>
                  <SelectItem value="2">2</SelectItem>
                  <SelectItem value="3">3</SelectItem>
                  <SelectItem value="4">4</SelectItem>
                  <SelectItem value="5">5+</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Tri */}
            <div className="w-full lg:w-48">
              <Select value={sortBy} onValueChange={setSortBy}>
                <SelectTrigger>
                  <SelectValue placeholder="Trier par" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="rating">Note</SelectItem>
                  <SelectItem value="price-low">Prix croissant</SelectItem>
                  <SelectItem value="price-high">Prix décroissant</SelectItem>
                  <SelectItem value="reviews">Nombre d'avis</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Filtres mobile */}
            <div className="lg:hidden">
              <Dialog>
                <DialogTrigger asChild>
                  <Button variant="outline">
                    <SlidersHorizontal className="h-4 w-4 mr-2" />
                    Filtres
                  </Button>
                </DialogTrigger>
                <DialogContent>
                  <DialogHeader>
                    <DialogTitle>Filtres</DialogTitle>
                  </DialogHeader>
                  <FilterContent />
                </DialogContent>
              </Dialog>
            </div>
          </div>
        </div>

        <div className="flex gap-8">
          {/* Filtres desktop */}
          <div className="hidden lg:block w-80">
            <Card className="p-6 sticky top-4">
              <h3 className="font-semibold mb-4 flex items-center">
                <Filter className="h-4 w-4 mr-2" />
                Filtres
              </h3>
              <FilterContent />
            </Card>
          </div>

          {/* Liste des hôtels */}
          <div className="flex-1">
            {/* Loading indicator */}
            {loading && (
              <div className="flex justify-center items-center py-12">
                <Loader className="h-8 w-8 animate-spin text-primary" />
                <span className="ml-2 text-lg">Chargement des hôtels...</span>
              </div>
            )}

            {/* Error message */}
            {error && (
              <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded mb-6">
                <p>{error}</p>
                {!apiConnected && (
                  <p className="text-sm mt-2">
                    Le serveur API n'est pas accessible. Les données affichées sont des exemples.
                  </p>
                )}
              </div>
            )}

            {/* API status indicator */}
            {!loading && apiConnected && (
              <div className="bg-green-50 border border-green-200 text-green-700 px-4 py-3 rounded mb-6">
                <p>✅ Connecté à l'API - Affichage des données en temps réel</p>
              </div>
            )}

            {!loading && !apiConnected && !error && (
              <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 px-4 py-3 rounded mb-6">
                <p>⚠️ Mode démo - Affichage des données d'exemple</p>
              </div>
            )}

            <div className="grid gap-6">
              {filteredAndSortedHotels.map((hotel) => (
                <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="flex flex-col md:flex-row">
                    {/* Image */}
                    <div className="relative md:w-80 h-48 md:h-auto">
                      <img
                        src={hotel.image || "/placeholder.svg"}
                        alt={hotel.name}
                        className="w-full h-full object-cover"
                      />
                      <Button
                        variant="ghost"
                        size="sm"
                        className="absolute top-2 right-2 bg-white/80 hover:bg-white"
                        onClick={() => toggleFavorite(hotel.id)}
                      >
                        <Heart
                          className={`h-4 w-4 ${favorites.includes(hotel.id) ? "fill-red-500 text-red-500" : "text-gray-600"}`}
                        />
                      </Button>
                      {!hotel.available && (
                        <div className="absolute inset-0 bg-black/50 flex items-center justify-center">
                          <Badge variant="destructive">Complet</Badge>
                        </div>
                      )}
                    </div>

                    {/* Contenu */}
                    <CardContent className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">{hotel.name}</h3>
                          <div className="flex items-center text-gray-600 mb-2">
                            <MapPin className="h-4 w-4 mr-1" />
                            <span className="text-sm">{hotel.location}</span>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="flex items-center gap-2">
                            {hotel.originalPrice > hotel.price && (
                              <span className="text-sm text-gray-500 line-through">{hotel.originalPrice}€</span>
                            )}
                            <span className="text-2xl font-bold text-red-600">{hotel.price}€</span>
                          </div>
                          <div className="text-sm text-gray-500">par nuit</div>
                        </div>
                      </div>

                      <p className="text-gray-600 text-sm mb-3">{hotel.description}</p>

                      {/* Note et avis */}
                      <div className="flex items-center mb-4">
                        <div className="flex items-center bg-green-100 px-2 py-1 rounded">
                          <Star className="h-4 w-4 fill-green-600 text-green-600 mr-1" />
                          <span className="font-medium text-green-800">{hotel.rating}</span>
                        </div>
                        <span className="text-sm text-gray-500 ml-2">({hotel.reviews} avis)</span>
                      </div>

                      {/* Équipements */}
                      <div className="flex flex-wrap gap-2 mb-4">
                        {hotel.amenities.slice(0, 4).map((amenity) => (
                          <div key={amenity} className="flex items-center bg-gray-100 px-2 py-1 rounded text-xs">
                            {amenityIcons[amenity as keyof typeof amenityIcons]}
                            <span className="ml-1">{amenityLabels[amenity as keyof typeof amenityLabels]}</span>
                          </div>
                        ))}
                        {hotel.amenities.length > 4 && (
                          <Badge variant="outline" className="text-xs">
                            +{hotel.amenities.length - 4}
                          </Badge>
                        )}
                      </div>

                      {/* Actions */}
                      <div className="flex gap-2">
                        <Button
                          className="flex-1 bg-green-600 hover:bg-green-700"
                          disabled={!hotel.available}
                          onClick={() => handleBookNow(hotel)}
                        >
                          {hotel.available ? "Réserver maintenant" : "Complet"}
                        </Button>
                        <Button variant="outline" onClick={() => router.push(`/hotels/${hotel.id}`)}>
                          Voir détails
                        </Button>
                      </div>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>

            {filteredAndSortedHotels.length === 0 && (
              <div className="text-center py-12">
                <p className="text-gray-500 text-lg">Aucun hôtel ne correspond à vos critères</p>
                <Button
                  variant="outline"
                  className="mt-4"
                  onClick={() => {
                    setSearchTerm("")
                    setPriceRange([0, 500])
                    setSelectedCategory("all")
                    setSelectedAmenities([])
                    setShowAvailableOnly(false)
                  }}
                >
                  Réinitialiser les filtres
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Modal de réservation */}
      <Dialog open={!!selectedHotel} onOpenChange={() => setSelectedHotel(null)}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Réserver - {selectedHotel?.name}</DialogTitle>
            <DialogDescription>Sélectionnez votre chambre et vos dates de séjour</DialogDescription>
          </DialogHeader>

          {selectedHotel && (
            <div className="space-y-6">
              {/* Dates de séjour */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label>Date d'arrivée</Label>
                  <Input
                    type="date"
                    value={bookingData.checkIn}
                    onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                    min={new Date().toISOString().split("T")[0]}
                  />
                </div>
                <div>
                  <Label>Date de départ</Label>
                  <Input
                    type="date"
                    value={bookingData.checkOut}
                    onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                    min={bookingData.checkIn || new Date().toISOString().split("T")[0]}
                  />
                </div>
              </div>

              {/* Nombre de voyageurs */}
              <div>
                <Label>Nombre de voyageurs</Label>
                <Select
                  value={bookingData.guests.toString()}
                  onValueChange={(value) => setBookingData({ ...bookingData, guests: Number.parseInt(value) })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="1">1 voyageur</SelectItem>
                    <SelectItem value="2">2 voyageurs</SelectItem>
                    <SelectItem value="3">3 voyageurs</SelectItem>
                    <SelectItem value="4">4 voyageurs</SelectItem>
                    <SelectItem value="5">5+ voyageurs</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {/* Sélection de chambre */}
              <div>
                <Label className="text-base font-medium">Choisissez votre chambre</Label>
                <div className="grid gap-3 mt-2">
                  {selectedHotel.rooms.map((room: any) => (
                    <Card
                      key={room.id}
                      className={`cursor-pointer transition-colors ${
                        bookingData.selectedRoom?.id === room.id ? "border-green-500 bg-green-50" : ""
                      } ${!room.available ? "opacity-50" : ""}`}
                      onClick={() => room.available && handleRoomSelection(room)}
                    >
                      <CardContent className="p-4">
                        <div className="flex justify-between items-center">
                          <div>
                            <h4 className="font-medium">{room.name}</h4>
                            <p className="text-sm text-gray-600">Capacité: {room.capacity} personnes</p>
                          </div>
                          <div className="text-right">
                            <div className="text-lg font-bold text-green-600">{room.price}€</div>
                            <div className="text-sm text-gray-500">par nuit</div>
                            {!room.available && (
                              <Badge variant="destructive" className="mt-1">
                                Indisponible
                              </Badge>
                            )}

                            {/* AI Price Prediction */}
                            {room.available && (
                              <div className="mt-2">
                                {predictedPrices[room.id] ? (
                                  <div className="flex flex-col items-end">
                                    <div className="text-sm text-gray-600">Prix suggéré par IA:</div>
                                    <div className={`text-sm font-medium ${
                                      predictedPrices[room.id] > room.price 
                                        ? 'text-red-600' 
                                        : 'text-blue-600'
                                    }`}>
                                      {predictedPrices[room.id]}€
                                      {predictedPrices[room.id] > room.price 
                                        ? ' ↑' 
                                        : predictedPrices[room.id] < room.price 
                                          ? ' ↓' 
                                          : ''}
                                    </div>
                                  </div>
                                ) : (
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    className="text-xs mt-1"
                                    onClick={(e) => {
                                      e.stopPropagation();
                                      getPredictedPrice(room.id);
                                    }}
                                    disabled={loadingPredictions[room.id]}
                                  >
                                    {loadingPredictions[room.id] ? (
                                      <>
                                        <Loader className="h-3 w-3 mr-1 animate-spin" />
                                        Prédiction...
                                      </>
                                    ) : (
                                      "Prédire prix optimal"
                                    )}
                                  </Button>
                                )}
                                {predictionErrors[room.id] && (
                                  <div className="text-xs text-red-500 mt-1">
                                    {predictionErrors[room.id]}
                                  </div>
                                )}
                              </div>
                            )}
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </div>

              {/* Résumé */}
              {bookingData.selectedRoom && bookingData.checkIn && bookingData.checkOut && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="font-medium mb-2">Résumé de votre réservation</h4>
                  <div className="space-y-1 text-sm">
                    <div className="flex justify-between">
                      <span>Chambre:</span>
                      <span>{bookingData.selectedRoom.name}</span>
                    </div>
                    <div className="flex justify-between">
                      <span>Dates:</span>
                      <span>
                        {bookingData.checkIn} - {bookingData.checkOut}
                      </span>
                    </div>
                    <div className="flex justify-between">
                      <span>Voyageurs:</span>
                      <span>{bookingData.guests}</span>
                    </div>
                    <div className="flex justify-between font-medium">
                      <span>Prix par nuit:</span>
                      <span>{bookingData.selectedRoom.price}€</span>
                    </div>
                  </div>
                </div>
              )}

              {/* Actions */}
              <div className="flex gap-3">
                <Button variant="outline" onClick={() => setSelectedHotel(null)} className="flex-1">
                  Annuler
                </Button>
                <Button
                  onClick={proceedToPayment}
                  className="flex-1 bg-green-600 hover:bg-green-700"
                  disabled={!bookingData.selectedRoom || !bookingData.checkIn || !bookingData.checkOut}
                >
                  Continuer vers le paiement
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      <Footer />
    </div>
  )
}
