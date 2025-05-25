"use client"

import type React from "react"

import { useState, useEffect } from "react"
import { useAuth } from "../../contexts/auth-context"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Textarea } from "@/components/ui/textarea"
import { Switch } from "@/components/ui/switch"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Badge } from "@/components/ui/badge"
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"
import { Separator } from "@/components/ui/separator"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { User, Shield, Clock, Smartphone, MapPin, Save, Eye, EyeOff, Key, Activity, Settings } from "lucide-react"
import { useRouter } from "next/navigation"

export default function AdminProfile() {
  const { user, updateProfile, hasPermission, logout } = useAuth()
  const router = useRouter()
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState("")
  const [showPassword, setShowPassword] = useState(false)

  // États pour les différentes sections
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    phone: "",
    address: "",
    bio: "",
    avatar: "",
  })

  const [securitySettings, setSecuritySettings] = useState({
    twoFactorEnabled: false,
    emailNotifications: true,
    smsNotifications: false,
    loginAlerts: true,
  })

  const [preferences, setPreferences] = useState({
    language: "fr",
    timezone: "Africa/Tunis",
    theme: "light",
    dashboardLayout: "default",
  })

  const [sessions] = useState([
    {
      id: 1,
      device: "Chrome sur Windows",
      location: "Tunis, Tunisie",
      lastActive: "Il y a 2 minutes",
      current: true,
    },
    {
      id: 2,
      device: "Safari sur iPhone",
      location: "Sousse, Tunisie",
      lastActive: "Il y a 1 heure",
      current: false,
    },
  ])

  const [activities] = useState([
    {
      id: 1,
      action: "Connexion au tableau de bord",
      timestamp: "2024-01-15 14:30:00",
      ip: "192.168.1.100",
    },
    {
      id: 2,
      action: "Modification d'un hôtel",
      timestamp: "2024-01-15 13:45:00",
      ip: "192.168.1.100",
    },
    {
      id: 3,
      action: "Création d'un utilisateur",
      timestamp: "2024-01-15 12:20:00",
      ip: "192.168.1.100",
    },
  ])

  useEffect(() => {
    if (!user) {
      router.push("/login")
      return
    }

    if (!hasPermission("admin.dashboard")) {
      router.push("/")
      return
    }

    // Initialiser les données du profil
    setProfileData({
      name: user.name || "",
      email: user.email || "",
      phone: user.phone || "",
      address: user.address || "",
      bio: user.bio || "",
      avatar: user.avatar || "",
    })
  }, [user, hasPermission, router])

  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setMessage("")

    try {
      const success = await updateProfile(profileData)
      if (success) {
        setMessage("Profil mis à jour avec succès !")
      } else {
        setMessage("Erreur lors de la mise à jour du profil")
      }
    } catch (error) {
      setMessage("Erreur lors de la mise à jour du profil")
    } finally {
      setLoading(false)
    }
  }

  const handleSecurityUpdate = async () => {
    setLoading(true)
    setMessage("")

    try {
      // Simulation de mise à jour des paramètres de sécurité
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setMessage("Paramètres de sécurité mis à jour !")
    } catch (error) {
      setMessage("Erreur lors de la mise à jour des paramètres")
    } finally {
      setLoading(false)
    }
  }

  const handlePreferencesUpdate = async () => {
    setLoading(true)
    setMessage("")

    try {
      // Simulation de mise à jour des préférences
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setMessage("Préférences mises à jour !")
    } catch (error) {
      setMessage("Erreur lors de la mise à jour des préférences")
    } finally {
      setLoading(false)
    }
  }

  const terminateSession = async (sessionId: number) => {
    // Simulation de terminaison de session
    console.log(`Terminer la session ${sessionId}`)
  }

  if (!user) {
    return <div>Chargement...</div>
  }

  return (
    <div className="container mx-auto p-6 max-w-6xl">
      {/* En-tête du profil */}
      <div className="mb-8">
        <div className="flex items-center space-x-4 mb-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar || "/placeholder.svg"} alt={user.name} />
            <AvatarFallback className="text-2xl">
              {user.name
                .split(" ")
                .map((n) => n[0])
                .join("")}
            </AvatarFallback>
          </Avatar>
          <div>
            <h1 className="text-3xl font-bold">{user.name}</h1>
            <p className="text-muted-foreground">{user.email}</p>
            <div className="flex items-center space-x-2 mt-2">
              <Badge variant="secondary" className="bg-red-100 text-red-800">
                <Shield className="h-3 w-3 mr-1" />
                Administrateur
              </Badge>
              <Badge variant="outline">{user.loyaltyLevel}</Badge>
            </div>
          </div>
        </div>
      </div>

      {message && (
        <Alert className="mb-6">
          <AlertDescription>{message}</AlertDescription>
        </Alert>
      )}

      <Tabs defaultValue="profile" className="space-y-6">
        <TabsList className="grid w-full grid-cols-5">
          <TabsTrigger value="profile" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Profil</span>
          </TabsTrigger>
          <TabsTrigger value="security" className="flex items-center space-x-2">
            <Shield className="h-4 w-4" />
            <span>Sécurité</span>
          </TabsTrigger>
          <TabsTrigger value="preferences" className="flex items-center space-x-2">
            <Settings className="h-4 w-4" />
            <span>Préférences</span>
          </TabsTrigger>
          <TabsTrigger value="sessions" className="flex items-center space-x-2">
            <Smartphone className="h-4 w-4" />
            <span>Sessions</span>
          </TabsTrigger>
          <TabsTrigger value="activity" className="flex items-center space-x-2">
            <Activity className="h-4 w-4" />
            <span>Activité</span>
          </TabsTrigger>
        </TabsList>

        {/* Onglet Profil */}
        <TabsContent value="profile">
          <Card>
            <CardHeader>
              <CardTitle>Informations du Profil</CardTitle>
              <CardDescription>Gérez vos informations personnelles et votre profil public</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleProfileUpdate} className="space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="space-y-2">
                    <Label htmlFor="name">Nom complet</Label>
                    <Input
                      id="name"
                      value={profileData.name}
                      onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                      placeholder="Votre nom complet"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email">Email</Label>
                    <Input
                      id="email"
                      type="email"
                      value={profileData.email}
                      onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                      placeholder="votre@email.com"
                    />
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
                </div>
                <div className="space-y-2">
                  <Label htmlFor="bio">Biographie</Label>
                  <Textarea
                    id="bio"
                    value={profileData.bio}
                    onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                    placeholder="Parlez-nous de vous..."
                    rows={4}
                  />
                </div>
                <Button type="submit" disabled={loading}>
                  <Save className="h-4 w-4 mr-2" />
                  {loading ? "Enregistrement..." : "Enregistrer les modifications"}
                </Button>
              </form>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Sécurité */}
        <TabsContent value="security">
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Paramètres de Sécurité</CardTitle>
                <CardDescription>Configurez vos paramètres de sécurité et notifications</CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Authentification à deux facteurs</Label>
                    <p className="text-sm text-muted-foreground">Ajoutez une couche de sécurité supplémentaire</p>
                  </div>
                  <Switch
                    checked={securitySettings.twoFactorEnabled}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({ ...securitySettings, twoFactorEnabled: checked })
                    }
                  />
                </div>
                <Separator />
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications par email</Label>
                    <p className="text-sm text-muted-foreground">Recevez des notifications de sécurité par email</p>
                  </div>
                  <Switch
                    checked={securitySettings.emailNotifications}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({ ...securitySettings, emailNotifications: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Notifications SMS</Label>
                    <p className="text-sm text-muted-foreground">Recevez des alertes par SMS</p>
                  </div>
                  <Switch
                    checked={securitySettings.smsNotifications}
                    onCheckedChange={(checked) =>
                      setSecuritySettings({ ...securitySettings, smsNotifications: checked })
                    }
                  />
                </div>
                <div className="flex items-center justify-between">
                  <div className="space-y-0.5">
                    <Label>Alertes de connexion</Label>
                    <p className="text-sm text-muted-foreground">Soyez alerté des nouvelles connexions</p>
                  </div>
                  <Switch
                    checked={securitySettings.loginAlerts}
                    onCheckedChange={(checked) => setSecuritySettings({ ...securitySettings, loginAlerts: checked })}
                  />
                </div>
                <Button onClick={handleSecurityUpdate} disabled={loading}>
                  <Shield className="h-4 w-4 mr-2" />
                  Mettre à jour la sécurité
                </Button>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Changer le mot de passe</CardTitle>
                <CardDescription>Mettez à jour votre mot de passe régulièrement</CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="current-password">Mot de passe actuel</Label>
                  <div className="relative">
                    <Input
                      id="current-password"
                      type={showPassword ? "text" : "password"}
                      placeholder="Mot de passe actuel"
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      className="absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent"
                      onClick={() => setShowPassword(!showPassword)}
                    >
                      {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                    </Button>
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="new-password">Nouveau mot de passe</Label>
                  <Input id="new-password" type="password" placeholder="Nouveau mot de passe" />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="confirm-password">Confirmer le mot de passe</Label>
                  <Input id="confirm-password" type="password" placeholder="Confirmer le mot de passe" />
                </div>
                <Button>
                  <Key className="h-4 w-4 mr-2" />
                  Changer le mot de passe
                </Button>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        {/* Onglet Préférences */}
        <TabsContent value="preferences">
          <Card>
            <CardHeader>
              <CardTitle>Préférences</CardTitle>
              <CardDescription>Personnalisez votre expérience utilisateur</CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="language">Langue</Label>
                  <select
                    id="language"
                    value={preferences.language}
                    onChange={(e) => setPreferences({ ...preferences, language: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="fr">Français</option>
                    <option value="en">English</option>
                    <option value="ar">العربية</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="timezone">Fuseau horaire</Label>
                  <select
                    id="timezone"
                    value={preferences.timezone}
                    onChange={(e) => setPreferences({ ...preferences, timezone: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="Africa/Tunis">Tunis (GMT+1)</option>
                    <option value="Europe/Paris">Paris (GMT+1)</option>
                    <option value="UTC">UTC (GMT+0)</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="theme">Thème</Label>
                  <select
                    id="theme"
                    value={preferences.theme}
                    onChange={(e) => setPreferences({ ...preferences, theme: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="light">Clair</option>
                    <option value="dark">Sombre</option>
                    <option value="auto">Automatique</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="dashboard-layout">Disposition du tableau de bord</Label>
                  <select
                    id="dashboard-layout"
                    value={preferences.dashboardLayout}
                    onChange={(e) => setPreferences({ ...preferences, dashboardLayout: e.target.value })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="default">Par défaut</option>
                    <option value="compact">Compact</option>
                    <option value="expanded">Étendu</option>
                  </select>
                </div>
              </div>
              <Button onClick={handlePreferencesUpdate} disabled={loading}>
                <Settings className="h-4 w-4 mr-2" />
                Enregistrer les préférences
              </Button>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Sessions */}
        <TabsContent value="sessions">
          <Card>
            <CardHeader>
              <CardTitle>Sessions actives</CardTitle>
              <CardDescription>Gérez vos sessions de connexion actives</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {sessions.map((session) => (
                  <div key={session.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex items-center space-x-4">
                      <Smartphone className="h-8 w-8 text-muted-foreground" />
                      <div>
                        <p className="font-medium">{session.device}</p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <MapPin className="h-3 w-3 mr-1" />
                          {session.location}
                        </p>
                        <p className="text-sm text-muted-foreground flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {session.lastActive}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {session.current && <Badge variant="secondary">Session actuelle</Badge>}
                      {!session.current && (
                        <Button variant="outline" size="sm" onClick={() => terminateSession(session.id)}>
                          Terminer
                        </Button>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Onglet Activité */}
        <TabsContent value="activity">
          <Card>
            <CardHeader>
              <CardTitle>Historique d'activité</CardTitle>
              <CardDescription>Consultez votre historique d'activité récente</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {activities.map((activity) => (
                  <div key={activity.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                    <Activity className="h-8 w-8 text-muted-foreground" />
                    <div className="flex-1">
                      <p className="font-medium">{activity.action}</p>
                      <p className="text-sm text-muted-foreground">
                        {activity.timestamp} • IP: {activity.ip}
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  )
}
