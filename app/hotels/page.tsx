"use client"

import { useState, useMemo } from "react"
import { Search, Filter, Star, Heart, MapPin, Wifi, Car, Utensils, Waves, SlidersHorizontal } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Slider } from "@/components/ui/slider"
import { Checkbox } from "@/components/ui/checkbox"
import { Label } from "@/components/ui/label"
import { Navbar } from "../components/navbar"
import { Footer } from "../components/footer"

const hotels = [
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
    category: "4-stars",
    available: true,
    description: "Hôtel moderne au cœur de Tunis avec vue panoramique",
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
    category: "5-stars",
    available: true,
    description: "Luxe et élégance face à la Méditerranée",
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
    category: "luxury",
    available: false,
    description: "Villa de charme avec vue mer exceptionnelle",
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
    category: "3-stars",
    available: true,
    description: "Confort et convivialité au centre de Sousse",
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
    category: "4-stars",
    available: true,
    description: "Resort tout inclus sur la plage de Djerba",
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
    category: "boutique",
    available: true,
    description: "Riad authentique dans la médina de Hammamet",
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
  const [searchTerm, setSearchTerm] = useState("")
  const [priceRange, setPriceRange] = useState([0, 500])
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedAmenities, setSelectedAmenities] = useState<string[]>([])
  const [sortBy, setSortBy] = useState("rating")
  const [showAvailableOnly, setShowAvailableOnly] = useState(false)
  const [favorites, setFavorites] = useState<number[]>([])

  const filteredAndSortedHotels = useMemo(() => {
    const filtered = hotels.filter((hotel) => {
      const matchesSearch =
        hotel.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        hotel.location.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesPrice = hotel.price >= priceRange[0] && hotel.price <= priceRange[1]
      const matchesCategory = selectedCategory === "all" || hotel.category === selectedCategory
      const matchesAmenities =
        selectedAmenities.length === 0 || selectedAmenities.every((amenity) => hotel.amenities.includes(amenity))
      const matchesAvailability = !showAvailableOnly || hotel.available

      return matchesSearch && matchesPrice && matchesCategory && matchesAmenities && matchesAvailability
    })

    // Tri
    filtered.sort((a, b) => {
      switch (sortBy) {
        case "price-low":
          return a.price - b.price
        case "price-high":
          return b.price - a.price
        case "rating":
          return b.rating - a.rating
        case "reviews":
          return b.reviews - a.reviews
        default:
          return 0
      }
    })

    return filtered
  }, [searchTerm, priceRange, selectedCategory, selectedAmenities, sortBy, showAvailableOnly])

  const toggleFavorite = (hotelId: number) => {
    setFavorites((prev) => (prev.includes(hotelId) ? prev.filter((id) => id !== hotelId) : [...prev, hotelId]))
  }

  const toggleAmenity = (amenity: string) => {
    setSelectedAmenities((prev) => (prev.includes(amenity) ? prev.filter((a) => a !== amenity) : [...prev, amenity]))
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

            {/* Filtres mobile - Version simplifiée */}
            <div className="lg:hidden">
              <Button
                variant="outline"
                onClick={() => {
                  // Pour l'instant, on peut simplement afficher/masquer les filtres
                  const filtersDiv = document.getElementById("mobile-filters")
                  if (filtersDiv) {
                    filtersDiv.style.display = filtersDiv.style.display === "none" ? "block" : "none"
                  }
                }}
              >
                <SlidersHorizontal className="h-4 w-4 mr-2" />
                Filtres
              </Button>

              <div id="mobile-filters" style={{ display: "none" }} className="mt-4 p-4 bg-white rounded-lg shadow-sm">
                <h3 className="font-semibold mb-4 flex items-center">
                  <Filter className="h-4 w-4 mr-2" />
                  Filtres
                </h3>
                <FilterContent />
              </div>
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
                        <Button className="flex-1 bg-green-600 hover:bg-green-700" disabled={!hotel.available}>
                          {hotel.available ? "Réserver maintenant" : "Complet"}
                        </Button>
                        <Button variant="outline">Voir détails</Button>
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

      <Footer />
    </div>
  )
}
