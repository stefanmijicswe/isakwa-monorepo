// Student Search Service

export interface Student {
  id: number
  firstName: string
  lastName: string
  indexNumber: string
  year: number
  faculty: string
  averageGrade: number
  totalECTS: number
  status: string
  email?: string
  enrollmentYear?: string
  studyProgram?: {
    name: string
    faculty: {
      name: string
    }
  }
  user?: {
    firstName: string
    lastName: string
    email: string
  }
  // Extended details for professor view
  enrollmentHistory?: {
    year: string
    status: string
    program: string
  }[]
  failedExams?: {
    subject: string
    date: string
    grade: number
    points: number
  }[]
  passedExams?: {
    subject: string
    date: string
    grade: number
    points: number
  }[]
  transferRequests?: {
    date: string
    fromProgram: string
    toProgram: string
    status: string
    reason: string
  }[]
  registeredExams?: {
    subject: string
    examDate: string
    status: string
  }[]
  thesis?: {
    title: string
    advisor: string
    status: string
    submissionDate: string
    grade?: number
  }
}

export interface Faculty {
  id: number
  name: string
  code: string
}

export interface StudentsResponse {
  data: Student[]
  meta: {
    total: number
    page: number
    limit: number
    totalPages: number
  }
}

class StudentSearchService {
  private readonly API_BASE_URL = 'http://localhost:3001/api'

  // Mock data - different students per faculty
  private readonly mockStudents: Student[] = [
    // Computer Science Faculty
    {
      id: 1,
      firstName: "Marko",
      lastName: "Petrović",
      indexNumber: "2021/001",
      year: 3,
      faculty: "Computer Science",
      averageGrade: 8.7,
      totalECTS: 120,
      status: "ACTIVE",
      email: "marko.petrovic@student.university.rs",
      enrollmentYear: "2021",
      enrollmentHistory: [
        { year: "2021", status: "Enrolled", program: "Software Engineering" },
        { year: "2022", status: "Active", program: "Software Engineering" },
        { year: "2023", status: "Active", program: "Software Engineering" }
      ],
      failedExams: [
        { subject: "Advanced Mathematics", date: "2022-02-15", grade: 5, points: 23 },
        { subject: "Database Systems", date: "2022-09-10", grade: 5, points: 28 }
      ],
      passedExams: [
        { subject: "Programming Fundamentals", date: "2021-07-01", grade: 9, points: 89 },
        { subject: "Data Structures", date: "2022-01-20", grade: 8, points: 78 },
        { subject: "Web Development", date: "2022-07-15", grade: 9, points: 92 },
        { subject: "Software Engineering", date: "2023-01-25", grade: 8, points: 81 }
      ],
      transferRequests: [
        { 
          date: "2022-03-10", 
          fromProgram: "Information Technologies", 
          toProgram: "Software Engineering", 
          status: "Approved", 
          reason: "Better career prospects in software development" 
        }
      ],
      registeredExams: [
        { subject: "Machine Learning", examDate: "2024-02-15", status: "Registered" },
        { subject: "Computer Networks", examDate: "2024-02-20", status: "Registered" }
      ],
      thesis: {
        title: "AI-Based Code Review System",
        advisor: "Prof. Dr. Milan Stevović",
        status: "In Progress",
        submissionDate: "2024-06-15"
      }
    },
    {
      id: 2,
      firstName: "Ana",
      lastName: "Jovanović", 
      indexNumber: "2021/002",
      year: 3,
      faculty: "Computer Science",
      averageGrade: 9.2,
      totalECTS: 135,
      status: "ACTIVE",
      email: "ana.jovanovic@student.university.rs",
      enrollmentYear: "2021"
    },
    {
      id: 3,
      firstName: "Stefan",
      lastName: "Nikolić",
      indexNumber: "2022/001",
      year: 2,
      faculty: "Computer Science",
      averageGrade: 7.8,
      totalECTS: 90,
      status: "ACTIVE",
      email: "stefan.nikolic@student.university.rs",
      enrollmentYear: "2022"
    },
    
    // Mathematics Faculty
    {
      id: 4,
      firstName: "Milica",
      lastName: "Stojanović",
      indexNumber: "2020/003",
      year: 4,
      faculty: "Mathematics",
      averageGrade: 9.5,
      totalECTS: 180,
      status: "ACTIVE",
      email: "milica.stojanovic@student.university.rs",
      enrollmentYear: "2020"
    },
    {
      id: 5,
      firstName: "Nikola",
      lastName: "Mitrović",
      indexNumber: "2022/002",
      year: 2,
      faculty: "Mathematics",
      averageGrade: 8.9,
      totalECTS: 95,
      status: "ACTIVE",
      email: "nikola.mitrovic@student.university.rs",
      enrollmentYear: "2022"
    },
    {
      id: 6,
      firstName: "Jovana",
      lastName: "Radić",
      indexNumber: "2021/003",
      year: 3,
      faculty: "Mathematics",
      averageGrade: 8.1,
      totalECTS: 115,
      status: "ACTIVE",
      email: "jovana.radic@student.university.rs",
      enrollmentYear: "2021"
    },

    // Physics Faculty
    {
      id: 7,
      firstName: "Luka",
      lastName: "Popović",
      indexNumber: "2020/004",
      year: 4,
      faculty: "Physics",
      averageGrade: 7.6,
      totalECTS: 165,
      status: "ACTIVE",
      email: "luka.popovic@student.university.rs",
      enrollmentYear: "2020"
    },
    {
      id: 8,
      firstName: "Teodora",
      lastName: "Stanković",
      indexNumber: "2022/003",
      year: 2,
      faculty: "Physics",
      averageGrade: 9.1,
      totalECTS: 88,
      status: "ACTIVE",
      email: "teodora.stankovic@student.university.rs",
      enrollmentYear: "2022"
    },
    {
      id: 9,
      firstName: "Miloš",
      lastName: "Đorđević",
      indexNumber: "2021/004",
      year: 3,
      faculty: "Physics",
      averageGrade: 8.4,
      totalECTS: 125,
      status: "ACTIVE",
      email: "milos.djordjevic@student.university.rs",
      enrollmentYear: "2021"
    },

    // Engineering Faculty
    {
      id: 10,
      firstName: "Dušan",
      lastName: "Ilić",
      indexNumber: "2020/005",
      year: 4,
      faculty: "Engineering",
      averageGrade: 8.8,
      totalECTS: 175,
      status: "ACTIVE",
      email: "dusan.ilic@student.university.rs",
      enrollmentYear: "2020"
    },
    {
      id: 11,
      firstName: "Isidora",
      lastName: "Marković",
      indexNumber: "2022/004",
      year: 2,
      faculty: "Engineering",
      averageGrade: 7.9,
      totalECTS: 82,
      status: "ACTIVE",
      email: "isidora.markovic@student.university.rs",
      enrollmentYear: "2022"
    },
    {
      id: 12,
      firstName: "Vladimir",
      lastName: "Kostić",
      indexNumber: "2021/005",
      year: 3,
      faculty: "Engineering",
      averageGrade: 8.6,
      totalECTS: 130,
      status: "ACTIVE",
      email: "vladimir.kostic@student.university.rs",
      enrollmentYear: "2021"
    }
  ]

  private readonly mockFaculties: Faculty[] = [
    { id: 1, name: "Computer Science", code: "CS" },
    { id: 2, name: "Mathematics", code: "MATH" },
    { id: 3, name: "Physics", code: "PHYS" },
    { id: 4, name: "Engineering", code: "ENG" }
  ]

  // Get all students or filter by faculty
  async getStudents(facultyFilter?: string): Promise<Student[]> {
    console.log('Getting students with faculty filter:', facultyFilter)
    
    // For now, always use mock data to avoid API issues
    // This ensures the presentation works even if backend is not running
    return this.getMockStudents(facultyFilter)

    /* TODO: Enable API integration when auth is properly set up
    try {
      const token = localStorage.getItem('auth_token')
      if (!token) {
        console.warn('No auth token found, using mock data')
        return this.getMockStudents(facultyFilter)
      }

      const params = new URLSearchParams()
      if (facultyFilter) {
        // Add faculty filter to API params when implemented
      }
      
      const response = await fetch(`${this.API_BASE_URL}/academic-records/students/search?${params}`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      })

      if (!response.ok) {
        console.warn(`API call failed with status ${response.status}, using mock data`)
        return this.getMockStudents(facultyFilter)
      }

      const result: StudentsResponse = await response.json()
      
      // Transform API response to match our interface
      const students: Student[] = result.data.map(apiStudent => ({
        id: apiStudent.id,
        firstName: apiStudent.user?.firstName || apiStudent.firstName,
        lastName: apiStudent.user?.lastName || apiStudent.lastName,
        indexNumber: apiStudent.indexNumber,
        year: apiStudent.year,
        faculty: apiStudent.studyProgram?.faculty?.name || 'Unknown Faculty',
        averageGrade: apiStudent.averageGrade || 0,
        totalECTS: apiStudent.totalECTS || 0,
        status: apiStudent.status,
        email: apiStudent.user?.email || apiStudent.email,
        enrollmentYear: apiStudent.enrollmentYear,
        coursesEnrolled: 0
      }))

      // Apply faculty filter on frontend if needed
      const filteredStudents = facultyFilter 
        ? students.filter(student => student.faculty === facultyFilter)
        : students

      // Store in localStorage for caching
      this.saveStudentsToStorage(filteredStudents)
      
      return filteredStudents

    } catch (error) {
      console.error('Error fetching students from API:', error)
      return this.getMockStudents(facultyFilter)
    }
    */
  }

  // Fallback method to get mock students
  private getMockStudents(facultyFilter?: string): Student[] {
    let students = this.getStoredStudents()
    
    if (facultyFilter && facultyFilter !== "") {
      students = students.filter(student => student.faculty === facultyFilter)
    }

    return students
  }

  // Get all faculties
  async getFaculties(): Promise<Faculty[]> {
    await new Promise(resolve => setTimeout(resolve, 200))
    return this.mockFaculties
  }

  // Get stored students from localStorage or return mock data
  private getStoredStudents(): Student[] {
    // Always return mock data for now to ensure consistency
    return this.mockStudents
    
    /* TODO: Enable localStorage when needed
    if (typeof window === 'undefined') return this.mockStudents

    try {
      const stored = localStorage.getItem(this.STORAGE_KEY)
      if (stored) {
        const parsed = JSON.parse(stored)
        return parsed.students || this.mockStudents
      }
    } catch (error) {
      console.error('Error loading stored students:', error)
    }

    // If no stored data, save mock data and return it
    this.saveStudentsToStorage(this.mockStudents)
    return this.mockStudents
    */
  }

  // Save students to localStorage
  private saveStudentsToStorage(students: Student[]): void {
    if (typeof window === 'undefined') return

    try {
      const data = {
        students,
        lastUpdated: new Date().toISOString()
      }
      localStorage.setItem(this.STORAGE_KEY, JSON.stringify(data))
    } catch (error) {
      console.error('Error saving students to storage:', error)
    }
  }

  // Export students data
  async exportStudents(students: Student[], format: 'csv' | 'json' = 'csv'): Promise<void> {
    console.log('Exporting students:', students.length, 'format:', format)
    
    if (students.length === 0) {
      console.warn('No students to export')
      return
    }

    if (format === 'csv') {
      const csvContent = this.generateCSV(students)
      this.downloadFile(csvContent, 'students_export.csv', 'text/csv')
    } else if (format === 'json') {
      const jsonContent = JSON.stringify(students, null, 2)
      this.downloadFile(jsonContent, 'students_export.json', 'application/json')
    }
  }

  // Generate CSV content
  private generateCSV(students: Student[]): string {
    const headers = [
      'ID', 'First Name', 'Last Name', 'Index Number', 'Email', 
      'Faculty', 'Current Year', 'Enrollment Year', 'Average Grade', 'Total ECTS', 
      'Status'
    ]

    const rows = students.map(student => [
      student.id.toString(),
      student.firstName,
      student.lastName,
      student.indexNumber,
      student.email || '',
      student.faculty,
      student.year?.toString() || '',
      student.enrollmentYear || '',
      student.averageGrade?.toString() || '0',
      student.totalECTS?.toString() || '0',
      student.status
    ])

    return [headers, ...rows].map(row => 
      row.map(field => `"${field.replace(/"/g, '""')}"`).join(',')
    ).join('\n')
  }

  // Download file helper
  private downloadFile(content: string, filename: string, contentType: string): void {
    const blob = new Blob([content], { type: contentType })
    const url = window.URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = filename
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    window.URL.revokeObjectURL(url)
  }
}

// Export singleton instance
export const studentSearchService = new StudentSearchService()
