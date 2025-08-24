"use client"

import * as React from "react"
import { Plus, Edit3, Trash2, FileText, Calendar, Users, BarChart3 } from "lucide-react"

export default function EvaluationToolsPage() {
  const [showCreateModal, setShowCreateModal] = React.useState(false)
  const [selectedTool, setSelectedTool] = React.useState<any>(null)

  const evaluationTools = [
    {
      id: 1,
      name: "Midterm Exam",
      type: "Exam",
      course: "Introduction to Information Technologies",
      courseCode: "IT101",
      weight: 30,
      dueDate: "2024-12-15",
      totalPoints: 100,
      submissions: 45,
      averageScore: 78.5,
      status: "Active"
    },
    {
      id: 2,
      name: "Final Project",
      type: "Project",
      course: "Programming Fundamentals",
      courseCode: "PF102",
      weight: 40,
      dueDate: "2025-01-20",
      totalPoints: 150,
      submissions: 38,
      averageScore: 82.3,
      status: "Active"
    },
    {
      id: 3,
      name: "Weekly Quizzes",
      type: "Quiz",
      course: "Web Technologies",
      courseCode: "WT202",
      weight: 20,
      dueDate: "2024-12-01",
      totalPoints: 50,
      submissions: 32,
      averageScore: 75.8,
      status: "Completed"
    },
    {
      id: 4,
      name: "Lab Assignments",
      type: "Assignment",
      course: "Database Systems",
      courseCode: "DB203",
      weight: 10,
      dueDate: "2024-11-30",
      totalPoints: 80,
      submissions: 28,
      averageScore: 88.2,
      status: "Completed"
    }
  ]

  const getTypeColor = (type: string) => {
    switch (type) {
      case "Exam":
        return "bg-red-100 text-red-800"
      case "Project":
        return "bg-blue-100 text-blue-800"
      case "Quiz":
        return "bg-green-100 text-green-800"
      case "Assignment":
        return "bg-purple-100 text-purple-800"
      default:
        return "bg-slate-100 text-slate-800"
    }
  }

  const getStatusColor = (status: string) => {
    return status === "Active" 
      ? "bg-green-100 text-green-800" 
      : "bg-gray-100 text-gray-800"
  }

  const totalTools = evaluationTools.length
  const activeTools = evaluationTools.filter(tool => tool.status === "Active").length
  const totalSubmissions = evaluationTools.reduce((sum, tool) => sum + tool.submissions, 0)
  const averageScore = evaluationTools.reduce((sum, tool) => sum + tool.averageScore, 0) / evaluationTools.length

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Evaluation Tools</h1>
          <p className="text-slate-600">Manage evaluation instruments for your courses</p>
        </div>
        <button
          onClick={() => setShowCreateModal(true)}
          className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors flex items-center gap-2"
        >
          <Plus className="h-4 w-4" />
          Create Tool
        </button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-6">
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{totalTools}</div>
            <div className="text-sm text-slate-600">Total Tools</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{activeTools}</div>
            <div className="text-sm text-slate-600">Active Tools</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{totalSubmissions}</div>
            <div className="text-sm text-slate-600">Total Submissions</div>
          </div>
        </div>
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <div className="text-center">
            <div className="text-2xl font-bold text-slate-900">{averageScore.toFixed(1)}</div>
            <div className="text-sm text-slate-600">Average Score</div>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-lg border border-slate-200">
        <div className="p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">Evaluation Tools</h2>
          <p className="text-sm text-slate-600 mt-1">Manage and monitor your evaluation instruments</p>
        </div>
        
        <div className="divide-y divide-slate-200">
          {evaluationTools.map((tool) => (
            <div key={tool.id} className="p-6 hover:bg-slate-50 transition-colors">
              <div className="flex items-center justify-between">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-3">
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(tool.type)}`}>
                      {tool.type}
                    </span>
                    <span className={`px-2 py-1 text-xs font-medium rounded-full ${getStatusColor(tool.status)}`}>
                      {tool.status}
                    </span>
                    <span className="font-mono text-sm font-medium text-slate-600 bg-slate-100 px-2 py-1 rounded">
                      {tool.courseCode}
                    </span>
                  </div>
                  
                  <h3 className="font-medium text-slate-900 text-lg mb-2">{tool.name}</h3>
                  <p className="text-sm text-slate-600 mb-3">{tool.course}</p>
                  
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Calendar className="h-4 w-4" />
                      <span>Due: {tool.dueDate}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <BarChart3 className="h-4 w-4" />
                      <span>Weight: {tool.weight}%</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <FileText className="h-4 w-4" />
                      <span>Points: {tool.totalPoints}</span>
                    </div>
                    <div className="flex items-center gap-2 text-sm text-slate-600">
                      <Users className="h-4 w-4" />
                      <span>Submissions: {tool.submissions}</span>
                    </div>
                  </div>

                  {tool.status === "Active" && (
                    <div className="mb-3">
                      <div className="flex items-center justify-between text-sm mb-1">
                        <span className="text-slate-600">Average Score</span>
                        <span className="font-medium">{tool.averageScore}%</span>
                      </div>
                      <div className="w-full bg-slate-200 rounded-full h-2">
                        <div 
                          className="h-2 rounded-full bg-blue-500"
                          style={{ width: `${tool.averageScore}%` }}
                        ></div>
                      </div>
                    </div>
                  )}
                </div>
                
                <div className="flex flex-col gap-2 ml-4">
                  <button 
                    onClick={() => setSelectedTool(tool)}
                    className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors text-sm flex items-center gap-2"
                  >
                    <Edit3 className="h-4 w-4" />
                    Edit
                  </button>
                  <button className="px-4 py-2 bg-green-600 text-white hover:bg-green-700 rounded-md transition-colors text-sm">
                    View Submissions
                  </button>
                  <button className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors text-sm flex items-center gap-2">
                    <Trash2 className="h-4 w-4" />
                    Delete
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {showCreateModal && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg shadow-xl w-full max-w-2xl mx-4">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-semibold text-slate-900">Create Evaluation Tool</h3>
              <p className="text-sm text-slate-600">Add a new evaluation instrument for your course</p>
            </div>
            
            <div className="p-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Tool Name</label>
                  <input
                    type="text"
                    className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="e.g., Midterm Exam"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Type</label>
                  <select className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Exam</option>
                    <option>Project</option>
                    <option>Quiz</option>
                    <option>Assignment</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Course</label>
                  <select className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent">
                    <option>Introduction to Information Technologies</option>
                    <option>Programming Fundamentals</option>
                    <option>Web Technologies</option>
                  </select>
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Weight (%)</label>
                  <input
                    type="number"
                    className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="30"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Due Date</label>
                  <input
                    type="date"
                    className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  />
                </div>
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-2">Total Points</label>
                  <input
                    type="number"
                    className="w-full p-3 border border-slate-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                    placeholder="100"
                  />
                </div>
              </div>
            </div>
            
            <div className="p-6 border-t border-slate-200 flex justify-end gap-3">
              <button
                onClick={() => setShowCreateModal(false)}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button className="px-4 py-2 bg-blue-600 text-white hover:bg-blue-700 rounded-md transition-colors">
                Create Tool
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
