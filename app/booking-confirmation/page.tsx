"use client"

import { useEffect, useState } from "react"
import { useSearchParams } from "next/navigation"
import { Check, Download, Calendar, MapPin, Users, Phone, Mail, Star } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Separator } from "@/components/ui/separator"
import { Navbar } from "../components/navbar"
import { Footer } from "../components/footer"

// Simulation des données de confirmation
const confirmationData = {
  bookingReference: "TS-ABC12345",
  status: "confirmed",
  hotel: {
    name: "Four Seasons Tunis",
    location: "Gammarth",
    address: "Zone Touristique Gammarth, 2078 La Marsa",
    phone: "+216 71 910 910",
    email: "reservations@fourseasons-tunis.com",
    rating: 4.8,
    image: "/placeholder.svg?height=200&width=300",
  },
  room: {
    name: "Suite Deluxe avec vue mer",
    type: "Suite",
    capacity: 2,
    amenities: ["Vue mer", "Balcon", "WiFi gratuit", "Minibar"],
  },
  booking: {
    checkIn: "2024-03-15",
    checkOut: "2024-03-20",
    nights: 5,
    guests: 2,
    guestName: "Sophie Martin",
    guestEmail: "sophie.martin@example.com",
    guestPhone: "+216 20 123 456",
  },
  payment: {
    total: 1463,
    method: "Carte bancaire",
    transactionId: "TXN-789456123",
  },
  loyaltyPoints: 146,
}

export default function BookingConfirmationPage() {
  const searchParams = useSearchParams()
  const bookingId = searchParams.get("id")
  const [showConfetti, setShowConfetti] = useState(true)

  useEffect(() => {
    // Animation de confettis
    const timer = setTimeout(() => setShowConfetti(false), 3000)
    return () => clearTimeout(timer)
  }, [])

  const downloadConfirmation = () => {
    // Simulation du téléchargement
    const element = document.createElement("a")
    element.href =
      "data:text/plain;charset=utf-8," +
      encodeURIComponent(
        `Confirmation de réservation TunisiaStay\n\nRéférence: ${confirmationData.bookingReference}\nHôtel: ${confirmationData.hotel.name}\nDates: ${confirmationData.booking.checkIn} - ${confirmationData.booking.checkOut}`,
      )
    element.download = `confirmation-${confirmationData.bookingReference}.txt`
    element.click()
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Animation de succès */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-50">
          <div className="absolute inset-0 bg-green-500/10 animate-pulse" />
        </div>
      )}

      <div className="container mx-auto px-4 py-8">
        {/* En-tête de confirmation */}
        <div className="text-center mb-8">
          <div className="w-20 h-20 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
            <Check className="h-10 w-10 text-green-600" />
          </div>
          <h1 className="text-4xl font-bold text-green-600 mb-2">Réservation confirmée !</h1>
          <p className="text-xl text-gray-600 mb-4">Votre séjour au {confirmationData.hotel.name} est confirmé</p>
          <Badge className="bg-green-600 text-white text-lg px-4 py-2">
            Référence: {confirmationData.bookingReference}
          </Badge>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Détails de la réservation */}
          <div className="lg:col-span-2 space-y-6">
            {/* Informations de l'hôtel */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <MapPin className="h-5 w-5 mr-2" />
                  Votre hôtel
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="flex space-x-4">
                  <img
                    src={confirmationData.hotel.image || "/placeholder.svg"}
                    alt={confirmationData.hotel.name}
                    className="w-32 h-24 object-cover rounded-lg"
                  />
                  <div className="flex-1">
                    <h3 className="text-xl font-semibold mb-1">{confirmationData.hotel.name}</h3>
                    <div className="flex items-center mb-2">
                      <Star className="h-4 w-4 fill-yellow-400 text-yellow-400 mr-1" />
                      <span className="font-medium">{confirmationData.hotel.rating}</span>
                      <span className="text-gray-500 ml-1">• Hôtel 5 étoiles</span>
                    </div>
                    <p className="text-gray-600 mb-2">{confirmationData.hotel.address}</p>
                    <div className="space-y-1 text-sm">
                      <div className="flex items-center">
                        <Phone className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{confirmationData.hotel.phone}</span>
                      </div>
                      <div className="flex items-center">
                        <Mail className="h-4 w-4 text-gray-400 mr-2" />
                        <span>{confirmationData.hotel.email}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Détails du séjour */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Calendar className="h-5 w-5 mr-2" />
                  Détails de votre séjour
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div>
                    <h4 className="font-semibold mb-3">Dates</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Arrivée:</span>
                        <span className="font-medium">
                          {new Date(confirmationData.booking.checkIn).toLocaleDateString("fr-FR", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Départ:</span>
                        <span className="font-medium">
                          {new Date(confirmationData.booking.checkOut).toLocaleDateString("fr-FR", {
                            weekday: "long",
                            year: "numeric",
                            month: "long",
                            day: "numeric",
                          })}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Durée:</span>
                        <span className="font-medium">{confirmationData.booking.nights} nuits</span>
                      </div>
                    </div>
                  </div>

                  <div>
                    <h4 className="font-semibold mb-3">Chambre et voyageurs</h4>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Chambre:</span>
                        <span className="font-medium">{confirmationData.room.name}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Voyageurs:</span>
                        <span className="font-medium">{confirmationData.booking.guests} personnes</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Type:</span>
                        <span className="font-medium">{confirmationData.room.type}</span>
                      </div>
                    </div>
                  </div>
                </div>

                <Separator className="my-4" />

                <div>
                  <h4 className="font-semibold mb-3">Équipements inclus</h4>
                  <div className="flex flex-wrap gap-2">
                    {confirmationData.room.amenities.map((amenity) => (
                      <Badge key={amenity} variant="secondary">
                        {amenity}
                      </Badge>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Informations du voyageur */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Users className="h-5 w-5 mr-2" />
                  Informations du voyageur principal
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <span className="text-gray-600">Nom:</span>
                    <p className="font-medium">{confirmationData.booking.guestName}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Email:</span>
                    <p className="font-medium">{confirmationData.booking.guestEmail}</p>
                  </div>
                  <div>
                    <span className="text-gray-600">Téléphone:</span>
                    <p className="font-medium">{confirmationData.booking.guestPhone}</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Instructions importantes */}
            <Card className="border-blue-200 bg-blue-50">
              <CardHeader>
                <CardTitle className="text-blue-800">Instructions importantes</CardTitle>
              </CardHeader>
              <CardContent className="text-blue-700">
                <ul className="space-y-2 text-sm">
                  <li>• Présentez-vous à la réception avec une pièce d'identité valide</li>
                  <li>• L'enregistrement se fait à partir de 15h00</li>
                  <li>• Le départ doit se faire avant 12h00</li>
                  <li>• Un dépôt de garantie peut être demandé à l'arrivée</li>
                  <li>• Contactez l'hôtel directement pour toute demande spéciale</li>
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Résumé et actions */}
          <div className="space-y-6">
            {/* Résumé financier */}
            <Card>
              <CardHeader>
                <CardTitle>Résumé du paiement</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Méthode de paiement:</span>
                    <span className="font-medium">{confirmationData.payment.method}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Transaction ID:</span>
                    <span className="font-medium text-xs">{confirmationData.payment.transactionId}</span>
                  </div>
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total payé:</span>
                  <span className="text-green-600">{confirmationData.payment.total}€</span>
                </div>

                <div className="text-center">
                  <Badge className="bg-purple-100 text-purple-800">
                    +{confirmationData.loyaltyPoints} points de fidélité gagnés
                  </Badge>
                </div>
              </CardContent>
            </Card>

            {/* Actions */}
            <Card>
              <CardHeader>
                <CardTitle>Actions</CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <Button className="w-full" onClick={downloadConfirmation}>
                  <Download className="h-4 w-4 mr-2" />
                  Télécharger la confirmation
                </Button>

                <Button variant="outline" className="w-full">
                  <Mail className="h-4 w-4 mr-2" />
                  Envoyer par email
                </Button>

                <Button variant="outline" className="w-full">
                  <Calendar className="h-4 w-4 mr-2" />
                  Ajouter au calendrier
                </Button>

                <Separator />

                <Button variant="secondary" className="w-full">
                  Modifier la réservation
                </Button>

                <Button variant="outline" className="w-full text-red-600 border-red-200 hover:bg-red-50">
                  Annuler la réservation
                </Button>
              </CardContent>
            </Card>

            {/* Support */}
            <Card className="border-green-200 bg-green-50">
              <CardHeader>
                <CardTitle className="text-green-800">Besoin d'aide ?</CardTitle>
              </CardHeader>
              <CardContent className="text-green-700">
                <p className="text-sm mb-3">Notre équipe est disponible 24h/24 pour vous assister</p>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center">
                    <Phone className="h-4 w-4 mr-2" />
                    <span>+216 70 123 456</span>
                  </div>
                  <div className="flex items-center">
                    <Mail className="h-4 w-4 mr-2" />
                    <span>support@tunisiastay.com</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>

        {/* Prochaines étapes */}
        <Card className="mt-8">
          <CardHeader>
            <CardTitle>Que se passe-t-il maintenant ?</CardTitle>
            <CardDescription>Voici les prochaines étapes de votre réservation</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div className="text-center">
                <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Mail className="h-6 w-6 text-blue-600" />
                </div>
                <h3 className="font-semibold mb-2">Confirmation par email</h3>
                <p className="text-sm text-gray-600">
                  Vous recevrez un email de confirmation dans les prochaines minutes
                </p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Phone className="h-6 w-6 text-green-600" />
                </div>
                <h3 className="font-semibold mb-2">Rappel avant le séjour</h3>
                <p className="text-sm text-gray-600">Nous vous enverrons un rappel 24h avant votre arrivée</p>
              </div>

              <div className="text-center">
                <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-3">
                  <Star className="h-6 w-6 text-purple-600" />
                </div>
                <h3 className="font-semibold mb-2">Évaluez votre séjour</h3>
                <p className="text-sm text-gray-600">
                  Après votre séjour, partagez votre expérience et gagnez des points
                </p>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      <Footer />
    </div>
  )
}
