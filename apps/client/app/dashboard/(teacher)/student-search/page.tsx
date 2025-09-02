"use client"

import * as React from "react"
import { Search, Users, Eye, Download, Calendar, GraduationCap, BookOpen, AlertTriangle, CheckCircle, Clock, FileText, User } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Badge } from "@/components/ui/badge"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { studentSearchService, type Student, type Faculty } from "@/lib/student-search.service"

export default function StudentSearchPage() {
  const [searchTerm, setSearchTerm] = React.useState("")
  const [selectedFilters, setSelectedFilters] = React.useState({
    year: "",
    averageGrade: "",
    faculty: ""
  })
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
      await studentSearchService.exportStudents(filteredStudents, 'csv')
    } catch (error) {
      console.error('Export failed:', error)
    } finally {
      setExporting(false)
    }
  }

  // Load data on component mount
  React.useEffect(() => {
    const loadData = async () => {
      setLoading(true)
      try {
        const [studentsData, facultiesData] = await Promise.all([
          studentSearchService.getStudents(),
          studentSearchService.getFaculties()
        ])
        setStudents(studentsData)
        setFaculties(facultiesData)
      } catch (error) {
        console.error('Failed to load data:', error)
      } finally {
        setLoading(false)
      }
    }

    loadData()
  }, [])

  // Reload students when faculty filter changes
  React.useEffect(() => {
    const loadFilteredStudents = async () => {
      if (!loading) {
        try {
          const studentsData = await studentSearchService.getStudents(selectedFilters.faculty || undefined)
          setStudents(studentsData)
        } catch (error) {
          console.error('Failed to load filtered students:', error)
        }
      }
    }

    loadFilteredStudents()
  }, [selectedFilters.faculty, loading])

  const filteredStudents = React.useMemo(() => {
    return students.filter(student => {
      const matchesSearch = 
        student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        student.indexNumber.includes(searchTerm)
      
      const matchesYear = !selectedFilters.year || student.enrollmentYear === selectedFilters.year || student.year?.toString() === selectedFilters.year
      
      let matchesGrade = true
      if (selectedFilters.averageGrade) {
        const [min, max] = selectedFilters.averageGrade.split('-').map(Number)
        matchesGrade = student.averageGrade >= min && student.averageGrade <= max
      }
      
      return matchesSearch && matchesYear && matchesGrade
    })
  }, [students, searchTerm, selectedFilters])



  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-2xl font-semibold text-slate-900">Student Search</h1>
        <p className="text-slate-600">Search and view detailed student information</p>
      </div>

      {/* Search and Filters */}
      <Card>
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4 mb-6">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-4 w-4" />
              <Input
                type="text"
                placeholder="Search by name, index number..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="flex gap-2">
              <Button 
                className="gap-2" 
                onClick={handleExport}
                disabled={exporting || filteredStudents.length === 0}
              >
                <Download className="h-4 w-4" />
                {exporting ? 'Exporting...' : 'Export'}
              </Button>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Enrollment Year</label>
              <select
                value={selectedFilters.year}
                onChange={(e) => setSelectedFilters({...selectedFilters, year: e.target.value})}
                className="w-full h-9 px-3 py-2 text-sm border border-input rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                disabled={loading}
              >
                <option value="">All Years</option>
                <option value="2020">2020</option>
                <option value="2021">2021</option>
                <option value="2022">2022</option>
                <option value="2023">2023</option>
                <option value="2024">2024</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Average Grade Range</label>
              <select
                value={selectedFilters.averageGrade}
                onChange={(e) => setSelectedFilters({...selectedFilters, averageGrade: e.target.value})}
                className="w-full h-9 px-3 py-2 text-sm border border-input rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
              >
                <option value="">All Grades</option>
                <option value="9-10">9.0 - 10.0</option>
                <option value="8-9">8.0 - 8.9</option>
                <option value="7-8">7.0 - 7.9</option>
                <option value="6-7">6.0 - 6.9</option>
              </select>
            </div>
            
            <div className="space-y-2">
              <label className="text-sm font-medium text-slate-700">Faculty</label>
              <select
                value={selectedFilters.faculty}
                onChange={(e) => setSelectedFilters({...selectedFilters, faculty: e.target.value})}
                className="w-full h-9 px-3 py-2 text-sm border border-input rounded-md bg-transparent focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
                disabled={loading}
              >
                <option value="">All Faculties</option>
                {faculties.map(faculty => (
                  <option key={faculty.id} value={faculty.name}>
                    {faculty.name}
                  </option>
                ))}
              </select>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Results */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <div>
              <h2 className="text-lg">Student Results</h2>
              <p className="text-sm text-slate-600 font-normal">
                Found {filteredStudents.length} students
              </p>
            </div>
          </CardTitle>
        </CardHeader>
        
        <CardContent className="p-0">
          {loading ? (
            <div className="text-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-slate-900 mx-auto mb-3"></div>
              <p className="text-lg font-medium text-slate-900 mb-2">Loading students...</p>
              <p className="text-sm text-slate-500">Please wait while we fetch the data</p>
            </div>
          ) : filteredStudents.length === 0 ? (
            <div className="text-center py-12">
              <Users className="h-12 w-12 mx-auto mb-3 text-slate-300" />
              <p className="text-lg font-medium text-slate-900 mb-2">No students found</p>
              <p className="text-sm text-slate-500">Try adjusting your search criteria</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-200">
              {filteredStudents.map((student) => (
              <div key={student.id} className="p-6 hover:bg-slate-50 transition-colors">
                <div className="flex items-center justify-between">
                  <div className="flex-1">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant={student.status === "Active" ? "default" : "secondary"}>
                        {student.status}
                      </Badge>
                      <Badge variant="outline" className="font-mono">
                        {student.indexNumber}
                      </Badge>
                      <Badge 
                        variant="secondary"
                        className={student.averageGrade >= 9 ? "bg-green-100 text-green-800" : 
                                   student.averageGrade >= 8 ? "bg-blue-100 text-blue-800" :
                                   student.averageGrade >= 7 ? "bg-yellow-100 text-yellow-800" : 
                                   "bg-red-100 text-red-800"}
                      >
                        {student.averageGrade} GPA
                      </Badge>
                    </div>
                    
                    <h3 className="font-semibold text-slate-900 text-lg mb-3">
                      {student.firstName} {student.lastName}
                    </h3>
                    
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Calendar className="h-4 w-4" />
                        <span>Enrolled: {student.yearOfEnrollment}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <GraduationCap className="h-4 w-4" />
                        <span>{student.faculty}</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <GraduationCap className="h-4 w-4" />
                        <span>{student.totalECTS || student.ectsEarned || 0} ECTS</span>
                      </div>
                      <div className="flex items-center gap-2 text-sm text-slate-600">
                        <Users className="h-4 w-4" />
                        <span>Year {student.year || student.yearOfEnrollment}</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="flex flex-col gap-2 ml-4">
                    <Button 
                      className="gap-2 text-sm"
                      onClick={() => handleViewDetails(student)}
                    >
                      <Eye className="h-4 w-4" />
                      View Details
                    </Button>

                  </div>
                </div>
              </div>
              ))
            }
            </div>
          )}
        </CardContent>
      </Card>

      {/* Student Details Modal */}
      <Dialog open={isDetailsModalOpen} onOpenChange={setIsDetailsModalOpen}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-xl">
              {selectedStudent?.firstName} {selectedStudent?.lastName}
            </DialogTitle>
            <DialogDescription>
              Detailed student information and academic record
            </DialogDescription>
          </DialogHeader>

          {selectedStudent && (
            <Tabs defaultValue="overview" className="space-y-4">
              <TabsList className="grid w-full grid-cols-6">
                <TabsTrigger value="overview">Overview</TabsTrigger>
                <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
                <TabsTrigger value="exams">Exams</TabsTrigger>
                <TabsTrigger value="transfers">Transfers</TabsTrigger>
                <TabsTrigger value="registered">Registered</TabsTrigger>
                <TabsTrigger value="thesis">Thesis</TabsTrigger>
              </TabsList>

              {/* Overview Tab */}
              <TabsContent value="overview" className="space-y-6">
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
                        <Badge variant={selectedStudent.status === "Active" ? "default" : "secondary"}>
                          {selectedStudent.status}
                        </Badge>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Faculty:</span>
                        <span className="font-medium text-right">{selectedStudent.faculty}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Enrollment Year:</span>
                        <span className="font-medium">{selectedStudent.enrollmentYear || selectedStudent.yearOfEnrollment}</span>
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
                        <span className="font-medium">{selectedStudent.totalECTS || selectedStudent.ectsEarned || 0}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-600">Year:</span>
                        <span className="font-medium">{selectedStudent.year || selectedStudent.yearOfEnrollment}</span>
                      </div>
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Enrollment History Tab */}
              <TabsContent value="enrollments" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Calendar className="h-5 w-5" />
                      Enrollment History
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedStudent.enrollmentHistory?.length ? (
                      <div className="space-y-3">
                        {selectedStudent.enrollmentHistory.map((enrollment, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium">{enrollment.program}</div>
                              <div className="text-sm text-slate-600">Academic Year {enrollment.year}</div>
                            </div>
                            <Badge variant={enrollment.status === "Active" ? "default" : "secondary"}>
                              {enrollment.status}
                            </Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-slate-500">
                        <Calendar className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                        <p>No enrollment history available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Exams Tab */}
              <TabsContent value="exams" className="space-y-4">
                <div className="grid gap-4">
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

                  {/* Failed Exams */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="text-lg flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-red-600" />
                        Failed Exams
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      {selectedStudent.failedExams?.length ? (
                        <div className="space-y-2">
                          {selectedStudent.failedExams.map((exam, index) => (
                            <div key={index} className="flex items-center justify-between p-3 border rounded-lg bg-red-50">
                              <div>
                                <div className="font-medium">{exam.subject}</div>
                                <div className="text-sm text-slate-600">{exam.date}</div>
                              </div>
                              <div className="text-right">
                                <Badge className="bg-red-100 text-red-800">Grade: {exam.grade}</Badge>
                                <div className="text-sm text-slate-600 mt-1">{exam.points} points</div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 text-slate-500">No failed exams recorded</div>
                      )}
                    </CardContent>
                  </Card>
                </div>
              </TabsContent>

              {/* Transfer Requests Tab */}
              <TabsContent value="transfers" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <User className="h-5 w-5" />
                      Transfer Requests
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedStudent.transferRequests?.length ? (
                      <div className="space-y-3">
                        {selectedStudent.transferRequests.map((transfer, index) => (
                          <div key={index} className="p-4 border rounded-lg">
                            <div className="flex items-center justify-between mb-2">
                              <div className="font-medium">
                                {transfer.fromProgram} → {transfer.toProgram}
                              </div>
                              <Badge variant={transfer.status === "Approved" ? "default" : "secondary"}>
                                {transfer.status}
                              </Badge>
                            </div>
                            <div className="text-sm text-slate-600 mb-2">{transfer.date}</div>
                            <div className="text-sm text-slate-700">{transfer.reason}</div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-slate-500">
                        <User className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                        <p>No transfer requests found</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Registered Exams Tab */}
              <TabsContent value="registered" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Clock className="h-5 w-5" />
                      Registered Exams
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedStudent.registeredExams?.length ? (
                      <div className="space-y-2">
                        {selectedStudent.registeredExams.map((exam, index) => (
                          <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                            <div>
                              <div className="font-medium">{exam.subject}</div>
                              <div className="text-sm text-slate-600">Exam Date: {exam.examDate}</div>
                            </div>
                            <Badge variant="outline">{exam.status}</Badge>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-6 text-slate-500">
                        <Clock className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                        <p>No registered exams found</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>

              {/* Thesis Tab */}
              <TabsContent value="thesis" className="space-y-4">
                <Card>
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Thesis Work
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    {selectedStudent.thesis ? (
                      <div className="space-y-4">
                        <div>
                          <label className="text-sm font-medium text-slate-600">Title</label>
                          <div className="font-medium text-lg">{selectedStudent.thesis.title}</div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-slate-600">Advisor</label>
                            <div className="font-medium">{selectedStudent.thesis.advisor}</div>
                          </div>
                          <div>
                            <label className="text-sm font-medium text-slate-600">Status</label>
                            <div>
                              <Badge variant={selectedStudent.thesis.status === "Completed" ? "default" : "secondary"}>
                                {selectedStudent.thesis.status}
                              </Badge>
                            </div>
                          </div>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                          <div>
                            <label className="text-sm font-medium text-slate-600">Submission Date</label>
                            <div className="font-medium">{selectedStudent.thesis.submissionDate}</div>
                          </div>
                          {selectedStudent.thesis.grade && (
                            <div>
                              <label className="text-sm font-medium text-slate-600">Grade</label>
                              <div>
                                <Badge className="bg-green-100 text-green-800">
                                  {selectedStudent.thesis.grade}
                                </Badge>
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    ) : (
                      <div className="text-center py-6 text-slate-500">
                        <FileText className="h-8 w-8 mx-auto mb-2 text-slate-300" />
                        <p>No thesis information available</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          )}
        </DialogContent>
      </Dialog>
    </div>
  )
}
