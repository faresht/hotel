"use client"

import { useState } from "react"
import { MapPin, Star, Camera, Users, Calendar, ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Navbar } from "../components/navbar"
import { Footer } from "../components/footer"

const destinations = [
  {
    id: 1,
    name: "Tunis",
    region: "Nord",
    description: "La capitale historique avec sa médina classée UNESCO",
    image: "/placeholder.svg?height=300&width=400",
    hotels: 45,
    averagePrice: 120,
    rating: 4.5,
    highlights: ["Médina de Tunis", "Musée du Bardo", "Sidi Bou Said"],
    bestTime: "Mars - Mai, Septembre - Novembre",
    category: "culture",
  },
  {
    id: 2,
    name: "Djerba",
    region: "Sud",
    description: "L'île aux mille et une nuits avec ses plages paradisiaques",
    image: "/placeholder.svg?height=300&width=400",
    hotels: 67,
    averagePrice: 180,
    rating: 4.7,
    highlights: ["Plages de sable fin", "Village de Guellala", "Synagogue de la Ghriba"],
    bestTime: "Avril - Juin, Septembre - Octobre",
    category: "beach",
  },
  {
    id: 3,
    name: "Sousse",
    region: "Centre",
    description: "La perle du Sahel avec son patrimoine et ses plages",
    image: "/placeholder.svg?height=300&width=400",
    hotels: 38,
    averagePrice: 95,
    rating: 4.3,
    highlights: ["Médina de Sousse", "Port El Kantaoui", "Musée archéologique"],
    bestTime: "Mai - Octobre",
    category: "culture",
  },
  {
    id: 4,
    name: "Hammamet",
    region: "Nord-Est",
    description: "Station balnéaire réputée pour ses jardins et spas",
    image: "/placeholder.svg?height=300&width=400",
    hotels: 52,
    averagePrice: 110,
    rating: 4.4,
    highlights: ["Médina d'Hammamet", "Jardins de Hammamet", "Plages dorées"],
    bestTime: "Avril - Octobre",
    category: "beach",
  },
  {
    id: 5,
    name: "Tozeur",
    region: "Sud-Ouest",
    description: "Porte du désert avec ses oasis et architecture unique",
    image: "/placeholder.svg?height=300&width=400",
    hotels: 23,
    averagePrice: 85,
    rating: 4.6,
    highlights: ["Chott el-Jérid", "Oasis de montagne", "Architecture traditionnelle"],
    bestTime: "Octobre - Avril",
    category: "desert",
  },
  {
    id: 6,
    name: "Monastir",
    region: "Centre",
    description: "Ville côtière avec son ribat historique",
    image: "/placeholder.svg?height=300&width=400",
    hotels: 29,
    averagePrice: 100,
    rating: 4.2,
    highlights: ["Ribat de Monastir", "Mausolée Bourguiba", "Marina"],
    bestTime: "Mai - Septembre",
    category: "culture",
  },
]

const regions = [
  {
    name: "Nord",
    destinations: ["Tunis", "Bizerte", "Tabarka"],
    description: "Région riche en histoire et culture",
  },
  {
    name: "Centre",
    destinations: ["Sousse", "Monastir", "Mahdia"],
    description: "Côte méditerranéenne et patrimoine",
  },
  {
    name: "Sud",
    destinations: ["Djerba", "Gabès", "Médenine"],
    description: "Îles et traditions berbères",
  },
  {
    name: "Sud-Ouest",
    destinations: ["Tozeur", "Douz", "Tataouine"],
    description: "Désert du Sahara et oasis",
  },
]

export default function DestinationsPage() {
  const [searchTerm, setSearchTerm] = useState("")
  const [selectedCategory, setSelectedCategory] = useState("all")
  const [selectedRegion, setSelectedRegion] = useState("all")

  const filteredDestinations = destinations.filter((dest) => {
    const matchesSearch =
      dest.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      dest.description.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesCategory = selectedCategory === "all" || dest.category === selectedCategory
    const matchesRegion = selectedRegion === "all" || dest.region === selectedRegion

    return matchesSearch && matchesCategory && matchesRegion
  })

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-green-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Découvrez la Tunisie</h1>
            <p className="text-xl mb-8">Des destinations authentiques entre mer, désert et histoire</p>

            <div className="max-w-md mx-auto">
              <div className="relative">
                <MapPin className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                <Input
                  placeholder="Rechercher une destination..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10 bg-white text-gray-900"
                />
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Filtres */}
        <div className="mb-8">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-5">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="culture">Culture</TabsTrigger>
              <TabsTrigger value="beach">Plages</TabsTrigger>
              <TabsTrigger value="desert">Désert</TabsTrigger>
              <TabsTrigger value="nature">Nature</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Régions */}
        <section className="mb-12">
          <h2 className="text-3xl font-bold mb-8 text-center">Explorez par région</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {regions.map((region) => (
              <Card
                key={region.name}
                className="cursor-pointer hover:shadow-lg transition-shadow"
                onClick={() => setSelectedRegion(region.name)}
              >
                <CardContent className="p-6 text-center">
                  <h3 className="text-xl font-semibold mb-2">{region.name}</h3>
                  <p className="text-gray-600 text-sm mb-4">{region.description}</p>
                  <div className="space-y-1">
                    {region.destinations.map((dest) => (
                      <Badge key={dest} variant="outline" className="mr-1">
                        {dest}
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        {/* Destinations */}
        <section>
          <div className="flex justify-between items-center mb-8">
            <h2 className="text-3xl font-bold">Destinations populaires</h2>
            <p className="text-gray-600">{filteredDestinations.length} destinations trouvées</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredDestinations.map((destination) => (
              <Card key={destination.id} className="overflow-hidden hover:shadow-lg transition-shadow group">
                <div className="relative">
                  <img
                    src={destination.image || "/placeholder.svg"}
                    alt={destination.name}
                    className="w-full h-48 object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                  <div className="absolute top-4 left-4">
                    <Badge className="bg-white/90 text-gray-900">{destination.region}</Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <div className="bg-white/90 rounded-full p-2">
                      <Camera className="h-4 w-4 text-gray-700" />
                    </div>
                  </div>
                </div>

                <CardContent className="p-6">
                  <div className="flex justify-between items-start mb-2">
                    <h3 className="text-xl font-semibold">{destination.name}</h3>
                    <div className="flex items-center">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="text-sm font-medium">{destination.rating}</span>
                    </div>
                  </div>

                  <p className="text-gray-600 text-sm mb-4">{destination.description}</p>

                  <div className="space-y-3 mb-4">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center">
                        <Users className="h-4 w-4 text-gray-400 mr-1" />
                        <span>{destination.hotels} hôtels</span>
                      </div>
                      <div className="text-red-600 font-semibold">À partir de {destination.averagePrice}€</div>
                    </div>

                    <div className="flex items-center text-sm text-gray-600">
                      <Calendar className="h-4 w-4 mr-1" />
                      <span>Meilleure période: {destination.bestTime}</span>
                    </div>
                  </div>

                  <div className="mb-4">
                    <h4 className="font-medium text-sm mb-2">À ne pas manquer:</h4>
                    <div className="flex flex-wrap gap-1">
                      {destination.highlights.slice(0, 2).map((highlight) => (
                        <Badge key={highlight} variant="secondary" className="text-xs">
                          {highlight}
                        </Badge>
                      ))}
                      {destination.highlights.length > 2 && (
                        <Badge variant="outline" className="text-xs">
                          +{destination.highlights.length - 2}
                        </Badge>
                      )}
                    </div>
                  </div>

                  <div className="flex gap-2">
                    <Button
                      className="flex-1 bg-blue-600 hover:bg-blue-700"
                      onClick={() => (window.location.href = `/hotels?location=${destination.name}`)}
                    >
                      Voir les hôtels
                      <ArrowRight className="h-4 w-4 ml-2" />
                    </Button>
                    <Button variant="outline" size="sm">
                      <Camera className="h-4 w-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {filteredDestinations.length === 0 && (
            <div className="text-center py-12">
              <p className="text-gray-500 text-lg">Aucune destination trouvée</p>
              <Button
                variant="outline"
                className="mt-4"
                onClick={() => {
                  setSearchTerm("")
                  setSelectedCategory("all")
                  setSelectedRegion("all")
                }}
              >
                Réinitialiser les filtres
              </Button>
            </div>
          )}
        </section>

        {/* Guide de voyage */}
        <section className="mt-16">
          <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white rounded-2xl p-8 text-center">
            <h2 className="text-3xl font-bold mb-4">Besoin d'inspiration ?</h2>
            <p className="text-xl mb-6">Découvrez notre guide de voyage complet pour la Tunisie</p>
            <Button variant="secondary" size="lg">
              Télécharger le guide
            </Button>
          </div>
        </section>
      </div>

      <Footer />
    </div>
  )
}
