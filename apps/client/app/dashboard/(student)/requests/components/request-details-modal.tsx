"use client"

import * as React from "react"
import { X, MessageSquare, Send, Clock, User, AlertCircle, Loader2, Calendar } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Textarea } from "@/components/ui/textarea"
import { requestsService, WorkflowStatus, RequestComment } from "@/lib/requests.service"

interface RequestDetailsModalProps {
  requestId: number
  isOpen: boolean
  onClose: () => void
}

export function RequestDetailsModal({ requestId, isOpen, onClose }: RequestDetailsModalProps) {
  const [workflowData, setWorkflowData] = React.useState<WorkflowStatus | null>(null)
  const [comments, setComments] = React.useState<RequestComment[]>([])
  const [newComment, setNewComment] = React.useState("")
  const [isLoading, setIsLoading] = React.useState(false)
  const [isSubmittingComment, setIsSubmittingComment] = React.useState(false)
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
      await fetchData() // Refresh comments
    } catch (err) {
      console.error('Failed to add comment:', err)
    } finally {
      setIsSubmittingComment(false)
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

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-2xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Request Details</h2>
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
              {/* Request Info */}
              <div>
                <div className="flex items-center gap-2 mb-2">
                  <span className="text-lg">
                    {workflowData.type === 'COMPLAINT' ? '⚠️' : '📋'}
                  </span>
                  <h3 className="text-lg font-medium text-slate-900">{workflowData.title}</h3>
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <span className={`inline-flex items-center px-2 py-1 rounded-full text-xs font-medium ${requestsService.getStatusColor(workflowData.status)}`}>
                    {workflowData.status.replace('_', ' ')}
                  </span>
                  {workflowData.workflow.isOverdue && (
                    <span className="inline-flex items-center px-2 py-1 rounded-full text-xs font-medium text-red-600 bg-red-50">
                      Overdue
                    </span>
                  )}
                </div>
              </div>

              {/* Progress */}
              <div>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-slate-700">Progress</span>
                  <span className="text-sm text-slate-600">{workflowData.workflow.progress}%</span>
                </div>
                <div className="w-full bg-slate-200 rounded-full h-2">
                  <div
                    className={`h-2 rounded-full transition-all duration-300 ${getProgressColor(workflowData.workflow.progress)}`}
                    style={{ width: `${workflowData.workflow.progress}%` }}
                  />
                </div>
                <div className="flex items-center gap-4 mt-2 text-xs text-slate-500">
                  <span className="flex items-center gap-1">
                    <Calendar className="h-3 w-3" />
                    {workflowData.workflow.daysSinceCreated} days ago
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

              {/* Comments */}
              <div>
                <h4 className="font-medium text-slate-900 mb-3">
                  Comments ({comments.length})
                </h4>
                
                {comments.length === 0 ? (
                  <div className="text-center py-6 text-slate-500">
                    <MessageSquare className="h-6 w-6 mx-auto mb-2" />
                    <p className="text-sm">No comments yet</p>
                  </div>
                ) : (
                  <div className="space-y-3 mb-4 max-h-60 overflow-y-auto">
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
                    placeholder="Add a comment..."
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
                          Post Comment
                        </>
                      )}
                    </Button>
                  </div>
                </form>
              </div>
            </div>
          ) : null}
        </div>
      </div>
    </div>
  )
}
