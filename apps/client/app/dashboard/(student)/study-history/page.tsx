"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { BookOpen, GraduationCap, Clock, CheckCircle, XCircle, TrendingUp } from "lucide-react"
import { 
  getStudyHistory, 
  getStudyHistoryStats,
  type StudyHistoryItem,
  type StudyHistoryStats
} from "@/lib/courses.service"

export default function StudyHistoryPage() {
  const [studyHistory, setStudyHistory] = useState<StudyHistoryItem[]>([])
  const [stats, setStats] = useState<StudyHistoryStats>({
    totalCourses: 0,
    passedCourses: 0,
    failedCourses: 0,
    totalEcts: 0,
    averageGrade: 0,
    totalAttempts: 0
  })
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    fetchData()
  }, [])

  const fetchData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [history, historyStats] = await Promise.all([
        getStudyHistory(),
        getStudyHistoryStats()
      ])
      
      setStudyHistory(history)
      setStats(historyStats)
    } catch (err) {
      console.error('Failed to fetch study history:', err)
      setError(err instanceof Error ? err.message : 'Failed to load study history')
    } finally {
      setLoading(false)
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'passed':
        return <CheckCircle className="h-4 w-4 text-green-600" />
      case 'failed':
        return <XCircle className="h-4 w-4 text-red-600" />
      case 'in_progress':
        return <Clock className="h-4 w-4 text-blue-600" />
      default:
        return <BookOpen className="h-4 w-4 text-slate-600" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'passed':
        return 'text-green-600 bg-green-50'
      case 'failed':
        return 'text-red-600 bg-red-50'
      case 'in_progress':
        return 'text-blue-600 bg-blue-50'
      default:
        return 'text-slate-600 bg-slate-50'
    }
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Study History</h1>
          <p className="text-slate-600">Overview of your academic results and completed courses</p>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-slate-600"></div>
            <span className="text-slate-600">Loading study history...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Study History</h1>
          <p className="text-slate-600">Overview of your academic results and completed courses</p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <div className="h-4 w-4 text-red-600">⚠️</div>
            <span className="text-red-800 text-sm">Failed to load study history</span>
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
        <h1 className="text-2xl font-semibold text-slate-900">Study History</h1>
        <p className="text-slate-600">Overview of your academic results and completed courses</p>
      </div>

      {/* Simple Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="text-2xl font-semibold text-slate-900">{stats.totalCourses}</div>
          <div className="text-sm text-slate-600">Total Courses</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="text-2xl font-semibold text-slate-900">{stats.passedCourses}</div>
          <div className="text-sm text-slate-600">Passed</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="text-2xl font-semibold text-slate-900">{stats.totalEcts}</div>
          <div className="text-sm text-slate-600">ECTS Credits</div>
        </div>
      </div>

      {/* Course History */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <h2 className="font-medium text-slate-900">Course History</h2>
          <p className="text-sm text-slate-600 mt-1">Detailed overview of all courses and results</p>
        </div>
        
        {studyHistory.length === 0 ? (
          <div className="p-8 text-center">
            <BookOpen className="h-8 w-8 text-slate-400 mx-auto mb-3" />
            <h3 className="font-medium text-slate-900 mb-1">No courses yet</h3>
            <p className="text-sm text-slate-600">
              Your course history will appear here once you enroll in courses.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {studyHistory.map((course) => (
              <div key={course.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-slate-900">{course.subjectName}</span>
                      <span className="text-xs text-slate-500">({course.subjectCode})</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <GraduationCap className="h-3 w-3" />
                        {course.professor || 'TBD'}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {course.subjectCredits} ECTS
                      </span>
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {course.academicYear}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <div className="flex items-center gap-2">
                      <Badge 
                        variant="outline" 
                        className={getStatusColor(course.status || 'unknown')}
                      >
                        {course.status === 'passed' ? 'Passed' : 
                         course.status === 'failed' ? 'Failed' : 
                         course.status === 'in_progress' ? 'In Progress' : 'Unknown'}
                      </Badge>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
