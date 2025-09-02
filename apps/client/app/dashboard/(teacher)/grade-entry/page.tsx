"use client"

import * as React from "react"
import { Search, Save, Download, CheckCircle, FileText, Edit3, AlertTriangle, Clock } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { gradeEntryService, type Course, type Student } from "@/lib/grade-entry.service"

export default function GradeEntryPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedCourse, setSelectedCourse] = React.useState("all")
  const [grades, setGrades] = React.useState<{[key: string]: string}>({})
  const [courses, setCourses] = React.useState<Course[]>([])
  const [students, setStudents] = React.useState<Student[]>([])
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [exporting, setExporting] = React.useState(false)
  const [editingStudent, setEditingStudent] = React.useState<number | null>(null)
  const [savingStudent, setSavingStudent] = React.useState<number | null>(null)
  const [gradeEntryStatus, setGradeEntryStatus] = React.useState<{
    allowed: boolean
    daysElapsed: number
    message?: string
  } | null>(null)

  // Load data on component mount and when course changes
  React.useEffect(() => {
    loadData()
  }, [selectedCourse])

  const loadData = async () => {
    try {
      setLoading(true)
      const [coursesData, studentsData] = await Promise.all([
        gradeEntryService.getProfessorCourses(),
        gradeEntryService.getCourseStudents(selectedCourse === "all" ? undefined : selectedCourse)
      ])
      setCourses(coursesData)
      setStudents(studentsData)
      
      // Pre-populate grades for students who already have them
      const preloadedGrades: {[key: string]: string} = {}
      studentsData.forEach(student => {
        if (student.enrollments && student.enrollments.length > 0) {
          const enrollment = student.enrollments[0]
          preloadedGrades[`${student.id}_attendance`] = enrollment.attendance?.toString() || ''
          preloadedGrades[`${student.id}_assignments`] = enrollment.assignments?.toString() || ''
          preloadedGrades[`${student.id}_midterm`] = enrollment.midterm?.toString() || ''
          preloadedGrades[`${student.id}_final`] = enrollment.final?.toString() || ''
        }
      })
      setGrades(preloadedGrades)
      
      // Check grade entry time validation for selected course
      if (selectedCourse !== "all") {
        const selectedCourseData = coursesData.find(c => c.id.toString() === selectedCourse)
        if (selectedCourseData?.examDate) {
          const validationResult = gradeEntryService.isGradeEntryAllowed(selectedCourseData.examDate)
          setGradeEntryStatus(validationResult)
        }
      } else {
        setGradeEntryStatus(null)
      }
      
    } catch (error) {
      console.error('Failed to load data:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusVariant = (status: string) => {
    switch (status) {
      case "Completed":
        return "default"
      case "Pending":
        return "secondary"
      case "Overdue":
        return "destructive"
      default:
        return "outline"
    }
  }

  const handleGradeChange = (studentId: string, field: string, value: string) => {
    setGrades(prev => ({
      ...prev,
      [`${studentId}_${field}`]: value
    }))
  }

  const handleSaveAll = async () => {
    try {
      setSaving(true)
      await gradeEntryService.saveGrades(grades, selectedCourse === "all" ? undefined : selectedCourse)
      alert("Grades saved successfully!")
    } catch (error) {
      console.error("Failed to save grades:", error)
      alert("Failed to save grades")
    } finally {
      setSaving(false)
    }
  }

  const handleExport = async (format: 'csv' | 'pdf' = 'csv') => {
    try {
      setExporting(true)
      await gradeEntryService.exportGrades(selectedCourse === "all" ? undefined : selectedCourse, format)
    } catch (error) {
      console.error("Failed to export:", error)
      alert("Failed to export")
    } finally {
      setExporting(false)
    }
  }

  const getStudentStatus = (student: Student) => {
    if (student.enrollments && student.enrollments.length > 0) {
      return student.enrollments[0].status
    }
    return "Pending"
  }

  const getStatusVariantForStudent = (status: string) => {
    switch (status) {
      case "Completed":
        return "default"
      case "Pending":
        return "secondary"
      case "Overdue":
        return "destructive"
      default:
        return "outline"
    }
  }

  const handleEditStudent = (studentId: number) => {
    setEditingStudent(studentId)
  }

  const handleSaveStudent = async (studentId: number) => {
    // Check if grade entry is allowed
    if (gradeEntryStatus && !gradeEntryStatus.allowed) {
      alert(gradeEntryStatus.message || "Grade entry is not allowed at this time.")
      return
    }

    try {
      setSavingStudent(studentId)
      
      // Get current grades for this student
      const attendance = grades[`${studentId}_attendance`] || '0'
      const assignments = grades[`${studentId}_assignments`] || '0'
      const midterm = grades[`${studentId}_midterm`] || '0'
      const final = grades[`${studentId}_final`] || '0'
      
      // Create grades object for this student only
      const studentGrades = {
        [`${studentId}_attendance`]: attendance,
        [`${studentId}_assignments`]: assignments,
        [`${studentId}_midterm`]: midterm,
        [`${studentId}_final`]: final
      }
      
      // Save grades
      await gradeEntryService.saveGrades(studentGrades, selectedCourse === "all" ? undefined : selectedCourse)
      
      // Update student status to completed if all grades are entered
      const hasAllGrades = attendance && assignments && midterm && final
      if (hasAllGrades) {
        // Update students state to reflect completed status
        setStudents(prev => prev.map(student => {
          if (student.id === studentId && student.enrollments && student.enrollments.length > 0) {
            const updatedEnrollments = student.enrollments.map(enrollment => ({
              ...enrollment,
              attendance: parseFloat(attendance),
              assignments: parseFloat(assignments), 
              midterm: parseFloat(midterm),
              final: parseFloat(final),
              status: "Completed"
            }))
            return { ...student, enrollments: updatedEnrollments }
          }
          return student
        }))
      }
      
      setEditingStudent(null)
      alert("Grades saved successfully!")
    } catch (error) {
      console.error("Failed to save student grades:", error)
      alert("Failed to save grades")
    } finally {
      setSavingStudent(null)
    }
  }

  const canSaveStudent = (studentId: number) => {
    const attendance = grades[`${studentId}_attendance`]
    const assignments = grades[`${studentId}_assignments`]
    const midterm = grades[`${studentId}_midterm`]
    const final = grades[`${studentId}_final`]
    
    // Can save if at least one grade is entered or modified
    return attendance || assignments || midterm || final
  }

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.indexNumber.includes(searchTerm)
    
    return matchesSearch
  })

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Grade Entry</h1>
        <p className="text-slate-600">Enter and manage student grades for your courses</p>
      </div>

      {/* Grade Entry Time Validation Alert */}
      {gradeEntryStatus && (
        <Alert className={gradeEntryStatus.allowed ? "border-blue-200 bg-blue-50" : "border-red-200 bg-red-50"}>
          <div className="flex items-center gap-2">
            {gradeEntryStatus.allowed ? (
              <Clock className="h-4 w-4 text-blue-600" />
            ) : (
              <AlertTriangle className="h-4 w-4 text-red-600" />
            )}
            <AlertDescription className={gradeEntryStatus.allowed ? "text-blue-800" : "text-red-800"}>
              {gradeEntryStatus.message}
            </AlertDescription>
          </div>
        </Alert>
      )}

      <Card>
        <CardHeader className="pb-4">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
                <Input
                  type="text"
                  placeholder="Search students by name or index number..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="pl-10"
                />
              </div>
            </div>
            
            <div className="flex gap-2">
              <Select value={selectedCourse} onValueChange={setSelectedCourse}>
                <SelectTrigger className="w-64">
                  <SelectValue placeholder="All Courses" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Courses</SelectItem>
                  {courses.map(course => (
                    <SelectItem key={course.id} value={course.id.toString()}>
                      {course.code} - {course.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              <Button className="gap-2" onClick={handleSaveAll} disabled={saving}>
                <Save className="h-4 w-4" />
                {saving ? "Saving..." : "Save All"}
              </Button>
              <Button variant="outline" className="gap-2" onClick={() => handleExport('csv')} disabled={exporting}>
                <Download className="h-4 w-4" />
                {exporting ? "Exporting..." : "Export CSV"}
              </Button>
              <Button variant="outline" className="gap-2" onClick={() => handleExport('pdf')} disabled={exporting}>
                <FileText className="h-4 w-4" />
                {exporting ? "Exporting..." : "Export PDF"}
              </Button>
            </div>
          </div>
        </CardHeader>
      </Card>

      {/* Course Information Card */}
      {selectedCourse !== "all" && (
        <Card>
          <CardContent className="pt-6">
            {(() => {
              const course = courses.find(c => c.id.toString() === selectedCourse)
              if (!course) return null
              
              const gradeStatus = gradeEntryService.isGradeEntryAllowed(course.examDate)
              const examDate = new Date(course.examDate).toLocaleDateString('sr-RS', {
                day: 'numeric',
                month: 'long', 
                year: 'numeric'
              })
              
              return (
                <div className="bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg p-4">
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-slate-900">{course.code} - {course.name}</h3>
                      <p className="text-sm text-slate-600 mt-1">Datum ispita: {examDate}</p>
                      <div className="flex items-center gap-2 mt-2">
                        <Badge variant={gradeStatus.allowed ? "default" : "destructive"}>
                          {gradeStatus.allowed ? "Aktivno" : "Zatvoreno"}
                        </Badge>
                        <span className="text-sm text-slate-700 font-medium">
                          {gradeStatus.allowed 
                            ? `Preostalo ${15 - gradeStatus.daysElapsed} dan/a`
                            : `Isteklo pre ${gradeStatus.daysElapsed - 15} dan/a`
                          }
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-2xl font-bold text-slate-900">{course.studentsEnrolled}</div>
                      <div className="text-sm text-slate-600">studenata</div>
                    </div>
                  </div>
                </div>
              )
            })()}
          </CardContent>
        </Card>
      )}

      <Card>
        <CardHeader className="pb-4">
          <CardTitle className="text-lg">Student Grades</CardTitle>
          <p className="text-sm text-slate-600 mt-1">Enter grades for each student component</p>
        </CardHeader>
        
        <CardContent className="p-0">
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-50">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Student
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Attendance (10%)
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Assignments (20%)
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Midterm (30%)
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Final (40%)
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Status
                  </th>
                  <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                    Actions
                  </th>
                </tr>
              </thead>
              <tbody className="bg-white divide-y divide-slate-200">
                {filteredStudents.map((student) => (
                  <tr key={student.id} className="hover:bg-slate-50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-slate-900">
                          {student.firstName} {student.lastName}
                        </div>
                        <div className="text-sm text-slate-500">{student.indexNumber}</div>
                        <div className="text-xs text-slate-400">{student.email}</div>
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={grades[`${student.id}_attendance`] || ''}
                        onChange={(e) => handleGradeChange(student.id.toString(), "attendance", e.target.value)}
                        className="w-16 text-center"
                        placeholder="0"
                        disabled={editingStudent !== student.id || (gradeEntryStatus && !gradeEntryStatus.allowed)}
                      />
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={grades[`${student.id}_assignments`] || ''}
                        onChange={(e) => handleGradeChange(student.id.toString(), "assignments", e.target.value)}
                        className="w-16 text-center"
                        placeholder="0"
                        disabled={editingStudent !== student.id || (gradeEntryStatus && !gradeEntryStatus.allowed)}
                      />
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={grades[`${student.id}_midterm`] || ''}
                        onChange={(e) => handleGradeChange(student.id.toString(), "midterm", e.target.value)}
                        className="w-16 text-center"
                        placeholder="0"
                        disabled={editingStudent !== student.id || (gradeEntryStatus && !gradeEntryStatus.allowed)}
                      />
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <Input
                        type="number"
                        min="0"
                        max="100"
                        value={grades[`${student.id}_final`] || ''}
                        onChange={(e) => handleGradeChange(student.id.toString(), "final", e.target.value)}
                        className="w-16 text-center"
                        placeholder="0"
                        disabled={editingStudent !== student.id || (gradeEntryStatus && !gradeEntryStatus.allowed)}
                      />
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex flex-col items-center gap-1">
                        <Badge variant={getStatusVariantForStudent(getStudentStatus(student))}>
                          {getStudentStatus(student)}
                        </Badge>
                        {(() => {
                          if (selectedCourse === "all") return null
                          const course = courses.find(c => c.id.toString() === selectedCourse)
                          if (!course) return null
                          
                          const gradeStatus = gradeEntryService.isGradeEntryAllowed(course.examDate)
                          return (
                            <div className="text-xs text-slate-500">
                              {gradeStatus.allowed 
                                ? `Preostalo ${15 - gradeStatus.daysElapsed} dan/a`
                                : `Isteklo pre ${gradeStatus.daysElapsed - 15} dan/a`
                              }
                            </div>
                          )
                        })()}
                      </div>
                    </td>
                    
                    <td className="px-6 py-4 whitespace-nowrap text-center">
                      <div className="flex gap-2 justify-center">
                        {editingStudent === student.id ? (
                          <>
                            <Button 
                              variant="outline" 
                              size="sm"
                              onClick={() => setEditingStudent(null)}
                              disabled={savingStudent === student.id}
                            >
                              Cancel
                            </Button>
                            <Button 
                              variant="default" 
                              size="sm"
                              onClick={() => handleSaveStudent(student.id)}
                              disabled={savingStudent === student.id || !canSaveStudent(student.id) || (gradeEntryStatus && !gradeEntryStatus.allowed)}
                              className="gap-1"
                            >
                              {savingStudent === student.id ? (
                                "Saving..."
                              ) : (
                                <>
                                  <Save className="h-3 w-3" />
                                  Save
                                </>
                              )}
                            </Button>
                          </>
                        ) : (
                          <Button 
                            variant="ghost" 
                            size="sm"
                            onClick={() => handleEditStudent(student.id)}
                            disabled={gradeEntryStatus && !gradeEntryStatus.allowed}
                            className="gap-1"
                            title={gradeEntryStatus && !gradeEntryStatus.allowed ? gradeEntryStatus.message : undefined}
                          >
                            <Edit3 className="h-3 w-3" />
                            Edit
                          </Button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )
}