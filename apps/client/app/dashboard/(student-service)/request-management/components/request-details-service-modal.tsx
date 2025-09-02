"use client"

import * as React from "react"
import { 
  X, 
  MessageSquare, 
  Send, 
  Clock, 
  User, 
  AlertCircle, 
  Loader2, 
  Calendar,
  UserCheck,
  Settings,
  CheckCircle2,
  XCircle
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"

import { requestsService, WorkflowStatus, RequestComment } from "@/lib/requests.service"

interface RequestDetailsServiceModalProps {
  requestId: number
  isOpen: boolean
  onClose: () => void
  onUpdate: () => void
}

export function RequestDetailsServiceModal({ 
  requestId, 
  isOpen, 
  onClose, 
  onUpdate 
}: RequestDetailsServiceModalProps) {
  const [workflowData, setWorkflowData] = React.useState<WorkflowStatus | null>(null)
  const [comments, setComments] = React.useState<RequestComment[]>([])
  const [newComment, setNewComment] = React.useState("")
  const [newStatus, setNewStatus] = React.useState<string>("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSubmittingComment, setIsSubmittingComment] = React.useState(false)
  const [isUpdatingStatus, setIsUpdatingStatus] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const fetchData = React.useCallback(async () => {
    if (!isOpen) return

    try {
      setIsLoading(true)
      setError(null)
      
      const [workflow, commentsData] = await Promise.all([
        requestsService.getRequestWorkflow(requestId),
        requestsService.getComments(requestId)
      ])
      
      setWorkflowData(workflow)
      setComments(commentsData)
      setNewStatus(workflow.status)
    } catch (err) {
      console.error('Failed to fetch request details:', err)
      setError(err instanceof Error ? err.message : 'Failed to load request details')
    } finally {
      setIsLoading(false)
    }
  }, [requestId, isOpen])

  React.useEffect(() => {
    fetchData()
  }, [fetchData])

  const handleAddComment = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!newComment.trim()) return

    try {
      setIsSubmittingComment(true)
      await requestsService.addComment(requestId, newComment)
      setNewComment("")
      await fetchData() // Refresh data
    } catch (err) {
      console.error('Failed to add comment:', err)
    } finally {
      setIsSubmittingComment(false)
    }
  }

  const handleStatusUpdate = async () => {
    if (!newStatus || newStatus === workflowData?.status) return

    try {
      setIsUpdatingStatus(true)
      await requestsService.updateRequestStatus(requestId, { status: newStatus as any })
      await fetchData() // Refresh data
      onUpdate() // Update parent
    } catch (err) {
      console.error('Failed to update status:', err)
    } finally {
      setIsUpdatingStatus(false)
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getProgressColor = (progress: number) => {
    if (progress === 100) return 'bg-green-500'
    if (progress >= 50) return 'bg-blue-500'
    return 'bg-yellow-500'
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'APPROVED': return <CheckCircle2 className="h-4 w-4 text-green-600" />
      case 'REJECTED': return <XCircle className="h-4 w-4 text-red-600" />
      case 'IN_REVIEW': return <Clock className="h-4 w-4 text-blue-600" />
      default: return <Clock className="h-4 w-4 text-yellow-600" />
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-4xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <div className="flex items-center gap-3">
            <h2 className="text-lg font-semibold text-slate-900">Request Management</h2>
            {workflowData && getStatusIcon(workflowData.status)}
          </div>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Content */}
        <div className="overflow-y-auto" style={{ maxHeight: 'calc(90vh - 140px)' }}>
          {isLoading ? (
            <div className="p-8 text-center">
              <Loader2 className="h-6 w-6 animate-spin text-slate-600 mx-auto mb-2" />
              <p className="text-slate-600">Loading request details...</p>
            </div>
          ) : error ? (
            <div className="p-6">
              <div className="bg-red-50 border border-red-200 rounded-lg p-4">
                <div className="flex items-center space-x-2">
                  <AlertCircle className="h-4 w-4 text-red-600" />
                  <span className="text-red-800 text-sm">{error}</span>
                </div>
              </div>
            </div>
          ) : workflowData ? (
            <div className="p-6 space-y-6">
              <div className="grid grid-cols-3 gap-6">
                {/* Left Column - Request Details */}
                <div className="col-span-2 space-y-6">
                  {/* Request Info */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <span className="text-lg">
                          {workflowData.type === 'COMPLAINT' ? '⚠️' : '📋'}
                        </span>
                        {workflowData.title}
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="flex items-center gap-2">
                        <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${requestsService.getStatusColor(workflowData.status)}`}>
                          {workflowData.status.replace('_', ' ')}
                        </span>
                        {workflowData.workflow.isOverdue && (
                          <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-red-600 bg-red-50">
                            Overdue
                          </span>
                        )}
                      </div>

                      {/* Student Info */}
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <User className="h-4 w-4" />
                        <span>
                          Student: {workflowData.student?.firstName} {workflowData.student?.lastName}
                        </span>
                        <span className="text-slate-400">
                          ({workflowData.student?.studentProfile?.studentIndex})
                        </span>
                      </div>

                      {/* Description */}
                      <div>
                        <h4 className="font-medium text-slate-900 mb-2">Description</h4>
                        <p className="text-sm text-slate-600">{workflowData.description}</p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Progress */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Progress Tracking</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <span className="text-sm font-medium text-slate-700">Completion</span>
                            <span className="text-sm text-slate-600">{workflowData.workflow.progress}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div
                              className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(workflowData.workflow.progress)}`}
                              style={{ width: `${workflowData.workflow.progress}%` }}
                            />
                          </div>
                        </div>

                        <div className="flex items-center gap-4 text-xs text-slate-500">
                          <span className="flex items-center gap-1">
                            <Calendar className="h-3 w-3" />
                            Created {workflowData.workflow.daysSinceCreated} days ago
                          </span>
                          {workflowData.workflow.daysUntilDue && (
                            <span className="flex items-center gap-1">
                              <Clock className="h-3 w-3" />
                              {workflowData.workflow.daysUntilDue > 0 
                                ? `${workflowData.workflow.daysUntilDue} days left`
                                : `${Math.abs(workflowData.workflow.daysUntilDue)} days overdue`
                              }
                            </span>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Comments */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">
                        Communication ({comments.length})
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      {comments.length === 0 ? (
                        <div className="text-center py-6 text-slate-500">
                          <MessageSquare className="h-6 w-6 mx-auto mb-2" />
                          <p className="text-sm">No comments yet</p>
                        </div>
                      ) : (
                        <div className="space-y-3 max-h-60 overflow-y-auto">
                          {comments.map((comment) => (
                            <div key={comment.id} className="bg-slate-50 rounded-lg p-3">
                              <div className="flex items-center gap-2 mb-1">
                                <User className="h-3 w-3 text-slate-500" />
                                <span className="text-sm font-medium text-slate-700">
                                  {comment.user.firstName} {comment.user.lastName}
                                </span>
                                <span className="text-xs text-slate-500">
                                  ({comment.user.role.toLowerCase().replace('_', ' ')})
                                </span>
                                <span className="text-xs text-slate-500">•</span>
                                <span className="text-xs text-slate-500">
                                  {formatDate(comment.createdAt)}
                                </span>
                              </div>
                              <p className="text-sm text-slate-600">{comment.content}</p>
                            </div>
                          ))}
                        </div>
                      )}

                      {/* Add Comment */}
                      <form onSubmit={handleAddComment} className="space-y-3">
                        <Textarea
                          placeholder="Add a response or update..."
                          value={newComment}
                          onChange={(e) => setNewComment(e.target.value)}
                          rows={3}
                        />
                        <div className="flex justify-end">
                          <Button 
                            type="submit" 
                            size="sm" 
                            disabled={!newComment.trim() || isSubmittingComment}
                            className="gap-2"
                          >
                            {isSubmittingComment ? (
                              <>
                                <div className="h-3 w-3 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                Posting...
                              </>
                            ) : (
                              <>
                                <Send className="h-3 w-3" />
                                Add Response
                              </>
                            )}
                          </Button>
                        </div>
                      </form>
                    </CardContent>
                  </Card>
                </div>

                {/* Right Column - Actions */}
                <div className="space-y-6">
                  {/* Status Management */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base flex items-center gap-2">
                        <Settings className="h-4 w-4" />
                        Status Management
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div>
                        <label className="text-sm font-medium text-slate-700 mb-2 block">
                          Current Status
                        </label>
                        <Select value={newStatus} onValueChange={setNewStatus}>
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="PENDING">Pending</SelectItem>
                            <SelectItem value="IN_REVIEW">In Review</SelectItem>
                            <SelectItem value="APPROVED">Approved</SelectItem>
                            <SelectItem value="REJECTED">Rejected</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Button 
                        onClick={handleStatusUpdate}
                        disabled={!newStatus || newStatus === workflowData.status || isUpdatingStatus}
                        className="w-full gap-2"
                      >
                        {isUpdatingStatus ? (
                          <>
                            <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                            Updating...
                          </>
                        ) : (
                          <>
                            <UserCheck className="h-4 w-4" />
                            Update Status
                          </>
                        )}
                      </Button>
                    </CardContent>
                  </Card>

                  {/* Quick Actions */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-base">Quick Actions</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-2">
                      {workflowData.status === 'PENDING' && (
                        <Button 
                          variant="outline" 
                          className="w-full"
                                  onClick={async () => {
          setNewStatus('IN_REVIEW')
          await handleStatusUpdate()
        }}
                        >
                          Start Review
                        </Button>
                      )}
                      
                      {workflowData.status === 'IN_REVIEW' && (
                        <>
                          <Button 
                            variant="outline" 
                            className="w-full text-green-600 border-green-600"
                                        onClick={async () => {
              setNewStatus('APPROVED')
              await handleStatusUpdate()
            }}
                          >
                            <CheckCircle2 className="h-4 w-4 mr-2" />
                            Approve Request
                          </Button>
                          <Button 
                            variant="outline" 
                            className="w-full text-red-600 border-red-600"
                                        onClick={async () => {
              setNewStatus('REJECTED')
              await handleStatusUpdate()
            }}
                          >
                            <XCircle className="h-4 w-4 mr-2" />
                            Reject Request
                          </Button>
                        </>
                      )}
                    </CardContent>
                  </Card>

                  {/* Assignment Info */}
                  {workflowData.assignedStaff && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="text-base">Assignment</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="flex items-center gap-2 text-sm">
                          <UserCheck className="h-4 w-4 text-green-600" />
                          <span>
                            Assigned to {workflowData.assignedStaff.firstName} {workflowData.assignedStaff.lastName}
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </div>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
