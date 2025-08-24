"use client"

import * as React from "react"
import { 
  Home, 
  BookOpen, 
  Users, 
  ChartBar, 
  User, 
  Settings,
  GraduationCap,
  Calendar,
  FileText,
  Bell,
  LogOut,
  Library,
  ChevronRight,
  Sparkles,
  Target,
  BarChart3,
  Clock,
  Award
} from "lucide-react"
import Image from "next/image"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarSeparator,
} from "../../../components/ui/sidebar"

// Navigation items by user role - simplified for clean dashboard
const navigationByRole = {
  student: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
      description: "Overview of your studies"
    },
    {
      title: "My Courses",
      url: "/dashboard/my-courses",
      icon: BookOpen,
      description: "View enrolled courses"
    },
    {
      title: "Grades",
      url: "/dashboard/grades",
      icon: Award,
      description: "View your grades"
    },
    {
      title: "Notifications",
      url: "/dashboard/notifications",
      icon: Bell,
      description: "Stay updated"
    },
  ],
  teacher: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
      description: "Teaching overview"
    },
    {
      title: "Teaching Courses",
      url: "/dashboard/teaching-courses",
      icon: GraduationCap,
      description: "Manage your courses"
    },
    {
      title: "Evaluation Tools",
      url: "/dashboard/evaluation-tools",
      icon: Target,
      description: "Create assessments"
    },
    {
      title: "Student Search",
      url: "/dashboard/student-search",
      icon: Users,
      description: "Find students"
    },
  ],
  studentService: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
      description: "Service overview"
    },
    {
      title: "Student Enrollment",
      url: "/dashboard/enroll",
      icon: Users,
      description: "Manage enrollments"
    },
    {
      title: "Library Management",
      url: "/dashboard/library",
      icon: Library,
      description: "Book management"
    },
  ],
  admin: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
      description: "System overview"
    },
    {
      title: "Student Management",
      url: "/dashboard/students",
      icon: Users,
      description: "Manage students"
    },
    {
      title: "Course Management",
      url: "/dashboard/courses",
      icon: BookOpen,
      description: "Manage courses"
    },
  ],
}

// TODO: Replace with actual user role from authentication context
// For now, showing all items for development purposes
const getCurrentUserRole = (): keyof typeof navigationByRole => {
  // This will be replaced with actual authentication logic
  // For development, you can change this to test different roles:
  // return "student" | "teacher" | "studentService" | "admin"
  return "student" // Default to student for better demo
}

const data = {
  navMain: navigationByRole[getCurrentUserRole()],
}

const notificationCount = 6

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false)

  const handleLogout = () => {
    setShowLogoutConfirm(true)
  }

  const confirmLogout = () => {
    // TODO: Implement actual logout logic
    console.log("Logging out...")
    setShowLogoutConfirm(false)
  }

  return (
    <>
      <Sidebar variant="inset" {...props}>
        <SidebarHeader>
          <SidebarGroup>
            <SidebarGroupContent>
              <div className="flex items-center gap-3 p-4">
                <div className="flex items-center gap-3">
                  <div className="relative">
                    <Image 
                      src="/logos/logo.svg" 
                      alt="Harvox Logo" 
                      width={40} 
                      height={40}
                      className="rounded-lg"
                    />
                    <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white"></div>
                  </div>
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-sidebar-foreground">Harvox</span>
                    <span className="text-xs text-sidebar-foreground/70 flex items-center gap-1">
                      <Sparkles className="h-3 w-3" />
                      University
                    </span>
                  </div>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel className="text-xs font-semibold text-sidebar-foreground/60 uppercase tracking-wider px-4">
              Navigation
            </SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={item.isActive}
                      size="lg"
                      className="h-14 px-4 mx-2 rounded-xl hover:bg-sidebar-accent/50 transition-all duration-200"
                    >
                      <a href={item.url} className="flex items-center gap-3">
                        <div className={`p-2 rounded-lg ${
                          item.isActive 
                            ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                            : 'bg-sidebar-accent text-sidebar-accent-foreground'
                        }`}>
                          <item.icon className="h-4 w-4" />
                        </div>
                        <div className="flex-1 text-left">
                          <span className="font-medium text-sidebar-foreground">{item.title}</span>
                          <p className="text-xs text-sidebar-foreground/60 mt-0.5">{item.description}</p>
                        </div>
                        {item.title === "Notifications" && notificationCount > 0 && (
                          <span className="ml-auto h-6 w-6 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                            {notificationCount}
                          </span>
                        )}
                        <ChevronRight className="h-4 w-4 text-sidebar-foreground/40 ml-auto" />
                      </a>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                ))}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        
        <SidebarFooter>
          <SidebarSeparator />
          <SidebarGroup>
            <SidebarGroupContent>
              <div className="p-3">
                <div className="bg-sidebar-accent/50 rounded-lg p-3">
                  <div className="flex items-center gap-3">
                    <div className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex flex-col flex-1 min-w-0">
                      <div className="font-medium text-sidebar-foreground text-sm">John Doe</div>
                      <div className="text-xs text-sidebar-foreground/70 flex items-center gap-1">
                        <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                        {getCurrentUserRole() === 'student' ? 'Student' : 
                         getCurrentUserRole() === 'teacher' ? 'Professor' :
                         getCurrentUserRole() === 'studentService' ? 'Staff' : 'Administrator'}
                      </div>
                    </div>
                  </div>
                  
                  <button 
                    onClick={handleLogout}
                    className="w-full mt-3 px-3 py-2 text-xs font-medium text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors flex items-center justify-center gap-2"
                  >
                    <LogOut className="h-3 w-3" />
                    Sign Out
                  </button>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>

      {/* Logout confirmation modal */}
      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-xl shadow-xl p-6 max-w-sm mx-4">
            <h3 className="text-lg font-semibold text-slate-900 mb-2">Sign Out</h3>
            <p className="text-slate-600 mb-6">Are you sure you want to sign out of your account?</p>
            <div className="flex gap-3">
              <button
                onClick={() => setShowLogoutConfirm(false)}
                className="flex-1 px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="flex-1 px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-lg transition-colors"
              >
                Sign Out
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
