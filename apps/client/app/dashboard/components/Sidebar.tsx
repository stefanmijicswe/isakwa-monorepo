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
    href: "/dashboard",
    icon: Home,
    description: "Overview and quick actions"
  },
  {
    name: "Courses",
    href: "/dashboard/courses",
    icon: BookOpen,
    description: "Manage your courses"
  },
  {
    name: "Students",
    href: "/dashboard/students",
    icon: Users,
    description: "Student management"
  },
  {
    name: "Grades",
    href: "/dashboard/grades",
    icon: ChartBar,
    description: "Grades and assessments"
  },
  {
    name: "Assignments",
    href: "/dashboard/assignments",
    icon: FileText,
    description: "Course assignments"
  },
  {
    name: "Schedule",
    href: "/dashboard/schedule",
    icon: Calendar,
    description: "Class schedule"
  },
  {
    name: "Profile",
    href: "/dashboard/profile",
    icon: User,
    description: "Your profile settings"
  },
  {
    name: "Settings",
    href: "/dashboard/settings",
    icon: Settings,
    description: "Application settings"
  }
]

export function Sidebar({ ...props }: React.ComponentProps<typeof SidebarRoot>) {
  const pathname = usePathname()

  return (
    <SidebarRoot variant="inset" collapsible="offcanvas" {...props}>
      <SidebarHeader>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton
              asChild
              className="data-[slot=sidebar-menu-button]:!p-1.5"
            >
              <Link href="/dashboard">
                <div className="h-10 w-10 rounded-lg bg-slate-900 flex items-center justify-center">
                  <GraduationCap className="h-6 w-6 text-white" />
                </div>
                <span className="text-base font-semibold">Singidunum</span>
              </Link>
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarHeader>

      <SidebarContent>
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
    </SidebarRoot>
  )
}
