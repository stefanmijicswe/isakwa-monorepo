"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Button } from "@/components/ui/button"
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form"
import { Input } from "@/components/ui/input"

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Badge } from "@/components/ui/badge"

// Validation schema
const studentFormSchema = z.object({
  firstName: z.string().min(2, "First name must be at least 2 characters"),
  lastName: z.string().min(2, "Last name must be at least 2 characters"),
  email: z.string().email("Invalid email address"),
  dateOfBirth: z.string().optional(),
  studentIndex: z.string().min(1, "Student index is required"),
  year: z.number().min(1, "Year must be at least 1").max(8, "Year cannot exceed 8"),
  phoneNumber: z.string().optional(),
  status: z.enum(["ACTIVE", "INACTIVE", "GRADUATED", "INTERRUPTED"]),
  enrollmentYear: z.string().optional(),
  studyProgramId: z.number().optional(),
})

export type StudentFormValues = z.infer<typeof studentFormSchema>

interface StudyProgram {
  id: number
  name: string
  faculty: {
    name: string
  }
}

interface EditStudentModalProps {
  isOpen: boolean
  onClose: () => void
  student: {
    id: number
    firstName: string
    lastName: string
    email: string
    dateOfBirth?: string
    isActive: boolean
    studentProfile?: {
      id: number
      studentIndex: string
      year: number
      phoneNumber?: string
      status: 'ACTIVE' | 'INACTIVE' | 'GRADUATED' | 'INTERRUPTED'
      enrollmentYear?: string
      studyProgramId?: number
    }
  } | null
  onSave: (data: StudentFormValues) => Promise<void>
}

export function EditStudentModal({
  isOpen,
  onClose,
  student,
  onSave,
}: EditStudentModalProps) {
  const [studyPrograms, setStudyPrograms] = useState<StudyProgram[]>([])
  const [loading, setLoading] = useState(false)
  const [loadingPrograms, setLoadingPrograms] = useState(false)

  const form = useForm<StudentFormValues>({
    resolver: zodResolver(studentFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      dateOfBirth: "",
      studentIndex: "",
      year: 1,
      phoneNumber: "",
      status: "ACTIVE",
      enrollmentYear: "",
      studyProgramId: undefined,
    },
  })

  // Fetch study programs
  useEffect(() => {
    const fetchStudyPrograms = async () => {
      try {
        console.log('🔍 Fetching study programs...')
        setLoadingPrograms(true)
        
        // Try without Authorization header first since backend doesn't require it
        const response = await fetch('http://localhost:3001/api/study-programs', {
          headers: {
            'Content-Type': 'application/json'
          }
        })
        
        console.log('📡 Response status:', response.status)
        
        if (response.ok) {
          const data = await response.json()
          console.log('✅ Study programs data:', data)
          // Backend returns {data: [...], meta: {...}} format
          setStudyPrograms(data.data || [])
        } else {
          console.error('❌ Failed to fetch study programs:', response.status)
          setStudyPrograms([])
        }
      } catch (error) {
        console.error('💥 Error fetching study programs:', error)
        setStudyPrograms([])
      } finally {
        setLoadingPrograms(false)
      }
    }

    if (isOpen) {
      console.log('🚀 Modal opened, fetching study programs...')
      fetchStudyPrograms()
    }
  }, [isOpen])

  // Update form when student changes
  useEffect(() => {
    if (student) {
      form.reset({
        firstName: student.firstName,
        lastName: student.lastName,
        email: student.email,
        dateOfBirth: student.dateOfBirth ? new Date(student.dateOfBirth).toISOString().split('T')[0] : "",
        studentIndex: student.studentProfile?.studentIndex || "",
        year: student.studentProfile?.year || 1,
        phoneNumber: student.studentProfile?.phoneNumber || "",
        status: student.studentProfile?.status || "ACTIVE",
        enrollmentYear: student.studentProfile?.enrollmentYear || "",
        studyProgramId: student.studentProfile?.studyProgramId,
      })
    }
  }, [student, form])

  const onSubmit = async (data: StudentFormValues) => {
    try {
      setLoading(true)
      await onSave(data)
      onClose()
    } catch (error) {
      console.error('Error saving student:', error)
    } finally {
      setLoading(false)
    }
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'ACTIVE':
        return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Active</Badge>
      case 'INACTIVE':
        return <Badge className="bg-slate-50 text-slate-700 border-slate-200">Inactive</Badge>
      case 'GRADUATED':
        return <Badge className="bg-blue-50 text-blue-700 border-blue-200">Graduated</Badge>
      case 'INTERRUPTED':
        return <Badge className="bg-red-50 text-red-700 border-red-200">Interrupted</Badge>
      default:
        return <Badge className="bg-slate-50 text-slate-700 border-slate-200">{status}</Badge>
    }
  }

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px] max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Edit Student</DialogTitle>
          <DialogDescription>
            Update student information. Click save when you're done.
          </DialogDescription>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Personal Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-900">Personal Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="firstName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>First Name</FormLabel>
                      <FormControl>
                        <Input placeholder="First name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="lastName"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Last Name</FormLabel>
                      <FormControl>
                        <Input placeholder="Last name" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Email</FormLabel>
                    <FormControl>
                      <Input type="email" placeholder="Email address" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="dateOfBirth"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Date of Birth</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Academic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-900">Academic Information</h3>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="studentIndex"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Student Index</FormLabel>
                      <FormControl>
                        <Input placeholder="Student index" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="year"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Year of Study</FormLabel>
                      <FormControl>
                        <Input 
                          type="number" 
                          min="1" 
                          max="8" 
                          placeholder="Year"
                          {...field}
                          onChange={(e) => field.onChange(parseInt(e.target.value) || 1)}
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
              <div className="grid grid-cols-2 gap-4">
                <FormField
                  control={form.control}
                  name="enrollmentYear"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Enrollment Year</FormLabel>
                      <FormControl>
                        <Input placeholder="e.g., 2023" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="studyProgramId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Study Program</FormLabel>
                                             <Select onValueChange={(value) => field.onChange(parseInt(value) || undefined)} value={field.value?.toString() || "loading"}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select study program" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {loadingPrograms ? (
                            <SelectItem value="loading" disabled>Loading programs...</SelectItem>
                          ) : Array.isArray(studyPrograms) && studyPrograms.length > 0 ? (
                            studyPrograms.map((program) => (
                              <SelectItem key={program.id} value={program.id.toString()}>
                                {program.name} - {program.faculty.name}
                              </SelectItem>
                            ))
                          ) : (
                            <SelectItem value="no-programs" disabled>No programs available</SelectItem>
                          )}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Contact & Status */}
            <div className="space-y-4">
              <h3 className="text-lg font-medium text-slate-900">Contact & Status</h3>
              <FormField
                control={form.control}
                name="phoneNumber"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Phone Number</FormLabel>
                    <FormControl>
                      <Input placeholder="Phone number" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Status</FormLabel>
                    <Select onValueChange={field.onChange} value={field.value}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select status" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="ACTIVE">
                          <div className="flex items-center gap-2">
                            <span>Active</span>
                            {getStatusBadge("ACTIVE")}
                          </div>
                        </SelectItem>
                        <SelectItem value="INACTIVE">
                          <div className="flex items-center gap-2">
                            <span>Inactive</span>
                            {getStatusBadge("INACTIVE")}
                          </div>
                        </SelectItem>
                        <SelectItem value="GRADUATED">
                          <div className="flex items-center gap-2">
                            <span>Graduated</span>
                            {getStatusBadge("GRADUATED")}
                          </div>
                        </SelectItem>
                        <SelectItem value="INTERRUPTED">
                          <div className="flex items-center gap-2">
                            <span>Interrupted</span>
                            {getStatusBadge("INTERRUPTED")}
                          </div>
                        </SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit" disabled={loading}>
                {loading ? "Saving..." : "Save Changes"}
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
