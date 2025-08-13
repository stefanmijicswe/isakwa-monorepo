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
  Bell
} from "lucide-react"

import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../../components/ui/sidebar"

// Navigation items by user role
const navigationByRole = {
  student: [
    {
      title: "Dashboard",
      url: "/dashboard",
      icon: Home,
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
    },
    {
      title: "Student Enrollment",
      url: "/dashboard/student-enrollment",
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
      icon: BookOpen,
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
  return "student" // Default to student for now
}

const data = {
  navMain: navigationByRole[getCurrentUserRole()],
}

export function AppSidebar({ ...props }: React.ComponentProps<typeof Sidebar>) {
  return (
    <Sidebar collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <a href="/dashboard">
                <div className="h-10 w-10 rounded-lg bg-slate-900 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="text-base font-semibold">Singidunum</span>
              </a>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>
      <SidebarContent>
        <SidebarMenu>
          {data.navMain.map((item) => (
            <SidebarMenuItem key={item.title}>
              <SidebarMenuButton asChild tooltip={item.title}>
                <a href={item.url}>
                  {item.icon && <item.icon />}
                  <span>{item.title}</span>
                </a>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>
      <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton size="lg" className="data-[state=open]:bg-sidebar-accent data-[state=open]:text-sidebar-accent-foreground">
              <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
                <Bell className="h-4 w-4 text-green-600" />
              </div>
              <div className="grid flex-1 text-left text-sm leading-tight">
                <span className="truncate font-medium">Notifications</span>
                <span className="text-muted-foreground truncate text-xs">3 new messages</span>
              </div>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  )
}
