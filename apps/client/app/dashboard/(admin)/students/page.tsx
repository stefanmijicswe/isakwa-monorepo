"use client"

import * as React from "react"
import { useState, useEffect } from "react"
import { useAuth } from "../../../../components/auth"
import { 
  Users, 
  Search, 
  Plus, 
  Edit, 
  Trash2, 
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter
} from "lucide-react"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Badge } from "../../../../components/ui/badge"
import { EditStudentModal } from "./components/edit-student-modal"
import type { StudentFormValues } from "./components/edit-student-modal"
import { DeleteStudentDialog } from "./components/delete-student-dialog"

interface Student {
  id: number
  firstName: string
  lastName: string
  email: string
  isActive: boolean
  dateOfBirth?: string
  createdAt: string
  updatedAt: string
  studentProfile?: {
    id: number
    userId: number
    studentIndex: string
    year: number
    phoneNumber?: string
    status: 'ACTIVE' | 'INACTIVE' | 'GRADUATED' | 'INTERRUPTED'
    studyProgramId?: number
    enrollmentYear?: string
  }
}

interface StudentsResponse {
  users: Student[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function StudentsPage() {
  const { user } = useAuth()
  const [students, setStudents] = useState<Student[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalStudents, setTotalStudents] = useState(0)
  const [limit] = useState(10)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<Student | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [studentToDelete, setStudentToDelete] = useState<Student | null>(null)

  // Fetch students from backend API
  const fetchStudents = async (page: number = 1, search?: string) => {
    try {
      setLoading(true)
      setError(null)

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      })
      
      if (search) {
        params.append('search', search)
      }

      const response = await fetch(`http://localhost:3001/api/users/students?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch students: ${response.status}`)
      }

      const data: StudentsResponse = await response.json()
      
      setStudents(data.users)
      setTotalPages(data.totalPages)
      setTotalStudents(data.total)
      setCurrentPage(data.page)
    } catch (err) {
      console.error('Error fetching students:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch students')
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchStudents(1, searchTerm || "")
    }
  }, [user])

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
    fetchStudents(1, value)
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchStudents(page, searchTerm || "")
  }

  // Handle edit student
  const handleEdit = (student: Student) => {
    setSelectedStudent(student)
    setIsEditModalOpen(true)
  }

  // Handle delete student
  const handleDelete = (student: Student) => {
    setStudentToDelete(student)
    setIsDeleteDialogOpen(true)
  }

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    try {
      if (!studentToDelete) {
        console.error('No student selected for deletion')
        return
      }

      // console.log('Deleting student:', studentToDelete)
      
      // Make API call to delete student
      const response = await fetch(`http://localhost:3001/api/users/${studentToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to delete student: ${response.status}`)
      }

      // console.log('Student deleted successfully')
      
      // Close dialog and refresh the list
      setIsDeleteDialogOpen(false)
      setStudentToDelete(null)
      fetchStudents(currentPage, searchTerm || "")
    } catch (error) {
      console.error('Error deleting student:', error)
      // TODO: Show error message to user
    }
  }

  // Handle save student
  const handleSaveStudent = async (data: StudentFormValues) => {
    try {
      // TODO: Implement API call to update student
      // console.log('Saving student:', data)
      
      // For now, just close the modal and refresh the list
      setIsEditModalOpen(false)
      setSelectedStudent(null)
      fetchStudents(currentPage, searchTerm || "")
    } catch (error) {
      console.error('Error saving student:', error)
    }
  }

  // Get status badge color
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

  // Format date
  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  if (user?.role !== 'ADMIN') {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600">Access Denied</h1>
          <p className="text-slate-600 mt-2">You don't have permission to view this page.</p>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
      <div>
          <h1 className="text-2xl font-semibold text-slate-900">Students</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage your student roster and information
          </p>
        </div>
        <Button size="sm" className="bg-slate-900 hover:bg-slate-800">
          <Plus className="h-4 w-4 mr-2" />
          Add Student
        </Button>
      </div>

      {/* Search and Filters */}
      <div className="flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search students..."
              value={searchTerm || ""}
              onChange={(e) => handleSearch(e.target.value)}
              className="pl-10 w-80 border-slate-200 focus:border-slate-400 focus:ring-slate-400"
            />
          </div>
          <Button variant="outline" size="sm" className="border-slate-200">
            <Filter className="h-4 w-4 mr-2" />
            Filters
          </Button>
      </div>

        <div className="text-sm text-slate-500">
          {totalStudents > 0 && `${totalStudents} student${totalStudents === 1 ? '' : 's'}`}
                  </div>
                </div>

      {/* Students Table */}
      <div className="bg-white border border-slate-200 rounded-lg">
        {loading ? (
          <div className="flex items-center justify-center py-16">
            <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-900"></div>
            <span className="ml-3 text-slate-600">Loading students...</span>
                        </div>
        ) : error ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                        </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">Error loading students</h3>
            <p className="text-slate-600 text-sm mb-4">{error}</p>
            <Button 
              variant="outline" 
              size="sm"
              onClick={() => fetchStudents(currentPage, searchTerm || "")}
              className="border-slate-200"
            >
              Try Again
            </Button>
                        </div>
        ) : students.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
              <Users className="h-6 w-6 text-slate-400" />
                        </div>
            <h3 className="text-lg font-medium text-slate-900 mb-2">No students found</h3>
            <p className="text-slate-600 text-sm">
              {searchTerm ? `No students match "${searchTerm}"` : 'No students registered yet'}
            </p>
                      </div>
        ) : (
          <>
            <div className="overflow-hidden">
              <table className="w-full">
                <thead className="bg-slate-50 border-b border-slate-200">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Student
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Student Index
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Year
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Contact
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Joined
                    </th>
                    <th className="px-6 py-3 text-right text-xs font-medium text-slate-500 uppercase tracking-wider">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-slate-200">
                  {students.map((student) => (
                    <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="flex items-center">
                          <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center mr-3">
                            <span className="text-sm font-medium text-white">
                              {student.firstName.charAt(0)}{student.lastName.charAt(0)}
                            </span>
                          </div>
                          <div>
                            <div className="text-sm font-medium text-slate-900">
                              {student.firstName} {student.lastName}
                    </div>
                            <div className="text-sm text-slate-500">{student.email}</div>
                  </div>
                </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <code className="text-sm text-slate-600 bg-slate-50 px-2 py-1 rounded">
                          {student.studentProfile?.studentIndex}
                        </code>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className="text-sm text-slate-900">Year {student.studentProfile?.year}</span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        {getStatusBadge(student.studentProfile?.status || 'INACTIVE')}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-sm text-slate-600">
                          {student.studentProfile?.phoneNumber || (
                            <span className="text-slate-400 italic">No phone</span>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                        {formatDate(student.createdAt)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                               <div className="flex items-center justify-end space-x-1">
                         <Button 
                           variant="ghost" 
                           size="sm" 
                           className="h-8 w-8 p-0"
                           onClick={() => handleEdit(student)}
                         >
                           <Edit className="h-4 w-4" />
                         </Button>
                         <Button 
                           variant="ghost" 
                           size="sm" 
                           className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                           onClick={() => handleDelete(student)}
                         >
                           <Trash2 className="h-4 w-4" />
                         </Button>
                       </div>
                      </td>
                    </tr>
                    ))}
                </tbody>
              </table>
                </div>

            {/* Pagination */}
            <div className="bg-white px-6 py-3 border-t border-slate-200 flex items-center justify-between">
              <div className="text-sm text-slate-700">
                Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalStudents)} of {totalStudents} students
                          </div>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(1)}
                  disabled={currentPage === 1}
                  className="h-8 px-2 border-slate-200"
                >
                  <ChevronsLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage - 1)}
                  disabled={currentPage === 1}
                  className="h-8 px-2 border-slate-200"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                
                <div className="flex items-center space-x-1">
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    const page = Math.max(1, Math.min(totalPages - 4, currentPage - 2)) + i
                    if (page > totalPages) return null
                    
                    return (
                      <Button
                        key={page}
                        variant={page === currentPage ? "default" : "outline"}
                        size="sm"
                        onClick={() => handlePageChange(page)}
                        className={`h-8 w-8 p-0 ${
                          page === currentPage 
                            ? 'bg-slate-900 hover:bg-slate-800' 
                            : 'border-slate-200'
                        }`}
                      >
                        {page}
                      </Button>
                    )
                  })}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(currentPage + 1)}
                  disabled={currentPage === totalPages}
                  className="h-8 px-2 border-slate-200"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handlePageChange(totalPages)}
                  disabled={currentPage === totalPages}
                  className="h-8 px-2 border-slate-200"
                >
                  <ChevronsRight className="h-4 w-4" />
                </Button>
                        </div>
                      </div>
          </>
                )}
              </div>

      {/* Edit Student Modal */}
      <EditStudentModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedStudent(null)
        }}
        student={selectedStudent}
        onSave={handleSaveStudent}
      />

      {/* Delete Student Dialog */}
      <DeleteStudentDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false)
          setStudentToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        studentName={studentToDelete ? `${studentToDelete.firstName} ${studentToDelete.lastName}` : ''}
      />
    </div>
  )
}
