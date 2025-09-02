"use client"

import * as React from "react"
import { MessageSquare, FileText, Clock, Calendar, Eye, ChevronRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import { StudentRequest, requestsService } from "@/lib/requests.service"
import { RequestDetailsModal } from "./request-details-modal"

interface RequestCardProps {
  request: StudentRequest
}

export function RequestCard({ request }: RequestCardProps) {
  const [isDetailsOpen, setIsDetailsOpen] = React.useState(false)

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

  return (
    <>
      <div 
        className="bg-white border border-slate-200 rounded-lg p-4 hover:border-slate-300 transition-colors cursor-pointer"
        onClick={() => setIsDetailsOpen(true)}
      >
        <div className="flex items-start justify-between">
          <div className="flex-1 min-w-0">
            {/* Header */}
            <div className="flex items-center gap-2 mb-2">
              <span className="text-lg">{getTypeIcon()}</span>
              <span className="text-sm text-slate-500">
                {requestsService.getCategoryIcon(request.category)} {request.category}
              </span>
              <div className="flex items-center gap-2">
                {getStatusBadge()}
                {getPriorityBadge()}
              </div>
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
              
              {request._count && request._count.attachments > 0 && (
                <span className="flex items-center gap-1">
                  <FileText className="h-3 w-3" />
                  {request._count.attachments} files
                </span>
              )}

              {request.assignedStaff && (
                <span className="flex items-center gap-1">
                  <div className="h-2 w-2 bg-green-500 rounded-full" />
                  Assigned
                </span>
              )}

              {request.dueDate && (
                <span className="flex items-center gap-1">
                  <Clock className="h-3 w-3" />
                  Due {formatDate(request.dueDate)}
                </span>
              )}
            </div>
          </div>

          {/* Action */}
          <div className="ml-4 flex-shrink-0">
            <Button variant="ghost" size="sm" className="gap-1">
              <Eye className="h-4 w-4" />
              View
              <ChevronRight className="h-3 w-3" />
            </Button>
          </div>
        </div>
      </div>

      {/* Details Modal */}
      <RequestDetailsModal
        requestId={request.id}
        isOpen={isDetailsOpen}
        onClose={() => setIsDetailsOpen(false)}
      />
    </>
  )
}
