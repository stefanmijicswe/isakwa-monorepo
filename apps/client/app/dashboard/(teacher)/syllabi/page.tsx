"use client"

import * as React from "react"
import { Edit3, BookOpen, Calendar, Users, FileText, Save, X } from "lucide-react"

export default function SyllabiPage() {
  const [showEditor, setShowEditor] = React.useState(false)
  const [selectedCourse, setSelectedCourse] = React.useState<any>(null)
  const [syllabusContent, setSyllabusContent] = React.useState("")

  const teachingCourses = [
    {
      id: 1,
      name: "Introduction to Information Technologies",
      acronym: "IT101",
      ects: 6,
      semester: "Winter",
      studentsEnrolled: 45,
      status: "Active"
    },
    {
      id: 2,
      name: "Programming Fundamentals",
      acronym: "PF102",
      ects: 6,
      semester: "Winter",
      studentsEnrolled: 38,
      status: "Active"
    },
    {
      id: 3,
      name: "Web Technologies",
      acronym: "WT202",
      ects: 6,
      semester: "Summer",
      studentsEnrolled: 32,
      status: "Active"
    },
    {
      id: 4,
      name: "Database Systems",
      acronym: "DB203",
      ects: 6,
      semester: "Summer",
      studentsEnrolled: 28,
      status: "Active"
    },
    {
      id: 5,
      name: "Software Engineering Basics",
      acronym: "SE205",
      ects: 6,
      semester: "Winter",
      studentsEnrolled: 25,
      status: "Active"
    },
    {
      id: 6,
      name: "Object-Oriented Programming",
      acronym: "OOP301",
      ects: 6,
      semester: "Winter",
      studentsEnrolled: 42,
      status: "Active"
    },
    {
      id: 7,
      name: "Computer Networks",
      acronym: "CN204",
      ects: 6,
      semester: "Summer",
      studentsEnrolled: 35,
      status: "Active"
    },
    {
      id: 8,
      name: "Information Security",
      acronym: "IS303",
      ects: 6,
      semester: "Summer",
      studentsEnrolled: 30,
      status: "Active"
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

  const handleEditSyllabus = (course: any) => {
    setSelectedCourse(course)
    setSyllabusContent(`# ${course.name} Syllabus

## Course Overview
This course provides students with fundamental knowledge and skills in ${course.name.toLowerCase()}.

## Learning Objectives
- Understand the basic concepts and principles
- Develop practical skills through hands-on exercises
- Apply knowledge to real-world scenarios

## Course Content
### Week 1-2: Introduction
- Basic concepts and terminology
- Historical development
- Current trends and applications

### Week 3-4: Core Principles
- Fundamental theories
- Key methodologies
- Best practices

### Week 5-6: Practical Applications
- Hands-on exercises
- Case studies
- Project work

## Assessment Methods
- Midterm exam: 30%
- Final exam: 40%
- Assignments: 20%
- Participation: 10%

## Required Materials
- Textbook: [To be specified]
- Software: [To be specified]
- Additional resources: [To be specified]

## Office Hours
- Monday: 2:00 PM - 4:00 PM
- Wednesday: 10:00 AM - 12:00 PM
- Friday: 1:00 PM - 3:00 PM

## Contact Information
- Professor: John Doe
- Email: john.doe@university.edu
- Office: Room 301, Building A`)
    setShowEditor(true)
  }

  const handleSaveSyllabus = () => {
    // TODO: Implement backend save functionality
    console.log("Saving syllabus for:", selectedCourse.name)
    console.log("Content:", syllabusContent)
    setShowEditor(false)
    setSelectedCourse(null)
    setSyllabusContent("")
  }

  const handleCancelEdit = () => {
    setShowEditor(false)
    setSelectedCourse(null)
    setSyllabusContent("")
  }

  const totalStudents = teachingCourses.reduce((sum, course) => sum + course.studentsEnrolled, 0)
  const totalEcts = teachingCourses.reduce((sum, course) => sum + course.ects, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Syllabi Management</h1>
        <p className="text-slate-600">Edit and manage course syllabi</p>
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
          <h2 className="text-lg font-semibold text-slate-900">Teaching Courses</h2>
          <p className="text-sm text-slate-600 mt-1">Manage syllabi for your current courses</p>
        </div>
        
        <div className="divide-y divide-slate-200">
          {teachingCourses.map((course) => (
            <div key={course.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
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
                <div className="flex items-center gap-4">
                  <div className="text-right">
                    <div className="text-2xl font-bold text-slate-900">{course.studentsEnrolled}</div>
                    <div className="text-xs text-slate-500">Students</div>
                  </div>
                  <button
                    onClick={() => handleEditSyllabus(course)}
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors flex items-center gap-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit Syllabus
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-4xl h-[90vh] mx-4 flex flex-col">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Syllabus Editor</h3>
                <p className="text-sm text-slate-600">{selectedCourse?.name} ({selectedCourse?.acronym})</p>
              </div>
              <div className="flex gap-2">
                <button
                  onClick={handleCancelEdit}
                  className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>
            
            <div className="flex-1 p-6 overflow-hidden">
              <div className="h-full flex flex-col">
                <div className="mb-4">
                  <label className="block text-sm font-medium text-slate-700 mb-2">
                    Syllabus Content (Markdown supported)
                  </label>
                </div>
                <textarea
                  value={syllabusContent}
                  onChange={(e) => setSyllabusContent(e.target.value)}
                  className="flex-1 w-full p-4 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent font-mono text-sm resize-none"
                  placeholder="Enter your syllabus content here..."
                />
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={handleCancelEdit}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSaveSyllabus}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors flex items-center gap-2"
              >
                <Save className="h-4 w-4" />
                Save Syllabus
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
