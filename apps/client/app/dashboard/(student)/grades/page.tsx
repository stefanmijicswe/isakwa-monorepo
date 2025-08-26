"use client"

import * as React from "react"
import { Award, TrendingUp, BookOpen, Calendar, Users, Loader2, AlertCircle } from "lucide-react"
import { coursesService, Grade, GradeStats } from "@/lib/courses.service"
import { useAuth } from "@/components/auth"

export default function GradesPage() {
  const { user } = useAuth()
  const [grades, setGrades] = React.useState<Grade[]>([])
  const [stats, setStats] = React.useState<GradeStats>({
    totalAssessments: 0,
    averageGrade: 0,
    highestGrade: 'N/A',
    lowestGrade: 'N/A',
    totalEcts: 0,
    gpa: 0
  })
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)

  React.useEffect(() => {
    const fetchData = async () => {
      try {
        setIsLoading(true)
        setError(null)
        
        const [gradesData, gradeStats] = await Promise.all([
          coursesService.getGrades(),
          coursesService.getGradeStats()
        ])
        
        setGrades(gradesData)
        setStats(gradeStats)
      } catch (err) {
        console.error('Failed to fetch grade data:', err)
        setError(err instanceof Error ? err.message : 'Failed to load grades')
      } finally {
        setIsLoading(false)
      }
    }

    fetchData()
  }, [])

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    })
  }

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Grades</h1>
          <p className="text-slate-600">View your academic performance</p>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin text-slate-600" />
            <span className="text-slate-600">Loading grades...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Grades</h1>
          <p className="text-slate-600">View your academic performance</p>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-red-800 text-sm">Failed to load grades</span>
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
        <h1 className="text-2xl font-semibold text-slate-900">Grades</h1>
        <p className="text-slate-600">View your academic performance</p>
      </div>

      {/* Simple Stats Row */}
      <div className="grid grid-cols-3 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="text-2xl font-semibold text-slate-900">{stats.averageGrade.toFixed(1)}</div>
          <div className="text-sm text-slate-600">Average Grade</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="text-2xl font-semibold text-slate-900">{stats.gpa.toFixed(2)}</div>
          <div className="text-sm text-slate-600">GPA</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="text-2xl font-semibold text-slate-900">{stats.totalEcts}</div>
          <div className="text-sm text-slate-600">ECTS Credits</div>
        </div>
      </div>

      {/* Grades List */}
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-4 border-b border-slate-200">
          <h2 className="font-medium text-slate-900">All Grades</h2>
        </div>
        
        {grades.length === 0 ? (
          <div className="p-8 text-center">
            <Award className="h-8 w-8 text-slate-400 mx-auto mb-3" />
            <h3 className="font-medium text-slate-900 mb-1">No grades yet</h3>
            <p className="text-sm text-slate-600">
              Grades will appear here after your professors complete evaluations.
            </p>
          </div>
        ) : (
          <div className="divide-y divide-slate-200">
            {grades.map((grade) => (
              <div key={grade.id} className="p-4 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <span className="font-medium text-slate-900">{grade.courseName}</span>
                      <span className="text-xs text-slate-500">({grade.courseAcronym})</span>
                    </div>
                    
                    <div className="flex items-center gap-4 text-sm text-slate-600">
                      <span className="flex items-center gap-1">
                        <Users className="h-3 w-3" />
                        {grade.professor}
                      </span>
                      <span className="flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {formatDate(grade.assessmentDate)}
                      </span>
                      <span className="flex items-center gap-1">
                        <BookOpen className="h-3 w-3" />
                        {grade.semester}
                      </span>
                    </div>
                  </div>
                  
                  <div className="text-right ml-4">
                    <div className={`text-2xl font-bold ${coursesService.getGradeColor(grade.grade)}`}>
                      {grade.grade}
                    </div>
                    <div className="text-xs text-slate-500">
                      {grade.numericalGrade.toFixed(1)} pts
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
