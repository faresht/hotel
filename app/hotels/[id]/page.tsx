"use client"

import { useState, useEffect } from "react"
import { useParams, useRouter } from "next/navigation"
import {
  Star,
  MapPin,
  Wifi,
  Car,
  Utensils,
  Waves,
  Calendar,
  Users,
  ArrowLeft,
  Loader,
  Heart,
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Navbar } from "../../components/navbar"
import { Footer } from "../../components/footer"
import { useAuth } from "../../contexts/auth-context"
import { useNotifications } from "../../contexts/notification-context"
import { apiClient } from "@/lib/api"

// Amenity icons and labels (same as in hotels/page.tsx)
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

export default function HotelDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const { user } = useAuth()
  const { addNotification } = useNotifications()
  const hotelId = params.id as string

  // State
  const [hotel, setHotel] = useState<any>(null)
  const [rooms, setRooms] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [isFavorite, setIsFavorite] = useState(false)
  const [bookingData, setBookingData] = useState({
    checkIn: "",
    checkOut: "",
    guests: 2,
    selectedRoom: null as any,
  })

  // Price prediction state
  const [predictedPrices, setPredictedPrices] = useState<Record<number, number>>({})
  const [loadingPredictions, setLoadingPredictions] = useState<Record<number, boolean>>({})
  const [predictionErrors, setPredictionErrors] = useState<Record<number, string>>({})

  // Fetch hotel details
  useEffect(() => {
    const fetchHotelDetails = async () => {
      setLoading(true)
      setError(null)

      try {
        // Test API connection
        const connectionTest = await apiClient.testConnection()

        if (connectionTest.success) {
          // Fetch hotel details from API
          const hotelData = await apiClient.getHotelById(Number(hotelId))
          setHotel(hotelData)

          // Fetch hotel rooms
          const roomsData = await apiClient.getHotelRooms(Number(hotelId))
          setRooms(roomsData || [])

          // Check if hotel is in favorites
          if (user) {
            const isInFavorites = localStorage.getItem("tunisia_stay_favorites")
            if (isInFavorites) {
              const favorites = JSON.parse(isInFavorites)
              setIsFavorite(favorites.includes(Number(hotelId)))
            }
          }
        } else {
          // Use fallback data if API is not connected
          console.log("API not connected, using fallback data")
          setError("API non disponible. Utilisation des données de démonstration.")

          // Create fallback hotel data
          setHotel({
            id: Number(hotelId),
            name: "Hôtel Exemple",
            location: "Tunis",
            description: "Cet hôtel est un exemple pour le mode démo.",
            rating: 4.5,
            reviewCount: 120,
            amenities: ["wifi", "parking", "restaurant", "pool"],
            category: "FOUR_STARS",
            available: true,
            price: 150,
            originalPrice: 180,
            images: ["/placeholder.svg?height=400&width=600"],
            address: "123 Rue de Tunis, Tunis",
            phone: "+216 71 123 456",
            email: "contact@hotel-exemple.com",
            website: "https://www.hotel-exemple.com",
          })

          // Create fallback rooms data
          setRooms([
            {
              id: 1,
              name: "Chambre Standard",
              type: "DOUBLE",
              description: "Chambre confortable avec vue sur la ville",
              pricePerNight: 150,
              capacity: 2,
              bedCount: 1,
              bedType: "King size",
              size: 25,
              available: true,
              hasBalcony: true,
              hasSeaView: false,
              hasKitchen: false,
            },
            {
              id: 2,
              name: "Suite Deluxe",
              type: "SUITE",
              description: "Suite spacieuse avec salon séparé",
              pricePerNight: 250,
              capacity: 3,
              bedCount: 2,
              bedType: "King size + Sofa",
              size: 40,
              available: true,
              hasBalcony: true,
              hasSeaView: true,
              hasKitchen: true,
            },
          ])
        }
      } catch (err) {
        console.error("Error fetching hotel details:", err)
        setError("Impossible de charger les détails de l'hôtel.")
      } finally {
        setLoading(false)
      }
    }

    if (hotelId) {
      fetchHotelDetails()
    }
  }, [hotelId, user])

  const toggleFavorite = () => {
    if (!user) {
      addNotification({
        type: "error",
        title: "Connexion requise",
        message: "Veuillez vous connecter pour ajouter aux favoris",
      })
      router.push("/login")
      return
    }

    const savedFavorites = localStorage.getItem("tunisia_stay_favorites")
    let favorites = savedFavorites ? JSON.parse(savedFavorites) : []

    if (isFavorite) {
      favorites = favorites.filter((id: number) => id !== Number(hotelId))
    } else {
      favorites.push(Number(hotelId))
    }

    localStorage.setItem("tunisia_stay_favorites", JSON.stringify(favorites))
    setIsFavorite(!isFavorite)

    addNotification({
      type: "success",
      title: isFavorite ? "Retiré des favoris" : "Ajouté aux favoris",
      message: `L'hôtel a été ${isFavorite ? "retiré de" : "ajouté à"} vos favoris`,
    })
  }

  const handleBookNow = (room: any) => {
    if (!user) {
      addNotification({
        type: "error",
        title: "Connexion requise",
        message: "Veuillez vous connecter pour effectuer une réservation",
      })
      router.push("/login")
      return
    }

    setBookingData({ ...bookingData, selectedRoom: room })

    // Redirect to payment page with query parameters
    if (bookingData.checkIn && bookingData.checkOut) {
      const params = new URLSearchParams({
        hotelId: hotelId,
        roomId: room.id.toString(),
        checkIn: bookingData.checkIn,
        checkOut: bookingData.checkOut,
        guests: bookingData.guests.toString(),
      })

      router.push(`/payment?${params.toString()}`)
    } else {
      addNotification({
        type: "error",
        title: "Dates manquantes",
        message: "Veuillez sélectionner les dates d'arrivée et de départ",
      })
    }
  }

  const getPredictedPrice = async (roomId: number) => {
    if (loadingPredictions[roomId]) return

    setLoadingPredictions(prev => ({ ...prev, [roomId]: true }))
    setPredictionErrors(prev => ({ ...prev, [roomId]: "" }))

    try {
      // Check if API is connected
      const connectionTest = await apiClient.testConnection()

      if (!connectionTest.success) {
        // Simulate API call in demo mode with a random price adjustment
        await new Promise(resolve => setTimeout(resolve, 1000))
        const room = rooms.find((r: any) => r.id === roomId)
        if (room) {
          const basePrice = room.pricePerNight
          // Ensure base price is a valid number
          if (typeof basePrice === 'number' && !isNaN(basePrice)) {
            const adjustment = (Math.random() * 0.3) - 0.15 // -15% to +15%
            const predictedPrice = Math.round(basePrice * (1 + adjustment))
            setPredictedPrices(prev => ({ ...prev, [roomId]: predictedPrice }))
          } else {
            console.error("Invalid base price for prediction:", basePrice)
            setPredictionErrors(prev => ({ ...prev, [roomId]: "Prix de base invalide" }))
          }
        } else {
          console.error("Room not found for prediction:", roomId)
          setPredictionErrors(prev => ({ ...prev, [roomId]: "Chambre non trouvée" }))
        }
      } else {
        // Real API call
        const response = await apiClient.predictRoomPrice(roomId)
        // Ensure the predicted price is a valid number
        const predictedPrice = response.predictedPrice
        if (typeof predictedPrice === 'number' && !isNaN(predictedPrice)) {
          setPredictedPrices(prev => ({ ...prev, [roomId]: predictedPrice }))
        } else {
          console.error("Received invalid predicted price:", predictedPrice)
          setPredictionErrors(prev => ({ ...prev, [roomId]: "Prix invalide reçu" }))
        }
      }
    } catch (err) {
      console.error("Error predicting price:", err)
      setPredictionErrors(prev => ({ ...prev, [roomId]: "Erreur lors de la prédiction" }))
    } finally {
      setLoadingPredictions(prev => ({ ...prev, [roomId]: false }))
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12 flex justify-center items-center">
          <Loader className="h-8 w-8 animate-spin text-primary mr-2" />
          <span>Chargement des détails de l'hôtel...</span>
        </div>
        <Footer />
      </div>
    )
  }

  if (error || !hotel) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-12">
          <Button variant="outline" onClick={() => router.back()} className="mb-6">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <div className="bg-red-50 border border-red-200 text-red-700 p-4 rounded">
            <p>{error || "Hôtel non trouvé"}</p>
            <Button className="mt-4" onClick={() => router.push("/hotels")}>
              Voir tous les hôtels
            </Button>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        {/* Back button */}
        <Button variant="outline" onClick={() => router.back()} className="mb-6">
          <ArrowLeft className="h-4 w-4 mr-2" />
          Retour à la liste
        </Button>

        {/* Hotel header */}
        <div className="bg-white rounded-lg shadow-sm overflow-hidden mb-8">
          <div className="relative h-64 md:h-96 bg-gray-200">
            <img 
              src={hotel.images?.[0] || "/placeholder.svg?height=400&width=600"} 
              alt={hotel.name} 
              className="w-full h-full object-cover"
            />
            <Button
              variant="ghost"
              size="sm"
              className="absolute top-4 right-4 bg-white/80 hover:bg-white"
              onClick={toggleFavorite}
            >
              <Heart
                className={`h-5 w-5 ${isFavorite ? "fill-red-500 text-red-500" : "text-gray-600"}`}
              />
            </Button>
          </div>

          <div className="p-6">
            <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
              <div>
                <h1 className="text-3xl font-bold mb-2">{hotel.name}</h1>
                <div className="flex items-center text-gray-600 mb-4">
                  <MapPin className="h-4 w-4 mr-1" />
                  <span>{hotel.location}</span>
                </div>

                {/* Rating */}
                <div className="flex items-center mb-4">
                  <div className="flex items-center bg-green-100 px-2 py-1 rounded">
                    <Star className="h-4 w-4 fill-green-600 text-green-600 mr-1" />
                    <span className="font-medium text-green-800">{hotel.rating}</span>
                  </div>
                  <span className="text-sm text-gray-500 ml-2">({hotel.reviewCount} avis)</span>
                </div>
              </div>

              <div className="text-right">
                {hotel.originalPrice > hotel.price && (
                  <span className="text-sm text-gray-500 line-through block">
                    À partir de {hotel.originalPrice}€
                  </span>
                )}
                <span className="text-2xl font-bold text-red-600">
                  À partir de {hotel.price}€
                </span>
                <div className="text-sm text-gray-500">par nuit</div>
              </div>
            </div>

            {/* Amenities */}
            <div className="flex flex-wrap gap-2 mb-6">
              {hotel.amenities?.map((amenity: string) => (
                <div key={amenity} className="flex items-center bg-gray-100 px-3 py-1 rounded text-sm">
                  {amenityIcons[amenity as keyof typeof amenityIcons]}
                  <span className="ml-1">{amenityLabels[amenity as keyof typeof amenityLabels]}</span>
                </div>
              ))}
            </div>

            {/* Description */}
            <div className="mb-6">
              <h2 className="text-xl font-semibold mb-2">Description</h2>
              <p className="text-gray-700">{hotel.description}</p>
            </div>

            {/* Contact info */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
              <div>
                <h3 className="font-medium mb-1">Adresse</h3>
                <p className="text-gray-600">{hotel.address}</p>
              </div>
              <div>
                <h3 className="font-medium mb-1">Contact</h3>
                <p className="text-gray-600">{hotel.phone}</p>
                <p className="text-gray-600">{hotel.email}</p>
              </div>
              {hotel.website && (
                <div>
                  <h3 className="font-medium mb-1">Site web</h3>
                  <a 
                    href={hotel.website} 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="text-blue-600 hover:underline"
                  >
                    {hotel.website}
                  </a>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Booking section */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold mb-4">Réserver votre séjour</h2>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div>
              <Label htmlFor="check-in">Date d'arrivée</Label>
              <Input
                id="check-in"
                type="date"
                value={bookingData.checkIn}
                onChange={(e) => setBookingData({ ...bookingData, checkIn: e.target.value })}
                min={new Date().toISOString().split("T")[0]}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="check-out">Date de départ</Label>
              <Input
                id="check-out"
                type="date"
                value={bookingData.checkOut}
                onChange={(e) => setBookingData({ ...bookingData, checkOut: e.target.value })}
                min={bookingData.checkIn || new Date().toISOString().split("T")[0]}
                className="mt-1"
              />
            </div>
            <div>
              <Label htmlFor="guests">Voyageurs</Label>
              <Input
                id="guests"
                type="number"
                min={1}
                max={10}
                value={bookingData.guests}
                onChange={(e) => {
                  const parsedValue = parseInt(e.target.value);
                  setBookingData({ 
                    ...bookingData, 
                    guests: isNaN(parsedValue) ? 1 : parsedValue 
                  });
                }}
                className="mt-1"
              />
            </div>
            <div className="flex items-end">
              <Button 
                className="w-full bg-green-600 hover:bg-green-700"
                disabled={!bookingData.checkIn || !bookingData.checkOut}
                onClick={() => {
                  if (rooms.length > 0) {
                    const element = document.getElementById('rooms-section')
                    element?.scrollIntoView({ behavior: 'smooth' })
                  } else {
                    addNotification({
                      type: "error",
                      title: "Aucune chambre disponible",
                      message: "Désolé, il n'y a pas de chambres disponibles pour cet hôtel.",
                    })
                  }
                }}
              >
                <Calendar className="h-4 w-4 mr-2" />
                Vérifier disponibilité
              </Button>
            </div>
          </div>
        </div>

        {/* Rooms section */}
        <div id="rooms-section" className="mb-8">
          <h2 className="text-2xl font-semibold mb-4">Chambres disponibles</h2>

          {rooms.length === 0 ? (
            <div className="bg-yellow-50 border border-yellow-200 text-yellow-700 p-4 rounded">
              <p>Aucune chambre disponible pour cet hôtel.</p>
            </div>
          ) : (
            <div className="grid gap-6">
              {rooms.map((room) => (
                <Card key={room.id} className="overflow-hidden">
                  <div className="flex flex-col md:flex-row">
                    <div className="md:w-64 h-48 md:h-auto bg-gray-200">
                      <img
                        src="/placeholder.svg?height=200&width=300"
                        alt={room.name}
                        className="w-full h-full object-cover"
                      />
                    </div>

                    <CardContent className="flex-1 p-6">
                      <div className="flex justify-between items-start mb-2">
                        <div>
                          <h3 className="text-xl font-semibold mb-1">{room.name}</h3>
                          <Badge className="mb-2">{room.type}</Badge>
                          <p className="text-gray-600 text-sm mb-3">{room.description}</p>
                        </div>
                        <div className="text-right">
                          <div className="text-2xl font-bold text-green-600">{room.pricePerNight}€</div>
                          <div className="text-sm text-gray-500">par nuit</div>

                          {/* AI Price Prediction */}
                          {room.available && (
                            <div className="mt-2">
                              {predictedPrices[room.id] ? (
                                <div className="flex flex-col items-end">
                                  <div className="text-sm text-gray-600">Prix suggéré par IA:</div>
                                  <div className={`text-sm font-medium ${
                                    !isNaN(predictedPrices[room.id]) && predictedPrices[room.id] > room.pricePerNight 
                                      ? 'text-red-600' 
                                      : 'text-blue-600'
                                  }`}>
                                    {!isNaN(predictedPrices[room.id]) ? `${predictedPrices[room.id]}€` : 'N/A'}
                                    {!isNaN(predictedPrices[room.id]) && (
                                      predictedPrices[room.id] > room.pricePerNight 
                                        ? ' ↑' 
                                        : predictedPrices[room.id] < room.pricePerNight 
                                          ? ' ↓' 
                                          : ''
                                    )}
                                  </div>
                                </div>
                              ) : (
                                <Button 
                                  variant="outline" 
                                  size="sm"
                                  className="text-xs mt-1"
                                  onClick={() => getPredictedPrice(room.id)}
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

                      {/* Room details */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 mb-4">
                        <div>
                          <span className="text-sm text-gray-500">Capacité</span>
                          <div className="flex items-center">
                            <Users className="h-4 w-4 mr-1 text-gray-600" />
                            <span>{room.capacity} personnes</span>
                          </div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Taille</span>
                          <div>{room.size} m²</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Lits</span>
                          <div>{room.bedCount} {room.bedType}</div>
                        </div>
                        <div>
                          <span className="text-sm text-gray-500">Caractéristiques</span>
                          <div className="flex flex-wrap gap-1">
                            {room.hasBalcony && <Badge variant="outline" className="text-xs">Balcon</Badge>}
                            {room.hasSeaView && <Badge variant="outline" className="text-xs">Vue mer</Badge>}
                            {room.hasKitchen && <Badge variant="outline" className="text-xs">Cuisine</Badge>}
                          </div>
                        </div>
                      </div>

                      {/* Book button */}
                      <Button
                        className="w-full md:w-auto bg-green-600 hover:bg-green-700"
                        disabled={!room.available}
                        onClick={() => handleBookNow(room)}
                      >
                        {room.available ? "Réserver maintenant" : "Non disponible"}
                      </Button>
                    </CardContent>
                  </div>
                </Card>
              ))}
            </div>
          )}
        </div>
      </div>

      <Footer />
    </div>
  )
}
