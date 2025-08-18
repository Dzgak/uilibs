"use client"

import { useState, useEffect } from "react"
import { createClient } from "@/lib/client"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { X, Check, XCircle, Clock } from "lucide-react"

interface NotificationBannerProps {
  userId: string
}

export function NotificationBanner({ userId }: NotificationBannerProps) {
  const [notifications, setNotifications] = useState<any[]>([])
  const [visible, setVisible] = useState(false)
  const supabase = createClient()

  useEffect(() => {
    const fetchNotifications = async () => {
      // Fetch recent submissions that have been reviewed
      const { data: submissions } = await supabase
        .from("pending_submissions")
        .select("*")
        .eq("user_id", userId)
        .in("status", ["approved", "rejected"])
        .gte("reviewed_at", new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString()) // Last 7 days
        .order("reviewed_at", { ascending: false })

      if (submissions && submissions.length > 0) {
        setNotifications(submissions)
        setVisible(true)
      }
    }

    if (userId) {
      fetchNotifications()
    }
  }, [userId])

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'approved':
        return <Check className="w-4 h-4" />
      case 'rejected':
        return <XCircle className="w-4 h-4" />
      default:
        return <Clock className="w-4 h-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-50 border-green-200 text-green-800'
      case 'rejected':
        return 'bg-red-50 border-red-200 text-red-800'
      default:
        return 'bg-blue-50 border-blue-200 text-blue-800'
    }
  }

  if (!visible || notifications.length === 0) {
    return null
  }

  return (
    <div className="fixed top-4 right-4 z-50 max-w-sm">
      {notifications.map((notification) => (
        <div
          key={notification.id}
          className={`mb-2 p-4 border rounded-lg shadow-lg ${getStatusColor(notification.status)}`}
        >
          <div className="flex items-start justify-between">
            <div className="flex items-start gap-3">
              {getStatusIcon(notification.status)}
              <div className="flex-1">
                <h4 className="font-medium text-sm">
                  {notification.status === 'approved' ? 'Library Approved!' : 'Library Review Complete'}
                </h4>
                <p className="text-sm mt-1">
                  "{notification.name}" has been {notification.status}.
                  {notification.admin_notes && (
                    <span className="block mt-1 text-xs opacity-80">
                      Note: {notification.admin_notes}
                    </span>
                  )}
                </p>
              </div>
            </div>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setVisible(false)}
              className="text-current hover:bg-current/10"
            >
              <X className="w-4 h-4" />
            </Button>
          </div>
        </div>
      ))}
    </div>
  )
}
