"use client"

import * as React from "react"
import { Edit3, Plus, FileText, Save, X, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { syllabiService, Subject, Syllabus, CreateSyllabusDto, UpdateSyllabusDto } from "@/lib/syllabi.service"

interface CourseWithSyllabus extends Subject {
  syllabus?: Syllabus
  syllabusExists: boolean
}

export default function SyllabiPage() {
  const [showEditor, setShowEditor] = React.useState(false)
  const [selectedCourse, setSelectedCourse] = React.useState<CourseWithSyllabus | null>(null)
  const [syllabusContent, setSyllabusContent] = React.useState("")
  const [courses, setCourses] = React.useState<CourseWithSyllabus[]>([])
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Load professor's subjects and syllabi
  React.useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      // Get current academic year
      const currentYear = syllabiService.getCurrentAcademicYear()
      
      // Fetch professor's subjects
      const subjects = await syllabiService.getProfessorSubjects(currentYear)
      
      // Fetch existing syllabi for these subjects individually
      const syllabi = await syllabiService.getSyllabi({ academicYear: currentYear })
      console.log('🔍 Retrieved syllabi from backend:', syllabi)
      console.log('📚 Retrieved subjects:', subjects)
      
      // Combine subjects with their syllabi
      const coursesWithSyllabi: CourseWithSyllabus[] = subjects.map(subject => {
        const syllabus = syllabi.find(s => s.subjectId === subject.id)
        console.log(`🔗 Subject ${subject.id} (${subject.name}):`, { syllabus, exists: !!syllabus })
        return {
          ...subject,
          syllabus,
          syllabusExists: !!syllabus
        }
      })
      
      setCourses(coursesWithSyllabi)
    } catch (err) {
      console.error('Failed to load data:', err)
      setError('Failed to load courses and syllabi')
    } finally {
      setLoading(false)
    }
  }

  const handleEditSyllabus = async (course: CourseWithSyllabus) => {
    setSelectedCourse(course)
    
    if (course.syllabusExists && course.syllabus) {
      // Load existing syllabus content
      try {
        const syllabus = await syllabiService.getSyllabusById(course.syllabus.id)
        setSyllabusContent(`# ${course.name} Syllabus

## Course Information
- **Course Code:** ${course.code}
- **Semester:** ${syllabiService.getSemesterDisplayName(course.semesterType)} ${course.academicYear}
- **Credits:** ${course.ects} ECTS

## Course Description
${syllabus.description || 'No description provided'}

## Learning Outcomes
${syllabus.objectives || 'No learning outcomes specified'}

## Additional Information
Created: ${new Date(syllabus.createdAt).toLocaleDateString()}
Last Updated: ${new Date(syllabus.updatedAt).toLocaleDateString()}`)
      } catch (err) {
        console.error('Failed to load syllabus:', err)
        setSyllabusContent(`# ${course.name} Syllabus

## Course Information
- **Course Code:** ${course.code}
- **Semester:** ${syllabiService.getSemesterDisplayName(course.semesterType)} ${course.academicYear}
- **Credits:** ${course.ects} ECTS

## Course Description
Error loading syllabus content. Please try again.`)
      }
    } else {
      // Template for new syllabus
      setSyllabusContent(`# ${course.name} Syllabus

## Course Information
- **Course Code:** ${course.code}
- **Semester:** ${syllabiService.getSemesterDisplayName(course.semesterType)} ${course.academicYear}
- **Credits:** ${course.ects} ECTS

## Course Description
[Add course description here]

## Learning Outcomes
Upon completion of this course, students will be able to:
- [Add learning outcome 1]
- [Add learning outcome 2]
- [Add learning outcome 3]

## Assessment Methods
- [Add assessment methods and weightings]

## Course Schedule
- [Add weekly schedule and topics]

## Required Materials
- [Add textbooks and resources]`)
    }
    setShowEditor(true)
  }

  const handleSaveSyllabus = async () => {
    if (!selectedCourse) return
    
    try {
      setSaving(true)
      setError(null)
      
      // Parse the content to extract description and objectives
      const sections = parseSyllabusContent(syllabusContent)
      console.log('📝 Parsed sections:', sections)
      console.log('📄 Original content:', syllabusContent)
      
      if (selectedCourse.syllabusExists && selectedCourse.syllabus) {
        // Update existing syllabus
        const updateData: UpdateSyllabusDto = {
          description: sections.description,
          objectives: sections.objectives,
          isActive: true
        }
        
        await syllabiService.updateSyllabus(selectedCourse.syllabus.id, updateData)
      } else {
        // Create new syllabus
        const createData: CreateSyllabusDto = {
          subjectId: selectedCourse.id,
          academicYear: selectedCourse.academicYear,
          semesterType: selectedCourse.semesterType,
          description: sections.description,
          objectives: sections.objectives,
          isActive: true
        }
        
        await syllabiService.createSyllabus(createData)
      }
      
      // Refresh the data to show updated syllabi
      await loadData()
      
      // Close editor
      setShowEditor(false)
      setSelectedCourse(null)
      setSyllabusContent("")
    } catch (err) {
      console.error('Failed to save syllabus:', err)
      setError('Failed to save syllabus. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  // Helper function to parse syllabus content
  const parseSyllabusContent = (content: string) => {
    const lines = content.split('\n')
    let description = ''
    let objectives = ''
    let currentSection = ''
    
    for (const line of lines) {
      if (line.startsWith('## Course Description')) {
        currentSection = 'description'
        continue
      } else if (line.startsWith('## Learning Outcomes')) {
        currentSection = 'objectives'
        continue
      } else if (line.startsWith('##')) {
        currentSection = ''
        continue
      }
      
      // Include all non-empty lines in the current section
      if (currentSection === 'description' && line.trim()) {
        description += line.trim() + '\n'
      } else if (currentSection === 'objectives' && line.trim()) {
        objectives += line.trim() + '\n'
      }
    }
    
    return {
      description: description.trim() || 'Course description not provided',
      objectives: objectives.trim() || 'Learning outcomes not specified'
    }
  }

  const handleCancelEdit = () => {
    setShowEditor(false)
    setSelectedCourse(null)
    setSyllabusContent("")
  }

  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Course Syllabi</h1>
          <p className="text-slate-600">Loading your courses...</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          <span className="ml-2 text-slate-600">Loading courses and syllabi...</span>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Course Syllabi</h1>
          <p className="text-slate-600">Manage your course syllabi</p>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="text-red-800">
              <p className="font-medium">Error loading data</p>
              <p className="text-sm mt-1">{error}</p>
              <Button 
                onClick={loadData} 
                variant="outline" 
                className="mt-3 border-red-300 text-red-700 hover:bg-red-100"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Course Syllabi</h1>
        <p className="text-slate-600">Manage your course syllabi</p>
      </div>

      {/* Error Display */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <p className="text-red-800 text-sm">{error}</p>
          </CardContent>
        </Card>
      )}

      {/* Main Content Area */}
      <div className="grid gap-6 lg:grid-cols-2">
        {/* Left Panel - Courses List */}
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-slate-900">Your Courses</h2>
          <div className="space-y-4">
            {courses.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <FileText className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                  <h3 className="font-medium text-slate-900 mb-1">No courses found</h3>
                  <p className="text-sm text-slate-600">You don't have any assigned courses for this academic year.</p>
                </CardContent>
              </Card>
            ) : (
              courses.map((course) => (
              <Card 
                key={course.id} 
                className={`hover:shadow-sm transition-shadow cursor-pointer ${
                  selectedCourse?.id === course.id ? 'ring-2 ring-blue-500 bg-blue-50' : ''
                }`}
              >
                <CardContent className="p-6">
                  <div className="flex items-center justify-between">
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded">
                          {course.code}
                        </span>
                        <span className="text-sm text-slate-500">
                          {syllabiService.getSemesterDisplayName(course.semesterType)} {course.academicYear}
                        </span>
                        <span className="text-sm text-slate-500">• {course.ects} ECTS</span>
                      </div>
                      <h3 className="font-medium text-slate-900">{course.name}</h3>
                      <div className="flex items-center gap-2">
                        <FileText className="h-4 w-4 text-slate-400" />
                        <span className="text-sm text-slate-500">
                          {course.syllabusExists ? "Syllabus exists" : "No syllabus"}
                        </span>
                      </div>
                    </div>
                    <Button
                      onClick={() => handleEditSyllabus(course)}
                      variant={course.syllabusExists ? "outline" : "default"}
                      size="sm"
                      className="gap-2"
                    >
                      {course.syllabusExists ? (
                        <>
                          <Edit3 className="h-4 w-4" />
                          Edit
                        </>
                      ) : (
                        <>
                          <Plus className="h-4 w-4" />
                          Create
                        </>
                      )}
                    </Button>
                  </div>
                </CardContent>
              </Card>
              ))
            )}
          </div>
        </div>

        {/* Right Panel - Syllabus Editor */}
        <div className="space-y-4">
          {showEditor && selectedCourse ? (
            <Card className="h-[calc(100vh-12rem)]">
              <CardHeader className="border-b">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="text-lg">Syllabus Editor</CardTitle>
                    <p className="text-sm text-slate-600">
                      {selectedCourse.name} ({selectedCourse.code})
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={handleCancelEdit}
                  >
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              </CardHeader>
              
              <CardContent className="p-6 h-full">
                <div className="h-full flex flex-col">
                  <label className="text-sm font-medium text-slate-700 mb-2">
                    Syllabus Content
                  </label>
                  <textarea
                    value={syllabusContent}
                    onChange={(e) => setSyllabusContent(e.target.value)}
                    className="flex-1 w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 font-mono text-sm resize-none"
                    placeholder="Enter syllabus content..."
                  />
                  <div className="flex justify-end gap-3 mt-4">
                    <Button variant="outline" onClick={handleCancelEdit}>
                      Cancel
                    </Button>
                    <Button 
                      onClick={handleSaveSyllabus} 
                      disabled={saving}
                      className="gap-2"
                    >
                      {saving ? (
                        <>
                          <Loader2 className="h-4 w-4 animate-spin" />
                          Saving...
                        </>
                      ) : (
                        <>
                          <Save className="h-4 w-4" />
                          Save
                        </>
                      )}
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="h-[calc(100vh-12rem)]">
              <CardContent className="p-8 text-center h-full flex flex-col justify-center">
                <FileText className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                <h3 className="font-medium text-slate-900 mb-2">Select a Course</h3>
                <p className="text-sm text-slate-500">
                  Choose a course from the left to view or edit its syllabus
                </p>
              </CardContent>
            </Card>
          )}
        </div>
      </div>
    </div>
  )
}
