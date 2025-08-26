"use client"

import { useState, useEffect } from "react"
import { useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import * as z from "zod"
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Badge } from "@/components/ui/badge"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"

// Form validation schema
const personnelFormSchema = z.object({
  firstName: z.string().min(1, "First name is required"),
  lastName: z.string().min(1, "Last name is required"),
  email: z.string().email("Invalid email address"),
  title: z.string().min(1, "Title is required"),
  departmentId: z.number().min(1, "Department is required"),
  specialization: z.string().optional(),
  isActive: z.boolean()
})

type PersonnelFormValues = z.infer<typeof personnelFormSchema>

interface Personnel {
  id: number
  firstName: string
  lastName: string
  email: string
  isActive: boolean
  createdAt: string
  professorProfile?: {
    title: string
    department: {
      id: number
      name: string
    }
  }
  studentServiceProfile?: {
    position: string
    department: {
      id: number
      name: string
    }
  }
  role: 'PROFESSOR' | 'STUDENT_SERVICE'
}

interface EditPersonnelModalProps {
  isOpen: boolean
  onClose: () => void
  personnel: Personnel | null
  onSave: (data: PersonnelFormValues) => void
}

export function EditPersonnelModal({ isOpen, onClose, personnel, onSave }: EditPersonnelModalProps) {
  const [departments, setDepartments] = useState<Array<{id: number, name: string}>>([])
  const [loadingDepartments, setLoadingDepartments] = useState(false)

  const form = useForm<PersonnelFormValues>({
    resolver: zodResolver(personnelFormSchema),
    defaultValues: {
      firstName: "",
      lastName: "",
      email: "",
      title: "",
      departmentId: 1,
      specialization: "",
      isActive: true
    }
  })

  // Fetch departments from backend
  const fetchDepartments = async () => {
    try {
      setLoadingDepartments(true)
      const token = localStorage.getItem('auth_token')
      if (!token) {
        console.error('No auth token found')
        setDepartments([])
        return
      }

      const response = await fetch('http://localhost:3001/api/departments', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const data = await response.json()
      console.log('Departments response:', data)
      
      // Store full department objects
      setDepartments(data)
    } catch (error) {
      console.error('Error fetching departments:', error)
      setDepartments([])
    } finally {
      setLoadingDepartments(false)
    }
  }

  // Reset form when personnel changes
  useEffect(() => {
    if (personnel) {
      const isProfessor = personnel.role === 'PROFESSOR'
      
      if (isProfessor && personnel.professorProfile) {
        form.reset({
          firstName: personnel.firstName,
          lastName: personnel.lastName,
          email: personnel.email,
          title: personnel.professorProfile.title || "",
          departmentId: personnel.professorProfile.department?.id || 1,
          specialization: personnel.professorProfile.specialization || "",
          isActive: personnel.isActive
        })
      } else if (!isProfessor && personnel.studentServiceProfile) {
        form.reset({
          firstName: personnel.firstName,
          lastName: personnel.lastName,
          email: personnel.email,
          title: personnel.studentServiceProfile.position || "",
          departmentId: personnel.studentServiceProfile.department?.id || 1,
          specialization: "",
          isActive: personnel.isActive
        })
      }
    }
  }, [personnel, form])

  // Fetch departments when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchDepartments()
    }
  }, [isOpen])

  const handleSubmit = (data: PersonnelFormValues) => {
    onSave(data)
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? (
      <Badge className="bg-green-100 text-green-800 hover:bg-green-100">Active</Badge>
    ) : (
      <Badge variant="secondary">Inactive</Badge>
    )
  }

  if (!personnel) return null

  const isProfessor = personnel.role === 'PROFESSOR'

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold">
            Edit {isProfessor ? 'Professor' : 'Staff Member'}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)} className="space-y-6">
            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="firstName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>First Name</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter first name" />
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
                      <Input {...field} placeholder="Enter last name" />
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
                    <Input {...field} type="email" placeholder="Enter email address" />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-2 gap-4">
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{isProfessor ? 'Title' : 'Position'}</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder={isProfessor ? "e.g., Associate Professor" : "e.g., Administrative Assistant"} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="departmentId"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Department</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="Select department" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {loadingDepartments ? (
                          <SelectItem value="loading" disabled>Loading departments...</SelectItem>
                        ) : departments.length > 0 ? (
                          departments.map((dept) => (
                            <SelectItem key={dept.id} value={dept.id.toString()}>
                              {dept.name}
                            </SelectItem>
                          ))
                        ) : (
                          <SelectItem value="no-departments" disabled>No departments available</SelectItem>
                        )}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {isProfessor && (
              <FormField
                control={form.control}
                name="specialization"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Specialization</FormLabel>
                    <FormControl>
                      <Input {...field} placeholder="Enter specialization (optional)" />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            )}

            <FormField
              control={form.control}
              name="isActive"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Status</FormLabel>
                  <div className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id="isActive"
                      checked={field.value}
                      onChange={(e) => field.onChange(e.target.checked)}
                      className="rounded border-slate-300 text-slate-900 focus:ring-slate-500"
                    />
                    <label htmlFor="isActive" className="text-sm text-slate-700">
                      Active
                    </label>
                  </div>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="flex items-center justify-end space-x-3 pt-4">
              <Button type="button" variant="outline" onClick={onClose}>
                Cancel
              </Button>
              <Button type="submit">
                Save Changes
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export type { PersonnelFormValues }
