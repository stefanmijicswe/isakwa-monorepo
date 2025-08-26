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
  Eye,
  ChevronLeft,
  ChevronRight,
  ChevronsLeft,
  ChevronsRight,
  Filter,
  GraduationCap,
  Shield
} from "lucide-react"
import { Button } from "../../../../components/ui/button"
import { Input } from "../../../../components/ui/input"
import { Badge } from "../../../../components/ui/badge"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "../../../../components/ui/tabs"
import { EditPersonnelModal } from "./components/edit-personnel-modal"
import { DeletePersonnelDialog } from "./components/delete-personnel-dialog"

interface Personnel {
  id: number
  firstName: string
  lastName: string
  email: string
  role: 'PROFESSOR' | 'STUDENT_SERVICE'
  isActive: boolean
  createdAt: string
  professorProfile?: {
    id: number
    userId: number
    title: string
    department: {
      id: number
      name: string
    }
    specialization: string
  }
  studentServiceProfile?: {
    id: number
    userId: number
    department: {
      id: number
      name: string
    }
    position: string
  }
}

interface PersonnelResponse {
  users: Personnel[]
  total: number
  page: number
  limit: number
  totalPages: number
}

export default function PersonnelPage() {
  const { user } = useAuth()
  const [personnel, setPersonnel] = useState<Personnel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState("")
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [totalPersonnel, setTotalPersonnel] = useState(0)
  const [limit] = useState(10)
  const [activeTab, setActiveTab] = useState('professors')
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [selectedPerson, setSelectedPerson] = useState<Personnel | null>(null)
  const [isDeleteDialogOpen, setIsDeleteDialogOpen] = useState(false)
  const [personToDelete, setPersonToDelete] = useState<Personnel | null>(null)

  // Fetch personnel from backend API
  const fetchPersonnel = async (role: string, page: number = 1, search?: string) => {
    try {
      setLoading(true)
      setError(null)

      let endpoint = ''
      if (role === 'PROFESSOR') {
        endpoint = 'http://localhost:3001/api/users/professors'
      } else if (role === 'STUDENT_SERVICE') {
        endpoint = 'http://localhost:3001/api/users/student-service'
      } else {
        throw new Error('Invalid role')
      }

      // Build query parameters
      const params = new URLSearchParams({
        page: page.toString(),
        limit: limit.toString()
      })

      if (search) {
        params.append('search', search)
      }

      const response = await fetch(`${endpoint}?${params}`, {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch personnel: ${response.status}`)
      }

      const data: PersonnelResponse = await response.json()

      setPersonnel(data.users)
      setTotalPages(data.totalPages)
      setTotalPersonnel(data.total)
      setCurrentPage(data.page)
    } catch (err) {
      console.error('Error fetching personnel:', err)
      setError(err instanceof Error ? err.message : 'Failed to fetch personnel')
    } finally {
      setLoading(false)
    }
  }

  // Initial fetch
  useEffect(() => {
    if (user?.role === 'ADMIN') {
      fetchPersonnel(activeTab === 'professors' ? 'PROFESSOR' : 'STUDENT_SERVICE', 1, searchTerm || "")
    }
  }, [user, activeTab])

  // Handle search
  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
    fetchPersonnel(activeTab === 'professors' ? 'PROFESSOR' : 'STUDENT_SERVICE', 1, value)
  }

  // Handle page change
  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    fetchPersonnel(activeTab === 'professors' ? 'PROFESSOR' : 'STUDENT_SERVICE', page, searchTerm || "")
  }

  // Handle edit personnel
  const handleEdit = (person: Personnel) => {
    setSelectedPerson(person)
    setIsEditModalOpen(true)
  }

  // Handle delete personnel
  const handleDelete = (person: Personnel) => {
    setPersonToDelete(person)
    setIsDeleteDialogOpen(true)
  }

  // Handle confirm delete
  const handleConfirmDelete = async () => {
    try {
      if (!personToDelete) {
        console.error('No personnel selected for deletion')
        return
      }

      console.log('Deleting personnel:', personToDelete)
      
      // Make API call to delete personnel
      const response = await fetch(`http://localhost:3001/api/users/${personToDelete.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        throw new Error(`Failed to delete personnel: ${response.status}`)
      }

      console.log('Personnel deleted successfully')
      
      // Close dialog and refresh the list
      setIsDeleteDialogOpen(false)
      setPersonToDelete(null)
      fetchPersonnel(activeTab === 'professors' ? 'PROFESSOR' : 'STUDENT_SERVICE', currentPage, searchTerm || "")
    } catch (error) {
      console.error('Error deleting personnel:', error)
      // TODO: Show error message to user
    }
  }

  // Handle save personnel
  const handleSavePersonnel = async (data: any) => {
    try {
      if (!selectedPerson) {
        console.error('No personnel selected for update')
        return
      }

      console.log('Saving personnel:', data)
      
      // Prepare update data
      const updateData = {
        firstName: data.firstName,
        lastName: data.lastName,
        email: data.email,
        isActive: data.isActive,
        title: data.title,
        departmentId: data.departmentId,
        position: data.title // For student service, position is stored in title field
      }

      // Make API call to update personnel
      const response = await fetch(`http://localhost:3001/api/users/${selectedPerson.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(updateData)
      })

      if (!response.ok) {
        throw new Error(`Failed to update personnel: ${response.status}`)
      }

      const updatedPersonnel = await response.json()
      console.log('Personnel updated successfully:', updatedPersonnel)
      
      // Close modal and refresh the list
      setIsEditModalOpen(false)
      setSelectedPerson(null)
      fetchPersonnel(activeTab === 'professors' ? 'PROFESSOR' : 'STUDENT_SERVICE', currentPage, searchTerm || "")
    } catch (error) {
      console.error('Error saving personnel:', error)
      // TODO: Show error message to user
    }
  }

  // Handle tab change
  const handleTabChange = (value: string) => {
    setActiveTab(value)
    setCurrentPage(1)
    setSearchTerm("")
    fetchPersonnel(value === 'professors' ? 'PROFESSOR' : 'STUDENT_SERVICE', 1, "")
  }

  // Get status badge color
  const getStatusBadge = (isActive: boolean) => {
    if (isActive) {
      return <Badge className="bg-emerald-50 text-emerald-700 border-emerald-200">Active</Badge>
    } else {
      return <Badge className="bg-slate-50 text-slate-700 border-slate-200">Inactive</Badge>
    }
  }

  // Get role badge
  const getRoleBadge = (role: string) => {
    if (role === 'PROFESSOR') {
      return <Badge className="bg-blue-50 text-blue-700 border-blue-200">
        <GraduationCap className="w-3 h-3 mr-1" />
        Professor
      </Badge>
    } else {
      return <Badge className="bg-green-50 text-green-700 border-green-200">
        <Shield className="w-3 h-3 mr-1" />
        Staff
      </Badge>
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
          <h1 className="text-2xl font-semibold text-slate-900">Personnel Management</h1>
          <p className="text-slate-500 text-sm mt-1">
            Manage professors and administrative staff
          </p>
        </div>
        <Button size="sm" className="bg-slate-900 hover:bg-slate-800">
          <Plus className="h-4 w-4 mr-2" />
          Add Personnel
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={handleTabChange} className="space-y-4">
        <TabsList className="grid w-full grid-cols-2 h-10">
          <TabsTrigger value="professors" className="flex items-center gap-2 text-sm">
            <GraduationCap className="h-4 w-4" />
            Professors
          </TabsTrigger>
          <TabsTrigger value="student-service" className="flex items-center gap-2 text-sm">
            <Shield className="h-4 w-4" />
            Student Service
          </TabsTrigger>
        </TabsList>

        <TabsContent value="professors" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search professors..."
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
              {totalPersonnel > 0 && `${totalPersonnel} professor${totalPersonnel === 1 ? '' : 's'}`}
            </div>
          </div>

          {/* Professors Table */}
          <div className="bg-white border border-slate-200 rounded-lg">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-900"></div>
                <span className="ml-3 text-slate-600">Loading professors...</span>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">Error loading professors</h3>
                <p className="text-slate-600 text-sm mb-4">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchPersonnel('PROFESSOR', currentPage, searchTerm || "")}
                  className="border-slate-200"
                >
                  Try Again
                </Button>
              </div>
            ) : personnel.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <GraduationCap className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">No professors found</h3>
                <p className="text-slate-600 text-sm">
                  {searchTerm ? `No professors match "${searchTerm}"` : 'No professors registered yet'}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Professor
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Title
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Specialization
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Status
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
                      {personnel.map((person) => (
                        <tr key={person.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center mr-3">
                                <span className="text-sm font-medium text-white">
                                  {person.firstName.charAt(0)}{person.lastName.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-slate-900">
                                  {person.firstName} {person.lastName}
                                </div>
                                <div className="text-sm text-slate-500">{person.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-slate-900">
                              {person.professorProfile?.title || (
                                <span className="text-slate-400 italic">No title</span>
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-slate-900">
                                              {person.professorProfile?.department?.name || (
                  <span className="text-slate-400 italic">No department</span>
                )}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-slate-900">
                              {person.professorProfile?.specialization || (
                                <span className="text-slate-400 italic">No specialization</span>
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(person.isActive)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {formatDate(person.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-1">
                          
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={() => handleEdit(person)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                onClick={() => handleDelete(person)}
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
                    Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalPersonnel)} of {totalPersonnel} professors
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
                            className={`h-8 w-8 p-0 ${page === currentPage
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
        </TabsContent>

        <TabsContent value="student-service" className="space-y-4">
          {/* Search and Filters */}
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <div className="relative">
                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                <Input
                  placeholder="Search student service staff..."
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
              {totalPersonnel > 0 && `${totalPersonnel} staff member${totalPersonnel === 1 ? '' : 's'}`}
            </div>
          </div>

          {/* Student Service Table */}
          <div className="bg-white border border-slate-200 rounded-lg">
            {loading ? (
              <div className="flex items-center justify-center py-16">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-slate-900"></div>
                <span className="ml-3 text-slate-600">Loading staff...</span>
              </div>
            ) : error ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 bg-red-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <div className="w-6 h-6 bg-red-500 rounded-full"></div>
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">Error loading staff</h3>
                <p className="text-slate-600 text-sm mb-4">{error}</p>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => fetchPersonnel('STUDENT_SERVICE', currentPage, searchTerm || "")}
                  className="border-slate-200"
                >
                  Try Again
                </Button>
              </div>
            ) : personnel.length === 0 ? (
              <div className="text-center py-16">
                <div className="w-12 h-12 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4">
                  <Shield className="h-6 w-6 text-slate-400" />
                </div>
                <h3 className="text-lg font-medium text-slate-900 mb-2">No staff found</h3>
                <p className="text-slate-600 text-sm">
                  {searchTerm ? `No staff match "${searchTerm}"` : 'No staff registered yet'}
                </p>
              </div>
            ) : (
              <>
                <div className="overflow-hidden">
                  <table className="w-full">
                    <thead className="bg-slate-50 border-b border-slate-200">
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Staff Member
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Position
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Department
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                          Status
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
                      {personnel.map((person) => (
                        <tr key={person.id} className="hover:bg-slate-50 transition-colors">
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-8 w-8 rounded-full bg-black flex items-center justify-center mr-3">
                                <span className="text-sm font-medium text-white">
                                  {person.firstName.charAt(0)}{person.lastName.charAt(0)}
                                </span>
                              </div>
                              <div>
                                <div className="text-sm font-medium text-slate-900">
                                  {person.firstName} {person.lastName}
                                </div>
                                <div className="text-sm text-slate-500">{person.email}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-slate-900">
                              {person.studentServiceProfile?.position || (
                                <span className="text-slate-400 italic">No position</span>
                              )}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className="text-sm text-slate-900">
                                              {person.studentServiceProfile?.department?.name || (
                  <span className="text-slate-400 italic">No department</span>
                )}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {getStatusBadge(person.isActive)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-500">
                            {formatDate(person.createdAt)}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <div className="flex items-center justify-end space-x-1">

                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0"
                                onClick={() => handleEdit(person)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm" 
                                className="h-8 w-8 p-0 text-red-600 hover:text-red-700"
                                onClick={() => handleDelete(person)}
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
                    Showing {((currentPage - 1) * limit) + 1} to {Math.min(currentPage * limit, totalPersonnel)} of {totalPersonnel} staff members
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
                            className={`h-8 w-8 p-0 ${page === currentPage
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
        </TabsContent>
      </Tabs>

      {/* Edit Personnel Modal */}
      <EditPersonnelModal
        isOpen={isEditModalOpen}
        onClose={() => {
          setIsEditModalOpen(false)
          setSelectedPerson(null)
        }}
        personnel={selectedPerson}
        onSave={handleSavePersonnel}
      />

      {/* Delete Personnel Dialog */}
      <DeletePersonnelDialog
        isOpen={isDeleteDialogOpen}
        onClose={() => {
          setIsDeleteDialogOpen(false)
          setPersonToDelete(null)
        }}
        onConfirm={handleConfirmDelete}
        personnelName={personToDelete ? `${personToDelete.firstName} ${personToDelete.lastName}` : ''}
      />
    </div>
  )
}
