"use client"

import * as React from "react"
import { BookOpen, Calendar, Users, ChartBar, Clock, CheckCircle } from "lucide-react"

export default function MyCoursesPage() {
  const enrolledCourses = [
    {
      id: 1,
      name: "Introduction to Information Technologies",
      acronym: "IT101",
      ects: 6,
      semester: "Winter",
      professor: "Dr. John Smith",
      schedule: "Monday 10:00-12:00, Wednesday 14:00-16:00",
      room: "A101",
      progress: 75,
      grade: "A",
      status: "Active"
    },
    {
      id: 2,
      name: "Programming Fundamentals",
      acronym: "PF102",
      ects: 6,
      semester: "Winter",
      professor: "Dr. Sarah Johnson",
      schedule: "Tuesday 09:00-11:00, Thursday 13:00-15:00",
      room: "B205",
      progress: 60,
      grade: "B+",
      status: "Active"
    },
    {
      id: 3,
      name: "Web Technologies",
      acronym: "WT202",
      ects: 6,
      semester: "Summer",
      professor: "Dr. Michael Brown",
      schedule: "Monday 14:00-16:00, Wednesday 10:00-12:00",
      room: "C301",
      progress: 0,
      grade: null,
      status: "Upcoming"
    },
    {
      id: 4,
      name: "Database Systems",
      acronym: "DB203",
      ects: 6,
      semester: "Summer",
      professor: "Dr. Emily Davis",
      schedule: "Tuesday 13:00-15:00, Thursday 09:00-11:00",
      room: "D401",
      progress: 0,
      grade: null,
      status: "Upcoming"
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case "Active":
        return "bg-green-100 text-green-800"
      case "Upcoming":
        return "bg-blue-100 text-blue-800"
      case "Completed":
        return "bg-gray-100 text-gray-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const getProgressColor = (progress: number) => {
    if (progress >= 80) return "bg-green-500"
    if (progress >= 60) return "bg-yellow-500"
    if (progress >= 40) return "bg-orange-500"
    return "bg-red-500"
  }

  const totalEcts = enrolledCourses.reduce((sum, course) => sum + course.ects, 0)
  const activeCourses = enrolledCourses.filter(course => course.status === "Active").length
  const averageGrade = enrolledCourses
    .filter(course => course.grade)
    .reduce((sum, course) => {
      const gradeValue = course.grade === "A" ? 4.0 : course.grade === "B+" ? 3.3 : course.grade === "B" ? 3.0 : 2.0
      return sum + gradeValue
    }, 0) / enrolledCourses.filter(course => course.grade).length

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">My Courses</h1>
        <p className="text-slate-600">View and manage your enrolled courses</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{enrolledCourses.length}</div>
            <div className="text-sm text-slate-600">Total Courses</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{activeCourses}</div>
            <div className="text-sm text-slate-600">Active Courses</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{totalEcts}</div>
            <div className="text-sm text-slate-600">Total ECTS</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{averageGrade.toFixed(1)}</div>
            <div className="text-sm text-slate-600">Average Grade</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Enrolled Courses</h2>
          <p className="text-sm text-slate-600 mt-1">Manage your current and upcoming courses</p>
        </div>
        
        <div className="divide-y divide-slate-200">
          {enrolledCourses.map((course) => (
            <div key={course.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className="font-mono text-sm font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                      {course.acronym}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(course.status)}`}>
                      {course.status}
                    </span>
                    {course.grade && (
                      <span className="px-2 py-1 text-xs font-medium rounded-full bg-blue-100 text-blue-800">
                        Grade: {course.grade}
                      </span>
                    )}
                  </div>
                  
                  <h3 className="font-medium text-slate-900 text-lg mb-2">{course.name}</h3>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Users className="h-4 w-4" />
                      <span>{course.professor}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="h-4 w-4" />
                      <span>{course.schedule}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <BookOpen className="h-4 w-4" />
                      <span>{course.ects} ECTS</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Clock className="h-4 w-4" />
                      <span>Room {course.room}</span>
                    </div>
                  </div>

                  {course.status === "Active" && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-600">Course Progress</span>
                        <span className="font-medium">{course.progress}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className={`h-2 rounded-full ${getProgressColor(course.progress)}`}
                          style={{ width: `${course.progress}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors text-sm">
                    View Details
                  </button>
                  {course.status === "Active" && (
                    <button className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md transition-colors text-sm">
                      Course Materials
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
