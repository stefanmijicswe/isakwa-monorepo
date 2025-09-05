"use client"

import * as React from "react"
import { Upload, FileText, Calendar, AlertCircle, Download } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Input } from "@/components/ui/input"
import { assignmentsService, Assignment } from "@/lib/assignments.service"

export default function AssignmentsPage() {
  const [assignments, setAssignments] = React.useState<Assignment[]>([])
  const [loading, setLoading] = React.useState(true)
  const [submitting, setSubmitting] = React.useState<number | null>(null)

  // Load assignments from API
  React.useEffect(() => {
    const loadAssignments = async () => {
      try {
        setLoading(true)
        const assignmentsData = await assignmentsService.getAssignments()
        setAssignments(assignmentsData)
      } catch (error) {
        console.error('Failed to load assignments:', error)
        // You could show an error toast here
      } finally {
        setLoading(false)
      }
    }

    loadAssignments()
  }, [])

  const handleMarkAsSubmitted = async (assignmentId: number) => {
    setSubmitting(assignmentId)
    
    try {
      // Submit to backend (no file, just mark as submitted)
      await assignmentsService.markAsSubmitted(assignmentId)
      
      // Update assignment status in local state
      setAssignments(prev => prev.map(assignment => 
        assignment.id === assignmentId 
          ? {
              ...assignment,
              status: 'submitted' as const,
              submission: {
                id: Date.now(),
                fileName: 'Submitted via email',
                submittedAt: new Date().toISOString()
              }
            }
          : assignment
      ))
      
    } catch (error) {
      console.error('❌ Failed to mark assignment as submitted:', error)
      
      // Show error message to user
      alert(`Error: ${error.message}`)
    } finally {
      setSubmitting(null)
    }
  }

  // Removed file upload handlers - using simple submission instead

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    })
  }

  const getDaysUntilDue = (dueDate: string) => {
    const due = new Date(dueDate)
    const now = new Date()
    const diffTime = due.getTime() - now.getTime()
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    return diffDays
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending': return 'bg-orange-50 text-orange-700'
      case 'submitted': return 'bg-blue-50 text-blue-700'  
      case 'graded': return 'bg-green-50 text-green-700'
      default: return 'bg-neutral-50 text-neutral-700'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'PROJECT': return <FileText className="h-4 w-4" />
      case 'PRESENTATION': return <Upload className="h-4 w-4" />
      case 'ASSIGNMENT': return <FileText className="h-4 w-4" />
      case 'LABORATORY': return <FileText className="h-4 w-4" />
      default: return <FileText className="h-4 w-4" />
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Assignments</h1>
          <p className="text-slate-600">Submit and track your assignments</p>
        </div>
        
        <div className="space-y-4">
          {[1, 2, 3].map(i => (
            <div key={i} className="h-32 bg-slate-100 rounded-lg animate-pulse" />
          ))}
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Assignments</h1>
        <p className="text-neutral-600">Submit and track your assignments</p>
      </div>


      {/* Assignments List */}
      <div className="space-y-3">
        {assignments.map((assignment) => {
          const daysUntilDue = getDaysUntilDue(assignment.dueDate)
          const isOverdue = daysUntilDue < 0 && assignment.status === 'pending'
          
          return (
            <Card key={assignment.id} className="border border-neutral-200 shadow-none bg-white hover:shadow-sm hover:border-neutral-300 transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-8 w-8 bg-neutral-100 rounded-md flex items-center justify-center">
                        {getTypeIcon(assignment.type)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-neutral-900">{assignment.title}</h3>
                        <p className="text-sm text-neutral-500">
                          {assignment.subjectCode} • {assignment.subject}
                        </p>
                      </div>
                    </div>
                    
                    <p className="text-neutral-600 mb-4 leading-relaxed">{assignment.description}</p>
                    
                    <div className="flex items-center gap-4 text-sm text-neutral-500">
                      <div className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        Due {formatDate(assignment.dueDate)}
                      </div>
                      <div className="flex items-center gap-1">
                        <FileText className="h-4 w-4" />
                        {assignment.maxPoints} points
                      </div>
                      {isOverdue && (
                        <div className="flex items-center gap-1 text-red-600">
                          <AlertCircle className="h-4 w-4" />
                          {Math.abs(daysUntilDue)} days overdue
                        </div>
                      )}
                    </div>
                  </div>
                  
                  <div className="flex flex-col items-end gap-4 ml-6">
                    <Badge className={`${getStatusColor(assignment.status)} border-0 px-2.5 py-1 text-xs font-medium`}>
                      {assignment.status === 'pending' && 'Pending'}
                      {assignment.status === 'submitted' && 'Submitted'}
                      {assignment.status === 'graded' && 'Graded'}
                    </Badge>
                    
                    {assignment.status === 'pending' && (
                      <div className="text-right">
                        {submitting === assignment.id ? (
                          <div className="flex items-center justify-center gap-2 p-4">
                            <div className="h-4 w-4 border-2 border-neutral-300 border-t-neutral-900 rounded-full animate-spin" />
                            <span className="text-sm text-neutral-600 font-medium">Submitting...</span>
                          </div>
                        ) : (
                          <div className="space-y-4 min-w-[280px]">
                            <div className="p-4 bg-neutral-50 border border-neutral-200 rounded-lg">
                              <div className="flex items-start gap-3">
                                <div className="h-5 w-5 rounded-full bg-neutral-100 flex items-center justify-center mt-0.5">
                                  <div className="h-2 w-2 rounded-full bg-neutral-400" />
                                </div>
                                <div>
                                  <p className="text-sm font-medium text-neutral-900 mb-1">
                                    Email Submission
                                  </p>
                                  <p className="text-xs text-neutral-600 leading-relaxed">
                                    Submitted via email? Mark it as completed here.
                                  </p>
                                </div>
                              </div>
                            </div>
                            <Button 
                              onClick={() => handleMarkAsSubmitted(assignment.id)}
                              className="w-full bg-black hover:bg-neutral-800 text-white border-0 h-10 font-medium transition-colors"
                            >
                              Mark as Submitted
                            </Button>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {assignment.submission && (
                      <div className="text-right space-y-2">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <FileText className="h-4 w-4" />
                          <span className="font-medium">{assignment.submission.fileName}</span>
                        </div>
                        <p className="text-xs text-slate-500">
                          Submitted {formatDate(assignment.submission.submittedAt)}
                        </p>
                        
                        {assignment.submission.grade && (
                          <div className="space-y-1">
                            <div className="flex items-center gap-2">
                              <span className="text-lg font-semibold text-green-600">
                                {assignment.submission.grade}/{assignment.maxPoints}
                              </span>
                              <div className="w-16 h-2 bg-slate-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-green-500 rounded-full transition-all duration-300"
                                  style={{ width: `${(assignment.submission.grade / assignment.maxPoints) * 100}%` }}
                                />
                              </div>
                            </div>
                            {assignment.submission.feedback && (
                              <p className="text-xs text-slate-600 italic max-w-xs">
                                "{assignment.submission.feedback}"
                              </p>
                            )}
                          </div>
                        )}
                        
                        <Button variant="outline" size="sm" className="w-full">
                          <Download className="h-4 w-4 mr-2" />
                          Download
                        </Button>
                      </div>
                    )}
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
      
      {assignments.length === 0 && (
        <div className="text-center py-12">
          <Upload className="h-12 w-12 text-slate-400 mx-auto mb-4" />
          <h3 className="text-lg font-semibold text-slate-900 mb-2">No assignments yet</h3>
          <p className="text-slate-600">
            Your assignments will appear here when professors create them.
          </p>
        </div>
      )}
    </div>
  )
}
