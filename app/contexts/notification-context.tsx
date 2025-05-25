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
  autoClose?: boolean
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
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [toasts, setToasts] = useState<Notification[]>([])

  const addNotification = (notificationData: Omit<Notification, "id" | "isRead" | "timestamp">) => {
    const newNotification: Notification = {
      ...notificationData,
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      isRead: false,
      timestamp: new Date(),
      autoClose: notificationData.autoClose !== false,
    }

    setNotifications((prev) => [newNotification, ...prev])

    // Ajouter aux toasts pour affichage temporaire
    setToasts((prev) => [newNotification, ...prev])

    // Auto-remove toast après 5 secondes
    if (newNotification.autoClose) {
      setTimeout(() => {
        setToasts((prev) => prev.filter((toast) => toast.id !== newNotification.id))
      }, 5000)
    }
  }

  const markAsRead = (id: string) => {
    setNotifications((prev) => prev.map((notif) => (notif.id === id ? { ...notif, isRead: true } : notif)))
  }

  const removeNotification = (id: string) => {
    setNotifications((prev) => prev.filter((notif) => notif.id !== id))
    setToasts((prev) => prev.filter((toast) => toast.id !== id))
  }

  const clearAll = () => {
    setNotifications([])
    setToasts([])
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
      <NotificationToasts toasts={toasts} removeNotification={removeNotification} />
    </NotificationContext.Provider>
  )
}

function NotificationToasts({
  toasts,
  removeNotification,
}: {
  toasts: Notification[]
  removeNotification: (id: string) => void
}) {
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
    <div className="fixed top-4 right-4 z-50 space-y-2 max-w-sm">
      {toasts.slice(0, 3).map((notification) => (
        <div
          key={notification.id}
          className={`p-4 rounded-lg border shadow-lg ${getBgColor(notification.type)} animate-in slide-in-from-right duration-300`}
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
              className="ml-2 h-6 w-6 p-0 hover:bg-gray-200"
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
