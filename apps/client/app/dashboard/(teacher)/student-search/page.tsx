'use client'

import React from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Download, Eye, Search, User, GraduationCap, Calendar, CheckCircle } from 'lucide-react'
import { Student, Faculty } from '@/lib/student-search.service'

// Import the service instance
const studentSearchService = {
  async getStudents(facultyFilter?: string): Promise<Student[]> {
    try {
      let token = localStorage.getItem('auth_token')
      if (!token) {
        console.warn('No auth token found, setting test token')
        const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiam9obi5zbWl0aEBpc2Frd2EuZWR1Iiwicm9sZSI6IlBST0ZFU1NPUiIsImZpcnN0TmFtZSI6IkpvaG4iLCJsYXN0TmFtZSI6IlNtaXRoIiwiaWF0IjoxNzU2OTAyNjEzLCJleHAiOjE3NTc1MDc0MTN9.Siqy9TGJr2ZGB5UJ20cJPv6rcDRIM4aMg0qKlqlaeho'
        localStorage.setItem('auth_token', testToken)
        token = testToken
      }

      const params = new URLSearchParams()
      // Note: Backend expects studyProgramId, not faculty name
      // For now, we'll fetch all students and filter client-side
      params.append('limit', '100') // Get more students
      
      const response = await fetch(`http://localhost:3001/api/academic-records/students/search?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.warn(`API call failed with status ${response.status}:`, errorText)
        return []
      }

      const data = await response.json()
      
      // Check if data is array or object with data property
      const studentsArray = Array.isArray(data) ? data : (data.data || [])
      
      // Transform API data to our Student interface
      const students: Student[] = studentsArray.map((apiStudent: any) => ({
        id: apiStudent.id,
        firstName: apiStudent.user?.firstName || apiStudent.firstName || 'Unknown',
        lastName: apiStudent.user?.lastName || apiStudent.lastName || 'Unknown',
        indexNumber: apiStudent.indexNumber || apiStudent.studentIndex || 'N/A',
        year: apiStudent.year || 1,
        faculty: apiStudent.studyProgram?.faculty?.name || 'Unknown Faculty',
        averageGrade: apiStudent.averageGrade || 0,
        totalECTS: apiStudent.totalECTS || 0,
        status: apiStudent.status || 'ACTIVE',
        email: apiStudent.user?.email || apiStudent.email || '',
        enrollmentYear: apiStudent.enrollmentYear || '2024/2025',
        studyProgram: apiStudent.studyProgram,
        // Transform passed exams from grades that backend provides
        passedExams: apiStudent.grades?.map((grade: any) => ({
          subject: grade.exam?.subject?.name || 'Unknown Subject',
          date: grade.exam?.date || grade.createdAt,
          grade: grade.grade,
          points: grade.points || (grade.grade * 10)
        })) || []
      }))

      return students

    } catch (error) {
      console.error('Error fetching students from API:', error)
      return []
    }
  },

  async getFaculties(): Promise<Faculty[]> {
    try {
      let token = localStorage.getItem('auth_token')
      if (!token) {
        console.warn('No auth token found, setting test token')
        const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiam9obi5zbWl0aEBpc2Frd2EuZWR1Iiwicm9sZSI6IlBST0ZFU1NPUiIsImZpcnN0TmFtZSI6IkpvaG4iLCJsYXN0TmFtZSI6IlNtaXRoIiwiaWF0IjoxNzU2OTAyNjEzLCJleHAiOjE3NTc1MDc0MTN9.Siqy9TGJr2ZGB5UJ20cJPv6rcDRIM4aMg0qKlqlaeho'
        localStorage.setItem('auth_token', testToken)
        token = testToken
      }

      const response = await fetch('http://localhost:3001/api/faculties', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        console.warn(`Faculties API call failed with status ${response.status}`)
        return []
      }

      const data = await response.json()
      
      const facultiesArray = Array.isArray(data) ? data : (data.data || [])
      
      return facultiesArray.map((faculty: any) => ({
        id: faculty.id,
        name: faculty.name,
        code: faculty.code || faculty.name
      }))

    } catch (error) {
      console.error('Error fetching faculties:', error)
      return []
    }
  }
}

export default function StudentSearchPage() {
  const [searchTerm, setSearchTerm] = React.useState('')
  const [enrollmentYear, setEnrollmentYear] = React.useState('All Years')
  const [averageGradeRange, setAverageGradeRange] = React.useState('All Grades')
  const [facultyFilter, setFacultyFilter] = React.useState('All Faculties')
  const [selectedStudent, setSelectedStudent] = React.useState<Student | null>(null)
  const [isDetailsModalOpen, setIsDetailsModalOpen] = React.useState(false)
  const [students, setStudents] = React.useState<Student[]>([])
  const [faculties, setFaculties] = React.useState<Faculty[]>([])
  const [loading, setLoading] = React.useState(true)
  const [exporting, setExporting] = React.useState(false)

  const handleViewDetails = (student: Student) => {
    setSelectedStudent(student)
    setIsDetailsModalOpen(true)
  }

  const handleExport = async () => {
    setExporting(true)
    try {
      const filteredStudents = getFilteredStudents()
      // Export functionality - simplified for now
      console.log('Exporting students:', filteredStudents.length)
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setExporting(false)
    }
  }

  const handleFacultyChange = (newFaculty: string) => {
    setFacultyFilter(newFaculty)
  }

  const getFilteredStudents = () => {
    return students.filter(student => {
      const matchesSearch = !searchTerm || 
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.indexNumber.toLowerCase().includes(searchTerm.toLowerCase())

      const matchesYear = enrollmentYear === 'All Years' || student.enrollmentYear === enrollmentYear

      const matchesGrade = averageGradeRange === 'All Grades' || 
        (averageGradeRange === '9-10' && student.averageGrade >= 9) ||
        (averageGradeRange === '8-9' && student.averageGrade >= 8 && student.averageGrade < 9) ||
        (averageGradeRange === '7-8' && student.averageGrade >= 7 && student.averageGrade < 8) ||
        (averageGradeRange === '6-7' && student.averageGrade >= 6 && student.averageGrade < 7)

      const matchesFaculty = facultyFilter === 'All Faculties' || student.faculty === facultyFilter

      return matchesSearch && matchesYear && matchesGrade && matchesFaculty
    })
  }

  React.useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true)
        
        const [studentsData, facultiesData] = await Promise.all([
          studentSearchService.getStudents(),
          studentSearchService.getFaculties()
        ])
        
        setStudents(studentsData)
        setFaculties(facultiesData)
      } catch (error) {
        console.error('Error loading data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  const filteredStudents = getFilteredStudents()

  if (loading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold tracking-tight">Student Search</h1>
            <p className="text-slate-600">Search and view detailed student information</p>
          </div>
        </div>
        <div className="text-center py-8">Loading...</div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Student Search</h1>
          <p className="text-slate-600">Search and view detailed student information</p>
        </div>
        <Button 
          onClick={handleExport}
          disabled={exporting || filteredStudents.length === 0}
          className="flex items-center gap-2"
        >
          <Download className="h-4 w-4" />
          Export
        </Button>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="pt-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4 mb-6">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                placeholder="Search by name, index number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>

            <Select value={enrollmentYear} onValueChange={setEnrollmentYear}>
              <SelectTrigger>
                <SelectValue placeholder="Enrollment Year" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Years">All Years</SelectItem>
                <SelectItem value="2024">2024</SelectItem>
                <SelectItem value="2023">2023</SelectItem>
                <SelectItem value="2022">2022</SelectItem>
                <SelectItem value="2021">2021</SelectItem>
                <SelectItem value="2020">2020</SelectItem>
              </SelectContent>
            </Select>

            <Select value={averageGradeRange} onValueChange={setAverageGradeRange}>
              <SelectTrigger>
                <SelectValue placeholder="Average Grade Range" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Grades">All Grades</SelectItem>
                <SelectItem value="9-10">9.0 - 10.0</SelectItem>
                <SelectItem value="8-9">8.0 - 8.9</SelectItem>
                <SelectItem value="7-8">7.0 - 7.9</SelectItem>
                <SelectItem value="6-7">6.0 - 6.9</SelectItem>
              </SelectContent>
            </Select>

            <Select value={facultyFilter} onValueChange={handleFacultyChange}>
              <SelectTrigger>
                <SelectValue placeholder="Faculty" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="All Faculties">All Faculties</SelectItem>
                {faculties.map((faculty) => (
                  <SelectItem key={faculty.id} value={faculty.name}>
                    {faculty.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle>Student Results</CardTitle>
          <p className="text-slate-600">Found {filteredStudents.length} students</p>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {filteredStudents.map((student) => (
              <div 
                key={student.id} 
                className="flex items-center justify-between p-4 border border-slate-200 rounded-lg hover:bg-slate-50 transition-colors"
              >
                <div className="flex items-center space-x-4">
                  <div className="space-y-1">
                    <div className="flex items-center space-x-2">
                      <Badge variant="outline" className="text-xs">
                        {student.status}
                      </Badge>
                      <Badge variant="outline" className="text-xs">
                        {student.enrollmentYear}
                      </Badge>
                      <Badge 
                        variant="secondary"
                        className={
                          student.averageGrade >= 9 ? "bg-green-100 text-green-800" : 
                          student.averageGrade >= 8 ? "bg-blue-100 text-blue-800" :
                          student.averageGrade >= 7 ? "bg-yellow-100 text-yellow-800" : 
                          "bg-red-100 text-red-800"
                        }
                      >
                        {student.averageGrade} GPA
                      </Badge>
                    </div>
                    <h3 className="font-semibold text-lg">
                      {student.firstName} {student.lastName}
                    </h3>
                    <div className="text-sm text-slate-600 space-y-1">
                      <div className="flex items-center space-x-4">
                        <span>📚 Enrolled: {student.faculty}</span>
                        <span>🎓 {student.totalECTS} ECTS</span>
                        <span>📅 Year {student.year}</span>
                      </div>
                    </div>
                  </div>
                </div>
                
                <div className="flex items-center space-x-2">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleViewDetails(student)}
                    className="flex items-center gap-2"
                  >
                    <Eye className="h-4 w-4" />
                    View Details
                  </Button>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Student Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-4xl max-h-[85vh] w-[90vw] h-[85vh] flex flex-col p-6">
          <DialogHeader className="flex-shrink-0">
            <DialogTitle className="text-xl">
              {selectedStudent?.firstName} {selectedStudent?.lastName}
            </DialogTitle>
            <DialogDescription>
              Detailed student information and academic record
            </DialogDescription>
          </DialogHeader>

          {selectedStudent && (
            <Tabs defaultValue="overview" className="flex flex-col flex-1 overflow-hidden">
              <TabsList className="grid w-full grid-cols-3 mb-4 flex-shrink-0">
                <TabsTrigger value="overview" className="text-sm px-4">Overview</TabsTrigger>
                <TabsTrigger value="enrollment" className="text-sm px-4">Enrollment</TabsTrigger>
                <TabsTrigger value="exams" className="text-sm px-4">Exams</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="flex-1 overflow-y-auto space-y-6">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <User className="h-5 w-5" />
                        Basic Information
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Index Number:</span>
                        <Badge variant="outline" className="font-mono">
                          {selectedStudent.indexNumber}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Status:</span>
                        <Badge variant={selectedStudent.status === "ACTIVE" ? "default" : "secondary"}>
                          {selectedStudent.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Faculty:</span>
                        <span className="font-medium text-right">{selectedStudent.faculty}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Enrollment Year:</span>
                        <span className="font-medium">{selectedStudent.enrollmentYear}</span>
                      </div>
                    </CardContent>
                  </Card>

                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <GraduationCap className="h-5 w-5" />
                        Academic Performance
                      </CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-3">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Average Grade:</span>
                        <Badge 
                          variant="secondary"
                          className={selectedStudent.averageGrade >= 9 ? "bg-green-100 text-green-800" : 
                                     selectedStudent.averageGrade >= 8 ? "bg-blue-100 text-blue-800" :
                                     selectedStudent.averageGrade >= 7 ? "bg-yellow-100 text-yellow-800" : 
                                     "bg-red-100 text-red-800"}
                        >
                          {selectedStudent.averageGrade}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">ECTS Earned:</span>
                        <span className="font-medium">{selectedStudent.totalECTS || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Year:</span>
                        <span className="font-medium">{selectedStudent.year}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Enrollment Tab */}
              <TabsContent value="enrollment" className="flex-1 overflow-y-auto space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Current Enrollment
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-3">
                      <div className="flex items-center justify-between p-3 border rounded-lg">
                        <div>
                          <div className="font-medium">{selectedStudent.studyProgram?.name || 'Unknown Program'}</div>
                          <div className="text-sm text-slate-600">Enrollment Year: {selectedStudent.enrollmentYear}</div>
                          <div className="text-sm text-slate-600">Faculty: {selectedStudent.faculty}</div>
                        </div>
                        <Badge variant="default">
                          {selectedStudent.status}
                        </Badge>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Exams Tab */}
              <TabsContent value="exams" className="flex-1 overflow-hidden">
                <div className="h-full overflow-y-auto space-y-4 pr-2 max-h-[calc(85vh-200px)]">
                  {/* Passed Exams */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Passed Exams
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedStudent.passedExams?.length ? (
                        <div className="space-y-2">
                          {selectedStudent.passedExams.map((exam, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-green-50">
                              <div>
                                <div className="font-medium">{exam.subject}</div>
                                <div className="text-sm text-slate-600">{exam.date}</div>
                              </div>
                              <div className="text-right">
                                <Badge className="bg-green-100 text-green-800">Grade: {exam.grade}</Badge>
                                <div className="text-sm text-slate-600 mt-1">{exam.points} points</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-slate-500">No passed exams recorded</div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Academic Statistics */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <GraduationCap className="h-5 w-5 text-blue-600" />
                        Academic Statistics
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 gap-4 text-center">
                        <div className="p-3 border rounded-lg">
                          <div className="text-2xl font-bold text-green-600">{selectedStudent.passedExams?.length || 0}</div>
                          <div className="text-sm text-slate-600">Passed Exams</div>
                        </div>
                        <div className="p-3 border rounded-lg">
                          <div className="text-2xl font-bold text-blue-600">{selectedStudent.totalECTS || 0}</div>
                          <div className="text-sm text-slate-600">Total ECTS</div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
