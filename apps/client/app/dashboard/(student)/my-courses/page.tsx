"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, GraduationCap, Clock, User, Calendar, MapPin, Clock3, Users, FileText, BookMarked, Library, FileSpreadsheet } from "lucide-react"
import { coursesService, type Course } from "@/lib/courses.service"
import { syllabiService, type Syllabus, type SyllabusMaterial } from "@/lib/syllabi.service"

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)
  const [courseSyllabus, setCourseSyllabus] = useState<Syllabus | null>(null)
  const [syllabusLoading, setSyllabusLoading] = useState(false)

  useEffect(() => {
    const fetchCourses = async () => {
      try {
        const data = await coursesService.getEnrolledCourses()
        setCourses(data)
      } catch (err) {
        setError('Failed to load courses')
        console.error('Error fetching courses:', err)
      } finally {
        setLoading(false)
      }
    }

    fetchCourses()
  }, [])


  const handleDetailsClick = async (course: Course) => {
    setSelectedCourse(course)
    setShowDetailsDialog(true)
    
    // Fetch syllabus data for the selected course
    setSyllabusLoading(true)
    try {
      const subjectId = course.subjectId
      
      
      if (subjectId && !isNaN(subjectId) && subjectId > 0) {
        const syllabi = await syllabiService.getSyllabi({ subjectId: subjectId })
        
        if (syllabi && syllabi.length > 0) {
          setCourseSyllabus(syllabi[0]) // Use the first syllabus found
        } else {
          console.warn('📚 No syllabus found for this course')
          setCourseSyllabus(null)
        }
      } else {
        console.warn('❌ No valid subject ID found for course:', course.name, 'Subject ID:', subjectId)
        setCourseSyllabus(null)
      }
    } catch (error) {
      console.error('❌ Error fetching syllabus:', error)
      setCourseSyllabus(null)
    } finally {
      setSyllabusLoading(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-300"></div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="text-center">
          <p className="text-gray-600 mb-3">{error}</p>
          <Button variant="outline" size="sm" onClick={() => window.location.reload()}>
            Try Again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-medium text-gray-900">My Courses</h1>
        <p className="text-gray-500 mt-1">Manage your enrolled courses</p>
      </div>


      {/* Enrolled Courses */}
      <div>
        <div className="mb-4">
          <h2 className="text-lg font-medium text-gray-900">Enrolled Courses</h2>
        </div>
        
        {courses.length === 0 ? (
          <div className="text-center py-12">
            <BookOpen className="h-8 w-8 text-gray-400 mx-auto mb-3" />
            <p className="text-gray-500">No courses enrolled yet</p>
          </div>
        ) : (
          <div className="space-y-2">
            {courses.map((course) => (
              <Card key={course.id} className="border border-gray-200 bg-white hover:border-gray-300 transition-colors">
                <CardContent className="p-3">
                  <div className="flex items-center justify-between">
                  <div className="flex-1">
                      <div className="flex items-center space-x-2 mb-1">
                        <Badge variant="outline" className="text-xs font-normal">
                        {course.acronym}
                        </Badge>
                        <span className={`text-xs px-1.5 py-0.5 rounded-full ${
                          course.status === 'Active' 
                            ? 'bg-green-100 text-green-700' 
                            : 'bg-gray-100 text-gray-700'
                        }`}>
                        {course.status}
                      </span>
                    </div>
                    
                      <h3 className="font-medium text-gray-900 mb-2 text-sm">
                        {course.name}
                      </h3>

                      <div className="grid grid-cols-2 gap-3 text-xs text-gray-600">
                        <div className="flex items-center space-x-1.5">
                          <User className="h-3 w-3" />
                          <span>{course.professor || 'TBD'}</span>
                        </div>
                        <div className="flex items-center space-x-1.5">
                          <GraduationCap className="h-3 w-3" />
                          <span>{course.ects} ECTS</span>
                      </div>
                        <div className="flex items-center space-x-1.5">
                          <Calendar className="h-3 w-3" />
                        <span>{course.schedule}</span>
                      </div>
                        <div className="flex items-center space-x-1.5">
                          <MapPin className="h-3 w-3" />
                          <span>{course.room}</span>
                      </div>
                      </div>
                    </div>

                    <div className="flex flex-col space-y-1.5 ml-4">
                      <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-16 h-7 text-xs"
                        onClick={() => handleDetailsClick(course)}
                      >
                        Details
                      </Button>
                        </div>
                  </div>
                </CardContent>
              </Card>
            ))}
                      </div>
                    )}
                  </div>
                  
      {/* Course Details Dialog with Tabs */}
      <Dialog open={showDetailsDialog} onOpenChange={setShowDetailsDialog}>
        <DialogContent className="sm:max-w-2xl max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-gray-600" />
              <span>Course Details</span>
            </DialogTitle>
            <DialogDescription>
              {selectedCourse?.name} - Comprehensive course information
            </DialogDescription>
          </DialogHeader>
          
          {selectedCourse && (
            <Tabs defaultValue="info" className="w-full">
              <TabsList className="grid w-full grid-cols-3">
                <TabsTrigger value="info" className="flex items-center space-x-2">
                  <BookOpen className="h-4 w-4" />
                  <span>Course Info</span>
                </TabsTrigger>
                <TabsTrigger value="syllabus" className="flex items-center space-x-2">
                  <BookMarked className="h-4 w-4" />
                  <span>Syllabus</span>
                </TabsTrigger>
                <TabsTrigger value="materials" className="flex items-center space-x-2">
                  <Library className="h-4 w-4" />
                  <span>Materials</span>
                </TabsTrigger>
              </TabsList>

              {/* Course Info Tab */}
              <TabsContent value="info" className="space-y-4 mt-4">
                {/* Course Header */}
                <div className="flex items-center justify-between p-4 bg-gray-50 rounded-lg">
                  <div>
                    <h3 className="text-lg font-semibold text-gray-900">{selectedCourse.name}</h3>
                    <div className="flex items-center space-x-2 mt-1">
                      <Badge variant="outline" className="text-sm">
                        {selectedCourse.acronym}
                      </Badge>
                      <span className={`text-xs px-2 py-1 rounded-full ${
                        selectedCourse.status === 'Active' 
                          ? 'bg-green-100 text-green-700' 
                          : 'bg-gray-100 text-gray-700'
                      }`}>
                        {selectedCourse.status}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Course Information Grid */}
                <div className="grid grid-cols-1 gap-3">
                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <User className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-500">Professor</p>
                      <p className="text-sm font-medium text-gray-900">{selectedCourse.professor || 'TBD'}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <GraduationCap className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-500">ECTS Credits</p>
                      <p className="text-sm font-medium text-gray-900">{selectedCourse.ects} ECTS</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Calendar className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-500">Schedule</p>
                      <p className="text-sm font-medium text-gray-900">{selectedCourse.schedule}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <MapPin className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-500">Room</p>
                      <p className="text-sm font-medium text-gray-900">{selectedCourse.room}</p>
                    </div>
                  </div>

                  <div className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                    <Clock3 className="h-4 w-4 text-gray-600" />
                    <div>
                      <p className="text-xs text-gray-500">Semester</p>
                      <p className="text-sm font-medium text-gray-900">{selectedCourse.semester}</p>
                    </div>
                  </div>
                </div>
              </TabsContent>

              {/* Syllabus Tab */}
              <TabsContent value="syllabus" className="space-y-4 mt-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <BookMarked className="h-5 w-5 text-gray-600" />
                    <h4 className="text-lg font-medium text-gray-900">Course Syllabus</h4>
                  </div>
                  
                  {syllabusLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-300"></div>
                      <span className="ml-2 text-gray-600">Loading syllabus...</span>
                    </div>
                  ) : courseSyllabus ? (
                    <div className="space-y-3">
                      <div className="p-3 bg-white rounded-lg border border-gray-200">
                        <h5 className="font-medium text-gray-900 mb-2">Course Description</h5>
                        <p className="text-sm text-gray-600">
                          {courseSyllabus.description || 'No description available.'}
                        </p>
                      </div>

                      <div className="p-3 bg-white rounded-lg border border-gray-200">
                        <h5 className="font-medium text-gray-900 mb-2">Learning Objectives</h5>
                        <div className="text-sm text-gray-600 whitespace-pre-line">
                          {courseSyllabus.objectives || 'No objectives defined yet.'}
                        </div>
                      </div>

                      {courseSyllabus.topics && courseSyllabus.topics.length > 0 && (
                        <div className="p-3 bg-white rounded-lg border border-gray-200">
                          <h5 className="font-medium text-gray-900 mb-2">Course Topics</h5>
                          <div className="space-y-2">
                            {courseSyllabus.topics.map((topic, index) => (
                              <div key={topic.id || index} className="border-l-2 border-blue-200 pl-3">
                                <p className="font-medium text-sm text-gray-900">{topic.title}</p>
                                {topic.description && (
                                  <p className="text-xs text-gray-600 mt-1">{topic.description}</p>
                                )}
                                {topic.weekNumber && (
                                  <span className="text-xs text-blue-600">Week {topic.weekNumber}</span>
                                )}
                              </div>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <BookMarked className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                      <p>No syllabus available for this course</p>
                    </div>
                  )}
                </div>
              </TabsContent>

              {/* Course Materials Tab */}
              <TabsContent value="materials" className="space-y-4 mt-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <Library className="h-5 w-5 text-gray-600" />
                    <h4 className="text-lg font-medium text-gray-900">Course Materials</h4>
                  </div>
                  
                  {syllabusLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-300"></div>
                      <span className="ml-2 text-gray-600">Loading materials...</span>
                    </div>
                  ) : courseSyllabus && courseSyllabus.materials && courseSyllabus.materials.length > 0 ? (
                    <div className="space-y-3">
                      {courseSyllabus.materials.map((material, index) => (
                        <div key={material.id || index} className="p-3 bg-white rounded-lg border border-gray-200">
                          <div className="flex items-center justify-between">
                            <div className="flex items-center space-x-3">
                              <FileText className="h-5 w-5 text-blue-600" />
                              <div>
                                <h5 className="font-medium text-gray-900">{material.title}</h5>
                                <p className="text-sm text-gray-600">{material.description}</p>
                                {material.fileSize && (
                                  <p className="text-xs text-gray-500">
                                    Size: {(material.fileSize / 1024).toFixed(1)} KB
                                  </p>
                                )}
                              </div>
                            </div>
                            {material.fileUrl ? (
                              <Button 
                                size="sm" 
                                variant="outline"
                                onClick={() => window.open(material.fileUrl, '_blank')}
                              >
                                Download
                              </Button>
                            ) : (
                              <Button size="sm" variant="outline" disabled>
                                Unavailable
                              </Button>
                            )}
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-8 text-gray-500">
                      <Library className="h-12 w-12 text-gray-300 mx-auto mb-2" />
                      <p>No materials available for this course</p>
                    </div>
                  )}
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
