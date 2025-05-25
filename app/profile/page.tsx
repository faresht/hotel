"use client"

import { useState, useEffect } from "react"
import { User, Heart, Calendar, Settings, Award, Star, MapPin } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Progress } from "@/components/ui/progress"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Navbar } from "../components/navbar"
import { useAuth } from "../contexts/auth-context"
import { useNotifications } from "../contexts/notification-context"

const bookingHistory = [
  {
    id: 1,
    hotel: "Four Seasons Tunis",
    location: "Gammarth",
    dates: "15-20 Jan 2024",
    nights: 5,
    amount: 1400,
    status: "completed",
    rating: 5,
    image: "/placeholder.svg?height=80&width=120",
  },
  {
    id: 2,
    hotel: "Villa Didon",
    location: "Sidi Bou Said",
    dates: "10-13 Déc 2023",
    nights: 3,
    amount: 1050,
    status: "completed",
    rating: 4,
    image: "/placeholder.svg?height=80&width=120",
  },
  {
    id: 3,
    hotel: "Laico Tunis",
    location: "Tunis Centre",
    dates: "25-27 Fév 2024",
    nights: 2,
    amount: 240,
    status: "upcoming",
    rating: null,
    image: "/placeholder.svg?height=80&width=120",
  },
]

const favoriteHotels = [
  {
    id: 1,
    name: "Four Seasons Tunis",
    location: "Gammarth",
    rating: 4.8,
    price: 280,
    image: "/placeholder.svg?height=120&width=180",
  },
  {
    id: 2,
    name: "Villa Didon",
    location: "Sidi Bou Said",
    rating: 4.9,
    price: 350,
    image: "/placeholder.svg?height=120&width=180",
  },
]

const loyaltyLevels = {
  BRONZE: { min: 0, max: 999, color: "orange", benefits: ["5% de réduction", "Check-in prioritaire"] },
  SILVER: {
    min: 1000,
    max: 2499,
    color: "gray",
    benefits: ["10% de réduction", "Surclassement gratuit", "WiFi premium"],
  },
  GOLD: {
    min: 2500,
    max: Number.POSITIVE_INFINITY,
    color: "yellow",
    benefits: ["15% de réduction", "Accès lounge", "Petit-déjeuner offert", "Annulation flexible"],
  },
}

export default function ProfilePage() {
  const { user, loading } = useAuth()
  const { addNotification } = useNotifications()
  const [activeTab, setActiveTab] = useState("profile")
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    bio: "",
    address: "",
  })

  useEffect(() => {
    if (user) {
      setProfileData({
        name: user.name || "",
        email: user.email || "",
        phone: user.phone || "",
        bio: user.bio || "",
        address: user.address || "",
      })
    }
  }, [user])

  const handleSaveProfile = () => {
    addNotification({
      type: "success",
      title: "Profil mis à jour",
      message: "Vos informations ont été sauvegardées avec succès",
    })
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
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6">
            <h1 className="text-2xl font-bold mb-4 text-center">Accès au profil</h1>
            <p className="text-gray-600 mb-4">Vous devez être connecté pour accéder à votre profil.</p>
            <div className="bg-green-50 p-4 rounded-lg mb-4">
              <h3 className="font-semibold text-green-800 mb-2">Comptes de test :</h3>
              <div className="text-sm text-green-700 space-y-1">
                <div>👤 user@tunisiastay.com / user123</div>
                <div>🔧 admin@tunisiastay.com / admin123</div>
                <div>⭐ sophie.martin@example.com / password123</div>
              </div>
            </div>
            <Button className="w-full bg-red-600 hover:bg-red-700" onClick={() => (window.location.href = "/login")}>
              Se connecter
            </Button>
          </div>
        </div>
      </div>
    )
  }

  const currentLevel = loyaltyLevels[user.loyaltyLevel || "BRONZE"]
  const nextLevel = user.loyaltyLevel === "BRONZE" ? "SILVER" : user.loyaltyLevel === "SILVER" ? "GOLD" : null
  const progressToNext = nextLevel
    ? ((user.points! - currentLevel.min) / (loyaltyLevels[nextLevel].min - currentLevel.min)) * 100
    : 100

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Mon profil</h1>
          <p className="text-gray-600">Gérez vos informations et préférences</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="profile">Profil</TabsTrigger>
            <TabsTrigger value="bookings">Réservations</TabsTrigger>
            <TabsTrigger value="loyalty">Fidélité</TabsTrigger>
            <TabsTrigger value="settings">Paramètres</TabsTrigger>
          </TabsList>

          <TabsContent value="profile" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Informations utilisateur */}
              <Card className="lg:col-span-2">
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <User className="h-5 w-5 mr-2" />
                    Informations personnelles
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet</Label>
                      <Input
                        id="name"
                        value={profileData.name}
                        onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input
                        id="email"
                        type="email"
                        value={profileData.email}
                        onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={profileData.phone}
                      onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                      placeholder="+216 XX XXX XXX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="address">Adresse</Label>
                    <Input
                      id="address"
                      value={profileData.address}
                      onChange={(e) => setProfileData({ ...profileData, address: e.target.value })}
                      placeholder="Votre adresse"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="bio">Bio</Label>
                    <Textarea
                      id="bio"
                      value={profileData.bio}
                      onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                      placeholder="Parlez-nous de vous..."
                      rows={3}
                    />
                  </div>

                  <Button className="bg-red-600 hover:bg-red-700" onClick={handleSaveProfile}>
                    Sauvegarder les modifications
                  </Button>
                </CardContent>
              </Card>

              {/* Carte utilisateur */}
              <Card>
                <CardContent className="p-6 text-center">
                  <Avatar className="h-24 w-24 mx-auto mb-4">
                    <AvatarImage src={user.avatar || "/placeholder.svg"} />
                    <AvatarFallback className="text-2xl">{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>

                  <h3 className="text-xl font-semibold mb-2">{user.name}</h3>
                  <p className="text-gray-600 mb-4">{user.email}</p>

                  <Badge
                    className={`mb-4 ${
                      user.loyaltyLevel === "GOLD"
                        ? "bg-yellow-500"
                        : user.loyaltyLevel === "SILVER"
                          ? "bg-gray-500"
                          : "bg-orange-500"
                    }`}
                  >
                    {user.loyaltyLevel} Member
                  </Badge>

                  <div className="text-center">
                    <div className="text-2xl font-bold text-red-600">{user.points}</div>
                    <div className="text-sm text-gray-500">Points de fidélité</div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Hôtels favoris */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Heart className="h-5 w-5 mr-2" />
                  Mes hôtels favoris
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {favoriteHotels.map((hotel) => (
                    <div key={hotel.id} className="flex space-x-4 p-4 border rounded-lg">
                      <img
                        src={hotel.image || "/placeholder.svg"}
                        alt={hotel.name}
                        className="w-20 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <h4 className="font-semibold">{hotel.name}</h4>
                        <div className="flex items-center text-sm text-gray-600 mb-1">
                          <MapPin className="h-3 w-3 mr-1" />
                          {hotel.location}
                        </div>
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <Star className="h-3 w-3 fill-yellow-400 text-yellow-400 mr-1" />
                            <span className="text-sm">{hotel.rating}</span>
                          </div>
                          <span className="font-semibold text-red-600">{hotel.price}€</span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Historique des réservations
                </CardTitle>
                <CardDescription>Retrouvez toutes vos réservations passées et à venir</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {bookingHistory.map((booking) => (
                    <div key={booking.id} className="flex space-x-4 p-4 border rounded-lg">
                      <img
                        src={booking.image || "/placeholder.svg"}
                        alt={booking.hotel}
                        className="w-24 h-16 object-cover rounded"
                      />
                      <div className="flex-1">
                        <div className="flex justify-between items-start mb-2">
                          <div>
                            <h4 className="font-semibold">{booking.hotel}</h4>
                            <div className="flex items-center text-sm text-gray-600">
                              <MapPin className="h-3 w-3 mr-1" />
                              {booking.location}
                            </div>
                          </div>
                          <Badge
                            variant={booking.status === "completed" ? "default" : "secondary"}
                            className={booking.status === "completed" ? "bg-green-600" : "bg-blue-600"}
                          >
                            {booking.status === "completed" ? "Terminé" : "À venir"}
                          </Badge>
                        </div>

                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-gray-500">Dates:</span>
                            <div className="font-medium">{booking.dates}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Nuits:</span>
                            <div className="font-medium">{booking.nights}</div>
                          </div>
                          <div>
                            <span className="text-gray-500">Total:</span>
                            <div className="font-medium text-red-600">€{booking.amount}</div>
                          </div>
                          <div>
                            {booking.rating ? (
                              <div className="flex items-center">
                                <span className="text-gray-500 mr-2">Note:</span>
                                <div className="flex">
                                  {[...Array(5)].map((_, i) => (
                                    <Star
                                      key={i}
                                      className={`h-3 w-3 ${i < booking.rating! ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                                    />
                                  ))}
                                </div>
                              </div>
                            ) : (
                              <Button variant="outline" size="sm">
                                Noter
                              </Button>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="loyalty" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Statut fidélité */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Award className="h-5 w-5 mr-2" />
                    Programme de fidélité
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="text-center mb-6">
                    <div
                      className={`inline-flex items-center px-4 py-2 rounded-full text-white mb-4 ${
                        user.loyaltyLevel === "GOLD"
                          ? "bg-yellow-500"
                          : user.loyaltyLevel === "SILVER"
                            ? "bg-gray-500"
                            : "bg-orange-500"
                      }`}
                    >
                      <Award className="h-4 w-4 mr-2" />
                      Niveau {user.loyaltyLevel}
                    </div>

                    <div className="text-3xl font-bold text-red-600 mb-2">{user.points}</div>
                    <div className="text-gray-600">Points disponibles</div>
                  </div>

                  {nextLevel && (
                    <div className="mb-6">
                      <div className="flex justify-between text-sm mb-2">
                        <span>Progression vers {nextLevel}</span>
                        <span>{Math.round(progressToNext)}%</span>
                      </div>
                      <Progress value={progressToNext} className="h-2" />
                      <div className="text-xs text-gray-500 mt-1">
                        {loyaltyLevels[nextLevel].min - user.points!} points restants
                      </div>
                    </div>
                  )}

                  <div>
                    <h4 className="font-semibold mb-2">Vos avantages actuels:</h4>
                    <ul className="space-y-1">
                      {currentLevel.benefits.map((benefit, index) => (
                        <li key={index} className="flex items-center text-sm">
                          <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
                          {benefit}
                        </li>
                      ))}
                    </ul>
                  </div>
                </CardContent>
              </Card>

              {/* Échange de points */}
              <Card>
                <CardHeader>
                  <CardTitle>Échanger mes points</CardTitle>
                  <CardDescription>Utilisez vos points pour obtenir des réductions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Réduction 10€</span>
                      <Badge variant="outline">500 points</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Réduction de 10€ sur votre prochaine réservation</p>
                    <Button variant="outline" size="sm" disabled={user.points! < 500} className="w-full">
                      Échanger
                    </Button>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Réduction 25€</span>
                      <Badge variant="outline">1000 points</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Réduction de 25€ sur votre prochaine réservation</p>
                    <Button variant="outline" size="sm" disabled={user.points! < 1000} className="w-full">
                      Échanger
                    </Button>
                  </div>

                  <div className="border rounded-lg p-4">
                    <div className="flex justify-between items-center mb-2">
                      <span className="font-medium">Nuit gratuite</span>
                      <Badge variant="outline">2500 points</Badge>
                    </div>
                    <p className="text-sm text-gray-600 mb-3">Une nuit gratuite dans nos hôtels partenaires</p>
                    <Button variant="outline" size="sm" disabled={user.points! < 2500} className="w-full">
                      Échanger
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          <TabsContent value="settings" className="space-y-6">
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              {/* Préférences */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Settings className="h-5 w-5 mr-2" />
                    Préférences
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Notifications par email</Label>
                      <p className="text-sm text-gray-600">Recevoir les offres et actualités</p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Notifications push</Label>
                      <p className="text-sm text-gray-600">Alertes sur votre appareil</p>
                    </div>
                    <input type="checkbox" className="toggle" />
                  </div>

                  <div className="flex items-center justify-between">
                    <div>
                      <Label>Recommandations personnalisées</Label>
                      <p className="text-sm text-gray-600">Suggestions basées sur vos préférences</p>
                    </div>
                    <input type="checkbox" defaultChecked className="toggle" />
                  </div>
                </CardContent>
              </Card>

              {/* Sécurité */}
              <Card>
                <CardHeader>
                  <CardTitle>Sécurité</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <Button variant="outline" className="w-full justify-start">
                    Changer le mot de passe
                  </Button>

                  <Button variant="outline" className="w-full justify-start">
                    Authentification à deux facteurs
                  </Button>

                  <Button variant="outline" className="w-full justify-start">
                    Gérer les sessions actives
                  </Button>

                  <Button variant="destructive" className="w-full justify-start">
                    Supprimer mon compte
                  </Button>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
