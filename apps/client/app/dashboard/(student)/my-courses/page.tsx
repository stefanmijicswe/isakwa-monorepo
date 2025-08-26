"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { BookOpen, GraduationCap, Clock, User, Calendar, MapPin, Clock3, Users, FileText, BookMarked, Library, FileSpreadsheet } from "lucide-react"
import { coursesService, type Course } from "@/lib/courses.service"

export default function MyCoursesPage() {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedCourse, setSelectedCourse] = useState<Course | null>(null)
  const [showDetailsDialog, setShowDetailsDialog] = useState(false)

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

  const totalCourses = courses.length
  const activeCourses = courses.filter(course => course.status === 'Active').length
  const totalEcts = courses.reduce((sum, course) => sum + course.ects, 0)
  const averageGrade = courses.length > 0 
    ? (courses.reduce((sum, course) => sum + (course.grade || 0), 0) / courses.length).toFixed(1)
    : '0.0'

  const handleDetailsClick = (course: Course) => {
    setSelectedCourse(course)
    setShowDetailsDialog(true)
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

      {/* Summary Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <div className="text-center">
          <div className="text-3xl font-semibold text-gray-900">{totalCourses}</div>
          <div className="text-sm text-gray-500 mt-1">Total Courses</div>
        </div>
          <div className="text-center">
          <div className="text-3xl font-semibold text-gray-900">{activeCourses}</div>
          <div className="text-sm text-gray-500 mt-1">Active Courses</div>
        </div>
          <div className="text-center">
          <div className="text-3xl font-semibold text-gray-900">{totalEcts}</div>
          <div className="text-sm text-gray-500 mt-1">Total ECTS</div>
        </div>
          <div className="text-center">
          <div className="text-3xl font-semibold text-gray-900">{averageGrade}</div>
          <div className="text-sm text-gray-500 mt-1">Average Grade</div>
        </div>
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
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                      <h5 className="font-medium text-gray-900 mb-2">Course Objectives</h5>
                      <p className="text-sm text-gray-600">
                        This course provides fundamental knowledge and practical skills in programming concepts, 
                        algorithms, and software development methodologies.
                      </p>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                      <h5 className="font-medium text-gray-900 mb-2">Learning Outcomes</h5>
                      <ul className="text-sm text-gray-600 space-y-1">
                        <li>• Understand basic programming concepts and syntax</li>
                        <li>• Develop problem-solving skills through coding exercises</li>
                        <li>• Learn software development best practices</li>
                        <li>• Gain hands-on experience with real-world projects</li>
                      </ul>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                      <h5 className="font-medium text-gray-900 mb-2">Assessment Methods</h5>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>• Final Exam: 60%</p>
                        <p>• Assignments: 25%</p>
                        <p>• Participation: 15%</p>
                      </div>
                  </div>
                </div>
              </div>
              </TabsContent>

              {/* Course Materials Tab */}
              <TabsContent value="materials" className="space-y-4 mt-4">
                <div className="p-4 bg-gray-50 rounded-lg">
                  <div className="flex items-center space-x-2 mb-3">
                    <Library className="h-5 w-5 text-gray-600" />
                    <h4 className="text-lg font-medium text-gray-900">Course Materials</h4>
                  </div>
                  
                  <div className="space-y-3">
                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileText className="h-5 w-5 text-blue-600" />
                          <div>
                            <h5 className="font-medium text-gray-900">Course Notes</h5>
                            <p className="text-sm text-gray-600">Comprehensive lecture notes and slides</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">Download</Button>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <FileSpreadsheet className="h-5 w-5 text-green-600" />
                          <div>
                            <h5 className="font-medium text-gray-900">Practice Exercises</h5>
                            <p className="text-sm text-gray-600">Weekly programming assignments</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">View</Button>
                      </div>
                    </div>

                    <div className="p-3 bg-white rounded-lg border border-gray-200">
                      <div className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <BookOpen className="h-5 w-5 text-purple-600" />
                          <div>
                            <h5 className="font-medium text-gray-900">Reading List</h5>
                            <p className="text-sm text-gray-600">Recommended textbooks and resources</p>
                          </div>
                        </div>
                        <Button size="sm" variant="outline">Browse</Button>
                      </div>
          </div>
      </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
