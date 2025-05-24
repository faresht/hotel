"use client"

import { createContext, useContext, useState, type ReactNode } from "react"
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react"
import { Button } from "@/components/ui/button"

interface Notification {
  id: string
  type: "success" | "error" | "info" | "warning"
  title: string
  message: string
  isRead: boolean
  timestamp: Date
}

interface NotificationContextType {
  notifications: Notification[]
  addNotification: (notification: Omit<Notification, "id" | "isRead" | "timestamp">) => void
  markAsRead: (id: string) => void
  removeNotification: (id: string) => void
  clearAll: () => void
  unreadCount: number
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined)

export function NotificationProvider({ children }: { children: ReactNode }) {
  const [notifications, setNotifications] = useState<Notification[]>([
    {
      id: "1",
      type: "info",
      title: "Bienvenue sur TunisiaStay !",
      message: "Découvrez nos offres exclusives et gagnez des points de fidélité.",
      isRead: false,
      timestamp: new Date(),
    },
    {
      id: "2",
      type: "success",
      title: "Réservation confirmée",
      message: "Votre réservation à l'Hôtel Laico Tunis a été confirmée.",
      isRead: false,
      timestamp: new Date(Date.now() - 3600000),
    },
  ])

  const addNotification = (notificationData: Omit<Notification, "id" | "isRead" | "timestamp">) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString(),
      isRead: false,
      timestamp: new Date(),
    }
    setNotifications((prev) => [newNotification, ...prev])
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif)))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
  }

  const unreadCount = notifications.filter((notif) => !notif.isRead).length

  return (
    <NotificationContext.Provider
      value={{
        notifications,
        addNotification,
        markAsRead,
        removeNotification,
        clearAll,
        unreadCount,
      }}
    >
      {children}
      <NotificationToasts />
    </NotificationContext.Provider>
  )
}

function NotificationToasts() {
  const { notifications, removeNotification } = useNotifications()
  const recentNotifications = notifications.slice(0, 3)

  const getIcon = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return <CheckCircle className="h-5 w-5 text-green-500" />
      case "error":
        return <AlertCircle className="h-5 w-5 text-red-500" />
      case "warning":
        return <AlertTriangle className="h-5 w-5 text-yellow-500" />
      default:
        return <Info className="h-5 w-5 text-blue-500" />
    }
  }

  const getBgColor = (type: Notification["type"]) => {
    switch (type) {
      case "success":
        return "bg-green-50 border-green-200"
      case "error":
        return "bg-red-50 border-red-200"
      case "warning":
        return "bg-yellow-50 border-yellow-200"
      default:
        return "bg-blue-50 border-blue-200"
    }
  }

  return (
    <div className="fixed top-4 right-4 z-50 space-y-2">
      {recentNotifications.map((notification) => (
        <div
          key={notification.id}
          className={`max-w-sm p-4 rounded-lg border shadow-lg ${getBgColor(notification.type)} animate-in slide-in-from-right`}
        >
          <div className="flex items-start">
            <div className="flex-shrink-0">{getIcon(notification.type)}</div>
            <div className="ml-3 flex-1">
              <p className="text-sm font-medium text-gray-900">{notification.title}</p>
              <p className="mt-1 text-sm text-gray-600">{notification.message}</p>
            </div>
            <Button
              variant="ghost"
              size="sm"
              className="ml-2 h-6 w-6 p-0"
              onClick={() => removeNotification(notification.id)}
            >
              <X className="h-4 w-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}

export function useNotifications() {
  const context = useContext(NotificationContext)
  if (context === undefined) {
    throw new Error("useNotifications must be used within a NotificationProvider")
  }
  return context
}
