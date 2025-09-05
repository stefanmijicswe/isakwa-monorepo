"use client"

import * as React from "react"
import { useRouter } from "next/navigation"
import { useAuth } from "../../../components/auth"
import { useEffect } from "react"

export default function StudentServiceDefaultPage() {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (user && user.role === 'STUDENT_SERVICE') {
      // Redirect student service users to request management
      router.replace('/dashboard/request-management')
    }
  }, [user, router])

  // Show loading while redirecting
  return (
    <div className="flex items-center justify-center min-h-screen">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-slate-600">Redirecting to request management...</p>
      </div>
    </div>
  )
}
