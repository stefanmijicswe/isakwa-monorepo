"use client"

import * as React from "react"
import { 
  BookOpen, 
  GraduationCap, 
  Calendar, 
  Clock, 
  TrendingUp, 
  Users, 
  FileText, 
  Bell,
  ArrowUpRight,
  CheckCircle,
  AlertCircle,
  Clock as ClockIcon
} from "lucide-react"

export default function DashboardPage() {
  const [currentTime, setCurrentTime] = React.useState(new Date())

  React.useEffect(() => {
    const timer = setInterval(() => setCurrentTime(new Date()), 1000)
    return () => clearInterval(timer)
  }, [])

  const stats = [
    {
      title: "Active Courses",
      value: "5",
      change: "+2",
      changeType: "positive",
      icon: BookOpen,
      color: "blue"
    },
    {
      title: "Average Grade",
      value: "8.7",
      change: "+0.3",
      changeType: "positive",
      icon: GraduationCap,
      color: "green"
    },
    {
      title: "ECTS Earned",
      value: "120",
      change: "+18",
      changeType: "positive",
      icon: TrendingUp,
      color: "purple"
    },
    {
      title: "Next Class",
      value: "2h 15m",
      change: "IT101",
      changeType: "neutral",
      icon: Clock,
      color: "amber"
    }
  ]

  const recentActivities = [
    {
      id: 1,
      type: "grade",
      title: "Programming Fundamentals - Final Exam",
      description: "Grade: A (95/100)",
      time: "2 hours ago",
      status: "completed"
    },
    {
      id: 2,
      type: "assignment",
      title: "Web Technologies - Project Submission",
      description: "Due in 3 days",
      time: "1 day ago",
      status: "pending"
    },
    {
      id: 3,
      type: "course",
      title: "Database Systems - Course Enrolled",
      description: "Summer 2024 semester",
      time: "3 days ago",
      status: "completed"
    },
    {
      id: 4,
      type: "notification",
      title: "New course material available",
      description: "Introduction to AI - Week 5",
      time: "5 days ago",
      status: "info"
    }
  ]

  const upcomingDeadlines = [
    {
      id: 1,
      title: "Web Technologies Final Project",
      course: "WT202",
      dueDate: "2024-12-20",
      daysLeft: 3,
      priority: "high"
    },
    {
      id: 2,
      title: "Database Systems Midterm",
      course: "DB203",
      dueDate: "2024-12-25",
      daysLeft: 8,
      priority: "medium"
    },
    {
      id: 3,
      title: "Programming Assignment #5",
      course: "PF102",
      dueDate: "2024-12-30",
      daysLeft: 13,
      priority: "low"
    }
  ]

  const getStatusIcon = (type: string) => {
    switch (type) {
      case "grade":
        return <GraduationCap className="h-4 w-4" />
      case "assignment":
        return <FileText className="h-4 w-4" />
      case "course":
        return <BookOpen className="h-4 w-4" />
      case "notification":
        return <Bell className="h-4 w-4" />
      default:
        return <CheckCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "completed":
        return "text-green-600 bg-green-50"
      case "pending":
        return "text-amber-600 bg-amber-50"
      case "info":
        return "text-blue-600 bg-blue-50"
      default:
        return "text-slate-600 bg-slate-50"
    }
  }

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "border-red-200 bg-red-50"
      case "medium":
        return "border-amber-200 bg-amber-50"
      case "low":
        return "border-green-200 bg-green-50"
      default:
        return "border-slate-200 bg-slate-50"
    }
  }

  const getPriorityTextColor = (priority: string) => {
    switch (priority) {
      case "high":
        return "text-red-700"
      case "medium":
        return "text-amber-700"
      case "low":
        return "text-green-700"
      default:
        return "text-slate-700"
    }
  }

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
            {currentTime.toLocaleDateString('en-US', { 
              weekday: 'long', 
              year: 'numeric', 
              month: 'long', 
              day: 'numeric' 
            })}
          </div>
          <div className="text-lg font-semibold text-slate-900">
            {currentTime.toLocaleTimeString('en-US', { 
              hour: '2-digit', 
              minute: '2-digit',
              second: '2-digit'
            })}
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat, index) => (
          <div key={index} className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md transition-all duration-200">
            <div className="flex items-center justify-between">
              <div className={`p-2 rounded-lg bg-${stat.color}-50`}>
                <stat.icon className={`h-5 w-5 text-${stat.color}-600`} />
              </div>
              <ArrowUpRight className="h-4 w-4 text-slate-400" />
            </div>
            <div className="mt-4">
              <p className="text-sm font-medium text-slate-600">{stat.title}</p>
              <p className="text-2xl font-bold text-slate-900 mt-1">{stat.value}</p>
              <div className="flex items-center mt-2">
                <span className={`text-sm font-medium ${
                  stat.changeType === 'positive' ? 'text-green-600' : 
                  stat.changeType === 'negative' ? 'text-red-600' : 'text-slate-600'
                }`}>
                  {stat.change}
                </span>
                <span className="text-sm text-slate-500 ml-1">
                  {stat.changeType === 'positive' ? 'from last month' : 
                   stat.changeType === 'negative' ? 'from last month' : stat.change}
                </span>
              </div>
            </div>
          </div>
        ))}
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
              {recentActivities.map((activity) => (
                <div key={activity.id} className="flex items-start space-x-3 p-3 rounded-lg hover:bg-slate-50 transition-colors">
                  <div className={`p-2 rounded-lg ${getStatusColor(activity.status)}`}>
                    {getStatusIcon(activity.type)}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-medium text-slate-900">{activity.title}</p>
                    <p className="text-sm text-slate-600">{activity.description}</p>
                    <p className="text-xs text-slate-500 mt-1">{activity.time}</p>
                  </div>
                </div>
              ))}
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
              {upcomingDeadlines.map((deadline) => (
                <div key={deadline.id} className={`p-4 rounded-lg border ${getPriorityColor(deadline.priority)}`}>
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-slate-900">{deadline.title}</p>
                      <p className="text-xs text-slate-600 mt-1">{deadline.course}</p>
                      <div className="flex items-center mt-2">
                        <ClockIcon className="h-3 w-3 text-slate-500 mr-1" />
                        <span className="text-xs text-slate-500">
                          Due: {deadline.dueDate}
                        </span>
                      </div>
                    </div>
                    <div className="text-right">
                      <span className={`text-xs font-medium px-2 py-1 rounded-full ${getPriorityTextColor(deadline.priority)} bg-white`}>
                        {deadline.daysLeft} days
                      </span>
                    </div>
                  </div>
                </div>
              ))}
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
