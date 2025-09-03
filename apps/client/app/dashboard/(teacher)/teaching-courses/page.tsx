"use client"

import * as React from "react"
import { BookOpen, GraduationCap, Calendar, Users, Star, Pin, PinOff, Eye } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { Badge } from "@/components/ui/badge"
import { Button } from "@/components/ui/button"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip"

interface Student {
  id: string
  name: string
  email: string
  year: number
  status: string
  averageGrade: number
}

interface Course {
  id: number
  name: string
  acronym: string
  ects: number
  semester: string
  studentsEnrolled: number
  status: string
  students: Student[]
}

export default function TeachingCoursesPage() {
  const [showStudentModal, setShowStudentModal] = React.useState(false)
  const [showCourseDetailsModal, setShowCourseDetailsModal] = React.useState(false)
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null)
  const [pinnedCourses, setPinnedCourses] = React.useState<Set<number>>(() => {
    // Load pinned courses from localStorage on component mount
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('pinned-courses')
      return saved ? new Set(JSON.parse(saved)) : new Set()
    }
    return new Set()
  })

  const teachingCourses: Course[] = React.useMemo(() => [
    {
      id: 1,
      name: "Introduction to Information Technologies",
      acronym: "IT101",
      ects: 6,
      semester: "Winter",
      studentsEnrolled: 45,
      status: "Active",
      students: [
        { id: "2021001", name: "John Doe", email: "john.doe@student.edu", year: 1, status: "Active", averageGrade: 8.5 },
        { id: "2021002", name: "Jane Smith", email: "jane.smith@student.edu", year: 1, status: "Active", averageGrade: 9.2 },
        { id: "2021003", name: "Mike Johnson", email: "mike.johnson@student.edu", year: 1, status: "Active", averageGrade: 7.8 },
        { id: "2021004", name: "Sarah Wilson", email: "sarah.wilson@student.edu", year: 1, status: "Active", averageGrade: 8.9 },
        { id: "2021005", name: "David Brown", email: "david.brown@student.edu", year: 1, status: "Active", averageGrade: 8.1 },
        { id: "2021006", name: "Emily Davis", email: "emily.davis@student.edu", year: 1, status: "Active", averageGrade: 9.0 },
        { id: "2021007", name: "Robert Miller", email: "robert.miller@student.edu", year: 1, status: "Active", averageGrade: 7.9 },
        { id: "2021008", name: "Lisa Garcia", email: "lisa.garcia@student.edu", year: 1, status: "Active", averageGrade: 8.7 },
        { id: "2021009", name: "James Rodriguez", email: "james.rodriguez@student.edu", year: 1, status: "Active", averageGrade: 8.3 },
        { id: "2021010", name: "Maria Martinez", email: "maria.martinez@student.edu", year: 1, status: "Active", averageGrade: 8.6 }
      ]
    },
    {
      id: 2,
      name: "Programming Fundamentals",
      acronym: "PF102",
      ects: 6,
      semester: "Winter",
      studentsEnrolled: 38,
      status: "Active",
      students: [
        { id: "2021001", name: "John Doe", email: "john.doe@student.edu", year: 1, status: "Active", averageGrade: 8.5 },
        { id: "2021002", name: "Jane Smith", email: "jane.smith@student.edu", year: 1, status: "Active", averageGrade: 9.2 },
        { id: "2021003", name: "Mike Johnson", email: "mike.johnson@student.edu", year: 1, status: "Active", averageGrade: 7.8 },
        { id: "2021004", name: "Sarah Wilson", email: "sarah.wilson@student.edu", year: 1, status: "Active", averageGrade: 8.9 },
        { id: "2021005", name: "David Brown", email: "david.brown@student.edu", year: 1, status: "Active", averageGrade: 8.1 },
        { id: "2021006", name: "Emily Davis", email: "emily.davis@student.edu", year: 1, status: "Active", averageGrade: 9.0 },
        { id: "2021007", name: "Robert Miller", email: "robert.miller@student.edu", year: 1, status: "Active", averageGrade: 7.9 },
        { id: "2021008", name: "Lisa Garcia", email: "lisa.garcia@student.edu", year: 1, status: "Active", averageGrade: 8.7 }
      ]
    },
    {
      id: 3,
      name: "Web Technologies",
      acronym: "WT202",
      ects: 6,
      semester: "Summer",
      studentsEnrolled: 32,
      status: "Active",
      students: [
        { id: "2021001", name: "John Doe", email: "john.doe@student.edu", year: 2, status: "Active", averageGrade: 8.5 },
        { id: "2021002", name: "Jane Smith", email: "jane.smith@student.edu", year: 2, status: "Active", averageGrade: 9.2 },
        { id: "2021003", name: "Mike Johnson", email: "mike.johnson@student.edu", year: 2, status: "Active", averageGrade: 7.8 },
        { id: "2021004", name: "Sarah Wilson", email: "sarah.wilson@student.edu", year: 2, status: "Active", averageGrade: 8.9 },
        { id: "2021005", name: "David Brown", email: "david.brown@student.edu", year: 2, status: "Active", averageGrade: 8.1 },
        { id: "2021006", name: "Emily Davis", email: "emily.davis@student.edu", year: 2, status: "Active", averageGrade: 9.0 },
        { id: "2021007", name: "Robert Miller", email: "robert.miller@student.edu", year: 2, status: "Active", averageGrade: 7.9 },
        { id: "2021008", name: "Lisa Garcia", email: "lisa.garcia@student.edu", year: 2, status: "Active", averageGrade: 8.7 }
      ]
    },
    {
      id: 4,
      name: "Database Systems",
      acronym: "DB203",
      ects: 6,
      semester: "Summer",
      studentsEnrolled: 28,
      status: "Active",
      students: [
        { id: "2021001", name: "John Doe", email: "john.doe@student.edu", year: 2, status: "Active", averageGrade: 8.5 },
        { id: "2021002", name: "Jane Smith", email: "jane.smith@student.edu", year: 2, status: "Active", averageGrade: 9.2 },
        { id: "2021003", name: "Mike Johnson", email: "mike.johnson@student.edu", year: 2, status: "Active", averageGrade: 7.8 },
        { id: "2021004", name: "Sarah Wilson", email: "sarah.wilson@student.edu", year: 2, status: "Active", averageGrade: 8.9 },
        { id: "2021005", name: "David Brown", email: "david.brown@student.edu", year: 2, status: "Active", averageGrade: 8.1 },
        { id: "2021006", name: "Emily Davis", email: "emily.davis@student.edu", year: 2, status: "Active", averageGrade: 9.0 },
        { id: "2021007", name: "Robert Miller", email: "robert.miller@student.edu", year: 2, status: "Active", averageGrade: 7.9 }
      ]
    },
    {
      id: 5,
      name: "Software Engineering Basics",
      acronym: "SE205",
      ects: 6,
      semester: "Winter",
      studentsEnrolled: 25,
      status: "Active",
      students: [
        { id: "2021001", name: "John Doe", email: "john.doe@student.edu", year: 2, status: "Active", averageGrade: 8.5 },
        { id: "2021002", name: "Jane Smith", email: "jane.smith@student.edu", year: 2, status: "Active", averageGrade: 9.2 },
        { id: "2021003", name: "Mike Johnson", email: "mike.johnson@student.edu", year: 2, status: "Active", averageGrade: 7.8 },
        { id: "2021004", name: "Sarah Wilson", email: "sarah.wilson@student.edu", year: 2, status: "Active", averageGrade: 8.9 },
        { id: "2021005", name: "David Brown", email: "david.brown@student.edu", year: 2, status: "Active", averageGrade: 8.1 }
      ]
    },
    {
      id: 6,
      name: "Object-Oriented Programming",
      acronym: "OOP301",
      ects: 6,
      semester: "Winter",
      studentsEnrolled: 42,
      status: "Active",
      students: [
        { id: "2021001", name: "John Doe", email: "john.doe@student.edu", year: 3, status: "Active", averageGrade: 8.5 },
        { id: "2021002", name: "Jane Smith", email: "jane.smith@student.edu", year: 3, status: "Active", averageGrade: 9.2 },
        { id: "2021003", name: "Mike Johnson", email: "mike.johnson@student.edu", year: 3, status: "Active", averageGrade: 7.8 },
        { id: "2021004", name: "Sarah Wilson", email: "sarah.wilson@student.edu", year: 3, status: "Active", averageGrade: 8.9 },
        { id: "2021005", name: "David Brown", email: "david.brown@student.edu", year: 3, status: "Active", averageGrade: 8.1 },
        { id: "2021006", name: "Emily Davis", email: "emily.davis@student.edu", year: 3, status: "Active", averageGrade: 9.0 },
        { id: "2021007", name: "Robert Miller", email: "robert.miller@student.edu", year: 3, status: "Active", averageGrade: 7.9 },
        { id: "2021008", name: "Lisa Garcia", email: "lisa.garcia@student.edu", year: 3, status: "Active", averageGrade: 8.7 },
        { id: "2021009", name: "James Rodriguez", email: "james.rodriguez@student.edu", year: 3, status: "Active", averageGrade: 8.3 },
        { id: "2021010", name: "Maria Martinez", email: "maria.martinez@student.edu", year: 3, status: "Active", averageGrade: 8.6 }
      ]
    },
    {
      id: 7,
      name: "Computer Networks",
      acronym: "CN204",
      ects: 6,
      semester: "Summer",
      studentsEnrolled: 35,
      status: "Active",
      students: [
        { id: "2021001", name: "John Doe", email: "john.doe@student.edu", year: 2, status: "Active", averageGrade: 8.5 },
        { id: "2021002", name: "Jane Smith", email: "jane.smith@student.edu", year: 2, status: "Active", averageGrade: 9.2 },
        { id: "2021003", name: "Mike Johnson", email: "mike.johnson@student.edu", year: 2, status: "Active", averageGrade: 7.8 },
        { id: "2021004", name: "Sarah Wilson", email: "sarah.wilson@student.edu", year: 2, status: "Active", averageGrade: 8.9 },
        { id: "2021005", name: "David Brown", email: "david.brown@student.edu", year: 2, status: "Active", averageGrade: 8.1 },
        { id: "2021006", name: "Emily Davis", email: "emily.davis@student.edu", year: 2, status: "Active", averageGrade: 9.0 },
        { id: "2021007", name: "Robert Miller", email: "robert.miller@student.edu", year: 2, status: "Active", averageGrade: 7.9 },
        { id: "2021008", name: "Lisa Garcia", email: "lisa.garcia@student.edu", year: 2, status: "Active", averageGrade: 8.7 },
        { id: "2021009", name: "James Rodriguez", email: "james.rodriguez@student.edu", year: 2, status: "Active", averageGrade: 8.3 }
      ]
    },
    {
      id: 8,
      name: "Information Security",
      acronym: "IS303",
      ects: 6,
      semester: "Summer",
      studentsEnrolled: 30,
      status: "Active",
      students: [
        { id: "2021001", name: "John Doe", email: "john.doe@student.edu", year: 3, status: "Active", averageGrade: 8.5 },
        { id: "2021002", name: "Jane Smith", email: "jane.smith@student.edu", year: 3, status: "Active", averageGrade: 9.2 },
        { id: "2021003", name: "Mike Johnson", email: "mike.johnson@student.edu", year: 3, status: "Active", averageGrade: 7.8 },
        { id: "2021004", name: "Sarah Wilson", email: "sarah.wilson@student.edu", year: 3, status: "Active", averageGrade: 8.9 },
        { id: "2021005", name: "David Brown", email: "david.brown@student.edu", year: 3, status: "Active", averageGrade: 8.1 },
        { id: "2021006", name: "Emily Davis", email: "emily.davis@student.edu", year: 3, status: "Active", averageGrade: 9.0 },
        { id: "2021007", name: "Robert Miller", email: "robert.miller@student.edu", year: 3, status: "Active", averageGrade: 7.9 },
        { id: "2021008", name: "Lisa Garcia", email: "lisa.garcia@student.edu", year: 3, status: "Active", averageGrade: 8.7 },
        { id: "2021009", name: "James Rodriguez", email: "james.rodriguez@student.edu", year: 3, status: "Active", averageGrade: 8.3 },
        { id: "2021010", name: "Maria Martinez", email: "maria.martinez@student.edu", year: 3, status: "Active", averageGrade: 8.6 }
      ]
    }
  ], [])



  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course)
    setShowCourseDetailsModal(true)
  }



  const togglePinCourse = (courseId: number) => {
    setPinnedCourses(prev => {
      const newSet = new Set(prev)
      if (newSet.has(courseId)) {
        newSet.delete(courseId)
      } else {
        newSet.add(courseId)
      }
      return newSet
    })
  }

  const handleViewStudents = (course: Course) => {
    setSelectedCourse(course)
    setShowStudentModal(true)
  }

  // Save pinned courses to localStorage whenever they change
  React.useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('pinned-courses', JSON.stringify([...pinnedCourses]))
    }
  }, [pinnedCourses])

  // Sort courses: pinned first, then by name
  const sortedCourses = React.useMemo(() => {
    return [...teachingCourses].sort((a, b) => {
      const aPinned = pinnedCourses.has(a.id)
      const bPinned = pinnedCourses.has(b.id)
      
      if (aPinned && !bPinned) return -1
      if (!aPinned && bPinned) return 1
      
      return a.name.localeCompare(b.name)
    })
  }, [teachingCourses, pinnedCourses])

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="space-y-4">
        <div className="space-y-2">
          <h1 className="text-2xl font-semibold tracking-tight">Teaching Courses</h1>
          <p className="text-muted-foreground">
            Manage and track your current teaching assignments
          </p>
        </div>
        
        {/* Pinned Courses Summary */}
        {pinnedCourses.size > 0 && (
          <div className="flex items-center gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg">
            <Pin className="h-4 w-4 text-blue-600" />
            <span className="text-sm text-blue-800">
              <strong>{pinnedCourses.size}</strong> course{pinnedCourses.size === 1 ? '' : 's'} pinned
            </span>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setPinnedCourses(new Set())}
              className="h-6 px-2 text-xs text-blue-600 hover:bg-blue-100 ml-auto"
            >
              Unpin All
            </Button>
          </div>
        )}
      </div>

      {/* Courses Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {sortedCourses.map((course) => {
          const isPinned = pinnedCourses.has(course.id)
          return (
            <Card 
              key={course.id} 
              className={`group transition-all hover:shadow-md hover:border-gray-300 ${
                isPinned ? 'ring-2 ring-blue-200 bg-blue-50/30' : ''
              }`}
            >
              <CardContent className="p-6 space-y-4">
                {/* Course Header with Pin Button */}
                <div className="flex items-start justify-between">
                  <div className="space-y-1 flex-1">
                    <div className="flex items-center gap-2">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <Badge variant="secondary" className="text-xs font-mono">
                        {course.acronym}
                      </Badge>
                      {isPinned && (
                        <Badge variant="default" className="text-xs bg-blue-100 text-blue-800">
                          <Pin className="h-3 w-3 mr-1" />
                          Pinned
                        </Badge>
                      )}
                    </div>
                    <h3 className="font-medium leading-tight">
                      {course.name}
                    </h3>
                  </div>
                  
                  {/* Pin Toggle Button */}
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            togglePinCourse(course.id)
                          }}
                          className="h-8 w-8 p-0 hover:bg-blue-100 hover:text-blue-700"
                        >
                          {isPinned ? (
                            <PinOff className="h-4 w-4 text-blue-600" />
                          ) : (
                            <Pin className="h-4 w-4 text-muted-foreground" />
                          )}
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        {isPinned ? 'Unpin course' : 'Pin course'}
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>

                {/* Course Details */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-sm">
                    <div className="flex items-center gap-2 text-muted-foreground">
                      <Calendar className="h-3 w-3" />
                      <span>{course.semester} Semester</span>
                    </div>
                    <Badge 
                      variant={course.status === 'Active' ? 'default' : 'secondary'}
                      className="text-xs"
                    >
                      {course.status}
                    </Badge>
                  </div>

                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-3 w-3" />
                      <span>{course.studentsEnrolled} students</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Star className="h-3 w-3" />
                      <span>{course.ects} ECTS</span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="flex gap-2 pt-2">
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleViewStudents(course)
                          }}
                          className="flex-1 text-xs"
                        >
                          <Eye className="h-3 w-3 mr-1" />
                          View Students
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        View list of enrolled students
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                  
                  <TooltipProvider>
                    <Tooltip>
                      <TooltipTrigger asChild>
                        <Button
                          variant="default"
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation()
                            handleCourseClick(course)
                          }}
                          className="flex-1 text-xs"
                        >
                          Course Details
                        </Button>
                      </TooltipTrigger>
                      <TooltipContent>
                        View detailed course information
                      </TooltipContent>
                    </Tooltip>
                  </TooltipProvider>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Student Details Dialog */}
      <Dialog open={showStudentModal} onOpenChange={setShowStudentModal}>
        <DialogContent className="max-w-[90vw] w-[90vw] h-auto max-h-[85vh] p-6 my-8">
          <DialogHeader className="pb-6">
            <DialogTitle className="flex items-center gap-3">
              <GraduationCap className="h-6 w-6" />
              <div>
                <div className="text-xl">Enrolled Students</div>
                <div className="text-sm font-normal text-muted-foreground">
                  {selectedCourse?.name} ({selectedCourse?.acronym}) • {selectedCourse?.studentsEnrolled} students
                </div>
              </div>
            </DialogTitle>
          </DialogHeader>
          
          <div className="w-full overflow-auto max-h-[65vh]">
            <div className="border rounded-lg bg-white shadow-sm">
              <table className="w-full table-fixed">
                <thead className="bg-gray-50 border-b sticky top-0">
                  <tr>
                    <th className="w-2/5 px-3 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="w-1/5 px-2 py-3 text-left text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Student ID
                    </th>
                    <th className="w-1/12 px-2 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Year
                    </th>
                    <th className="w-1/6 px-2 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="w-1/6 px-2 py-3 text-center text-xs font-semibold text-gray-700 uppercase tracking-wider">
                      Grade
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-100">
                  {selectedCourse?.students.map((student: Student) => (
                    <tr key={student.id} className="hover:bg-gray-50 transition-colors">
                      <td className="w-2/5 px-3 py-3">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-100 to-blue-200 flex items-center justify-center mr-2 flex-shrink-0 shadow-sm">
                            <span className="text-blue-700 font-semibold text-xs">
                              {student.name.split(' ').map((n: string) => n[0]).join('')}
                            </span>
                          </div>
                          <div className="min-w-0 flex-1">
                            <div className="text-sm font-semibold text-gray-900 truncate">{student.name}</div>
                            <div className="text-xs text-gray-600 truncate">{student.email}</div>
                          </div>
                        </div>
                      </td>
                      <td className="w-1/5 px-2 py-3 text-sm text-gray-900 font-mono font-medium">
                        {student.id}
                      </td>
                      <td className="w-1/12 px-2 py-3 text-sm text-gray-900 font-semibold text-center">
                        {student.year}
                      </td>
                      <td className="w-1/6 px-2 py-3 text-center">
                        <Badge 
                          variant={student.status === 'Active' ? 'default' : 'secondary'}
                          className="text-xs h-auto py-1 px-2 font-medium"
                        >
                          {student.status}
                        </Badge>
                      </td>
                      <td className="w-1/6 px-2 py-3 text-sm text-gray-900 font-bold text-center">
                        {student.averageGrade}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </DialogContent>
      </Dialog>

       {/* Course Details Dialog */}
       <Dialog open={showCourseDetailsModal} onOpenChange={setShowCourseDetailsModal}>
         <DialogContent className="max-w-4xl max-h-[80vh] p-6">
           <DialogHeader>
             <DialogTitle className="flex items-center gap-3">
               <BookOpen className="h-5 w-5" />
               <div>
                 <div className="text-lg">Course Details</div>
                 <div className="text-sm font-normal text-muted-foreground">
                   {selectedCourse?.name} ({selectedCourse?.acronym})
                 </div>
               </div>
             </DialogTitle>
           </DialogHeader>
           
           <div className="space-y-6">
             {/* Course Overview */}
             <div className="grid grid-cols-2 gap-6">
               <div className="space-y-4">
                 <div className="bg-gray-50 p-4 rounded-lg">
                   <h3 className="font-semibold text-gray-900 mb-3">Basic Information</h3>
                   <div className="space-y-2">
                     <div className="flex justify-between">
                       <span className="text-gray-600">Course Name:</span>
                       <span className="font-medium">{selectedCourse?.name}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-gray-600">Acronym:</span>
                       <span className="font-mono font-medium">{selectedCourse?.acronym}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-gray-600">ECTS Credits:</span>
                       <span className="font-medium">{selectedCourse?.ects}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-gray-600">Semester:</span>
                       <span className="font-medium">{selectedCourse?.semester}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-gray-600">Status:</span>
                       <Badge variant={selectedCourse?.status === 'Active' ? 'default' : 'secondary'}>
                         {selectedCourse?.status}
                       </Badge>
                     </div>
                   </div>
                 </div>
               </div>
               
               <div className="space-y-4">
                 <div className="bg-blue-50 p-4 rounded-lg">
                   <h3 className="font-semibold text-blue-900 mb-3">Enrollment Statistics</h3>
                   <div className="space-y-2">
                     <div className="flex justify-between">
                       <span className="text-blue-700">Total Students:</span>
                       <span className="font-bold text-blue-900">{selectedCourse?.studentsEnrolled}</span>
                     </div>
                     <div className="flex justify-between">
                       <span className="text-blue-700">Course ID:</span>
                       <span className="font-mono font-medium text-blue-900">{selectedCourse?.id}</span>
                     </div>
                   </div>
                 </div>
                 
                 <div className="bg-green-50 p-4 rounded-lg">
                   <h3 className="font-semibold text-green-900 mb-3">Quick Actions</h3>
                   <div className="space-y-2">
                     <Button
                       variant="outline"
                       size="sm"
                       onClick={() => {
                         setShowCourseDetailsModal(false)
                         handleViewStudents(selectedCourse!)
                       }}
                       className="w-full"
                     >
                       <Users className="h-4 w-4 mr-2" />
                       View Students List
                     </Button>
                   </div>
                 </div>
               </div>
             </div>
             
             
           </div>
         </DialogContent>
       </Dialog>
     </div>
   )
 }
