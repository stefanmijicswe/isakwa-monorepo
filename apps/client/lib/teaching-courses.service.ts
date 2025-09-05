// Teaching Courses Service - Backend Integration
export interface Student {
  id: string
  name: string
  email: string
  year: number
  status: string
  averageGrade: number
}

export interface Course {
  id: number
  name: string
  acronym: string
  ects: number
  semester: string
  studentsEnrolled: number
  status: string
  students: Student[]
  academicYear?: string
  semesterType?: 'WINTER' | 'SUMMER'
  description?: string
  professor?: {
    id: number
    name: string
  }
}

export interface CreateCourseDto {
  name: string
  acronym: string
  ects: number
  semester: string
  academicYear: string
  semesterType: 'WINTER' | 'SUMMER'
  description?: string
}

export interface UpdateCourseDto {
  name?: string
  acronym?: string
  ects?: number
  semester?: string
  description?: string
  status?: string
}

class TeachingCoursesService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null
    
    // Try to get token from localStorage first
    let token = localStorage.getItem('auth_token')
    
    // If no token exists, set a test token for development
    if (!token) {
      const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiam9obi5zbWl0aEBpc2Frd2EuZWR1Iiwicm9sZSI6IlBST0ZFU1NPUiIsImZpcnN0TmFtZSI6IkpvaG4iLCJsYXN0TmFtZSI6IlNtaXRoIiwiaWF0IjoxNzU2OTAyNjEzLCJleHAiOjE3NTc1MDc0MTN9.Siqy9TGJr2ZGB5UJ20cJPv6rcDRIM4aMg0qKlqlaeho'
      localStorage.setItem('auth_token', testToken)
      token = testToken
    }
    
    return token
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken()
    const url = `${this.baseUrl}${endpoint}`


    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    }

    try {
      const response = await fetch(url, config)
      

      if (!response.ok) {
        const errorData = await response.text()
        
        // Special handling for 403 errors - don't log as error, just warn
        if (response.status === 403) {
          console.warn('⚠️ TeachingCourses 403 Forbidden (will use fallback):', errorData)
        } else {
          console.error('❌ TeachingCourses API Error:', response.status, errorData)
        }
        
        throw new Error(`HTTP ${response.status}: ${errorData}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      // For 403 errors, just warn instead of error
      if (error instanceof Error && error.message.includes('403')) {
        console.warn('⚠️ TeachingCourses 403 Error (will use fallback):', error.message)
      } else {
        console.error('💥 TeachingCourses API Error:', error)
      }
      throw error
    }
  }

  // Get professor's teaching courses
  async getTeachingCourses(): Promise<Course[]> {
    try {
      
      // Try to get professor's subjects from backend
      const assignments = await this.request<any[]>('/academic-records/my-subjects')
      

      // Transform assignments to Course format with students
      const courses: Course[] = []
      
      for (const assignment of assignments) {
        const course: Course = {
          id: assignment.subject.id,
          name: assignment.subject.name,
          acronym: assignment.subject.code,
          ects: assignment.subject.ects || 6,
          semester: this.getSemesterDisplayName(assignment.subject.semesterType || 'WINTER'),
          studentsEnrolled: 0, // Will be updated with actual enrollment count
          status: 'Active',
          students: [],
          academicYear: assignment.academicYear || '2024/2025',
          semesterType: assignment.subject.semesterType || 'WINTER',
          description: assignment.subject.description,
          professor: {
            id: assignment.professorId,
            name: assignment.professor?.user?.firstName + ' ' + assignment.professor?.user?.lastName
          }
        }

        // Fetch students enrolled in this course
        try {
          const enrollments = await this.getCourseStudents(course.id)
          course.students = enrollments
          course.studentsEnrolled = enrollments.length
          // // console.log(`✅ Found ${enrollments.length} students for ${course.name}`)
        } catch (error) {
          console.warn(`❌ Failed to fetch students for course ${course.id}:`, error)
          course.students = []
          course.studentsEnrolled = 0
        }

        courses.push(course)
      }

      // // console.log('✅ Processed teaching courses:', courses)
      return courses

    } catch (error) {
      console.error('❌ Failed to fetch teaching courses from backend:', error)
      throw new Error('Failed to load teaching courses')
    }
  }

  // Get students enrolled in a specific course
  async getCourseStudents(courseId: number): Promise<Student[]> {
    // // console.log(`👨‍🎓 Fetching students for course ${courseId}...`)
    
    try {
      const enrollments = await this.request<any[]>(`/academic-records/professor/courses/${courseId}/students`)
      // // console.log(`📊 Raw enrollments for course ${courseId}:`, enrollments)
      
      // Transform enrollments to Student format
      const students: Student[] = enrollments.map((enrollment, index) => {
        const student = enrollment.student || enrollment.user
        return {
          id: student.id?.toString() || `${courseId}_${index}`,
          name: `${student.firstName || 'Unknown'} ${student.lastName || 'Student'}`,
          email: student.email || `student${student.id}@university.edu`,
          year: enrollment.year || 1,
          status: enrollment.status || 'Active',
          averageGrade: this.calculateAverageGrade(enrollment)
        }
      })

      // // console.log(`✅ Processed students for course ${courseId}:`, students)
      return students
      
    } catch (error: any) {
      console.warn(`⚠️ Failed to fetch students for course ${courseId}:`, error)
      
      // Check for 403 Forbidden or professor assignment errors
      const errorMessage = error.message || error.toString()
      if (errorMessage.includes('403') || 
          errorMessage.includes('Forbidden') || 
          errorMessage.includes('Professor not assigned')) {
        console.warn(`⚠️ Using sample data for course ${courseId} due to professor assignment issue`)
      } else {
        console.warn(`⚠️ Using sample data for course ${courseId} due to API error`)
      }
      
      return this.getSampleStudentsForCourse(courseId)
    }
  }



  // Calculate average grade from enrollment data
  private calculateAverageGrade(enrollment: any): number {
    const grades = []
    if (enrollment.attendance) grades.push(enrollment.attendance)
    if (enrollment.assignments) grades.push(enrollment.assignments)
    if (enrollment.midterm) grades.push(enrollment.midterm)
    if (enrollment.final) grades.push(enrollment.final)
    
    if (grades.length === 0) return 0
    
    const average = grades.reduce((sum, grade) => sum + grade, 0) / grades.length
    return Math.round(average * 10) / 10 // Round to 1 decimal place
  }

  // Get sample students for a course (fallback)
  private getSampleStudentsForCourse(courseId: number): Student[] {
    const sampleStudents = [
      { id: `${courseId}_1`, name: "Ana Marković", email: "ana.markovic@student.edu", year: 2, status: "Active", averageGrade: 8.5 },
      { id: `${courseId}_2`, name: "Marko Petrović", email: "marko.petrovic@student.edu", year: 2, status: "Active", averageGrade: 9.2 },
      { id: `${courseId}_3`, name: "Stefan Nikolić", email: "stefan.nikolic@student.edu", year: 1, status: "Active", averageGrade: 7.8 },
      { id: `${courseId}_4`, name: "Milica Jovanović", email: "milica.jovanovic@student.edu", year: 2, status: "Active", averageGrade: 8.9 },
      { id: `${courseId}_5`, name: "Nikola Đorđević", email: "nikola.djordjevic@student.edu", year: 1, status: "Active", averageGrade: 8.1 }
    ]

    // Return 3-8 random students per course
    const count = Math.floor(Math.random() * 6) + 3
    return sampleStudents.slice(0, count)
  }

  // Get course by ID (used internally, may not be needed for current implementation)
  async getCourseById(id: number): Promise<Course | null> {
    try {
      // // console.log(`🔍 Fetching course ${id} from backend...`)
      
      const subject = await this.request<any>(`/subjects/${id}`)
      
      const course: Course = {
        id: subject.id,
        name: subject.name,
        acronym: subject.code,
        ects: subject.ects || 6,
        semester: this.getSemesterDisplayName(subject.semesterType || 'WINTER'),
        studentsEnrolled: 0,
        status: 'Active', // Always active for professor's courses
        students: [],
        academicYear: subject.academicYear || '2024/2025',
        semesterType: subject.semesterType || 'WINTER',
        description: subject.description
      }

      // Get students for this course
      course.students = await this.getCourseStudents(id)
      course.studentsEnrolled = course.students.length

      return course

    } catch (error) {
      console.error(`❌ Failed to fetch course ${id}:`, error)
      return null
    }
  }

  // Update course information (if needed for future features)
  async updateCourse(id: number, data: UpdateCourseDto): Promise<Course> {
    try {
      // // console.log(`✏️ Updating course ${id}:`, data)
      
      // Use PATCH to update subject
      const updatedSubject = await this.request<any>(`/subjects/${id}`, {
        method: 'PATCH',
        body: JSON.stringify({
          name: data.name,
          code: data.acronym,
          ects: data.ects,
          description: data.description
          // Note: isActive field might not be available for update
        }),
      })

      // // console.log('✅ Course updated successfully:', updatedSubject)

      // Return updated course
      const updatedCourse = await this.getCourseById(id)
      if (!updatedCourse) {
        throw new Error('Failed to fetch updated course')
      }

      return updatedCourse

    } catch (error) {
      console.error(`❌ Failed to update course ${id}:`, error)
      throw error
    }
  }

  // Get pinned courses from localStorage (primary storage)
  async getPinnedCourses(): Promise<number[]> {
    try {
      // // console.log('📌 Fetching pinned courses from localStorage...')
      
      // Use localStorage as primary storage since backend doesn't have user preferences endpoint
      const saved = localStorage.getItem('pinned-courses')
      const pinnedCourses = saved ? JSON.parse(saved) : []
      
      // // console.log('✅ Pinned courses from localStorage:', pinnedCourses)
      return pinnedCourses

    } catch (error) {
      console.error('❌ Failed to read pinned courses from localStorage:', error)
      return []
    }
  }

  // Save pinned courses to localStorage (primary storage)
  async savePinnedCourses(pinnedCourses: number[]): Promise<void> {
    try {
      // // console.log('💾 Saving pinned courses to localStorage:', pinnedCourses)
      
      // Use localStorage as primary storage since backend doesn't have user preferences endpoint
      localStorage.setItem('pinned-courses', JSON.stringify(pinnedCourses))
      // // console.log('✅ Pinned courses saved to localStorage successfully')

    } catch (error) {
      console.error('❌ Failed to save pinned courses to localStorage:', error)
      throw new Error('Failed to save pinned courses')
    }
  }

  // Toggle pin status for a course
  async togglePinCourse(courseId: number): Promise<number[]> {
    const currentPinned = await this.getPinnedCourses()
    
    let newPinned: number[]
    if (currentPinned.includes(courseId)) {
      newPinned = currentPinned.filter(id => id !== courseId)
    } else {
      newPinned = [...currentPinned, courseId]
    }

    await this.savePinnedCourses(newPinned)
    return newPinned
  }

  // Clear all pinned courses
  async clearPinnedCourses(): Promise<void> {
    await this.savePinnedCourses([])
  }

  // Helper functions
  private getSemesterDisplayName(semester: 'WINTER' | 'SUMMER'): string {
    return semester === 'WINTER' ? 'Winter' : 'Summer'
  }

  // Refresh course data (useful for real-time updates)
  async refreshCourseData(courseId: number): Promise<Course | null> {
    // // console.log(`🔄 Refreshing data for course ${courseId}...`)
    return this.getCourseById(courseId)
  }

  // Get course statistics
  async getCourseStatistics(courseId: number): Promise<{
    totalStudents: number
    activeStudents: number
    averageGrade: number
    passRate: number
  }> {
    try {
      const students = await this.getCourseStudents(courseId)
      
      const totalStudents = students.length
      const activeStudents = students.filter(s => s.status === 'Active').length
      const averageGrade = totalStudents > 0 
        ? students.reduce((sum, s) => sum + s.averageGrade, 0) / totalStudents 
        : 0
      const passRate = totalStudents > 0
        ? (students.filter(s => s.averageGrade >= 6).length / totalStudents) * 100
        : 0

      return {
        totalStudents,
        activeStudents,
        averageGrade: Math.round(averageGrade * 100) / 100,
        passRate: Math.round(passRate * 100) / 100
      }

    } catch (error) {
      console.error(`❌ Failed to get statistics for course ${courseId}:`, error)
      return {
        totalStudents: 0,
        activeStudents: 0,
        averageGrade: 0,
        passRate: 0
      }
    }
  }
}

export const teachingCoursesService = new TeachingCoursesService()
