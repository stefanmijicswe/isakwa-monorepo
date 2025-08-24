"use client"

import * as React from "react"
import { Search, Filter, Users, GraduationCap, Calendar, BarChart3, Eye, Download } from "lucide-react"

export default function StudentSearchPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedFilters, setSelectedFilters] = React.useState({
    year: "",
    averageGrade: "",
    faculty: ""
  })

  const students = [
    {
      id: 1,
      firstName: "John",
      lastName: "Doe",
      indexNumber: "2021/001",
      yearOfEnrollment: 2021,
      faculty: "Computer Science",
      averageGrade: 8.7,
      ectsEarned: 120,
      coursesEnrolled: 5,
      status: "Active"
    },
    {
      id: 2,
      firstName: "Sarah",
      lastName: "Johnson",
      indexNumber: "2021/002",
      yearOfEnrollment: 2021,
      faculty: "Computer Science",
      averageGrade: 9.2,
      ectsEarned: 135,
      coursesEnrolled: 6,
      status: "Active"
    },
    {
      id: 3,
      firstName: "Michael",
      lastName: "Brown",
      indexNumber: "2022/001",
      yearOfEnrollment: 2022,
      faculty: "Computer Science",
      averageGrade: 7.8,
      ectsEarned: 90,
      coursesEnrolled: 4,
      status: "Active"
    },
    {
      id: 4,
      firstName: "Emily",
      lastName: "Davis",
      indexNumber: "2020/003",
      yearOfEnrollment: 2020,
      faculty: "Computer Science",
      averageGrade: 9.5,
      ectsEarned: 180,
      coursesEnrolled: 8,
      status: "Active"
    },
    {
      id: 5,
      firstName: "David",
      lastName: "Wilson",
      indexNumber: "2022/002",
      yearOfEnrollment: 2022,
      faculty: "Computer Science",
      averageGrade: 6.9,
      ectsEarned: 75,
      coursesEnrolled: 3,
      status: "Active"
    }
  ]

  const filteredStudents = students.filter(student => {
    const matchesSearch = 
      student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      student.indexNumber.includes(searchTerm)
    
    const matchesYear = !selectedFilters.year || student.yearOfEnrollment.toString() === selectedFilters.year
    const matchesFaculty = !selectedFilters.faculty || student.faculty === selectedFilters.faculty
    
    let matchesGrade = true
    if (selectedFilters.averageGrade) {
      const [min, max] = selectedFilters.averageGrade.split('-').map(Number)
      matchesGrade = student.averageGrade >= min && student.averageGrade <= max
    }
    
    return matchesSearch && matchesYear && matchesFaculty && matchesGrade
  })

  const getGradeColor = (grade: number) => {
    if (grade >= 9.0) return "bg-green-100 text-green-800"
    if (grade >= 8.0) return "bg-blue-100 text-blue-800"
    if (grade >= 7.0) return "bg-yellow-100 text-yellow-800"
    return "bg-red-100 text-red-800"
  }

  const getStatusColor = (status: string) => {
    return status === "Active" 
      ? "bg-green-100 text-green-800" 
      : "bg-gray-100 text-gray-800"
  }

  const totalStudents = filteredStudents.length
  const averageGrade = filteredStudents.reduce((sum, student) => sum + student.averageGrade, 0) / totalStudents
  const totalEcts = filteredStudents.reduce((sum, student) => sum + student.ectsEarned, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Student Search</h1>
        <p className="text-slate-600">Search and view detailed student information</p>
      </div>

      <div className="bg-white p-6 rounded-lg border border-slate-200">
        <div className="flex flex-col md:flex-row gap-4 mb-6">
          <div className="flex-1">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <input
                type="text"
                placeholder="Search by name, index number, or any other criteria..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
          </div>
          
          <div className="flex gap-2">
            <button className="px-4 py-2 bg-slate-100 text-slate-700 hover:bg-slate-200 rounded-md transition-colors flex items-center gap-2">
              <Filter className="h-4 w-4" />
              Filters
            </button>
            <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors flex items-center gap-2">
              <Download className="h-4 w-4" />
              Export
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Year of Enrollment</label>
            <select
              value={selectedFilters.year}
              onChange={(e) => setSelectedFilters({...selectedFilters, year: e.target.value})}
              className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Years</option>
              <option value="2020">2020</option>
              <option value="2021">2021</option>
              <option value="2022">2022</option>
              <option value="2023">2023</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Average Grade Range</label>
            <select
              value={selectedFilters.averageGrade}
              onChange={(e) => setSelectedFilters({...selectedFilters, averageGrade: e.target.value})}
              className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Grades</option>
              <option value="9-10">9.0 - 10.0</option>
              <option value="8-9">8.0 - 8.9</option>
              <option value="7-8">7.0 - 7.9</option>
              <option value="6-7">6.0 - 6.9</option>
            </select>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">Faculty</label>
            <select
              value={selectedFilters.faculty}
              onChange={(e) => setSelectedFilters({...selectedFilters, faculty: e.target.value})}
              className="w-full p-2 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            >
              <option value="">All Faculties</option>
              <option value="Computer Science">Computer Science</option>
              <option value="Mathematics">Mathematics</option>
              <option value="Physics">Physics</option>
            </select>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{totalStudents}</div>
            <div className="text-sm text-slate-600">Students Found</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{averageGrade.toFixed(1)}</div>
            <div className="text-sm text-slate-600">Average Grade</div>
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
          <h2 className="text-lg font-semibold text-slate-900">Student Results</h2>
          <p className="text-sm text-slate-600 mt-1">Detailed information about filtered students</p>
        </div>
        
        <div className="divide-y divide-slate-200">
          {filteredStudents.map((student) => (
            <div key={student.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(student.status)}`}>
                      {student.status}
                    </span>
                    <span className="font-mono text-sm font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                      {student.indexNumber}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getGradeColor(student.averageGrade)}`}>
                      {student.averageGrade} GPA
                    </span>
                  </div>
                  
                  <h3 className="font-medium text-slate-900 text-lg mb-2">
                    {student.firstName} {student.lastName}
                  </h3>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="h-4 w-4" />
                      <span>Enrolled: {student.yearOfEnrollment}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <GraduationCap className="h-4 w-4" />
                      <span>{student.faculty}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <BarChart3 className="h-4 w-4" />
                      <span>{student.ectsEarned} ECTS</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Users className="h-4 w-4" />
                      <span>{student.coursesEnrolled} Courses</span>
                    </div>
                  </div>
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors text-sm flex items-center gap-2">
                    <Eye className="h-4 w-4" />
                    View Details
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md transition-colors text-sm">
                    Academic Record
                  </button>
                  <button className="px-4 py-2 bg-purple-600 text-white hover:bg-purple-700 rounded-md transition-colors text-sm">
                    Course History
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
