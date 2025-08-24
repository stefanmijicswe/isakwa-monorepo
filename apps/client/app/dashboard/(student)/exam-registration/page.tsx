"use client"

import * as React from "react"
import { Calendar, CheckCircle, XCircle } from "lucide-react"

export default function ExamRegistrationPage() {
  const [showExamModal, setShowExamModal] = React.useState(false)
  const [selectedCourse, setSelectedCourse] = React.useState<any>(null)
  const [selectedExamTerm, setSelectedExamTerm] = React.useState("")
  const [registeredExams, setRegisteredExams] = React.useState<any[]>([])

  const currentCourses = [
    {
      id: 1,
      name: "Introduction to Information Technologies",
      acronym: "IT101",
      professor: "John Doe",
      ects: 6
    },
    {
      id: 2,
      name: "Programming Fundamentals",
      acronym: "PF102",
      professor: "John Doe",
      ects: 6
    },
    {
      id: 3,
      name: "Mathematics for IT",
      acronym: "MATH103",
      professor: "John Doe",
      ects: 6
    },
    {
      id: 4,
      name: "Computer Architecture",
      acronym: "CA104",
      professor: "John Doe",
      ects: 6
    },
    {
      id: 5,
      name: "Digital Logic Design",
      acronym: "DLD105",
      professor: "John Doe",
      ects: 6
    }
  ]

  const examTerms = [
    { id: 1, name: "January 2025 Regular Term", date: "January 15-20, 2025" },
    { id: 2, name: "January 2025 Retake Term", date: "January 25-30, 2025" },
    { id: 3, name: "February 2025 Regular Term", date: "February 10-15, 2025" },
    { id: 4, name: "February 2025 Retake Term", date: "February 20-25, 2025" }
  ]

  const handleExamRegistration = (course: any) => {
    setSelectedCourse(course)
    setSelectedExamTerm("")
    setShowExamModal(true)
  }

  const confirmRegistration = () => {
    if (selectedExamTerm) {
      const examTerm = examTerms.find(term => term.id.toString() === selectedExamTerm)
      const newRegistration = {
        id: Date.now(),
        course: selectedCourse,
        examTerm: examTerm,
        registrationDate: new Date().toLocaleDateString(),
        status: "Registered"
      }
      setRegisteredExams([...registeredExams, newRegistration])
      setShowExamModal(false)
      setSelectedCourse(null)
      setSelectedExamTerm("")
    }
  }

  const cancelRegistration = () => {
    setShowExamModal(false)
    setSelectedCourse(null)
    setSelectedExamTerm("")
  }

  const removeRegistration = (registrationId: number) => {
    setRegisteredExams(registeredExams.filter(reg => reg.id !== registrationId))
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Exam Registration</h1>
        <p className="text-slate-600">Register for exams for your current courses</p>
      </div>
      
      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Current Courses</h2>
          <p className="text-sm text-slate-600 mt-1">Select courses to register for exams</p>
        </div>
        
        <div className="divide-y divide-slate-200">
          {currentCourses.map((course) => (
            <div key={course.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <span className="font-mono text-sm font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                      {course.acronym}
                    </span>
                    <span className="px-2 py-1 bg-blue-100 text-blue-800 text-sm rounded-full">Current</span>
                  </div>
                  <h3 className="font-medium text-slate-900 text-lg mb-1">{course.name}</h3>
                  <p className="text-sm text-slate-600">Prof. {course.professor} • {course.ects} ECTS</p>
                </div>
                <button
                  onClick={() => handleExamRegistration(course)}
                  className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors flex items-center gap-2"
                >
                  <Calendar className="h-4 w-4" />
                  Register for Exam
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {registeredExams.length > 0 && (
        <div className="bg-white rounded-lg border border-slate-200">
          <div className="p-6 border-b border-slate-200">
            <h2 className="text-lg font-semibold text-slate-900">Registered Exams</h2>
            <p className="text-sm text-slate-600 mt-1">Your exam registrations for upcoming terms</p>
          </div>
          
          <div className="divide-y divide-slate-200">
            {registeredExams.map((registration) => (
              <div key={registration.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <span className="font-mono text-sm font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                        {registration.course.acronym}
                      </span>
                      <span className="px-2 py-1 bg-green-100 text-green-800 text-sm rounded-full flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        {registration.status}
                      </span>
                    </div>
                    <h3 className="font-medium text-slate-900 text-lg mb-1">{registration.course.name}</h3>
                    <p className="text-sm text-slate-600">
                      {registration.examTerm.name} • {registration.examTerm.date}
                    </p>
                    <p className="text-xs text-slate-500 mt-1">Registered on: {registration.registrationDate}</p>
                  </div>
                  <button
                    onClick={() => removeRegistration(registration.id)}
                    className="p-2 text-red-600 hover:text-red-800 hover:bg-red-50 rounded transition-colors"
                  >
                    <XCircle className="h-4 w-4" />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {showExamModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4 shadow-xl">
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-slate-900 mb-2">Register for Exam</h3>
              <p className="text-sm text-slate-600 mb-4">
                <strong>{selectedCourse?.name}</strong> ({selectedCourse?.acronym})
              </p>
              
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Select Exam Term:
              </label>
              <select
                value={selectedExamTerm}
                onChange={(e) => setSelectedExamTerm(e.target.value)}
                className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                <option value="">Choose an exam term...</option>
                {examTerms.map((term) => (
                  <option key={term.id} value={term.id}>
                    {term.name} - {term.date}
                  </option>
                ))}
              </select>
            </div>
            
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelRegistration}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmRegistration}
                disabled={!selectedExamTerm}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 disabled:bg-slate-400 disabled:cursor-not-allowed rounded-md transition-colors"
              >
                Confirm Registration
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
