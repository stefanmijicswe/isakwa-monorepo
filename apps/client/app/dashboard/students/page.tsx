"use client"

import * as React from "react"
import { User, BookOpen, Award, AlertTriangle, FileText, GraduationCap, X } from "lucide-react"

export default function StudentsPage() {
  const [selectedStudent, setSelectedStudent] = React.useState<any>(null)
  const [showStudentModal, setShowStudentModal] = React.useState(false)

  const students = [
    {
      id: "2021001",
      name: "John Doe",
      year: 2,
      program: "Computer Science",
      status: "Active",
      averageGrade: 8.5,
      currentEcts: 78,
      enrollmentYears: {
        year1: 1,
        year2: 1,
        year3: 0,
        year4: 0
      },
      passedCourses: [
        { name: "Introduction to IT", grade: 9, points: 85, ects: 6 },
        { name: "Programming Fundamentals", grade: 8, points: 78, ects: 6 },
        { name: "Mathematics for IT", grade: 9, points: 88, ects: 6 },
        { name: "Computer Architecture", grade: 7, points: 72, ects: 6 },
        { name: "Digital Logic Design", grade: 8, points: 79, ects: 6 },
        { name: "Data Structures", grade: 9, points: 86, ects: 6 },
        { name: "Web Technologies", grade: 8, points: 81, ects: 6 },
        { name: "Database Systems", grade: 9, points: 87, ects: 6 },
        { name: "Computer Networks", grade: 7, points: 73, ects: 6 },
        { name: "Software Engineering", grade: 8, points: 76, ects: 6 },
        { name: "Object-Oriented Programming", grade: 9, points: 89, ects: 6 },
        { name: "Operating Systems", grade: 8, points: 82, ects: 6 },
        { name: "Information Security", grade: 9, points: 91, ects: 6 }
      ],
      failedExams: [
        { name: "Advanced Algorithms", grade: 5, points: 48, ects: 6, attempts: 2 },
        { name: "Machine Learning", grade: 5, points: 45, ects: 6, attempts: 1 }
      ],
      misdemeanors: [
        { date: "2024-06-15", course: "Advanced Algorithms", description: "Unauthorized use of calculator during exam", severity: "Minor" }
      ],
      registeredExams: [
        { name: "Advanced Algorithms", term: "January 2025", status: "Registered" },
        { name: "Machine Learning", term: "January 2025", status: "Registered" }
      ],
      hasAllCoursesPassed: false
    },
    {
      id: "2021002",
      name: "Jane Smith",
      year: 3,
      program: "Computer Science",
      status: "Active",
      averageGrade: 9.2,
      currentEcts: 120,
      enrollmentYears: {
        year1: 1,
        year2: 1,
        year3: 1,
        year4: 0
      },
      passedCourses: [
        { name: "Introduction to IT", grade: 10, points: 95, ects: 6 },
        { name: "Programming Fundamentals", grade: 9, points: 88, ects: 6 },
        { name: "Mathematics for IT", grade: 10, points: 92, ects: 6 },
        { name: "Computer Architecture", grade: 9, points: 85, ects: 6 },
        { name: "Digital Logic Design", grade: 9, points: 87, ects: 6 },
        { name: "Data Structures", grade: 10, points: 93, ects: 6 },
        { name: "Web Technologies", grade: 9, points: 89, ects: 6 },
        { name: "Database Systems", grade: 10, points: 91, ects: 6 },
        { name: "Computer Networks", grade: 9, points: 86, ects: 6 },
        { name: "Software Engineering", grade: 9, points: 88, ects: 6 },
        { name: "Object-Oriented Programming", grade: 10, points: 94, ects: 6 },
        { name: "Operating Systems", grade: 9, points: 87, ects: 6 },
        { name: "Information Security", grade: 10, points: 96, ects: 6 },
        { name: "Advanced Algorithms", grade: 9, points: 89, ects: 6 },
        { name: "Machine Learning", grade: 9, points: 91, ects: 6 },
        { name: "Big Data Technologies", grade: 10, points: 93, ects: 6 },
        { name: "Cloud Computing", grade: 9, points: 88, ects: 6 },
        { name: "Cybersecurity", grade: 10, points: 95, ects: 6 },
        { name: "Software Project Management", grade: 9, points: 87, ects: 6 },
        { name: "Data Visualization", grade: 9, points: 89, ects: 6 },
        { name: "Deep Learning", grade: 10, points: 92, ects: 6 }
      ],
      failedExams: [],
      misdemeanors: [],
      registeredExams: [
        { name: "Final Project", term: "February 2025", status: "Registered" }
      ],
      hasAllCoursesPassed: true,
      finalThesis: {
        title: "Advanced Machine Learning Applications in Cybersecurity",
        supervisor: "Dr. John Doe",
        status: "In Progress",
        progress: 75
      }
    },
    {
      id: "2021003",
      name: "Mike Johnson",
      year: 1,
      program: "Computer Science",
      status: "New",
      averageGrade: 7.8,
      currentEcts: 36,
      enrollmentYears: {
        year1: 1,
        year2: 0,
        year3: 0,
        year4: 0
      },
      passedCourses: [
        { name: "Introduction to IT", grade: 8, points: 82, ects: 6 },
        { name: "Programming Fundamentals", grade: 7, points: 75, ects: 6 },
        { name: "Mathematics for IT", grade: 8, points: 79, ects: 6 },
        { name: "Computer Architecture", grade: 7, points: 71, ects: 6 },
        { name: "Digital Logic Design", grade: 8, points: 78, ects: 6 },
        { name: "Data Structures", grade: 7, points: 73, ects: 6 }
      ],
      failedExams: [
        { name: "Web Technologies", grade: 5, points: 45, ects: 6, attempts: 1 }
      ],
      misdemeanors: [],
      registeredExams: [
        { name: "Web Technologies", term: "January 2025", status: "Registered" }
      ],
      hasAllCoursesPassed: false
    }
  ]

  const handleStudentClick = (student: any) => {
    setSelectedStudent(student)
    setShowStudentModal(true)
  }

  const closeModal = () => {
    setShowStudentModal(false)
    setSelectedStudent(null)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active": return "bg-green-100 text-green-800"
      case "New": return "bg-blue-100 text-blue-800"
      default: return "bg-slate-100 text-slate-800"
    }
  }

  const getMisdemeanorColor = (severity: string) => {
    switch (severity) {
      case "Minor": return "bg-yellow-100 text-yellow-800"
      case "Major": return "bg-red-100 text-red-800"
      default: return "bg-slate-100 text-slate-800"
    }
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Students</h1>
        <p className="text-slate-600">Manage your student roster and information</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-slate-200">
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-lg font-semibold text-slate-900">Student List</h2>
          <div className="relative">
            <input
              type="text"
              placeholder="Search by name or ID..."
              className="w-80 pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-slate-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>
        </div>
        <div className="space-y-3">
          {students.map((student) => (
            <div 
              key={student.id} 
              className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              onClick={() => handleStudentClick(student)}
            >
              <div className="flex items-center space-x-3">
                <div className="h-10 w-10 rounded-full bg-slate-100 flex items-center justify-center">
                  <span className="text-slate-600 font-medium">{student.name.split(' ').map(n => n[0]).join('')}</span>
                </div>
                <div>
                  <h3 className="font-medium text-slate-900">{student.name}</h3>
                  <p className="text-sm text-slate-600">{student.program} • Year {student.year}</p>
                </div>
              </div>
              <span className={`px-3 py-1 text-sm rounded-full ${getStatusColor(student.status)}`}>
                {student.status}
              </span>
            </div>
          ))}
        </div>
      </div>

      {showStudentModal && selectedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] mx-4 flex flex-col">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-xl font-semibold text-slate-900">Student Profile</h3>
                <p className="text-sm text-slate-600">ID: {selectedStudent.id}</p>
              </div>
              <button
                onClick={closeModal}
                className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Basic Information */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <User className="h-4 w-4" />
                    Basic Information
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Name:</span> {selectedStudent.name}</div>
                    <div><span className="font-medium">Student ID:</span> {selectedStudent.id}</div>
                    <div><span className="font-medium">Program:</span> {selectedStudent.program}</div>
                    <div><span className="font-medium">Current Year:</span> {selectedStudent.year}</div>
                    <div><span className="font-medium">Status:</span> {selectedStudent.status}</div>
                  </div>
                </div>

                {/* Academic Summary */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <Award className="h-4 w-4" />
                    Academic Summary
                  </h4>
                  <div className="space-y-2 text-sm">
                    <div><span className="font-medium">Average Grade:</span> {selectedStudent.averageGrade}</div>
                    <div><span className="font-medium">Current ECTS:</span> {selectedStudent.currentEcts}</div>
                    <div className="space-y-2">
                      <div><span className="font-medium">Enrollment Count:</span></div>
                      <div className="space-y-2">
                        <div className="text-xs">
                          <span className="font-medium">Year 1:</span> {selectedStudent.enrollmentYears.year1} times
                        </div>
                        <div className="text-xs">
                          <span className="font-medium">Year 2:</span> {selectedStudent.enrollmentYears.year2} times
                        </div>
                        <div className="text-xs">
                          <span className="font-medium">Year 3:</span> {selectedStudent.enrollmentYears.year3} times
                        </div>
                        <div className="text-xs">
                          <span className="font-medium">Year 4:</span> {selectedStudent.enrollmentYears.year4} times
                        </div>
                      </div>
                      <div className="text-xs text-slate-600">
                        Total: {selectedStudent.enrollmentYears.year1 + selectedStudent.enrollmentYears.year2 + selectedStudent.enrollmentYears.year3 + selectedStudent.enrollmentYears.year4}/8
                      </div>
                    </div>
                  </div>
                </div>

                {/* Passed Courses */}
                <div className="lg:col-span-2 bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <BookOpen className="h-4 w-4" />
                    Passed Courses ({selectedStudent.passedCourses.length})
                  </h4>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {selectedStudent.passedCourses.map((course: any, index: number) => (
                      <div key={index} className="bg-white p-3 rounded border">
                        <div className="font-medium text-sm">{course.name}</div>
                        <div className="text-xs text-slate-600">
                          Grade: {course.grade} • Points: {course.points} • ECTS: {course.ects}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Failed Exams */}
                {selectedStudent.failedExams.length > 0 && (
                  <div className="lg:col-span-2 bg-red-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-red-900 mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Failed Exams ({selectedStudent.failedExams.length})
                    </h4>
                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                      {selectedStudent.failedExams.map((exam: any, index: number) => (
                        <div key={index} className="bg-white p-3 rounded border border-red-200">
                          <div className="font-medium text-sm">{exam.name}</div>
                          <div className="text-xs text-red-600">
                            Grade: {exam.grade} • Points: {exam.points} • Attempts: {exam.attempts}
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Misdemeanors */}
                {selectedStudent.misdemeanors.length > 0 && (
                  <div className="lg:col-span-2 bg-yellow-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-yellow-900 mb-3 flex items-center gap-2">
                      <AlertTriangle className="h-4 w-4" />
                      Exam Misdemeanors ({selectedStudent.misdemeanors.length})
                    </h4>
                    <div className="space-y-2">
                      {selectedStudent.misdemeanors.map((misdemeanor: any, index: number) => (
                        <div key={index} className="bg-white p-3 rounded border border-yellow-200">
                          <div className="flex items-center justify-between">
                            <div>
                              <div className="font-medium text-sm">{misdemeanor.course}</div>
                              <div className="text-xs text-slate-600">{misdemeanor.description}</div>
                              <div className="text-xs text-slate-500">{misdemeanor.date}</div>
                            </div>
                            <span className={`px-2 py-1 text-xs rounded-full ${getMisdemeanorColor(misdemeanor.severity)}`}>
                              {misdemeanor.severity}
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Registered Exams */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <h4 className="font-semibold text-slate-900 mb-3 flex items-center gap-2">
                    <FileText className="h-4 w-4" />
                    Registered Exams ({selectedStudent.registeredExams.length})
                  </h4>
                  <div className="space-y-2">
                    {selectedStudent.registeredExams.map((exam: any, index: number) => (
                      <div key={index} className="bg-white p-3 rounded border">
                        <div className="font-medium text-sm">{exam.name}</div>
                        <div className="text-xs text-slate-600">{exam.term} • {exam.status}</div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Final Thesis */}
                {selectedStudent.hasAllCoursesPassed && selectedStudent.finalThesis && (
                  <div className="bg-green-50 p-4 rounded-lg">
                    <h4 className="font-semibold text-green-900 mb-3 flex items-center gap-2">
                      <GraduationCap className="h-4 w-4" />
                      Final Thesis
                    </h4>
                    <div className="bg-white p-3 rounded border border-green-200">
                      <div className="font-medium text-sm">{selectedStudent.finalThesis.title}</div>
                      <div className="text-xs text-slate-600">
                        Supervisor: {selectedStudent.finalThesis.supervisor}
                      </div>
                      <div className="text-xs text-slate-600">
                        Status: {selectedStudent.finalThesis.status}
                      </div>
                      <div className="mt-2">
                        <div className="flex justify-between text-xs text-slate-600 mb-1">
                          <span>Progress</span>
                          <span>{selectedStudent.finalThesis.progress}%</span>
                        </div>
                        <div className="w-full bg-slate-200 rounded-full h-2">
                          <div 
                            className="bg-green-600 h-2 rounded-full transition-all duration-300"
                            style={{ width: `${selectedStudent.finalThesis.progress}%` }}
                          ></div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
