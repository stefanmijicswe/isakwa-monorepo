"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../components/auth"
import { useEffect } from "react"

export default function DashboardPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user) {
      // Redirect students to my-courses, admin to students
      if (user.role === 'STUDENT') {
        router.replace('/dashboard/my-courses')
      } else if (user.role === 'ADMIN') {
        router.replace('/dashboard/students')
      }
    }
  }, [user, router])

  // Show loading while redirecting
  if (user?.role === 'STUDENT') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Redirecting to your courses...</p>
        </div>
      </div>
    )
  }

  // Show loading while redirecting admin
  if (user?.role === 'ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600">Redirecting to student management...</p>
        </div>
      </div>
    )
  }

  // For non-students, show the original dashboard
  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-slate-900">Dashboard</h1>
          <p className="text-slate-600 mt-1">
            Welcome back! Here's what's happening with your studies today.
          </p>
        </div>
        <div className="text-right">
          <div className="text-sm text-slate-500">
            {new Date().toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          <div className="text-lg font-semibold text-slate-900">
            {new Date().toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-blue-50">
              <div className="h-5 w-5 text-blue-600">📚</div>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-600">Active Courses</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">5</p>
            <div className="flex items-center mt-2">
              <span className="text-sm font-medium text-green-600">+2</span>
              <span className="text-sm text-slate-500 ml-1">from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-green-50">
              <div className="h-5 w-5 text-green-600">🎓</div>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-600">Average Grade</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">8.7</p>
            <div className="flex items-center mt-2">
              <span className="text-sm font-medium text-green-600">+0.3</span>
              <span className="text-sm text-slate-500 ml-1">from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-purple-50">
              <div className="h-5 w-5 text-purple-600">📈</div>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-600">ECTS Earned</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">120</p>
            <div className="flex items-center mt-2">
              <span className="text-sm font-medium text-green-600">+18</span>
              <span className="text-sm text-slate-500 ml-1">from last month</span>
            </div>
          </div>
        </div>

        <div className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all duration-200">
          <div className="flex items-center justify-between">
            <div className="p-2 rounded-lg bg-amber-50">
              <div className="h-5 w-5 text-amber-600">⏰</div>
            </div>
          </div>
          <div className="mt-4">
            <p className="text-sm font-medium text-slate-600">Next Class</p>
            <p className="text-2xl font-bold text-slate-900 mt-1">2h 15m</p>
            <div className="flex items-center mt-2">
              <span className="text-sm font-medium text-slate-600">IT101</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Recent Activities */}
        <div className="lg:col-span-2">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">Recent Activities</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all
              </button>
            </div>
            <div className="space-y-4">
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="p-2 rounded-lg text-green-600 bg-green-50">
                  🎓
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">Programming Fundamentals - Final Exam</p>
                  <p className="text-sm text-slate-600">Grade: A (95/100)</p>
                  <p className="text-xs text-slate-500 mt-1">2 hours ago</p>
                </div>
              </div>
              <div className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                <div className="p-2 rounded-lg text-amber-600 bg-amber-50">
                  📝
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900">Web Technologies - Project Submission</p>
                  <p className="text-sm text-slate-600">Due in 3 days</p>
                  <p className="text-xs text-slate-500 mt-1">1 day ago</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Upcoming Deadlines */}
        <div className="lg:col-span-1">
          <div className="bg-white rounded-xl border border-slate-200 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-slate-900">Upcoming Deadlines</h2>
              <button className="text-sm text-blue-600 hover:text-blue-700 font-medium">
                View all
              </button>
            </div>
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-red-200 bg-red-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">Web Technologies Final Project</p>
                    <p className="text-xs text-slate-600 mt-1">WT202</p>
                    <div className="flex items-center mt-2">
                      <span className="text-xs text-slate-500">Due: 2024-12-20</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium px-2 py-1 rounded-full text-red-700 bg-white">
                      3 days
                    </span>
                  </div>
                </div>
              </div>
              <div className="p-4 rounded-lg border border-amber-200 bg-amber-50">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <p className="text-sm font-medium text-slate-900">Database Systems Midterm</p>
                    <p className="text-xs text-slate-600 mt-1">DB203</p>
                    <div className="flex items-center mt-2">
                      <span className="text-xs text-slate-500">Due: 2024-12-25</span>
                    </div>
                  </div>
                  <div className="text-right">
                    <span className="text-xs font-medium px-2 py-1 rounded-full text-amber-700 bg-white">
                      8 days
                    </span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="bg-white rounded-xl border border-slate-200 p-6">
        <h2 className="text-lg font-semibold text-slate-900 mb-6">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <button className="group p-4 text-center rounded-lg border border-slate-200 hover:border-blue-300 hover:bg-blue-50 transition-all duration-200">
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📝</div>
            <p className="text-sm font-medium text-slate-700 group-hover:text-blue-700">View Grades</p>
          </button>
          <button className="group p-4 text-center rounded-lg border border-slate-200 hover:border-green-300 hover:bg-green-50 transition-all duration-200">
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">📚</div>
            <p className="text-sm font-medium text-slate-700 group-hover:text-green-700">Course Materials</p>
          </button>
          <button className="group p-4 text-center rounded-lg border border-slate-200 hover:border-purple-300 hover:bg-purple-50 transition-all duration-200">
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">👥</div>
            <p className="text-sm font-medium text-slate-700 group-hover:text-purple-700">Classmates</p>
          </button>
          <button className="group p-4 text-center rounded-lg border border-slate-200 hover:border-amber-300 hover:bg-amber-50 transition-all duration-200">
            <div className="text-2xl mb-2 group-hover:scale-110 transition-transform">⚙️</div>
            <p className="text-sm font-medium text-slate-700 group-hover:text-amber-700">Settings</p>
          </button>
        </div>
      </div>
    </div>
  )
}
