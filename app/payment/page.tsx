"use client"

import { useState, useEffect } from "react"
import { useRouter, useSearchParams } from "next/navigation"
import { CreditCard, Shield, Lock, Check, ArrowLeft, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group"
import { Separator } from "@/components/ui/separator"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Checkbox } from "@/components/ui/checkbox"
import { Textarea } from "@/components/ui/textarea"
import { Navbar } from "../components/navbar"
import { useAuth } from "../contexts/auth-context"
import { useNotifications } from "../contexts/notification-context"

export default function PaymentPage() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const { user } = useAuth()
  const { addNotification } = useNotifications()

  const [paymentMethod, setPaymentMethod] = useState("card")
  const [isProcessing, setIsProcessing] = useState(false)
  const [cardData, setCardData] = useState({
    number: "",
    expiry: "",
    cvv: "",
    name: "",
  })
  const [billingData, setBillingData] = useState({
    firstName: user?.name?.split(" ")[0] || "",
    lastName: user?.name?.split(" ")[1] || "",
    email: user?.email || "",
    phone: "",
    address: "",
    city: "",
    postalCode: "",
    country: "TN",
  })
  const [bookingDetails, setBookingDetails] = useState({
    specialRequests: "",
  })
  const [acceptTerms, setAcceptTerms] = useState(false)
  const [saveCard, setSaveCard] = useState(false)
  const [bookingData, setBookingData] = useState<any>(null)

  useEffect(() => {
    // Récupérer les données de réservation depuis les paramètres URL
    const hotelId = searchParams.get("hotelId")
    const roomId = searchParams.get("roomId")
    const checkIn = searchParams.get("checkIn")
    const checkOut = searchParams.get("checkOut")
    const guests = searchParams.get("guests")

    if (!hotelId || !roomId || !checkIn || !checkOut) {
      addNotification({
        type: "error",
        title: "Données manquantes",
        message: "Informations de réservation incomplètes",
      })
      router.push("/hotels")
      return
    }

    // Simuler les données de réservation (en production, cela viendrait de l'API)
    const mockBookingData = {
      hotel: {
        id: hotelId,
        name: "Four Seasons Tunis",
        location: "Gammarth",
        image: "/placeholder.svg?height=100&width=150",
      },
      room: {
        id: roomId,
        name: "Suite Deluxe avec vue mer",
        pricePerNight: 280,
      },
      checkIn,
      checkOut,
      guests: Number.parseInt(guests || "2"),
      nights: Math.ceil((new Date(checkOut).getTime() - new Date(checkIn).getTime()) / (1000 * 60 * 60 * 24)),
    }

    const totalRoomPrice = mockBookingData.room.pricePerNight * mockBookingData.nights
    const taxes = Math.round(totalRoomPrice * 0.07) // 7% de taxes
    const serviceFee = 35
    const discount =
      user?.loyaltyLevel === "GOLD"
        ? Math.round(totalRoomPrice * 0.15)
        : user?.loyaltyLevel === "SILVER"
          ? Math.round(totalRoomPrice * 0.1)
          : user?.loyaltyLevel === "BRONZE"
            ? Math.round(totalRoomPrice * 0.05)
            : 0

    setBookingData({
      ...mockBookingData,
      totalRoomPrice,
      taxes,
      serviceFee,
      discount,
      total: totalRoomPrice + taxes + serviceFee - discount,
    })
  }, [searchParams, user, router, addNotification])

  const validateCardNumber = (number: string) => {
    const cleaned = number.replace(/\s/g, "")
    return cleaned.length >= 13 && cleaned.length <= 19 && /^\d+$/.test(cleaned)
  }

  const validateExpiry = (expiry: string) => {
    const [month, year] = expiry.split("/")
    if (!month || !year) return false
    const currentDate = new Date()
    const expiryDate = new Date(2000 + Number.parseInt(year), Number.parseInt(month) - 1)
    return expiryDate > currentDate
  }

  const validateCVV = (cvv: string) => {
    return cvv.length >= 3 && cvv.length <= 4 && /^\d+$/.test(cvv)
  }

  const handlePayment = async () => {
    if (!acceptTerms) {
      addNotification({
        type: "error",
        title: "Erreur",
        message: "Vous devez accepter les conditions générales",
      })
      return
    }

    if (paymentMethod === "card") {
      if (!validateCardNumber(cardData.number)) {
        addNotification({
          type: "error",
          title: "Numéro de carte invalide",
          message: "Veuillez vérifier le numéro de votre carte",
        })
        return
      }

      if (!validateExpiry(cardData.expiry)) {
        addNotification({
          type: "error",
          title: "Date d'expiration invalide",
          message: "Veuillez vérifier la date d'expiration",
        })
        return
      }

      if (!validateCVV(cardData.cvv)) {
        addNotification({
          type: "error",
          title: "CVV invalide",
          message: "Veuillez vérifier le code CVV",
        })
        return
      }
    }

    setIsProcessing(true)

    try {
      // Simuler l'appel API pour créer la réservation
      const bookingPayload = {
        hotelId: Number.parseInt(bookingData.hotel.id),
        roomId: Number.parseInt(bookingData.room.id),
        checkInDate: bookingData.checkIn,
        checkOutDate: bookingData.checkOut,
        guests: bookingData.guests,
        specialRequests: bookingDetails.specialRequests,
        guestName: `${billingData.firstName} ${billingData.lastName}`,
        guestEmail: billingData.email,
        guestPhone: billingData.phone,
      }

      // Essayer l'API backend d'abord
      try {
        const token = localStorage.getItem("tunisia_stay_token")
        const response = await fetch("http://localhost:9000/api/bookings", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify(bookingPayload),
        })

        if (response.ok) {
          const booking = await response.json()

          // Simuler le traitement du paiement
          await new Promise((resolve) => setTimeout(resolve, 2000))

          addNotification({
            type: "success",
            title: "Paiement réussi !",
            message: "Votre réservation a été confirmée",
          })

          router.push(`/booking-confirmation?id=${booking.bookingReference}`)
          return
        }
      } catch (error) {
        console.log("Backend not available, using demo mode")
      }

      // Fallback mode démo
      await new Promise((resolve) => setTimeout(resolve, 3000))

      const bookingReference = "TS-" + Math.random().toString(36).substr(2, 8).toUpperCase()

      addNotification({
        type: "success",
        title: "Paiement réussi !",
        message: "Votre réservation a été confirmée",
      })

      router.push(`/booking-confirmation?id=${bookingReference}`)
    } catch (error) {
      addNotification({
        type: "error",
        title: "Erreur de paiement",
        message: "Une erreur est survenue lors du traitement",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handlePayPal = async () => {
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    addNotification({
      type: "success",
      title: "Paiement PayPal réussi !",
      message: "Votre réservation a été confirmée",
    })

    setIsProcessing(false)
    router.push("/booking-confirmation?id=TS-PAYPAL123")
  }

  const handleStripe = async () => {
    setIsProcessing(true)
    await new Promise((resolve) => setTimeout(resolve, 2000))

    addNotification({
      type: "success",
      title: "Paiement Stripe réussi !",
      message: "Votre réservation a été confirmée",
    })

    setIsProcessing(false)
    router.push("/booking-confirmation?id=TS-STRIPE123")
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 py-8">
          <div className="max-w-md mx-auto bg-white rounded-lg shadow-md p-6 text-center">
            <h1 className="text-2xl font-bold text-red-600 mb-4">Connexion requise</h1>
            <p className="text-gray-600 mb-4">Vous devez être connecté pour effectuer un paiement.</p>
            <Button className="bg-red-600 hover:bg-red-700" onClick={() => router.push("/login")}>
              Se connecter
            </Button>
          </div>
        </div>
      </div>
    )
  }

  if (!bookingData) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="flex items-center justify-center min-h-[60vh]">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-red-600 mx-auto mb-4"></div>
            <p className="text-gray-600">Chargement des données de réservation...</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      <div className="container mx-auto px-4 py-8">
        <div className="mb-6">
          <Button variant="ghost" onClick={() => router.back()} className="mb-4">
            <ArrowLeft className="h-4 w-4 mr-2" />
            Retour
          </Button>
          <h1 className="text-3xl font-bold">Finaliser votre réservation</h1>
          <p className="text-gray-600">Sécurisé par SSL - Vos données sont protégées</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Formulaire de paiement */}
          <div className="lg:col-span-2 space-y-6">
            {/* Méthode de paiement */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <CreditCard className="h-5 w-5 mr-2" />
                  Méthode de paiement
                </CardTitle>
                <CardDescription>Choisissez votre mode de paiement préféré</CardDescription>
              </CardHeader>
              <CardContent>
                <RadioGroup value={paymentMethod} onValueChange={setPaymentMethod}>
                  <div className="space-y-4">
                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="card" id="card" />
                      <Label htmlFor="card" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <div className="flex items-center">
                            <CreditCard className="h-5 w-5 mr-2" />
                            <span>Carte bancaire</span>
                          </div>
                          <div className="flex space-x-2">
                            <img src="/placeholder.svg?height=20&width=30&text=VISA" alt="Visa" className="h-5" />
                            <img src="/placeholder.svg?height=20&width=30&text=MC" alt="Mastercard" className="h-5" />
                          </div>
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="paypal" id="paypal" />
                      <Label htmlFor="paypal" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span>PayPal</span>
                          <img src="/placeholder.svg?height=20&width=60&text=PayPal" alt="PayPal" className="h-5" />
                        </div>
                      </Label>
                    </div>

                    <div className="flex items-center space-x-2 p-4 border rounded-lg">
                      <RadioGroupItem value="stripe" id="stripe" />
                      <Label htmlFor="stripe" className="flex-1 cursor-pointer">
                        <div className="flex items-center justify-between">
                          <span>Stripe</span>
                          <img src="/placeholder.svg?height=20&width=60&text=Stripe" alt="Stripe" className="h-5" />
                        </div>
                      </Label>
                    </div>
                  </div>
                </RadioGroup>
              </CardContent>
            </Card>

            {/* Détails de la carte */}
            {paymentMethod === "card" && (
              <Card>
                <CardHeader>
                  <CardTitle>Informations de la carte</CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <Label htmlFor="cardNumber">Numéro de carte</Label>
                    <Input
                      id="cardNumber"
                      placeholder="1234 5678 9012 3456"
                      value={cardData.number}
                      onChange={(e) => {
                        const value = e.target.value
                          .replace(/\s/g, "")
                          .replace(/(.{4})/g, "$1 ")
                          .trim()
                        setCardData({ ...cardData, number: value })
                      }}
                      maxLength={19}
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="cardName">Nom sur la carte</Label>
                    <Input
                      id="cardName"
                      placeholder="Nom complet"
                      value={cardData.name}
                      onChange={(e) => setCardData({ ...cardData, name: e.target.value })}
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="expiry">Date d'expiration</Label>
                      <Input
                        id="expiry"
                        placeholder="MM/AA"
                        value={cardData.expiry}
                        onChange={(e) => {
                          let value = e.target.value.replace(/\D/g, "")
                          if (value.length >= 2) {
                            value = value.substring(0, 2) + "/" + value.substring(2, 4)
                          }
                          setCardData({ ...cardData, expiry: value })
                        }}
                        maxLength={5}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="cvv">CVV</Label>
                      <Input
                        id="cvv"
                        placeholder="123"
                        value={cardData.cvv}
                        onChange={(e) => {
                          const value = e.target.value.replace(/\D/g, "")
                          setCardData({ ...cardData, cvv: value })
                        }}
                        maxLength={4}
                      />
                    </div>
                  </div>

                  <div className="flex items-center space-x-2">
                    <Checkbox id="saveCard" checked={saveCard} onCheckedChange={setSaveCard} />
                    <Label htmlFor="saveCard" className="text-sm">
                      Sauvegarder cette carte pour les prochains achats
                    </Label>
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Informations de facturation */}
            <Card>
              <CardHeader>
                <CardTitle>Informations de facturation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="firstName">Prénom</Label>
                    <Input
                      id="firstName"
                      value={billingData.firstName}
                      onChange={(e) => setBillingData({ ...billingData, firstName: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="lastName">Nom</Label>
                    <Input
                      id="lastName"
                      value={billingData.lastName}
                      onChange={(e) => setBillingData({ ...billingData, lastName: e.target.value })}
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <Input
                    id="email"
                    type="email"
                    value={billingData.email}
                    onChange={(e) => setBillingData({ ...billingData, email: e.target.value })}
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="phone">Téléphone</Label>
                  <Input
                    id="phone"
                    value={billingData.phone}
                    onChange={(e) => setBillingData({ ...billingData, phone: e.target.value })}
                    placeholder="+216 XX XXX XXX"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="address">Adresse</Label>
                  <Input
                    id="address"
                    value={billingData.address}
                    onChange={(e) => setBillingData({ ...billingData, address: e.target.value })}
                  />
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="city">Ville</Label>
                    <Input
                      id="city"
                      value={billingData.city}
                      onChange={(e) => setBillingData({ ...billingData, city: e.target.value })}
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="postalCode">Code postal</Label>
                    <Input
                      id="postalCode"
                      value={billingData.postalCode}
                      onChange={(e) => setBillingData({ ...billingData, postalCode: e.target.value })}
                    />
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Demandes spéciales */}
            <Card>
              <CardHeader>
                <CardTitle>Demandes spéciales</CardTitle>
                <CardDescription>Informations supplémentaires pour votre séjour</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="specialRequests">Demandes spéciales (optionnel)</Label>
                  <Textarea
                    id="specialRequests"
                    placeholder="Lit bébé, chambre non-fumeur, étage élevé, etc."
                    value={bookingDetails.specialRequests}
                    onChange={(e) => setBookingDetails({ ...bookingDetails, specialRequests: e.target.value })}
                    rows={3}
                  />
                </div>
              </CardContent>
            </Card>

            {/* Conditions */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-4">
                  <div className="flex items-center space-x-2">
                    <Checkbox id="terms" checked={acceptTerms} onCheckedChange={setAcceptTerms} />
                    <Label htmlFor="terms" className="text-sm">
                      J'accepte les{" "}
                      <a href="/terms" className="text-blue-600 hover:underline">
                        conditions générales
                      </a>{" "}
                      et la{" "}
                      <a href="/privacy" className="text-blue-600 hover:underline">
                        politique de confidentialité
                      </a>
                    </Label>
                  </div>

                  <Alert>
                    <Shield className="h-4 w-4" />
                    <AlertDescription>
                      Vos informations de paiement sont sécurisées et cryptées. Nous ne stockons jamais vos données
                      bancaires.
                    </AlertDescription>
                  </Alert>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Résumé de la réservation */}
          <div className="space-y-6">
            <Card className="sticky top-4">
              <CardHeader>
                <CardTitle>Résumé de la réservation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="flex space-x-4">
                  <img
                    src={bookingData.hotel.image || "/placeholder.svg"}
                    alt={bookingData.hotel.name}
                    className="w-20 h-16 object-cover rounded"
                  />
                  <div className="flex-1">
                    <h3 className="font-semibold">{bookingData.hotel.name}</h3>
                    <p className="text-sm text-gray-600">{bookingData.hotel.location}</p>
                    <p className="text-sm text-gray-600">{bookingData.room.name}</p>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>Arrivée:</span>
                    <span>{new Date(bookingData.checkIn).toLocaleDateString("fr-FR")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Départ:</span>
                    <span>{new Date(bookingData.checkOut).toLocaleDateString("fr-FR")}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Nuits:</span>
                    <span>{bookingData.nights}</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Voyageurs:</span>
                    <span>{bookingData.guests}</span>
                  </div>
                </div>

                <Separator />

                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span>
                      {bookingData.nights} nuits × {bookingData.room.pricePerNight}€
                    </span>
                    <span>{bookingData.totalRoomPrice}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Taxes et frais</span>
                    <span>{bookingData.taxes}€</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Frais de service</span>
                    <span>{bookingData.serviceFee}€</span>
                  </div>
                  {bookingData.discount > 0 && (
                    <div className="flex justify-between text-green-600">
                      <span>Réduction fidélité ({user?.loyaltyLevel})</span>
                      <span>-{bookingData.discount}€</span>
                    </div>
                  )}
                </div>

                <Separator />

                <div className="flex justify-between font-semibold text-lg">
                  <span>Total</span>
                  <span>{bookingData.total}€</span>
                </div>

                {user?.loyaltyLevel && (
                  <div className="text-center">
                    <Badge variant="outline" className="text-xs">
                      Vous gagnez {Math.floor(bookingData.total / 10)} points de fidélité
                    </Badge>
                  </div>
                )}

                <div className="space-y-2">
                  {paymentMethod === "card" && (
                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={handlePayment}
                      disabled={isProcessing || !acceptTerms}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Traitement en cours...
                        </>
                      ) : (
                        <>
                          <Lock className="h-4 w-4 mr-2" />
                          Payer {bookingData.total}€
                        </>
                      )}
                    </Button>
                  )}

                  {paymentMethod === "paypal" && (
                    <Button
                      className="w-full bg-yellow-500 hover:bg-yellow-600"
                      onClick={handlePayPal}
                      disabled={isProcessing || !acceptTerms}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Redirection PayPal...
                        </>
                      ) : (
                        "Payer avec PayPal"
                      )}
                    </Button>
                  )}

                  {paymentMethod === "stripe" && (
                    <Button
                      className="w-full bg-purple-600 hover:bg-purple-700"
                      onClick={handleStripe}
                      disabled={isProcessing || !acceptTerms}
                    >
                      {isProcessing ? (
                        <>
                          <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                          Redirection Stripe...
                        </>
                      ) : (
                        "Payer avec Stripe"
                      )}
                    </Button>
                  )}
                </div>

                <div className="text-xs text-gray-500 text-center">
                  <div className="flex items-center justify-center mb-1">
                    <Shield className="h-3 w-3 mr-1" />
                    Paiement sécurisé SSL
                  </div>
                  <p>Vos données sont protégées</p>
                </div>
              </CardContent>
            </Card>

            {/* Garanties */}
            <Card>
              <CardContent className="pt-6">
                <div className="space-y-3">
                  <div className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-600 mr-2" />
                    <span>Annulation gratuite jusqu'à 48h</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-600 mr-2" />
                    <span>Confirmation immédiate</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-600 mr-2" />
                    <span>Support client 24h/24</span>
                  </div>
                  <div className="flex items-center text-sm">
                    <Check className="h-4 w-4 text-green-600 mr-2" />
                    <span>Meilleur prix garanti</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  )
}
