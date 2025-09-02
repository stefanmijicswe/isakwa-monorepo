"use client"

import * as React from "react"
import { 
  MessageSquare, 
  Clock, 
  Calendar, 
  User, 
  Eye, 
  ChevronRight,
  AlertTriangle,
  CheckCircle2,
  XCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Card, CardContent } from "@/components/ui/card"
import { StudentRequest, requestsService } from "@/lib/requests.service"

interface RequestServiceCardProps {
  request: StudentRequest
  onSelect: (id: number) => void
  onUpdate: () => void
}

export function RequestServiceCard({ request, onSelect, onUpdate }: RequestServiceCardProps) {
  const [isUpdating, setIsUpdating] = React.useState(false)

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffTime = Math.abs(now.getTime() - date.getTime())
    const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 0) {
      return 'Today'
    } else if (diffDays === 1) {
      return 'Yesterday'
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

  const isOverdue = request.dueDate && new Date(request.dueDate) < new Date()
  const daysUntilDue = request.dueDate 
    ? Math.ceil((new Date(request.dueDate).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))
    : null

  const getTypeIcon = () => {
    return request.type === 'COMPLAINT' ? '⚠️' : '📋'
  }

  const getStatusBadge = () => {
    const color = requestsService.getStatusColor(request.status)
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {request.status.replace('_', ' ')}
      </span>
    )
  }

  const getPriorityBadge = () => {
    if (request.priority === 'NORMAL') return null
    
    const color = requestsService.getPriorityColor(request.priority)
    return (
      <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${color}`}>
        {request.priority}
      </span>
    )
  }

  const getUrgencyIndicator = () => {
    if (request.type === 'COMPLAINT') {
      return <AlertTriangle className="h-4 w-4 text-red-500" />
    }
    if (isOverdue) {
      return <XCircle className="h-4 w-4 text-red-500" />
    }
    if (request.status === 'IN_REVIEW') {
      return <Clock className="h-4 w-4 text-blue-500" />
    }
    if (request.status === 'APPROVED') {
      return <CheckCircle2 className="h-4 w-4 text-green-500" />
    }
    return null
  }

  const handleQuickStatusChange = async (newStatus: string, e: React.MouseEvent) => {
    e.stopPropagation()
    
    try {
      setIsUpdating(true)
      await requestsService.updateRequestStatus(request.id, { status: newStatus })
      onUpdate()
    } catch (error) {
      console.error('Failed to update status:', error)
    } finally {
      setIsUpdating(false)
    }
  }

  return (
    <Card 
      className="hover:border-slate-300 transition-colors cursor-pointer"
      onClick={() => onSelect(request.id)}
    >
      <CardContent className="p-4">
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Header Row */}
            <div className="flex items-center gap-3 mb-2">
              <div className="flex items-center gap-2">
                {getUrgencyIndicator()}
                <span className="text-lg">{getTypeIcon()}</span>
                <span className="text-sm text-slate-500">
                  {requestsService.getCategoryIcon(request.category)} {request.category}
                </span>
              </div>
              <div className="flex items-center gap-2">
                {getStatusBadge()}
                {getPriorityBadge()}
              </div>
            </div>

            {/* Student Info */}
            <div className="flex items-center gap-2 mb-2">
              <User className="h-3 w-3 text-slate-500" />
              <span className="text-sm font-medium text-slate-700">
                {request.student?.firstName} {request.student?.lastName}
              </span>
              <span className="text-sm text-slate-500">
                ({request.student?.studentProfile?.studentIndex})
              </span>
              {request.assignedStaff && (
                <>
                  <span className="text-slate-300">•</span>
                  <span className="text-xs text-green-600">Assigned to {request.assignedStaff.firstName}</span>
                </>
              )}
            </div>

            {/* Title */}
            <h3 className="font-medium text-slate-900 mb-2 line-clamp-1">
              {request.title}
            </h3>

            {/* Description */}
            <p className="text-sm text-slate-600 line-clamp-2 mb-3">
              {request.description}
            </p>

            {/* Meta info */}
            <div className="flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1">
                <Calendar className="h-3 w-3" />
                {formatDate(request.createdAt)}
              </span>
              
              {request._count && request._count.comments > 0 && (
                <span className="flex items-center gap-1">
                  <MessageSquare className="h-3 w-3" />
                  {request._count.comments} comments
                </span>
              )}

              {isOverdue && (
                <span className="flex items-center gap-1 text-red-600">
                  <Clock className="h-3 w-3" />
                  Overdue by {Math.abs(daysUntilDue || 0)} days
                </span>
              )}

              {!isOverdue && daysUntilDue !== null && daysUntilDue >= 0 && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Due in {daysUntilDue} days
                </span>
              )}
            </div>
          </div>

          {/* Actions */}
          <div className="ml-4 flex flex-col gap-2">
            {/* Quick Actions */}
            {request.status === 'PENDING' && (
              <div className="flex gap-1">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-xs"
                  disabled={isUpdating}
                  onClick={(e) => handleQuickStatusChange('IN_REVIEW', e)}
                >
                  Review
                </Button>
              </div>
            )}
            
            {request.status === 'IN_REVIEW' && (
              <div className="flex gap-1">
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-xs text-green-600 border-green-600"
                  disabled={isUpdating}
                  onClick={(e) => handleQuickStatusChange('APPROVED', e)}
                >
                  Approve
                </Button>
                <Button 
                  size="sm" 
                  variant="outline"
                  className="text-xs text-red-600 border-red-600"
                  disabled={isUpdating}
                  onClick={(e) => handleQuickStatusChange('REJECTED', e)}
                >
                  Reject
                </Button>
              </div>
            )}

            {/* View Details */}
            <Button variant="ghost" size="sm" className="gap-1">
              <Eye className="h-4 w-4" />
              Details
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}
