"use client"

import { useState, useEffect } from "react"
import { Search, MapPin, Calendar, Users, Star, Heart, Info } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Navbar } from "./components/navbar"
import { Footer } from "./components/footer"

// Données de fallback si l'API n'est pas disponible
const fallbackHotels = [
  {
    id: 1,
    name: "Hôtel Royal Tunis",
    location: "Tunis",
    rating: 4.5,
    reviewCount: 128,
    images: ["/placeholder.svg?height=200&width=300"],
    amenities: ["WiFi gratuit", "Piscine", "Spa", "Restaurant"],
    rooms: [{ pricePerNight: 120 }],
    featured: true,
  },
  {
    id: 2,
    name: "Resort Hammamet Beach",
    location: "Hammamet",
    rating: 4.8,
    reviewCount: 256,
    images: ["/placeholder.svg?height=200&width=300"],
    amenities: ["Plage privée", "All inclusive", "Animation", "Tennis"],
    rooms: [{ pricePerNight: 180 }],
    featured: true,
  },
  {
    id: 3,
    name: "Hôtel Sidi Bou Said",
    location: "Sidi Bou Said",
    rating: 4.3,
    reviewCount: 89,
    images: ["/placeholder.svg?height=200&width=300"],
    amenities: ["Vue mer", "Terrasse", "WiFi", "Parking"],
    rooms: [{ pricePerNight: 95 }],
    featured: true,
  },
  {
    id: 4,
    name: "Desert Lodge Douz",
    location: "Douz",
    rating: 4.6,
    reviewCount: 167,
    images: ["/placeholder.svg?height=200&width=300"],
    amenities: ["Excursions désert", "Piscine", "Restaurant", "Spa"],
    rooms: [{ pricePerNight: 140 }],
    featured: true,
  },
  {
    id: 5,
    name: "Hôtel Sousse Palace",
    location: "Sousse",
    rating: 4.4,
    reviewCount: 203,
    images: ["/placeholder.svg?height=200&width=300"],
    amenities: ["Centre ville", "Piscine", "Fitness", "Business center"],
    rooms: [{ pricePerNight: 110 }],
    featured: true,
  },
  {
    id: 6,
    name: "Villa Djerba",
    location: "Djerba",
    rating: 4.7,
    reviewCount: 145,
    images: ["/placeholder.svg?height=200&width=300"],
    amenities: ["Plage", "Spa", "Golf", "Kids club"],
    rooms: [{ pricePerNight: 160 }],
    featured: true,
  },
]

const fallbackDestinations = [
  "Tunis",
  "Hammamet",
  "Sousse",
  "Djerba",
  "Sidi Bou Said",
  "Douz",
  "Tozeur",
  "Kairouan",
  "Monastir",
  "Mahdia",
]

export default function HomePage() {
  const [searchData, setSearchData] = useState({
    destination: "",
    checkin: "",
    checkout: "",
    guests: "2",
  })
  const [featuredHotels, setFeaturedHotels] = useState<any[]>([])
  const [destinations, setDestinations] = useState<string[]>([])
  const [favorites, setFavorites] = useState<number[]>([])
  const [loading, setLoading] = useState(true)
  const [apiStatus, setApiStatus] = useState<{
    available: boolean
    error?: string
    url?: string
    mode: "demo" | "api" | "error"
  }>({ available: false, mode: "demo" })

  useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    const apiUrl = "http://localhost:9000/api"

    try {
      console.log("Attempting to connect to API:", apiUrl)

      const [hotelsResponse, locationsResponse] = await Promise.all([
        fetch(`${apiUrl}/hotels/featured`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal: AbortSignal.timeout(5000),
        }),
        fetch(`${apiUrl}/hotels/locations`, {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
          },
          signal: AbortSignal.timeout(5000),
        }),
      ])

      if (hotelsResponse.ok && locationsResponse.ok) {
        const hotelsData = await hotelsResponse.json()
        const locationsData = await locationsResponse.json()

        setFeaturedHotels(hotelsData)
        setDestinations(locationsData)
        setApiStatus({ available: true, url: apiUrl, mode: "api" })
        console.log("API connected successfully")
      } else {
        throw new Error("API endpoints not available")
      }
    } catch (error) {
      console.log("API connection failed, using demo mode:", error.message)

      setApiStatus({
        available: false,
        error: error.message,
        url: apiUrl,
        mode: "demo",
      })

      setFeaturedHotels(fallbackHotels)
      setDestinations(fallbackDestinations)
    } finally {
      setLoading(false)
    }
  }

  const toggleFavorite = (hotelId: number) => {
    setFavorites((prev) => (prev.includes(hotelId) ? prev.filter((id) => id !== hotelId) : [...prev, hotelId]))
  }

  const handleSearch = () => {
    const params = new URLSearchParams()
    if (searchData.destination) params.append("location", searchData.destination)
    if (searchData.checkin) params.append("checkIn", searchData.checkin)
    if (searchData.checkout) params.append("checkOut", searchData.checkout)
    if (searchData.guests) params.append("guests", searchData.guests)

    window.location.href = `/hotels?${params.toString()}`
  }

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement...</p>
          </div>
        </div>
        <Footer />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Messages de statut */}
      {apiStatus.mode === "demo" && (
        <div className="bg-blue-50 border-l-4 border-blue-400 p-4">
          <div className="flex">
            <Info className="h-5 w-5 text-blue-400 mr-3 mt-0.5" />
            <div className="ml-3">
              <p className="text-sm text-blue-700">
                <strong>Mode Démo :</strong> Application fonctionnelle avec des données d'exemple.
              </p>
              <details className="mt-2">
                <summary className="text-xs text-blue-600 cursor-pointer hover:text-blue-800">
                  Connecter un backend
                </summary>
                <div className="mt-1 text-xs text-blue-600">
                  <p>Pour utiliser de vraies données :</p>
                  <ul className="list-disc list-inside ml-2 mt-1">
                    <li>Démarrez le backend Spring Boot sur localhost:9000</li>
                    <li>Assurez-vous que la base de données MySQL est accessible</li>
                  </ul>
                </div>
              </details>
            </div>
          </div>
        </div>
      )}

      {apiStatus.mode === "api" && (
        <div className="bg-green-50 border-l-4 border-green-400 p-4">
          <div className="flex">
            <div className="ml-3">
              <p className="text-sm text-green-700">
                ✅ <strong>API connectée :</strong> Données en temps réel depuis {apiStatus.url}
              </p>
            </div>
          </div>
        </div>
      )}

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-red-600 to-green-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h1 className="text-5xl font-bold mb-4">Découvrez la Tunisie</h1>
            <p className="text-xl mb-8">Réservez votre séjour parfait dans les plus beaux hôtels de Tunisie</p>

            {/* Statistiques */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
              <div className="text-center">
                <div className="text-3xl font-bold">{featuredHotels.length * 100}+</div>
                <div className="text-sm opacity-90">Hôtels partenaires</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">50K+</div>
                <div className="text-sm opacity-90">Clients satisfaits</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">4.8</div>
                <div className="text-sm opacity-90">Note moyenne</div>
              </div>
              <div className="text-center">
                <div className="text-3xl font-bold">24/7</div>
                <div className="text-sm opacity-90">Support client</div>
              </div>
            </div>
          </div>

          {/* Formulaire de recherche */}
          <Card className="max-w-4xl mx-auto">
            <CardContent className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Destination</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Select
                      value={searchData.destination}
                      onValueChange={(value) => setSearchData({ ...searchData, destination: value })}
                    >
                      <SelectTrigger className="pl-10">
                        <SelectValue placeholder="Choisir une destination" />
                      </SelectTrigger>
                      <SelectContent>
                        {destinations.map((location) => (
                          <SelectItem key={location} value={location}>
                            {location}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Arrivée</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="date"
                      value={searchData.checkin}
                      onChange={(e) => setSearchData({ ...searchData, checkin: e.target.value })}
                      className="pl-10"
                      min={new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Départ</label>
                  <div className="relative">
                    <Calendar className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                    <Input
                      type="date"
                      value={searchData.checkout}
                      onChange={(e) => setSearchData({ ...searchData, checkout: e.target.value })}
                      className="pl-10"
                      min={searchData.checkin || new Date().toISOString().split("T")[0]}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <label className="text-sm font-medium text-gray-700">Voyageurs</label>
                  <Select
                    value={searchData.guests}
                    onValueChange={(value) => setSearchData({ ...searchData, guests: value })}
                  >
                    <SelectTrigger>
                      <Users className="h-4 w-4 mr-2" />
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
              </div>

              <Button className="w-full mt-6 bg-red-600 hover:bg-red-700" size="lg" onClick={handleSearch}>
                <Search className="mr-2 h-4 w-4" />
                Rechercher des hôtels
              </Button>
            </CardContent>
          </Card>
        </div>
      </section>

      {/* Hôtels en vedette */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Hôtels en vedette</h2>
            <p className="text-gray-600">Découvrez nos établissements les mieux notés</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredHotels.map((hotel) => (
              <Card key={hotel.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                <div className="relative">
                  <img
                    src={hotel.images?.[0] || "/placeholder.svg?height=200&width=300"}
                    alt={hotel.name}
                    className="w-full h-48 object-cover"
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
                </div>

                <CardContent className="p-4">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="font-semibold text-lg">{hotel.name}</h3>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-red-600">{hotel.rooms?.[0]?.pricePerNight || "N/A"}€</div>
                      <div className="text-sm text-gray-500">par nuit</div>
                    </div>
                  </div>

                  <div className="flex items-center mb-2">
                    <MapPin className="h-4 w-4 text-gray-400 mr-1" />
                    <span className="text-sm text-gray-600">{hotel.location}</span>
                  </div>

                  <div className="flex items-center mb-3">
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                      <span className="ml-1 font-medium">{hotel.rating}</span>
                    </div>
                    <span className="text-sm text-gray-500 ml-2">({hotel.reviewCount} avis)</span>
                  </div>

                  <div className="flex flex-wrap gap-1 mb-4">
                    {hotel.amenities?.slice(0, 3).map((amenity: string) => (
                      <Badge key={amenity} variant="secondary" className="text-xs">
                        {amenity}
                      </Badge>
                    ))}
                    {hotel.amenities?.length > 3 && (
                      <Badge variant="outline" className="text-xs">
                        +{hotel.amenities.length - 3}
                      </Badge>
                    )}
                  </div>

                  <Button
                    className="w-full bg-green-600 hover:bg-green-700"
                    onClick={() => (window.location.href = `/hotels/${hotel.id}`)}
                  >
                    Voir les détails
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Destinations populaires */}
      <section className="py-16 bg-white">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Destinations populaires</h2>
            <p className="text-gray-600">Explorez les plus belles régions de Tunisie</p>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {destinations.slice(0, 8).map((destination) => (
              <Card key={destination} className="overflow-hidden hover:shadow-lg transition-shadow cursor-pointer">
                <div className="relative">
                  <img
                    src="/placeholder.svg?height=150&width=200"
                    alt={destination}
                    className="w-full h-32 object-cover"
                  />
                  <div className="absolute inset-0 bg-black/40 flex items-center justify-center">
                    <h3 className="text-white font-semibold text-lg">{destination}</h3>
                  </div>
                </div>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Section Pourquoi nous choisir */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold mb-4">Pourquoi choisir TunisiaStay ?</h2>
            <p className="text-gray-600">Votre partenaire de confiance pour découvrir la Tunisie</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="text-center">
              <div className="bg-red-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="h-8 w-8 text-red-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Qualité garantie</h3>
              <p className="text-gray-600">
                Tous nos hôtels sont sélectionnés et vérifiés pour vous garantir un séjour exceptionnel.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-green-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <MapPin className="h-8 w-8 text-green-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Expertise locale</h3>
              <p className="text-gray-600">
                Notre équipe locale vous guide vers les meilleures expériences tunisiennes.
              </p>
            </div>

            <div className="text-center">
              <div className="bg-blue-100 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-8 w-8 text-blue-600" />
              </div>
              <h3 className="font-semibold text-lg mb-2">Support 24/7</h3>
              <p className="text-gray-600">
                Notre équipe est disponible 24h/24 pour vous accompagner pendant votre séjour.
              </p>
            </div>
          </div>
        </div>
      </section>

      <Footer />
    </div>
  )
}
