import Link from "next/link"
import { Facebook, Twitter, Instagram, Mail, Phone, MapPin } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"

export function Footer() {
  return (
    <footer className="bg-gray-900 text-white">
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Logo et description */}
          <div className="space-y-4">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-r from-red-600 to-green-600 rounded-lg flex items-center justify-center">
                <span className="text-white font-bold text-sm">TS</span>
              </div>
              <span className="text-xl font-bold">TunisiaStay</span>
            </div>
            <p className="text-gray-400 text-sm">
              Votre partenaire de confiance pour découvrir les plus beaux hôtels de Tunisie. Réservez en toute sérénité
              avec TunisiaStay.
            </p>
            <div className="flex space-x-4">
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Facebook className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Twitter className="h-4 w-4" />
              </Button>
              <Button variant="ghost" size="sm" className="text-gray-400 hover:text-white">
                <Instagram className="h-4 w-4" />
              </Button>
            </div>
          </div>

          {/* Liens rapides */}
          <div>
            <h3 className="font-semibold mb-4">Liens rapides</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/hotels" className="text-gray-400 hover:text-white transition-colors">
                  Hôtels
                </Link>
              </li>
              <li>
                <Link href="/destinations" className="text-gray-400 hover:text-white transition-colors">
                  Destinations
                </Link>
              </li>
              <li>
                <Link href="/offers" className="text-gray-400 hover:text-white transition-colors">
                  Offres spéciales
                </Link>
              </li>
              <li>
                <Link href="/loyalty" className="text-gray-400 hover:text-white transition-colors">
                  Programme fidélité
                </Link>
              </li>
              <li>
                <Link href="/about" className="text-gray-400 hover:text-white transition-colors">
                  À propos
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div>
            <h3 className="font-semibold mb-4">Support</h3>
            <ul className="space-y-2 text-sm">
              <li>
                <Link href="/help" className="text-gray-400 hover:text-white transition-colors">
                  Centre d'aide
                </Link>
              </li>
              <li>
                <Link href="/contact" className="text-gray-400 hover:text-white transition-colors">
                  Nous contacter
                </Link>
              </li>
              <li>
                <Link href="/terms" className="text-gray-400 hover:text-white transition-colors">
                  Conditions d'utilisation
                </Link>
              </li>
              <li>
                <Link href="/privacy" className="text-gray-400 hover:text-white transition-colors">
                  Politique de confidentialité
                </Link>
              </li>
              <li>
                <Link href="/cookies" className="text-gray-400 hover:text-white transition-colors">
                  Politique des cookies
                </Link>
              </li>
            </ul>
          </div>

          {/* Newsletter et contact */}
          <div>
            <h3 className="font-semibold mb-4">Restez informé</h3>
            <p className="text-gray-400 text-sm mb-4">Recevez nos meilleures offres et actualités</p>
            <div className="space-y-2">
              <Input
                placeholder="Votre email"
                className="bg-gray-800 border-gray-700 text-white placeholder-gray-400"
              />
              <Button className="w-full bg-red-600 hover:bg-red-700">S'abonner</Button>
            </div>

            <div className="mt-6 space-y-2 text-sm">
              <div className="flex items-center text-gray-400">
                <Phone className="h-4 w-4 mr-2" />
                +216 70 123 456
              </div>
              <div className="flex items-center text-gray-400">
                <Mail className="h-4 w-4 mr-2" />
                contact@tunisiastay.com
              </div>
              <div className="flex items-center text-gray-400">
                <MapPin className="h-4 w-4 mr-2" />
                Tunis, Tunisie
              </div>
            </div>
          </div>
        </div>

        <div className="border-t border-gray-800 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 TunisiaStay. Tous droits réservés.</p>
        </div>
      </div>
    </footer>
  )
}
