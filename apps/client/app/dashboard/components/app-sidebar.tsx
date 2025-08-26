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
  Award,
  ClipboardList,
  Search,
  BookMarked,
  PenTool,
  Database,
  Package
} from "lucide-react"
import Image from "next/image"
import { useAuth } from "../../../components/auth"
import Link from "next/link"
import { usePathname } from "next/navigation"
import { getNotifications } from "../../../lib/courses.service"

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

// Navigation items by user role - mapped to actual routes
const navigationByRole = {
  STUDENT: [
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
      title: "Exam Registration",
      url: "/dashboard/exam-registration",
      icon: ClipboardList,
      description: "Register for exams"
    },
    {
      title: "Study History",
      url: "/dashboard/study-history",
      icon: BarChart3,
      description: "View academic history"
    },
    {
      title: "Notifications",
      url: "/dashboard/notifications",
      icon: Bell,
      description: "Stay updated"
    },
  ],
  PROFESSOR: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
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
      title: "Evaluation Instruments",
      url: "/dashboard/evaluation-instruments",
      icon: PenTool,
      description: "Manage evaluation instruments"
    },
    {
      title: "Assignments",
      url: "/dashboard/assignments",
      icon: FileText,
      description: "Create and manage assignments"
    },
    {
      title: "Grade Entry",
      url: "/dashboard/grade-entry",
      icon: Award,
      description: "Enter student grades"
    },
    {
      title: "Grading",
      url: "/dashboard/grading",
      icon: Award,
      description: "Grade student submissions"
    },
    {
      title: "Student Search",
      url: "/dashboard/student-search",
      icon: Search,
      description: "Find students"
    },
    {
      title: "Syllabi",
      url: "/dashboard/syllabi",
      icon: BookMarked,
      description: "Manage course syllabi"
    },
    {
      title: "Schedule Planning",
      url: "/dashboard/schedule-planning",
      icon: Clock,
      description: "Plan course schedules"
    },
    {
      title: "Notifications",
      url: "/dashboard/notifications",
      icon: Bell,
      description: "Stay updated"
    },
  ],
  STUDENT_SERVICE: [
    {
      title: "Student Enrollment",
      url: "/dashboard/enroll",
      icon: Users,
      description: "Manage enrollments"
    },
    {
      title: "Certificate Generator",
      url: "/dashboard/certificates",
      icon: FileText,
      description: "Generate student certificates"
    },
    {
      title: "Library Management",
      url: "/dashboard/library",
      icon: Library,
      description: "Book management"
    },
    {
      title: "Inventory",
      url: "/dashboard/inventory",
      icon: Package,
      description: "Manage inventory items"
    },
    {
      title: "Notifications",
      url: "/dashboard/notifications",
      icon: Bell,
      description: "Stay updated"
    },
  ],
  ADMIN: [
    {
      title: "Student Management",
      url: "/dashboard/students",
      icon: Users,
      description: "Manage students"
    },
    {
      title: "Personnel Management",
      url: "/dashboard/personnel",
      icon: Users,
      description: "Manage professors and staff"
    },
    {
      title: "Course Management",
      url: "/dashboard/courses",
      icon: BookOpen,
      description: "Manage courses"
    },
    {
      title: "Study Program Management",
      url: "/dashboard/study-programs",
      icon: GraduationCap,
      description: "Manage study programs"
    },
    {
      title: "Notifications",
      url: "/dashboard/notifications",
      icon: Bell,
      description: "Stay updated"
    },
  ],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  const { user, logout } = useAuth()
  const [showLogoutConfirm, setShowLogoutConfirm] = React.useState(false)
  const [notificationCount, setNotificationCount] = React.useState(0)
  const pathname = usePathname()

  // Fetch notifications count when user is logged in
  React.useEffect(() => {
    if (user) {
      const fetchNotifications = async () => {
        try {
          const notifications = await getNotifications()
          setNotificationCount(notifications.length)
        } catch (error) {
          console.error('Failed to fetch notifications:', error)
          setNotificationCount(0)
        }
      }
      
      fetchNotifications()
    }
  }, [user])

  const handleLogout = () => {
    setShowLogoutConfirm(true)
  }

  const confirmLogout = () => {
    logout()
    setShowLogoutConfirm(false)
  }

  // Get navigation items based on user role
  const getNavigationItems = () => {
    if (!user) return navigationByRole.STUDENT // Default fallback
    
    const role = user.role as keyof typeof navigationByRole
    return navigationByRole[role] || navigationByRole.STUDENT
  }

  const navigationItems = getNavigationItems()

  return (
    <>
      <Sidebar className="w-80 min-w-80 max-w-80 flex-shrink-0 border-r border-border bg-background shadow-sm h-screen overflow-y-auto flex flex-col" {...props}>
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

            <SidebarGroupContent>
              <SidebarMenu>
                {navigationItems.map((item) => {
                  const isActive = pathname === item.url
                  return (
                    <SidebarMenuItem key={item.title}>
                      <SidebarMenuButton 
                        asChild 
                        isActive={isActive}
                        size="lg"
                        className="h-14 px-4 mx-2 rounded-xl hover:bg-sidebar-accent/50 transition-all duration-200"
                      >
                        <Link href={item.url} className="flex items-center gap-3">
                          <div className={`p-2 rounded-lg ${
                            isActive 
                              ? 'bg-sidebar-primary text-sidebar-primary-foreground' 
                              : 'bg-sidebar-accent text-sidebar-accent-foreground'
                          }`}>
                            {item.icon && <item.icon className="h-4 w-4" />}
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
                        </Link>
                      </SidebarMenuButton>
                    </SidebarMenuItem>
                  )
                })}
              </SidebarMenu>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarContent>
        
        <SidebarFooter>
          <SidebarSeparator />
          <div className="p-2">
            <div className="bg-sidebar-accent/30 rounded-lg p-3">
              <div className="flex items-center gap-3">
                <div className="h-8 w-8 rounded-full bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                  {user ? (
                    <span className="text-sm font-medium text-white">
                      {user.firstName.charAt(0)}{user.lastName.charAt(0)}
                    </span>
                  ) : (
                    <User className="h-4 w-4 text-white" />
                  )}
                </div>
                <div className="flex flex-col flex-1 min-w-0">
                  <div className="font-medium text-sidebar-foreground text-sm">
                    {user ? `${user.firstName} ${user.lastName}` : 'Loading...'}
                  </div>
                  <div className="text-xs text-sidebar-foreground/70 flex items-center gap-1">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    {user ? user.role.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()) : 'Loading...'}
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-sidebar-foreground/60 hover:text-sidebar-foreground hover:bg-sidebar-accent/50 rounded-md transition-colors"
                  title="Sign Out"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </div>
          </div>
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
