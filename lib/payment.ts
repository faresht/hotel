// Types pour les méthodes de paiement
export interface PaymentMethod {
  id: string
  name: string
  type: "card" | "paypal" | "stripe" | "bank_transfer"
  icon: string
  enabled: boolean
}

export interface CardDetails {
  number: string
  expiry: string
  cvv: string
  name: string
}

export interface BillingAddress {
  firstName: string
  lastName: string
  email: string
  phone: string
  address: string
  city: string
  postalCode: string
  country: string
}

export interface PaymentRequest {
  amount: number
  currency: string
  method: PaymentMethod
  cardDetails?: CardDetails
  billingAddress: BillingAddress
  bookingId: string
  userId: string
}

export interface PaymentResponse {
  success: boolean
  transactionId?: string
  error?: string
  redirectUrl?: string
}

// Service de paiement
export class PaymentService {
  private static instance: PaymentService
  private apiUrl = process.env.NEXT_PUBLIC_API_URL || "http://localhost:8080/api"

  static getInstance(): PaymentService {
    if (!PaymentService.instance) {
      PaymentService.instance = new PaymentService()
    }
    return PaymentService.instance
  }

  // Traitement du paiement par carte
  async processCardPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Validation des données de carte
      if (!this.validateCardDetails(request.cardDetails!)) {
        return { success: false, error: "Données de carte invalides" }
      }

      // Simulation du traitement
      await new Promise((resolve) => setTimeout(resolve, 2000))

      // Simulation de succès (90% de chance)
      if (Math.random() > 0.1) {
        return {
          success: true,
          transactionId: `TXN-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
        }
      } else {
        return { success: false, error: "Paiement refusé par la banque" }
      }
    } catch (error) {
      return { success: false, error: "Erreur lors du traitement du paiement" }
    }
  }

  // Traitement du paiement PayPal
  async processPayPalPayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Simulation de redirection PayPal
      const paypalUrl = `https://sandbox.paypal.com/checkoutnow?token=EC-${Date.now()}`

      return {
        success: true,
        redirectUrl: paypalUrl,
        transactionId: `PP-${Date.now()}`,
      }
    } catch (error) {
      return { success: false, error: "Erreur lors de la redirection PayPal" }
    }
  }

  // Traitement du paiement Stripe
  async processStripePayment(request: PaymentRequest): Promise<PaymentResponse> {
    try {
      // Simulation de l'intégration Stripe
      await new Promise((resolve) => setTimeout(resolve, 1500))

      return {
        success: true,
        transactionId: `pi_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      }
    } catch (error) {
      return { success: false, error: "Erreur lors du traitement Stripe" }
    }
  }

  // Validation des détails de carte
  private validateCardDetails(cardDetails: CardDetails): boolean {
    // Validation du numéro de carte (algorithme de Luhn simplifié)
    const cardNumber = cardDetails.number.replace(/\s/g, "")
    if (!/^\d{13,19}$/.test(cardNumber)) return false

    // Validation de la date d'expiration
    const expiryRegex = /^(0[1-9]|1[0-2])\/\d{2}$/
    if (!expiryRegex.test(cardDetails.expiry)) return false

    // Validation du CVV
    if (!/^\d{3,4}$/.test(cardDetails.cvv)) return false

    // Validation du nom
    if (!cardDetails.name.trim()) return false

    return true
  }

  // Formatage du numéro de carte
  static formatCardNumber(value: string): string {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    const matches = v.match(/\d{4,16}/g)
    const match = (matches && matches[0]) || ""
    const parts = []

    for (let i = 0, len = match.length; i < len; i += 4) {
      parts.push(match.substring(i, i + 4))
    }

    if (parts.length) {
      return parts.join(" ")
    } else {
      return v
    }
  }

  // Formatage de la date d'expiration
  static formatExpiryDate(value: string): string {
    const v = value.replace(/\s+/g, "").replace(/[^0-9]/gi, "")
    if (v.length >= 2) {
      return v.substring(0, 2) + "/" + v.substring(2, 4)
    }
    return v
  }

  // Détection du type de carte
  static getCardType(number: string): string {
    const patterns = {
      visa: /^4/,
      mastercard: /^5[1-5]/,
      amex: /^3[47]/,
      discover: /^6(?:011|5)/,
    }

    for (const [type, pattern] of Object.entries(patterns)) {
      if (pattern.test(number)) {
        return type
      }
    }

    return "unknown"
  }
}

// Hook pour utiliser le service de paiement
export function usePayment() {
  const paymentService = PaymentService.getInstance()

  const processPayment = async (request: PaymentRequest): Promise<PaymentResponse> => {
    switch (request.method.type) {
      case "card":
        return paymentService.processCardPayment(request)
      case "paypal":
        return paymentService.processPayPalPayment(request)
      case "stripe":
        return paymentService.processStripePayment(request)
      default:
        return { success: false, error: "Méthode de paiement non supportée" }
    }
  }

  return {
    processPayment,
    formatCardNumber: PaymentService.formatCardNumber,
    formatExpiryDate: PaymentService.formatExpiryDate,
    getCardType: PaymentService.getCardType,
  }
}
