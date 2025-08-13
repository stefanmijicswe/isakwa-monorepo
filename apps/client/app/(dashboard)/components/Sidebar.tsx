"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
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
  Sidebar as SidebarRoot,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
} from "../../../components/ui/sidebar"

const navigationItems = [
  {
    name: "Dashboard",
    href: "/app",
    icon: Home,
    description: "Overview and quick actions"
  },
  {
    name: "Courses",
    href: "/app/courses",
    icon: BookOpen,
    description: "Manage your courses"
  },
  {
    name: "Students",
    href: "/app/students",
    icon: Users,
    description: "Student management"
  },
  {
    name: "Grades",
    href: "/app/grades",
    icon: ChartBar,
    description: "Grades and assessments"
  },
  {
    name: "Assignments",
    href: "/app/assignments",
    icon: FileText,
    description: "Course assignments"
  },
  {
    name: "Schedule",
    href: "/app/schedule",
    icon: Calendar,
    description: "Class schedule"
  },
  {
    name: "Profile",
    href: "/app/profile",
    icon: User,
    description: "Your profile settings"
  },
  {
    name: "Settings",
    href: "/app/settings",
    icon: Settings,
    description: "Application settings"
  }
]

export function Sidebar() {
  const pathname = usePathname()

  return (
    <SidebarRoot className="w-64">
      <SidebarHeader className="p-6 border-b border-slate-200">
        <div className="flex items-center space-x-3">
          <div className="h-10 w-10 rounded-lg bg-slate-900 flex items-center justify-center">
            <GraduationCap className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-xl font-semibold text-slate-900">Singidunum</h1>
            <p className="text-sm text-slate-500">Dashboard</p>
          </div>
        </div>
      </SidebarHeader>

      <SidebarContent className="p-4">
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {navigationItems.map((item) => {
                const isActive = pathname === item.href
                return (
                  <SidebarMenuItem key={item.name}>
                    <SidebarMenuButton
                      asChild
                      isActive={isActive}
                      tooltip={item.description}
                    >
                      <Link href={item.href}>
                        <item.icon className="h-5 w-5" />
                        <span>{item.name}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
              })}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter className="p-4 border-t border-slate-200">
        <div className="flex items-center space-x-3 px-3 py-2">
          <div className="h-8 w-8 rounded-full bg-green-100 flex items-center justify-center">
            <Bell className="h-4 w-4 text-green-600" />
          </div>
          <div className="flex-1">
            <p className="text-sm font-medium text-slate-900">Notifications</p>
            <p className="text-xs text-slate-500">3 new messages</p>
          </div>
        </div>
      </SidebarFooter>
    </SidebarRoot>
  )
}
