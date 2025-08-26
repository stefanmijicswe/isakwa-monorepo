"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Separator } from "@/components/ui/separator"
import { BookOpen, Calendar, Clock, FileText, GraduationCap, Users } from "lucide-react"
import { 
  getActiveExamPeriods, 
  getAvailableExams, 
  getRegisteredExams, 
  registerForExam,
  type ExamPeriod,
  type AvailableExam,
  type RegisteredExam
} from "@/lib/courses.service"

export default function ExamRegistrationPage() {
  const [availableExams, setAvailableExams] = useState<AvailableExam[]>([])
  const [registeredExams, setRegisteredExams] = useState<RegisteredExam[]>([])
  const [activePeriods, setActivePeriods] = useState<ExamPeriod[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedExam, setSelectedExam] = useState<AvailableExam | null>(null)
  const [isRegistering, setIsRegistering] = useState(false)
  const [showRegisterDialog, setShowRegisterDialog] = useState(false)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [exams, registered, periods] = await Promise.all([
        getAvailableExams(),
        getRegisteredExams(),
        getActiveExamPeriods()
      ])
      
      setAvailableExams(exams)
      setRegisteredExams(registered)
      setActivePeriods(periods)
    } catch (err) {
      console.error('Failed to fetch exam data:', err)
      setError(err instanceof Error ? err.message : 'Failed to load exam data')
    } finally {
      setLoading(false)
    }
  }

  const handleRegister = async (exam: AvailableExam) => {
    setSelectedExam(exam)
    setShowRegisterDialog(true)
  }

  const confirmRegistration = async () => {
    if (!selectedExam) return
    
    try {
      setIsRegistering(true)
      await registerForExam(selectedExam.id)
      
      // Refresh data
      await fetchData()
      setShowRegisterDialog(false)
      setSelectedExam(null)
    } catch (err) {
      console.error('Failed to register for exam:', err)
      setError(err instanceof Error ? err.message : 'Failed to register for exam')
    } finally {
      setIsRegistering(false)
    }
  }



  const formatDate = (dateString: string) => {
    try {
      // Handle YYYY-MM-DD format properly
      const date = new Date(dateString + 'T00:00:00')
      
      // Check if date is valid
      if (isNaN(date.getTime())) {
        console.error('Invalid date string:', dateString)
        return 'Invalid Date'
      }
      
      return date.toLocaleDateString('en-US', { 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric' 
      })
    } catch (error) {
      console.error('Error formatting date:', error, dateString)
      return 'Invalid Date'
    }
  }

  const formatTime = (timeString: string) => {
    try {
      // Handle time string format (e.g., "10:00 AM")
      if (!timeString || timeString === 'Invalid Date') {
        return 'TBD'
      }
      
      // If it's already formatted, return as is
      if (timeString.includes('AM') || timeString.includes('PM')) {
        return timeString
      }
      
      // If it's in HH:MM format, format it
      if (timeString.includes(':')) {
        const time = new Date(`2000-01-01T${timeString}`)
        if (isNaN(time.getTime())) {
          return 'TBD'
        }
        return time.toLocaleTimeString('en-US', { 
          hour: '2-digit', 
          minute: '2-digit' 
        })
      }
      
      return 'TBD'
    } catch (error) {
      console.error('Error formatting time:', error, timeString)
      return 'TBD'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Exam Registration</h1>
          <p className="text-slate-600">Register for your upcoming exams</p>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-600"></div>
            <span className="text-slate-600">Loading exams...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Exam Registration</h1>
          <p className="text-slate-600">Register for your upcoming exams</p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 text-red-600">⚠️</div>
            <span className="text-red-800 text-sm">Failed to load exam data</span>
          </div>
          <p className="text-red-700 text-sm mt-1">{error}</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Exam Registration</h1>
        <p className="text-slate-600">Register for your upcoming exams</p>
      </div>

      {/* Simple Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="text-2xl font-semibold text-slate-900">{availableExams.length}</div>
          <div className="text-sm text-slate-600">Available Exams</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="text-2xl font-semibold text-slate-900">{registeredExams.length}</div>
          <div className="text-sm text-slate-600">Registered</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="text-2xl font-semibold text-slate-900">{activePeriods.length}</div>
          <div className="text-sm text-slate-600">Active Periods</div>
        </div>
      </div>

      {/* Available Exams */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <h2 className="font-medium text-slate-900">Available Exams</h2>
          <p className="text-sm text-slate-600 mt-1">Exams you can register for</p>
        </div>
        
        {availableExams.length === 0 ? (
          <div className="p-8 text-center">
            <BookOpen className="h-8 w-8 text-slate-400 mx-auto mb-3" />
            <h3 className="font-medium text-slate-900 mb-1">No exams available</h3>
            <p className="text-sm text-slate-600">
              There are no exams available for registration at the moment.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {availableExams.map((exam) => (
              <div key={exam.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-slate-900">{exam.courseName}</span>
                      <span className="text-xs text-slate-500">({exam.courseCode})</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(exam.examDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(exam.examTime)}
                      </span>
                      <span className="flex items-center gap-1">
                        <FileText className="h-3 w-3" />
                        {exam.totalPoints} points
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <Button 
                      onClick={() => handleRegister(exam)}
                      size="sm"
                      className="bg-gray-900 hover:bg-gray-800"
                    >
                      Register
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Registered Exams */}
      {registeredExams.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="p-4 border-b border-slate-200">
            <h2 className="font-medium text-slate-900">Registered Exams</h2>
            <p className="text-sm text-slate-600 mt-1">Exams you have registered for</p>
          </div>
          
          <div className="divide-y divide-slate-200">
            {registeredExams.map((exam) => (
              <div key={exam.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-slate-900">{exam.courseName}</span>
                      <span className="text-xs text-slate-500">({exam.courseCode})</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(exam.examDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {formatTime(exam.examTime)}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <div className="inline-flex items-center px-2.5 py-1.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                      Registered
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Registration Dialog */}
      <Dialog open={showRegisterDialog} onOpenChange={setShowRegisterDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Confirm Exam Registration</DialogTitle>
            <DialogDescription>
              Are you sure you want to register for {selectedExam?.courseName}?
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-2 text-sm">
              <div className="flex justify-between">
                <span className="text-slate-600">Course:</span>
                <span className="font-medium">{selectedExam?.courseName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Date:</span>
                <span className="font-medium">{selectedExam ? formatDate(selectedExam.examDate) : ''}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-600">Time:</span>
                <span className="font-medium">{selectedExam ? formatTime(selectedExam.examTime) : ''}</span>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button 
              variant="outline" 
              onClick={() => setShowRegisterDialog(false)}
              disabled={isRegistering}
            >
              Cancel
            </Button>
            <Button 
              onClick={confirmRegistration}
              disabled={isRegistering}
              className="bg-gray-900 hover:bg-gray-800"
            >
              {isRegistering ? 'Registering...' : 'Confirm Registration'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
