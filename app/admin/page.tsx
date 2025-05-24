"use client"

import { useState } from "react"
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell,
} from "recharts"
import { Users, Hotel, Calendar, DollarSign, TrendingUp, TrendingDown, Eye, Edit, Trash2, Plus } from "lucide-react"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Navbar } from "../components/navbar"
import { useAuth } from "../contexts/auth-context"

const monthlyData = [
  { month: "Jan", reservations: 45, revenue: 12500 },
  { month: "Fév", reservations: 52, revenue: 15200 },
  { month: "Mar", reservations: 48, revenue: 14100 },
  { month: "Avr", reservations: 61, revenue: 18300 },
  { month: "Mai", reservations: 55, revenue: 16800 },
  { month: "Jun", reservations: 67, revenue: 21200 },
]

const hotelPerformance = [
  { name: "Four Seasons", bookings: 156, revenue: 43680, rating: 4.8 },
  { name: "Villa Didon", bookings: 89, revenue: 31150, rating: 4.9 },
  { name: "Laico Tunis", bookings: 324, revenue: 38880, rating: 4.5 },
  { name: "Resort Djerba", bookings: 445, revenue: 80100, rating: 4.6 },
]

const categoryData = [
  { name: "5 étoiles", value: 35, color: "#ef4444" },
  { name: "4 étoiles", value: 40, color: "#f97316" },
  { name: "3 étoiles", value: 20, color: "#eab308" },
  { name: "Boutique", value: 5, color: "#22c55e" },
]

const recentBookings = [
  {
    id: 1,
    user: "Sophie Martin",
    hotel: "Four Seasons Tunis",
    dates: "15-20 Jan 2024",
    amount: 1400,
    status: "confirmed",
  },
  {
    id: 2,
    user: "Ahmed Ben Ali",
    hotel: "Villa Didon",
    dates: "22-25 Jan 2024",
    amount: 1050,
    status: "pending",
  },
  {
    id: 3,
    user: "Marie Dubois",
    hotel: "Laico Tunis",
    dates: "18-21 Jan 2024",
    amount: 360,
    status: "confirmed",
  },
]

const users = [
  {
    id: 1,
    name: "Sophie Martin",
    email: "sophie.martin@example.com",
    role: "user",
    loyaltyLevel: "Gold",
    points: 2500,
    joinDate: "2023-03-15",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 2,
    name: "Ahmed Ben Ali",
    email: "ahmed.benali@email.com",
    role: "user",
    loyaltyLevel: "Silver",
    points: 1200,
    joinDate: "2023-07-22",
    avatar: "/placeholder.svg?height=32&width=32",
  },
  {
    id: 3,
    name: "Marie Dubois",
    email: "marie.dubois@email.com",
    role: "user",
    loyaltyLevel: "Bronze",
    points: 450,
    joinDate: "2023-11-08",
    avatar: "/placeholder.svg?height=32&width=32",
  },
]

export default function AdminPage() {
  const { user } = useAuth()
  const [activeTab, setActiveTab] = useState("dashboard")

  if (!user || user.role !== "admin") {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Accès refusé</h1>
          <p className="text-gray-600">Vous n'avez pas les permissions pour accéder à cette page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-8">
          <h1 className="text-3xl font-bold mb-2">Tableau de bord administrateur</h1>
          <p className="text-gray-600">Gérez votre plateforme TunisiaStay</p>
        </div>

        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="dashboard">Tableau de bord</TabsTrigger>
            <TabsTrigger value="hotels">Hôtels</TabsTrigger>
            <TabsTrigger value="bookings">Réservations</TabsTrigger>
            <TabsTrigger value="users">Utilisateurs</TabsTrigger>
          </TabsList>

          <TabsContent value="dashboard" className="space-y-6">
            {/* Métriques principales */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              <Card>
                <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                  <CardTitle className="text-sm font-medium">Réservations totales</CardTitle>
                  <Calendar className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">1,234</div>
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
                  <CardTitle className="text-sm font-medium">Revenus</CardTitle>
                  <DollarSign className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">€156,230</div>
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
                  <CardTitle className="text-sm font-medium">Hôtels actifs</CardTitle>
                  <Hotel className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">127</div>
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
                  <CardTitle className="text-sm font-medium">Utilisateurs</CardTitle>
                  <Users className="h-4 w-4 text-muted-foreground" />
                </CardHeader>
                <CardContent>
                  <div className="text-2xl font-bold">8,945</div>
                  <p className="text-xs text-muted-foreground">
                    <span className="text-red-600 flex items-center">
                      <TrendingDown className="h-3 w-3 mr-1" />
                      -2% ce mois
                    </span>
                  </p>
                </CardContent>
              </Card>
            </div>

            {/* Graphiques */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <Card>
                <CardHeader>
                  <CardTitle>Évolution des réservations</CardTitle>
                  <CardDescription>Réservations et revenus par mois</CardDescription>
                </CardHeader>
                <CardContent>
                  <ResponsiveContainer width="100%" height={300}>
                    <LineChart data={monthlyData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis dataKey="month" />
                      <YAxis />
                      <Tooltip />
                      <Line type="monotone" dataKey="reservations" stroke="#ef4444" strokeWidth={2} />
                    </LineChart>
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

            {/* Performance des hôtels */}
            <Card>
              <CardHeader>
                <CardTitle>Performance des hôtels</CardTitle>
                <CardDescription>Top hôtels par réservations et revenus</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <BarChart data={hotelPerformance}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="name" />
                    <YAxis />
                    <Tooltip />
                    <Bar dataKey="revenue" fill="#22c55e" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="hotels" className="space-y-6">
            <div className="flex justify-between items-center">
              <h2 className="text-2xl font-bold">Gestion des hôtels</h2>
              <Button className="bg-red-600 hover:bg-red-700">
                <Plus className="h-4 w-4 mr-2" />
                Ajouter un hôtel
              </Button>
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
                      <TableHead>Réservations</TableHead>
                      <TableHead>Revenus</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {hotelPerformance.map((hotel, index) => (
                      <TableRow key={index}>
                        <TableCell className="font-medium">{hotel.name}</TableCell>
                        <TableCell>Tunis</TableCell>
                        <TableCell>
                          <Badge variant="outline">5 étoiles</Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex items-center">
                            <span className="mr-1">{hotel.rating}</span>
                            <div className="flex">
                              {[...Array(5)].map((_, i) => (
                                <div
                                  key={i}
                                  className={`w-3 h-3 ${i < Math.floor(hotel.rating) ? "text-yellow-400" : "text-gray-300"}`}
                                >
                                  ⭐
                                </div>
                              ))}
                            </div>
                          </div>
                        </TableCell>
                        <TableCell>{hotel.bookings}</TableCell>
                        <TableCell>€{hotel.revenue.toLocaleString()}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bookings" className="space-y-6">
            <h2 className="text-2xl font-bold">Gestion des réservations</h2>

            <Card>
              <CardHeader>
                <CardTitle>Réservations récentes</CardTitle>
                <CardDescription>Dernières réservations effectuées</CardDescription>
              </CardHeader>
              <CardContent>
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Client</TableHead>
                      <TableHead>Hôtel</TableHead>
                      <TableHead>Dates</TableHead>
                      <TableHead>Montant</TableHead>
                      <TableHead>Statut</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {recentBookings.map((booking) => (
                      <TableRow key={booking.id}>
                        <TableCell className="font-medium">{booking.user}</TableCell>
                        <TableCell>{booking.hotel}</TableCell>
                        <TableCell>{booking.dates}</TableCell>
                        <TableCell>€{booking.amount}</TableCell>
                        <TableCell>
                          <Badge
                            variant={booking.status === "confirmed" ? "default" : "secondary"}
                            className={booking.status === "confirmed" ? "bg-green-600" : ""}
                          >
                            {booking.status === "confirmed" ? "Confirmée" : "En attente"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="users" className="space-y-6">
            <h2 className="text-2xl font-bold">Gestion des utilisateurs</h2>

            <Card>
              <CardContent className="p-0">
                <Table>
                  <TableHeader>
                    <TableRow>
                      <TableHead>Utilisateur</TableHead>
                      <TableHead>Email</TableHead>
                      <TableHead>Rôle</TableHead>
                      <TableHead>Fidélité</TableHead>
                      <TableHead>Points</TableHead>
                      <TableHead>Inscription</TableHead>
                      <TableHead>Actions</TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {users.map((user) => (
                      <TableRow key={user.id}>
                        <TableCell>
                          <div className="flex items-center space-x-3">
                            <Avatar className="h-8 w-8">
                              <AvatarImage src={user.avatar || "/placeholder.svg"} />
                              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{user.name}</span>
                          </div>
                        </TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell>
                          <Badge variant={user.role === "admin" ? "default" : "secondary"}>
                            {user.role === "admin" ? "Admin" : "Utilisateur"}
                          </Badge>
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="outline"
                            className={
                              user.loyaltyLevel === "Gold"
                                ? "border-yellow-500 text-yellow-700"
                                : user.loyaltyLevel === "Silver"
                                  ? "border-gray-500 text-gray-700"
                                  : "border-orange-500 text-orange-700"
                            }
                          >
                            {user.loyaltyLevel}
                          </Badge>
                        </TableCell>
                        <TableCell>{user.points}</TableCell>
                        <TableCell>{new Date(user.joinDate).toLocaleDateString("fr-FR")}</TableCell>
                        <TableCell>
                          <div className="flex space-x-2">
                            <Button variant="ghost" size="sm">
                              <Eye className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm">
                              <Edit className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="text-red-600">
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </div>
  )
}
