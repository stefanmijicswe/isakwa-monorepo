"use client"

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../../../components/ui/card'
import { Button } from '../../../../components/ui/button'
import { Input } from '../../../../components/ui/input'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../../../components/ui/tabs'
import { Badge } from '../../../../components/ui/badge'
import { Users, Search, Plus, User, GraduationCap, Shield } from 'lucide-react'

interface Personnel {
  id: number
  email: string
  firstName: string
  lastName: string
  role: 'PROFESSOR' | 'STUDENT_SERVICE'
  isActive: boolean
  createdAt: string
  professorProfile?: {
    id: number
    userId: number
    title: string
    department: string
    specialization: string
  }
  studentServiceProfile?: {
    id: number
    userId: number
    department: string
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
  const [personnel, setPersonnel] = useState<Personnel[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [currentPage, setCurrentPage] = useState(1)
  const [totalPages, setTotalPages] = useState(1)
  const [activeTab, setActiveTab] = useState('professors')

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

      const url = new URL(endpoint)
      if (search) {
        url.searchParams.set('search', search)
      }
      if (page > 1) {
        url.searchParams.set('page', page.toString())
      }
      url.searchParams.set('limit', '10')

      const response = await fetch(url.toString(), {
        headers: {
          'Content-Type': 'application/json',
        },
      })

      if (!response.ok) {
        throw new Error(`Failed to fetch personnel: ${response.status}`)
      }

      const data = await response.json()
      // Backend vraća { users: [...], total, page, totalPages }
      setPersonnel(data.users || [])
      setTotalPages(data.totalPages || 1)
      setCurrentPage(data.page || 1)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to fetch personnel')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    if (activeTab === 'professors') {
      fetchPersonnel('PROFESSOR', 1, searchTerm)
    } else {
      fetchPersonnel('STUDENT_SERVICE', 1, searchTerm)
    }
  }, [activeTab])

  useEffect(() => {
    if (activeTab === 'professors') {
      fetchPersonnel('PROFESSOR', currentPage, searchTerm)
    } else {
      fetchPersonnel('STUDENT_SERVICE', currentPage, searchTerm)
    }
  }, [searchTerm, currentPage])

  const handleSearch = (value: string) => {
    setSearchTerm(value)
    setCurrentPage(1)
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
    if (activeTab === 'professors') {
      fetchPersonnel('PROFESSOR', page, searchTerm)
    } else {
      fetchPersonnel('STUDENT_SERVICE', page, searchTerm)
    }
  }

  const getRoleBadge = (role: string) => {
    if (role === 'PROFESSOR') {
      return <Badge variant="secondary" className="bg-blue-50 text-blue-700 text-xs px-2 py-0.5 h-5"><GraduationCap className="w-3 h-3 mr-1" />Professor</Badge>
    }
    return <Badge variant="secondary" className="bg-green-50 text-green-700 text-xs px-2 py-0.5 h-5"><Shield className="w-3 h-3 mr-1" />Staff</Badge>
  }

  const getStatusBadge = (isActive: boolean) => {
    return isActive ? 
      <Badge variant="default" className="bg-green-50 text-green-700 text-xs px-2 py-0.5 h-5">Active</Badge> :
      <Badge variant="secondary" className="bg-gray-50 text-gray-600 text-xs px-2 py-0.5 h-5">Inactive</Badge>
  }

  if (loading && personnel.length === 0) {
    return (
      <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
        <div className="flex items-center justify-between space-y-2">
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Personnel Management</h2>
        </div>
        <div className="flex items-center justify-center h-32">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="flex-1 space-y-4 p-4 md:p-8 pt-6">
      <div className="flex items-center justify-between space-y-2">
        <div>
          <h2 className="text-2xl font-semibold tracking-tight text-gray-900">Personnel Management</h2>
          <p className="text-sm text-gray-500 mt-1">
            Manage professors and administrative staff
          </p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700 h-9 px-4 text-sm">
          <Plus className="w-4 h-4 mr-2" />
          Add Personnel
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-3">
        <TabsList className="grid w-full grid-cols-2 h-10">
          <TabsTrigger value="professors" className="flex items-center gap-2 text-sm">
            <GraduationCap className="w-4 h-4" />
            Professors
          </TabsTrigger>
          <TabsTrigger value="student-service" className="flex items-center gap-2 text-sm">
            <Shield className="w-4 h-4" />
            Student Service
          </TabsTrigger>
        </TabsList>

        <TabsContent value="professors" className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search professors..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8 h-9 text-sm"
              />
            </div>
          </div>

          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2 text-red-600 text-sm">
                  <span>Error: {error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-3">
            {personnel.map((person) => (
              <Card key={person.id} className="hover:shadow-sm transition-shadow border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-black flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {person.firstName.charAt(0)}{person.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">{person.firstName} {person.lastName}</h3>
                        <p className="text-xs text-gray-500">{person.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {getRoleBadge(person.role)}
                          {getStatusBadge(person.isActive)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-xs text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>

        <TabsContent value="student-service" className="space-y-3">
          <div className="flex items-center space-x-2">
            <div className="relative flex-1 max-w-sm">
              <Search className="absolute left-2 top-2.5 h-4 w-4 text-muted-foreground" />
              <Input
                placeholder="Search student service staff..."
                value={searchTerm}
                onChange={(e) => handleSearch(e.target.value)}
                className="pl-8 h-9 text-sm"
              />
            </div>
          </div>

          {error && (
            <Card className="border-red-200 bg-red-50">
              <CardContent className="p-3">
                <div className="flex items-center space-x-2 text-red-600 text-sm">
                  <span>Error: {error}</span>
                </div>
              </CardContent>
            </Card>
          )}

          <div className="grid gap-3">
            {personnel.map((person) => (
              <Card key={person.id} className="hover:shadow-sm transition-shadow border-gray-200">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 rounded-full bg-black flex items-center justify-center">
                        <span className="text-sm font-medium text-white">
                          {person.firstName.charAt(0)}{person.lastName.charAt(0)}
                        </span>
                      </div>
                      <div>
                        <h3 className="text-sm font-semibold text-gray-900">{person.firstName} {person.lastName}</h3>
                        <p className="text-xs text-gray-500">{person.email}</p>
                        <div className="flex items-center space-x-2 mt-1">
                          {getRoleBadge(person.role)}
                          {getStatusBadge(person.isActive)}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>

          {totalPages > 1 && (
            <div className="flex items-center justify-center space-x-2 pt-2">
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={() => handlePageChange(currentPage - 1)}
                disabled={currentPage === 1}
              >
                Previous
              </Button>
              <span className="text-xs text-muted-foreground">
                Page {currentPage} of {totalPages}
              </span>
              <Button
                variant="outline"
                size="sm"
                className="h-8 px-3 text-xs"
                onClick={() => handlePageChange(currentPage + 1)}
                disabled={currentPage === totalPages}
              >
                Next
              </Button>
            </div>
          )}
        </TabsContent>
      </Tabs>
    </div>
  )
}
