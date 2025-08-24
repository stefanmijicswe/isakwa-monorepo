"use client"

import * as React from "react"
import { User, BookOpen, Award, Calendar, Users, X, GraduationCap } from "lucide-react"

export default function TeachingCoursesPage() {
  const [showStudentModal, setShowStudentModal] = React.useState(false)
  const [selectedCourse, setSelectedCourse] = React.useState<any>(null)

  const teachingCourses = [
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
  ]

  const getSemesterColor = (semester: string) => {
    return semester === "Winter" 
      ? "bg-blue-100 text-blue-800" 
      : "bg-orange-100 text-orange-800"
  }

  const getStatusColor = (status: string) => {
    return status === "Active" 
      ? "bg-green-100 text-green-800" 
      : "bg-slate-100 text-slate-800"
  }

  const handleCourseClick = (course: any) => {
    setSelectedCourse(course)
    setShowStudentModal(true)
  }

  const closeModal = () => {
    setShowStudentModal(false)
    setSelectedCourse(null)
  }

  const totalStudents = teachingCourses.reduce((sum, course) => sum + course.studentsEnrolled, 0)
  const totalEcts = teachingCourses.reduce((sum, course) => sum + course.ects, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Teaching Courses</h1>
        <p className="text-slate-600">Manage courses you are currently teaching</p>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{teachingCourses.length}</div>
            <div className="text-sm text-slate-600">Active Courses</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{totalStudents}</div>
            <div className="text-sm text-slate-600">Total Students</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{totalEcts}</div>
            <div className="text-sm text-slate-600">Total ECTS</div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Current Teaching Load</h2>
          <p className="text-sm text-slate-600 mt-1">Click on a course to view enrolled students</p>
        </div>
        
        <div className="divide-y divide-slate-200">
          {teachingCourses.map((course) => (
            <div 
              key={course.id} 
              className="p-6 hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => handleCourseClick(course)}
            >
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                      {course.acronym}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getSemesterColor(course.semester)}`}>
                      {course.semester} Semester
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(course.status)}`}>
                      {course.status}
                    </span>
                  </div>
                  <h3 className="font-medium text-slate-900 text-lg mb-1">{course.name}</h3>
                  <p className="text-sm text-slate-600">{course.ects} ECTS</p>
                </div>
                <div className="text-right">
                  <div className="text-2xl font-bold text-slate-900">{course.studentsEnrolled}</div>
                  <div className="text-xs text-slate-500">Students</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showStudentModal && selectedCourse && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] mx-4 flex flex-col">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Enrolled Students</h3>
                <p className="text-sm text-slate-600">{selectedCourse.name} ({selectedCourse.acronym}) • {selectedCourse.studentsEnrolled} students</p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {selectedCourse.students.map((student: any) => (
                  <div key={student.id} className="bg-slate-50 p-4 rounded-lg border border-slate-200">
                    <div className="flex items-center gap-3 mb-3">
                      <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                        <span className="text-slate-600 font-medium">{student.name.split(' ').map((n: string) => n[0]).join('')}</span>
                      </div>
                      <div className="flex-1">
                        <h4 className="font-medium text-slate-900">{student.name}</h4>
                        <p className="text-xs text-slate-600">{student.email}</p>
                      </div>
                    </div>
                    
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-600">Student ID:</span>
                        <span className="font-medium">{student.id}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Year:</span>
                        <span className="font-medium">{student.year}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Status:</span>
                        <span className={`px-2 py-1 text-xs rounded-full ${getStatusColor(student.status)}`}>
                          {student.status}
                        </span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-600">Avg Grade:</span>
                        <span className="font-medium">{student.averageGrade}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
