"use client"

import * as React from "react"
import { Search, Filter, Save, Download, Users, Calendar, FileText, CheckCircle } from "lucide-react"

export default function GradeEntryPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedCourse, setSelectedCourse] = React.useState("")
  const [grades, setGrades] = React.useState<{[key: string]: string}>({})

  const courses = [
    {
      id: 1,
      name: "Introduction to Information Technologies",
      code: "IT101",
      semester: "Winter 2024",
      studentsEnrolled: 45,
      gradingDeadline: "2024-12-30"
    },
    {
      id: 2,
      name: "Programming Fundamentals",
      code: "PF102",
      semester: "Winter 2024",
      studentsEnrolled: 38,
      gradingDeadline: "2024-12-25"
    },
    {
      id: 3,
      name: "Web Technologies",
      code: "WT202",
      semester: "Summer 2024",
      studentsEnrolled: 32,
      gradingDeadline: "2025-01-15"
    }
  ]

  const students = [
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      indexNumber: "2021/001",
      email: "john.doe@student.edu",
      attendance: 85,
      assignments: 92,
      midterm: 78,
      final: 0,
      average: 0,
      status: "Pending"
    },
    {
      id: 2,
      firstName: "Sarah",
      lastName: "Johnson",
      indexNumber: "2021/002",
      email: "sarah.johnson@student.edu",
      attendance: 92,
      assignments: 88,
      midterm: 85,
      final: 0,
      average: 0,
      status: "Pending"
    },
    {
      id: 3,
      firstName: "Michael",
      lastName: "Brown",
      indexNumber: "2022/001",
      email: "michael.brown@student.edu",
      attendance: 78,
      assignments: 75,
      midterm: 72,
      final: 0,
      average: 0,
      status: "Pending"
    },
    {
      id: 4,
      firstName: "Emily",
      lastName: "Davis",
      indexNumber: "2020/003",
      email: "emily.davis@student.edu",
      attendance: 95,
      assignments: 96,
      midterm: 89,
      final: 0,
      average: 0,
      status: "Pending"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Completed":
        return "bg-green-100 text-green-800"
      case "Pending":
        return "bg-yellow-100 text-yellow-800"
      case "Overdue":
        return "bg-red-100 text-red-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const getGradeColor = (grade: number) => {
    if (grade >= 90) return "bg-green-100 text-green-800"
    if (grade >= 80) return "bg-blue-100 text-blue-800"
    if (grade >= 70) return "bg-yellow-100 text-yellow-800"
    if (grade >= 60) return "bg-orange-100 text-orange-800"
    return "bg-red-100 text-red-800"
  }

  const handleGradeChange = (studentId: string, field: string, value: string) => {
    setGrades(prev => ({
      ...prev,
      [`${studentId}_${field}`]: value
    }))
  }

  const calculateAverage = (student: any) => {
    const attendance = parseFloat(grades[`${student.id}_attendance`] || student.attendance.toString())
    const assignments = parseFloat(grades[`${student.id}_assignments`] || student.assignments.toString())
    const midterm = parseFloat(grades[`${student.id}_midterm`] || student.midterm.toString())
    const final = parseFloat(grades[`${student.id}_final`] || student.final.toString())
    
    if (final === 0) return 0
    
    // Weighted average: attendance 10%, assignments 20%, midterm 30%, final 40%
    return parseFloat((attendance * 0.1 + assignments * 0.2 + midterm * 0.3 + final * 0.4).toFixed(1))
  }

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.indexNumber.includes(searchTerm)
    
    return matchesSearch
  })

  const pendingGrades = students.filter(student => student.status === "Pending").length
  const completedGrades = students.filter(student => student.status === "Completed").length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Grade Entry</h1>
        <p className="text-slate-600">Enter and manage student grades for your courses</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search students by name or index number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <select
              value={selectedCourse}
              onChange={(e) => setSelectedCourse(e.target.value)}
              className="px-4 py-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Courses</option>
              {courses.map(course => (
                <option key={course.id} value={course.id}>{course.code} - {course.name}</option>
              ))}
            </select>
            <button className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md transition-colors flex items-center gap-2">
              <Save className="h-4 w-4" />
              Save All
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{filteredStudents.length}</div>
            <div className="text-sm text-slate-600">Students</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{pendingGrades}</div>
            <div className="text-sm text-slate-600">Pending Grades</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{completedGrades}</div>
            <div className="text-sm text-slate-600">Completed</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Student Grades</h2>
          <p className="text-sm text-slate-600 mt-1">Enter grades for each student component</p>
        </div>
        
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
                <th className="px-6 py-3 text-center text-xs font-medium text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Final (40%)
                </th>
                <th className="px-6 py-3 text-center text-xs font-medium text-slate-500 uppercase tracking-wider">
                  Average
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
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={grades[`${student.id}_attendance`] || student.attendance}
                      onChange={(e) => handleGradeChange(student.id.toString(), "attendance", e.target.value)}
                      className="w-16 p-1 text-center border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={grades[`${student.id}_assignments`] || student.assignments}
                      onChange={(e) => handleGradeChange(student.id.toString(), "assignments", e.target.value)}
                      className="w-16 p-1 text-center border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={grades[`${student.id}_midterm`] || student.midterm}
                      onChange={(e) => handleGradeChange(student.id.toString(), "midterm", e.target.value)}
                      className="w-16 p-1 text-center border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <input
                      type="number"
                      min="0"
                      max="100"
                      value={grades[`${student.id}_final`] || student.final}
                      onChange={(e) => handleGradeChange(student.id.toString(), "final", e.target.value)}
                      className="w-16 p-1 text-center border border-slate-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
                    />
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getGradeColor(calculateAverage(student))}`}>
                      {calculateAverage(student)}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(student.status)}`}>
                      {student.status}
                    </span>
                  </td>
                  
                  <td className="px-6 py-4 whitespace-nowrap text-center">
                    <div className="flex gap-2 justify-center">
                      <button className="p-1 text-blue-600 hover:text-blue-800">
                        <CheckCircle className="h-4 w-4" />
                      </button>
                      <button className="p-1 text-green-600 hover:text-green-800">
                        <FileText className="h-4 w-4" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
