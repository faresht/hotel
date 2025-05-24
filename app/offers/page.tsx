"use client"

import { useState } from "react"
import { Clock, Percent, Gift, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Progress } from "@/components/ui/progress"
import { Navbar } from "../components/navbar"
import { Footer } from "../components/footer"

const offers = [
  {
    id: 1,
    title: "Séjour de rêve à Djerba",
    description: "7 nuits en pension complète dans un resort 5 étoiles",
    originalPrice: 1200,
    discountedPrice: 899,
    discount: 25,
    hotel: "Resort Djerba Palace",
    location: "Djerba",
    image: "/placeholder.svg?height=200&width=300",
    validUntil: "2024-03-31",
    category: "flash",
    includes: ["Pension complète", "Spa inclus", "Activités nautiques"],
    rating: 4.8,
    availability: 12,
  },
  {
    id: 2,
    title: "Escapade culturelle à Tunis",
    description: "3 jours pour découvrir la capitale et ses trésors",
    originalPrice: 450,
    discountedPrice: 320,
    discount: 30,
    hotel: "Hôtel Laico Tunis",
    location: "Tunis",
    image: "/placeholder.svg?height=200&width=300",
    validUntil: "2024-04-15",
    category: "weekend",
    includes: ["Petit-déjeuner", "Visite guidée", "Transport"],
    rating: 4.5,
    availability: 8,
  },
  {
    id: 3,
    title: "Lune de miel à Sidi Bou Said",
    description: "5 nuits romantiques avec vue sur la mer",
    originalPrice: 1800,
    discountedPrice: 1350,
    discount: 25,
    hotel: "Villa Didon",
    location: "Sidi Bou Said",
    image: "/placeholder.svg?height=200&width=300",
    validUntil: "2024-06-30",
    category: "romantic",
    includes: ["Suite avec vue mer", "Dîner romantique", "Spa couple"],
    rating: 4.9,
    availability: 5,
  },
  {
    id: 4,
    title: "Aventure dans le désert",
    description: "4 jours d'exploration du Sahara tunisien",
    originalPrice: 680,
    discountedPrice: 510,
    discount: 25,
    hotel: "Ksar Tozeur",
    location: "Tozeur",
    image: "/placeholder.svg?height=200&width=300",
    validUntil: "2024-05-20",
    category: "adventure",
    includes: ["Excursion 4x4", "Nuit sous les étoiles", "Guide local"],
    rating: 4.7,
    availability: 15,
  },
  {
    id: 5,
    title: "Détente à Hammamet",
    description: "Week-end spa et bien-être",
    originalPrice: 380,
    discountedPrice: 285,
    discount: 25,
    hotel: "Riad Hammamet",
    location: "Hammamet",
    image: "/placeholder.svg?height=200&width=300",
    validUntil: "2024-04-30",
    category: "wellness",
    includes: ["Soins spa", "Hammam", "Yoga"],
    rating: 4.4,
    availability: 20,
  },
]

const loyaltyOffers = [
  {
    id: 1,
    title: "Membre Bronze - 5% de réduction",
    description: "Réduction automatique sur toutes vos réservations",
    pointsRequired: 0,
    level: "bronze",
  },
  {
    id: 2,
    title: "Membre Silver - 10% de réduction",
    description: "Réduction + surclassement gratuit quand disponible",
    pointsRequired: 1000,
    level: "silver",
  },
  {
    id: 3,
    title: "Membre Gold - 15% de réduction",
    description: "Réduction + avantages premium + accès lounge",
    pointsRequired: 2500,
    level: "gold",
  },
]

export default function OffersPage() {
  const [selectedCategory, setSelectedCategory] = useState("all")

  const filteredOffers =
    selectedCategory === "all" ? offers : offers.filter((offer) => offer.category === selectedCategory)

  const getTimeRemaining = (validUntil: string) => {
    const now = new Date()
    const end = new Date(validUntil)
    const diff = end.getTime() - now.getTime()
    const days = Math.ceil(diff / (1000 * 60 * 60 * 24))
    return days > 0 ? days : 0
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-orange-600 to-red-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Offres Exceptionnelles</h1>
            <p className="text-xl mb-8">Profitez de nos meilleures promotions pour vos séjours en Tunisie</p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-4xl mx-auto">
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <Percent className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Jusqu'à -30%</h3>
                <p className="text-sm opacity-90">Sur une sélection d'hôtels</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <Gift className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Avantages inclus</h3>
                <p className="text-sm opacity-90">Spa, excursions, repas</p>
              </div>
              <div className="bg-white/10 backdrop-blur-sm rounded-lg p-6">
                <Clock className="h-8 w-8 mx-auto mb-2" />
                <h3 className="font-semibold mb-1">Offres limitées</h3>
                <p className="text-sm opacity-90">Réservez rapidement</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Filtres */}
        <div className="mb-8">
          <Tabs value={selectedCategory} onValueChange={setSelectedCategory}>
            <TabsList className="grid w-full grid-cols-6">
              <TabsTrigger value="all">Toutes</TabsTrigger>
              <TabsTrigger value="flash">Flash</TabsTrigger>
              <TabsTrigger value="weekend">Week-end</TabsTrigger>
              <TabsTrigger value="romantic">Romantique</TabsTrigger>
              <TabsTrigger value="adventure">Aventure</TabsTrigger>
              <TabsTrigger value="wellness">Bien-être</TabsTrigger>
            </TabsList>
          </Tabs>
        </div>

        {/* Offres principales */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold mb-8">Offres du moment</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredOffers.map((offer) => {
              const daysRemaining = getTimeRemaining(offer.validUntil)
              const availabilityPercent = (offer.availability / 25) * 100

              return (
                <Card key={offer.id} className="overflow-hidden hover:shadow-lg transition-shadow">
                  <div className="relative">
                    <img
                      src={offer.image || "/placeholder.svg"}
                      alt={offer.title}
                      className="w-full h-48 object-cover"
                    />
                    <div className="absolute top-4 left-4">
                      <Badge className="bg-red-600 text-white">-{offer.discount}%</Badge>
                    </div>
                    <div className="absolute top-4 right-4">
                      <Badge variant="secondary" className="bg-white/90 text-gray-900">
                        <Clock className="h-3 w-3 mr-1" />
                        {daysRemaining}j restants
                      </Badge>
                    </div>
                  </div>

                  <CardContent className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-semibold">{offer.title}</h3>
                      <div className="flex items-center">
                        <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                        <span className="text-sm">{offer.rating}</span>
                      </div>
                    </div>

                    <p className="text-gray-600 text-sm mb-3">{offer.description}</p>

                    <div className="mb-3">
                      <div className="text-sm text-gray-500 mb-1">
                        {offer.hotel} • {offer.location}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-medium text-sm mb-2">Inclus:</h4>
                      <div className="flex flex-wrap gap-1">
                        {offer.includes.map((item) => (
                          <Badge key={item} variant="outline" className="text-xs">
                            {item}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <div className="mb-4">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span>Disponibilité</span>
                        <span className="text-red-600">{offer.availability} places restantes</span>
                      </div>
                      <Progress value={availabilityPercent} className="h-2" />
                    </div>

                    <div className="flex items-center justify-between mb-4">
                      <div>
                        <span className="text-sm text-gray-500 line-through">{offer.originalPrice}€</span>
                        <div className="text-2xl font-bold text-red-600">{offer.discountedPrice}€</div>
                      </div>
                      <div className="text-right">
                        <div className="text-sm text-gray-500">par personne</div>
                        <div className="text-sm font-medium text-green-600">
                          Économisez {offer.originalPrice - offer.discountedPrice}€
                        </div>
                      </div>
                    </div>

                    <Button className="w-full bg-orange-600 hover:bg-orange-700">Réserver maintenant</Button>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </section>

        {/* Programme de fidélité */}
        <section className="mb-16">
          <Card className="bg-gradient-to-r from-purple-600 to-blue-600 text-white">
            <CardHeader>
              <CardTitle className="text-2xl text-center">Programme de Fidélité TunisiaStay</CardTitle>
              <p className="text-center opacity-90">Plus vous voyagez, plus vous économisez</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {loyaltyOffers.map((offer) => (
                  <div key={offer.id} className="bg-white/10 backdrop-blur-sm rounded-lg p-6 text-center">
                    <div
                      className={`w-16 h-16 mx-auto mb-4 rounded-full flex items-center justify-center ${
                        offer.level === "gold"
                          ? "bg-yellow-500"
                          : offer.level === "silver"
                            ? "bg-gray-400"
                            : "bg-orange-500"
                      }`}
                    >
                      <Star className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="font-semibold mb-2">{offer.title}</h3>
                    <p className="text-sm opacity-90 mb-4">{offer.description}</p>
                    {offer.pointsRequired > 0 && (
                      <Badge variant="secondary" className="bg-white/20">
                        {offer.pointsRequired} points requis
                      </Badge>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </section>

        {/* Newsletter */}
        <section>
          <Card className="bg-gray-900 text-white">
            <CardContent className="p-8 text-center">
              <h2 className="text-2xl font-bold mb-4">Ne ratez aucune offre !</h2>
              <p className="mb-6">Inscrivez-vous à notre newsletter pour recevoir nos meilleures promotions</p>
              <div className="flex max-w-md mx-auto gap-2">
                <input type="email" placeholder="Votre email" className="flex-1 px-4 py-2 rounded-lg text-gray-900" />
                <Button className="bg-orange-600 hover:bg-orange-700">S'abonner</Button>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      <Footer />
    </div>
  )
}
