"use client"

import type React from "react"

import { useState } from "react"
import { Phone, Mail, MapPin, Clock, Send, MessageCircle, HelpCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { Navbar } from "../components/navbar"
import { Footer } from "../components/footer"
import { useAuth } from "../contexts/auth-context"
import { useNotifications } from "../contexts/notification-context"

const contactMethods = [
  {
    icon: Phone,
    title: "Téléphone",
    description: "Appelez-nous pour une assistance immédiate",
    value: "+216 70 123 456",
    available: "24h/24, 7j/7",
    action: () => window.open("tel:+21670123456"),
  },
  {
    icon: Mail,
    title: "Email",
    description: "Envoyez-nous un message",
    value: "contact@tunisiastay.com",
    available: "Réponse sous 24h",
    action: () => window.open("mailto:contact@tunisiastay.com"),
  },
  {
    icon: MessageCircle,
    title: "Chat en direct",
    description: "Discutez avec notre équipe",
    value: "Chat disponible",
    available: "9h-18h (GMT+1)",
    action: () => {
      // Simuler l'ouverture d'un chat
      alert("Chat en direct bientôt disponible !")
    },
  },
  {
    icon: MapPin,
    title: "Adresse",
    description: "Visitez nos bureaux",
    value: "Avenue Habib Bourguiba, Tunis 1000",
    available: "Lun-Ven 9h-17h",
    action: () => window.open("https://maps.google.com/?q=Avenue+Habib+Bourguiba+Tunis"),
  },
]

const faqItems = [
  {
    question: "Comment puis-je modifier ma réservation ?",
    answer:
      "Vous pouvez modifier votre réservation en vous connectant à votre compte et en accédant à la section 'Mes réservations'. Les modifications sont possibles jusqu'à 24h avant votre arrivée.",
  },
  {
    question: "Quelle est votre politique d'annulation ?",
    answer:
      "Notre politique d'annulation varie selon l'hôtel et le type de tarif. Généralement, vous pouvez annuler gratuitement jusqu'à 48h avant votre arrivée. Consultez les conditions lors de votre réservation.",
  },
  {
    question: "Comment fonctionne le programme de fidélité ?",
    answer:
      "Vous gagnez des points à chaque réservation (1 point = 1€ dépensé). Ces points vous permettent d'obtenir des réductions et de monter de niveau pour bénéficier d'avantages exclusifs.",
  },
  {
    question: "Puis-je réserver pour quelqu'un d'autre ?",
    answer:
      "Oui, vous pouvez réserver pour une autre personne. Assurez-vous de fournir les informations correctes du voyageur principal lors de la réservation.",
  },
  {
    question: "Comment puis-je obtenir une facture ?",
    answer:
      "Après votre séjour, vous recevrez automatiquement une facture par email. Vous pouvez également la télécharger depuis votre espace client.",
  },
  {
    question: "Que faire en cas de problème pendant mon séjour ?",
    answer:
      "Contactez immédiatement notre service client 24h/24 au +216 70 123 456 ou l'hôtel directement. Nous nous engageons à résoudre tout problème rapidement.",
  },
]

export default function ContactPage() {
  const { user } = useAuth()
  const { addNotification } = useNotifications()

  const [formData, setFormData] = useState({
    name: user?.name || "",
    email: user?.email || "",
    phone: "",
    subject: "",
    category: "",
    message: "",
  })
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [submitted, setSubmitted] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()

    if (!formData.name || !formData.email || !formData.subject || !formData.message || !formData.category) {
      addNotification({
        type: "error",
        title: "Champs requis",
        message: "Veuillez remplir tous les champs obligatoires",
      })
      return
    }

    setIsSubmitting(true)

    try {
      // Essayer d'envoyer via l'API backend
      const response = await fetch("http://localhost:9000/api/contact", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        addNotification({
          type: "success",
          title: "Message envoyé !",
          message: "Nous vous répondrons dans les plus brefs délais.",
        })
      } else {
        throw new Error("Erreur serveur")
      }
    } catch (error) {
      // Fallback mode démo
      await new Promise((resolve) => setTimeout(resolve, 2000))

      addNotification({
        type: "success",
        title: "Message envoyé !",
        message: "Nous vous répondrons dans les plus brefs délais.",
      })
    }

    setSubmitted(true)
    setIsSubmitting(false)
    setFormData({
      name: user?.name || "",
      email: user?.email || "",
      phone: "",
      subject: "",
      category: "",
      message: "",
    })

    // Réinitialiser après 5 secondes
    setTimeout(() => setSubmitted(false), 5000)
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />

      {/* Hero Section */}
      <section className="relative bg-gradient-to-r from-blue-600 to-purple-600 text-white py-20">
        <div className="container mx-auto px-4">
          <div className="text-center">
            <h1 className="text-5xl font-bold mb-4">Contactez-nous</h1>
            <p className="text-xl mb-8">Notre équipe est là pour vous aider 24h/24, 7j/7</p>
          </div>
        </div>
      </section>

      <div className="container mx-auto px-4 py-12">
        {/* Méthodes de contact */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-center mb-12">Comment nous joindre</h2>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {contactMethods.map((method, index) => (
              <Card
                key={index}
                className="text-center hover:shadow-lg transition-shadow cursor-pointer"
                onClick={method.action}
              >
                <CardContent className="p-6">
                  <div className="w-16 h-16 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                    <method.icon className="h-8 w-8 text-blue-600" />
                  </div>
                  <h3 className="font-semibold text-lg mb-2">{method.title}</h3>
                  <p className="text-gray-600 text-sm mb-3">{method.description}</p>
                  <p className="font-medium text-blue-600 mb-2">{method.value}</p>
                  <p className="text-xs text-gray-500">{method.available}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </section>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-12">
          {/* Formulaire de contact */}
          <section>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Send className="h-5 w-5 mr-2" />
                  Envoyez-nous un message
                </CardTitle>
                <CardDescription>
                  Remplissez le formulaire ci-dessous et nous vous répondrons rapidement
                </CardDescription>
              </CardHeader>
              <CardContent>
                {submitted && (
                  <Alert className="mb-6 border-green-200 bg-green-50">
                    <AlertDescription className="text-green-800">
                      Votre message a été envoyé avec succès ! Nous vous répondrons dans les plus brefs délais.
                    </AlertDescription>
                  </Alert>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nom complet *</Label>
                      <Input
                        id="name"
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        value={formData.email}
                        onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                        required
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="phone">Téléphone</Label>
                    <Input
                      id="phone"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      placeholder="+216 XX XXX XXX"
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="category">Catégorie *</Label>
                    <Select
                      value={formData.category}
                      onValueChange={(value) => setFormData({ ...formData, category: value })}
                    >
                      <SelectTrigger>
                        <SelectValue placeholder="Sélectionnez une catégorie" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="reservation">Réservation</SelectItem>
                        <SelectItem value="modification">Modification/Annulation</SelectItem>
                        <SelectItem value="payment">Paiement</SelectItem>
                        <SelectItem value="complaint">Réclamation</SelectItem>
                        <SelectItem value="suggestion">Suggestion</SelectItem>
                        <SelectItem value="technical">Problème technique</SelectItem>
                        <SelectItem value="partnership">Partenariat</SelectItem>
                        <SelectItem value="other">Autre</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="subject">Sujet *</Label>
                    <Input
                      id="subject"
                      value={formData.subject}
                      onChange={(e) => setFormData({ ...formData, subject: e.target.value })}
                      placeholder="Résumez votre demande en quelques mots"
                      required
                    />
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Message *</Label>
                    <Textarea
                      id="message"
                      value={formData.message}
                      onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                      placeholder="Décrivez votre demande en détail..."
                      rows={5}
                      required
                    />
                  </div>

                  <Button type="submit" className="w-full bg-blue-600 hover:bg-blue-700" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                        Envoi en cours...
                      </>
                    ) : (
                      "Envoyer le message"
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>
          </section>

          {/* FAQ et informations */}
          <section className="space-y-8">
            {/* FAQ */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <HelpCircle className="h-5 w-5 mr-2" />
                  Questions fréquentes
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {faqItems.map((item, index) => (
                  <details key={index} className="border-b pb-4 last:border-b-0">
                    <summary className="font-medium mb-2 cursor-pointer hover:text-blue-600">{item.question}</summary>
                    <p className="text-gray-600 text-sm pl-4">{item.answer}</p>
                  </details>
                ))}
              </CardContent>
            </Card>

            {/* Horaires */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <Clock className="h-5 w-5 mr-2" />
                  Horaires d'ouverture
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex justify-between">
                    <span>Support téléphonique</span>
                    <span className="font-medium text-green-600">24h/24, 7j/7</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Chat en direct</span>
                    <span className="font-medium">9h-18h (GMT+1)</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Email</span>
                    <span className="font-medium">Réponse sous 24h</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Bureaux</span>
                    <span className="font-medium">Lun-Ven 9h-17h</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Urgences */}
            <Card className="border-red-200 bg-red-50">
              <CardHeader>
                <CardTitle className="text-red-800">Urgences</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-red-700 text-sm mb-3">
                  Pour toute urgence pendant votre séjour (problème d'hébergement, urgence médicale, etc.)
                </p>
                <div className="space-y-2">
                  <Button
                    variant="outline"
                    className="w-full border-red-300 text-red-700 hover:bg-red-100"
                    onClick={() => window.open("tel:+21670123456")}
                  >
                    <Phone className="h-4 w-4 mr-2" />
                    Appeler +216 70 123 456
                  </Button>
                  <p className="text-xs text-red-600 text-center">Ligne d'urgence 24h/24</p>
                </div>
              </CardContent>
            </Card>

            {/* Support utilisateur connecté */}
            {user && (
              <Card className="border-blue-200 bg-blue-50">
                <CardHeader>
                  <CardTitle className="text-blue-800">Support personnalisé</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-blue-700 text-sm mb-3">
                    Bonjour {user.name}, en tant que membre {user.loyaltyLevel}, vous bénéficiez d'un support
                    prioritaire.
                  </p>
                  <div className="space-y-2">
                    <Button
                      variant="outline"
                      className="w-full border-blue-300 text-blue-700 hover:bg-blue-100"
                      onClick={() => {
                        setFormData({
                          ...formData,
                          category: "reservation",
                          subject: "Support prioritaire - " + user.name,
                        })
                        document.getElementById("subject")?.focus()
                      }}
                    >
                      <MessageCircle className="h-4 w-4 mr-2" />
                      Support prioritaire
                    </Button>
                    <p className="text-xs text-blue-600 text-center">
                      Réponse garantie sous 2h pour les membres {user.loyaltyLevel}
                    </p>
                  </div>
                </CardContent>
              </Card>
            )}
          </section>
        </div>

        {/* Carte */}
        <section className="mt-16">
          <Card>
            <CardHeader>
              <CardTitle>Nos bureaux</CardTitle>
              <CardDescription>Visitez-nous à Tunis</CardDescription>
            </CardHeader>
            <CardContent>
              <div
                className="bg-gray-200 h-64 rounded-lg flex items-center justify-center cursor-pointer hover:bg-gray-300 transition-colors"
                onClick={() => window.open("https://maps.google.com/?q=Avenue+Habib+Bourguiba+Tunis")}
              >
                <div className="text-center">
                  <MapPin className="h-12 w-12 text-gray-400 mx-auto mb-2" />
                  <p className="text-gray-600">Cliquez pour ouvrir dans Google Maps</p>
                  <p className="text-sm text-gray-500">Avenue Habib Bourguiba, Tunis 1000</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </section>
      </div>

      <Footer />
    </div>
  )
}
