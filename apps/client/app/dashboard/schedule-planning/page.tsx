"use client"

import * as React from "react"
import { Calendar, BookOpen, Plus, X, Edit3, Clock, MapPin } from "lucide-react"

export default function SchedulePlanningPage() {
  const [showEditor, setShowEditor] = React.useState(false)
  const [selectedCourse, setSelectedCourse] = React.useState<any>(null)
  const [scheduleData, setScheduleData] = React.useState<any>({
    lectures: [],
    practice: []
  })

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

  const handleCourseClick = (course: any) => {
    setSelectedCourse(course)
    setScheduleData({
      lectures: [
        { id: 1, week: 1, topic: "Course Introduction", description: "Overview of course objectives and syllabus", duration: "90 min", room: "Room 301" },
        { id: 2, week: 2, topic: "Basic Concepts", description: "Fundamental principles and terminology", duration: "90 min", room: "Room 301" }
      ],
      practice: [
        { id: 1, week: 1, topic: "Setup and Installation", description: "Setting up development environment", duration: "90 min", room: "Lab 205" },
        { id: 2, week: 2, topic: "First Exercises", description: "Basic hands-on practice", duration: "90 min", room: "Lab 205" }
      ]
    })
    setShowEditor(true)
  }

  const addLecture = () => {
    const newLecture = {
      id: Date.now(),
      week: scheduleData.lectures.length + 1,
      topic: "",
      description: "",
      duration: "90 min",
      room: "Room 301"
    }
    setScheduleData({
      ...scheduleData,
      lectures: [...scheduleData.lectures, newLecture]
    })
  }

  const addPractice = () => {
    const newPractice = {
      id: Date.now(),
      week: scheduleData.practice.length + 1,
      topic: "",
      description: "",
      duration: "90 min",
      room: "Lab 205"
    }
    setScheduleData({
      ...scheduleData,
      practice: [...scheduleData.practice, newPractice]
    })
  }

  const updateLecture = (id: number, field: string, value: string) => {
    setScheduleData({
      ...scheduleData,
      lectures: scheduleData.lectures.map((lecture: any) =>
        lecture.id === id ? { ...lecture, [field]: value } : lecture
      )
    })
  }

  const updatePractice = (id: number, field: string, value: string) => {
    setScheduleData({
      ...scheduleData,
      practice: scheduleData.practice.map((practice: any) =>
        practice.id === id ? { ...practice, [field]: value } : practice
      )
    })
  }

  const removeLecture = (id: number) => {
    setScheduleData({
      ...scheduleData,
      lectures: scheduleData.lectures.filter((lecture: any) => lecture.id !== id)
    })
  }

  const removePractice = (id: number) => {
    setScheduleData({
      ...scheduleData,
      practice: scheduleData.practice.filter((practice: any) => practice.id !== id)
    })
  }

  const handleSave = () => {
    // TODO: Implement backend save functionality
    console.log("Saving schedule for:", selectedCourse.name)
    console.log("Schedule data:", scheduleData)
    setShowEditor(false)
    setSelectedCourse(null)
    setScheduleData({ lectures: [], practice: [] })
  }

  const handleCancel = () => {
    setShowEditor(false)
    setSelectedCourse(null)
    setScheduleData({ lectures: [], practice: [] })
  }

  const totalStudents = teachingCourses.reduce((sum, course) => sum + course.studentsEnrolled, 0)
  const totalEcts = teachingCourses.reduce((sum, course) => sum + course.ects, 0)

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-slate-900">Schedule Planning</h1>
        <p className="text-slate-600">Plan schedule outcomes and topics for each session</p>
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
          <p className="text-sm text-slate-600 mt-1">Click on a course to plan its schedule</p>
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
                    onClick={() => handleCourseClick(course)}
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors flex items-center gap-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    Plan Schedule
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showEditor && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-6xl h-[90vh] mx-4 flex flex-col">
            <div className="p-6 border-b border-slate-200 flex items-center justify-between">
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Schedule Planning</h3>
                <p className="text-sm text-slate-600">{selectedCourse?.name} ({selectedCourse?.acronym})</p>
              </div>
              <button
                onClick={handleCancel}
                className="p-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded transition-colors"
              >
                <X className="h-5 w-5" />
              </button>
            </div>
            
            <div className="flex-1 p-6 overflow-y-auto">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                {/* Lectures Section */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                      <BookOpen className="h-4 w-4" />
                      Lectures ({scheduleData.lectures.length})
                    </h4>
                    <button
                      onClick={addLecture}
                      className="p-2 bg-blue-600 text-white rounded-full hover:bg-blue-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {scheduleData.lectures.map((lecture: any) => (
                      <div key={lecture.id} className="bg-white p-4 rounded border">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-slate-600">Week {lecture.week}</span>
                          <button
                            onClick={() => removeLecture(lecture.id)}
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                        
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Lecture topic"
                            value={lecture.topic}
                            onChange={(e) => updateLecture(lecture.id, 'topic', e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <textarea
                            placeholder="Description"
                            value={lecture.description}
                            onChange={(e) => updateLecture(lecture.id, 'description', e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={2}
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Duration"
                              value={lecture.duration}
                              onChange={(e) => updateLecture(lecture.id, 'duration', e.target.value)}
                              className="w-full p-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="text"
                              placeholder="Room"
                              value={lecture.room}
                              onChange={(e) => updateLecture(lecture.id, 'room', e.target.value)}
                              className="w-full p-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Practice Section */}
                <div className="bg-slate-50 p-4 rounded-lg">
                  <div className="flex items-center justify-between mb-4">
                    <h4 className="font-semibold text-slate-900 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      Practice Sessions ({scheduleData.practice.length})
                    </h4>
                    <button
                      onClick={addPractice}
                      className="p-2 bg-green-600 text-white rounded-full hover:bg-green-700 transition-colors"
                    >
                      <Plus className="h-4 w-4" />
                    </button>
                  </div>
                  
                  <div className="space-y-3">
                    {scheduleData.practice.map((practice: any) => (
                      <div key={practice.id} className="bg-white p-4 rounded border">
                        <div className="flex items-center justify-between mb-3">
                          <span className="text-sm font-medium text-slate-600">Week {practice.week}</span>
                          <button
                            onClick={() => removePractice(practice.id)}
                            className="p-1 text-red-600 hover:text-red-800 hover:bg-red-50 rounded"
                          >
                            <X className="h-3 w-3" />
                          </button>
                        </div>
                        
                        <div className="space-y-2">
                          <input
                            type="text"
                            placeholder="Practice topic"
                            value={practice.topic}
                            onChange={(e) => updatePractice(practice.id, 'topic', e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                          />
                          <textarea
                            placeholder="Description"
                            value={practice.description}
                            onChange={(e) => updatePractice(practice.id, 'description', e.target.value)}
                            className="w-full p-2 border border-slate-300 rounded text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                            rows={2}
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text"
                              placeholder="Duration"
                              value={practice.duration}
                              onChange={(e) => updatePractice(practice.id, 'duration', e.target.value)}
                              className="w-full p-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                            <input
                              type="text"
                              placeholder="Room"
                              value={practice.room}
                              onChange={(e) => updatePractice(practice.id, 'room', e.target.value)}
                              className="w-full p-2 border border-slate-300 rounded text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                            />
                          </div>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={handleCancel}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={handleSave}
                className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors"
              >
                Save Schedule
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
