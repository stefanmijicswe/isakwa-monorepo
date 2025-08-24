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
  ChevronRight
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

// Navigation items by user role
const navigationByRole = {
  student: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "My Courses",
      url: "/dashboard/my-courses",
      icon: BookOpen,
    },
    {
      title: "Notifications",
      url: "/dashboard/notifications",
      icon: Bell,
    },
    {
      title: "Study History",
      url: "/dashboard/study-history",
      icon: ChartBar,
    },
    {
      title: "Exam Registration",
      url: "/dashboard/exam-registration",
      icon: Calendar,
    },
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: User,
    },
  ],
  teacher: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Teaching Courses",
      url: "/dashboard/teaching-courses",
      icon: GraduationCap,
    },
    {
      title: "Syllabi Management",
      url: "/dashboard/syllabi",
      icon: FileText,
    },
    {
      title: "Schedule Planning",
      url: "/dashboard/schedule-planning",
      icon: Calendar,
    },
    {
      title: "Evaluation Tools",
      url: "/dashboard/evaluation-tools",
      icon: Settings,
    },
    {
      title: "Student Search",
      url: "/dashboard/student-search",
      icon: Users,
    },
    {
      title: "Grade Entry",
      url: "/dashboard/grade-entry",
      icon: ChartBar,
    },
    {
      title: "Notifications",
      url: "/dashboard/notifications",
      icon: Bell,
    },
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: User,
    },
  ],
  studentService: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "Student Enrollment",
      url: "/dashboard/enroll",
      icon: Users,
    },
    {
      title: "Documents & Certificates",
      url: "/dashboard/documents",
      icon: FileText,
    },
    {
      title: "Timetable Management",
      url: "/dashboard/timetables",
      icon: Calendar,
    },
    {
      title: "General Announcements",
      url: "/dashboard/announcements",
      icon: Bell,
    },
    {
      title: "Library Management",
      url: "/dashboard/library",
      icon: Library,
    },
    {
      title: "Inventory Management",
      url: "/dashboard/inventory",
      icon: Settings,
    },
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: User,
    },
  ],
  admin: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
      isActive: true,
    },
    {
      title: "User Administration",
      url: "/dashboard/user-admin",
      icon: Users,
    },
    {
      title: "Study Programs",
      url: "/dashboard/study-programs",
      icon: GraduationCap,
    },
    {
      title: "Organization Management",
      url: "/dashboard/organization",
      icon: Settings,
    },
    {
      title: "System Configuration",
      url: "/dashboard/system-config",
      icon: Settings,
    },
    {
      title: "Profile",
      url: "/dashboard/profile",
      icon: User,
    },
  ],
}

// TODO: Replace with actual user role from authentication context
// For now, showing all items for development purposes
const getCurrentUserRole = (): keyof typeof navigationByRole => {
  // This will be replaced with actual authentication logic
  // For development, you can change this to test different roles:
  // return "student" | "teacher" | "studentService" | "admin"
  return "studentService" // Default to studentService to access library
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
    console.log("User confirmed logout")
    setShowLogoutConfirm(false)
  }

  const cancelLogout = () => {
    setShowLogoutConfirm(false)
  }

  return (
    <>
      <Sidebar variant="inset" {...props}>
        <SidebarHeader>
          <SidebarGroup>
            <SidebarGroupContent>
              <div className="flex items-center gap-3 p-2">
                <div className="flex items-center gap-3">
                  <Image src="/logos/logo.svg" alt="Harvox Logo" width={40} height={40} />
                  <div className="flex flex-col">
                    <span className="text-lg font-bold text-sidebar-foreground">Harvox</span>
                    <span className="text-xs text-sidebar-foreground/70">University</span>
                  </div>
                </div>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarHeader>
        
        <SidebarContent>
          <SidebarGroup>
            <SidebarGroupLabel>Navigation</SidebarGroupLabel>
            <SidebarGroupContent>
              <SidebarMenu>
                {data.navMain.map((item) => (
                  <SidebarMenuItem key={item.title}>
                    <SidebarMenuButton 
                      asChild 
                      isActive={item.isActive}
                      size="lg"
                      className="h-12"
                    >
                      <a href={item.url}>
                        <item.icon className="h-5 w-5" />
                        <span className="font-medium">{item.title}</span>
                        {item.title === "Notifications" && notificationCount > 0 && (
                          <span className="ml-auto h-6 w-6 bg-red-500 text-white text-xs font-medium rounded-full flex items-center justify-center">
                            {notificationCount}
                          </span>
                        )}
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
              <div className="flex items-center gap-3 p-2">
                <div className="flex items-center gap-3 flex-1">
                  <div className="h-10 w-10 rounded-full bg-sidebar-accent flex items-center justify-center">
                    <User className="h-5 w-5 text-sidebar-accent-foreground" />
                  </div>
                  <div className="flex flex-col">
                    <div className="font-medium text-sidebar-foreground">John Doe</div>
                    <div className="text-xs text-sidebar-foreground/70">Student</div>
                  </div>
                </div>
                <button 
                  onClick={handleLogout}
                  className="p-2 text-sidebar-foreground/70 hover:text-sidebar-foreground hover:bg-sidebar-accent rounded-md transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                </button>
              </div>
            </SidebarGroupContent>
          </SidebarGroup>
        </SidebarFooter>
      </Sidebar>

      {showLogoutConfirm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-sm w-full mx-4 shadow-xl">
            <div className="flex items-center gap-3 mb-4">
              <div className="h-10 w-10 rounded-full bg-red-100 flex items-center justify-center">
                <LogOut className="h-5 w-5 text-red-600" />
              </div>
              <div>
                <h3 className="text-lg font-semibold text-slate-900">Confirm Logout</h3>
                <p className="text-sm text-slate-600">Are you sure you want to log out?</p>
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button
                onClick={cancelLogout}
                className="px-4 py-2 text-slate-600 hover:text-slate-800 hover:bg-slate-100 rounded-md transition-colors"
              >
                Cancel
              </button>
              <button
                onClick={confirmLogout}
                className="px-4 py-2 bg-red-600 text-white hover:bg-red-700 rounded-md transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  )
}
