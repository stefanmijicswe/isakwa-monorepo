"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Bell, BellOff, Trash2, CheckCircle, AlertTriangle, Info, XCircle } from "lucide-react"
import { 
  getNotifications, 
  markNotificationAsRead, 
  deleteNotification,
  markAllNotificationsAsRead,
  type Notification
} from "@/lib/courses.service"

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchNotifications()
  }, [])

  const fetchNotifications = async () => {
    try {
      setLoading(true)
      setError(null)

      const data = await getNotifications()
      setNotifications(data)
    } catch (err) {
      setError('Error loading notifications')
      console.error('Error fetching notifications:', err)
    } finally {
      setLoading(false)
    }
  }

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      const success = await markNotificationAsRead(notificationId)
      if (success) {
        setNotifications(prev => 
          prev.map(notif => 
            notif.id === notificationId 
              ? { ...notif, isRead: true }
              : notif
          )
        )
        // Emit event to update sidebar notification count
        window.dispatchEvent(new CustomEvent('notifications-updated'));
      }
    } catch (error) {
      console.error('Failed to mark notification as read:', error)
    }
  }

  const handleDeleteNotification = async (notificationId: number) => {
    try {
      const success = await deleteNotification(notificationId)
      if (success) {
        setNotifications(prev => prev.filter(notif => notif.id !== notificationId))
      }
    } catch (error) {
      console.error('Failed to delete notification:', error)
    }
  }

  const handleMarkAllAsRead = async () => {
    try {
      const success = await markAllNotificationsAsRead();
      if (success) {
        setNotifications(prev => prev.map(notif => ({ ...notif, isRead: true })));
        // Emit event to update sidebar notification count
        window.dispatchEvent(new CustomEvent('notifications-updated'));
      }
    } catch (error) {
      console.error('Failed to mark all notifications as read:', error);
    }
  };

  const getNotificationIcon = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return <CheckCircle className="h-5 w-5 text-green-600" />
      case 'WARNING':
        return <AlertTriangle className="h-5 w-5 text-yellow-600" />
      case 'ERROR':
        return <XCircle className="h-5 w-5 text-red-600" />
      case 'INFO':
      default:
        return <Info className="h-5 w-5 text-blue-600" />
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'HIGH':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'MEDIUM':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'LOW':
        return 'bg-green-100 text-green-800 border-green-300'
      default:
        return 'bg-gray-100 text-gray-800 border-gray-300'
    }
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case 'SUCCESS':
        return 'bg-green-100 text-green-800 border-green-300'
      case 'WARNING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-300'
      case 'ERROR':
        return 'bg-red-100 text-red-800 border-red-300'
      case 'INFO':
      default:
        return 'bg-blue-100 text-blue-800 border-blue-300'
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))

    if (diffDays === 1) {
      return 'Yesterday'
    } else if (diffDays === 0) {
      return 'Today'
    } else if (diffDays < 7) {
      return `${diffDays} days ago`
    } else {
      return date.toLocaleDateString('en-US', { 
        year: 'numeric', 
        month: 'short', 
        day: 'numeric' 
      })
    }
  }

  if (loading) {
    return (
      <div className="space-y-4">
        <div>
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Notifications</h1>
          <p className="text-sm text-gray-600">Overview of notifications for your courses</p>
        </div>
        
        <div className="space-y-2">
          {[1, 2, 3].map((i) => (
            <div key={i} className="p-3 rounded-lg border border-gray-200 bg-white animate-pulse">
              <div className="flex items-start space-x-3">
                <div className="h-4 w-4 bg-gray-200 rounded-full"></div>
                <div className="flex-1 space-y-2">
                  <div className="h-3 bg-gray-200 rounded w-3/4"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                  <div className="h-3 bg-gray-200 rounded w-2/3"></div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Notifications</h1>
          <p className="text-slate-600">Overview of notifications for your courses</p>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="text-center">
              <p className="text-red-600 mb-4">{error}</p>
              <Button 
                onClick={fetchNotifications}
                variant="destructive"
              >
                Try Again
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div>
        <h1 className="text-xl font-semibold text-gray-900 mb-1">Notifications</h1>
        <p className="text-sm text-gray-600">Overview of notifications for your courses</p>
      </div>
      
      {notifications.length === 0 ? (
        <Card className="border-dashed border-2 border-gray-200">
          <CardContent className="p-8">
            <div className="text-center">
              <BellOff className="h-12 w-12 mx-auto mb-3 text-gray-300" />
              <h3 className="text-base font-medium text-gray-900 mb-2">No Notifications</h3>
              <p className="text-sm text-gray-600 mb-4">
                You currently have no notifications. When professors post important information about your courses, 
                it will appear here.
              </p>
              <Button 
                onClick={fetchNotifications}
                variant="outline"
                size="sm"
                className="h-8"
              >
                <Bell className="h-3 w-3 mr-2" />
                Refresh
              </Button>
            </div>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <Bell className="h-4 w-4 text-gray-600" />
              <span className="text-sm font-medium text-gray-900">
                {notifications.length} notification{notifications.length !== 1 ? 's' : ''}
              </span>
              {notifications.filter(n => !n.isRead).length > 0 && (
                <Badge className="bg-blue-100 text-blue-800 text-xs">
                  {notifications.filter(n => !n.isRead).length} unread
                </Badge>
              )}
            </div>
            
            {notifications.filter(n => !n.isRead).length > 0 && (
              <Button
                onClick={handleMarkAllAsRead}
                variant="outline"
                size="sm"
                className="h-7 text-xs"
              >
                <CheckCircle className="h-3 w-3 mr-1" />
                Mark all as read
              </Button>
            )}
          </div>
          
          <div className="space-y-2">
            {notifications.map((notification) => (
              <div 
                key={notification.id} 
                className={`p-3 rounded-lg border transition-all hover:shadow-sm ${
                  notification.isRead 
                    ? 'bg-gray-50 border-gray-200' 
                    : 'bg-white border-blue-200 shadow-sm'
                }`}
              >
                <div className="flex items-start justify-between">
                  <div className="flex items-start space-x-3 flex-1 min-w-0">
                    {getNotificationIcon(notification.type)}
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center space-x-2 mb-1">
                        <h3 className={`font-medium text-sm truncate ${
                          notification.isRead ? 'text-gray-600' : 'text-gray-900'
                        }`}>
                          {notification.title}
                        </h3>
                        <div className="flex items-center space-x-1">
                          <Badge className={`text-xs px-2 py-0.5 ${getTypeColor(notification.type)}`}>
                            {notification.type}
                          </Badge>
                          <Badge className={`text-xs px-2 py-0.5 ${getPriorityColor(notification.priority)}`}>
                            {notification.priority}
                          </Badge>
                          {!notification.isRead && (
                            <Badge className="bg-blue-100 text-blue-800 text-xs px-2 py-0.5">
                              New
                            </Badge>
                          )}
                        </div>
                      </div>
                      
                      <p className={`text-sm leading-relaxed mb-2 ${
                        notification.isRead ? 'text-gray-600' : 'text-gray-700'
                      }`}>
                        {notification.message}
                      </p>
                      
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3 text-xs text-gray-500">
                          <span className="flex items-center space-x-1">
                            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                            <span>{notification.senderName}</span>
                          </span>
                          <span>{formatDate(notification.createdAt)}</span>
                        </div>
                        
                        <div className="flex items-center space-x-1">
                          {!notification.isRead && (
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleMarkAsRead(notification.id)}
                              className="h-6 w-6 p-0 hover:bg-blue-50"
                            >
                              <CheckCircle className="h-3 w-3 text-blue-600" />
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="h-6 w-6 p-0 text-red-600 hover:text-red-700 hover:bg-red-50"
                          >
                            <Trash2 className="h-3 w-3" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
