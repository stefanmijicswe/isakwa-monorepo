// Types for Grade Entry
export interface GradeEntry {
  studentId: number
  courseId: number
  attendance: number
  assignments: number
  midterm: number
  final: number
  status: 'Pending' | 'Completed' | 'Overdue'
}

export interface Student {
  id: number
  firstName: string
  lastName: string
  indexNumber: string
  email: string
  courseId?: number
  enrollments?: CourseEnrollment[]
}

export interface CourseEnrollment {
  id: number
  courseId: number
  course: {
    id: number
    name: string
    code: string
  }
  attendance?: number
  assignments?: number
  midterm?: number
  final?: number
  status: string
}

export interface Course {
  id: number
  name: string
  code: string
  semester: string
  studentsEnrolled: number
  gradingDeadline: string
  examDate: string // Date when the exam was held
}

class GradeEntryService {
  private baseUrl = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth_token')
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken()
    const url = `${this.baseUrl}${endpoint}`

    console.log('🔑 GradeEntry Auth token:', token ? `${token.substring(0, 10)}...` : 'NO TOKEN')

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    }

    console.log('📡 GradeEntry API Request:', { 
      url, 
      method: config.method || 'GET',
      hasToken: !!token,
      headers: config.headers,
      body: options.body
    })

    try {
      const response = await fetch(url, config)
      
      console.log('📊 GradeEntry Response status:', response.status, response.statusText)

      if (!response.ok) {
        const errorData = await response.text()
        console.error('❌ GradeEntry API Error:', response.status, errorData)
        throw new Error(`HTTP ${response.status}: ${errorData}`)
      }

      const data = await response.json()
      console.log('✅ GradeEntry API Success:', data)
      return data
    } catch (error) {
      console.error('💥 GradeEntry API Error:', error)
      throw error
    }
  }

  // Helper function to generate consistent exam date for each course
  private getConsistentExamDate(courseId: number): string {
    // Use courseId as seed for consistent dates across refreshes
    const fixedDates = {
      1: this.getDaysAgoDate(3),   // IT101 - 3 days ago (12 days remaining)
      2: this.getDaysAgoDate(8),   // PF102 - 8 days ago (7 days remaining)  
      3: this.getDaysAgoDate(1),   // WT202 - 1 day ago (14 days remaining)
      4: this.getDaysAgoDate(12),  // DB301 - 12 days ago (3 days remaining)
      5: this.getDaysAgoDate(6)    // SE401 - 6 days ago (9 days remaining)
    }
    return fixedDates[courseId as keyof typeof fixedDates] || this.getDaysAgoDate(5)
  }

  private getDaysAgoDate(daysAgo: number): string {
    const currentDate = new Date()
    const examDate = new Date(currentDate.getTime() - (daysAgo * 24 * 60 * 60 * 1000))
    return examDate.toISOString().split('T')[0] // Return YYYY-MM-DD format
  }

  // Get professor's courses
  async getProfessorCourses(): Promise<Course[]> {
    // Fixed courses with consistent exam dates for demonstration
    return [
      {
        id: 1,
        name: "Introduction to Information Technologies",
        code: "IT101",
        semester: "Winter 2024",
        studentsEnrolled: 45,
        gradingDeadline: "2024-12-30",
        examDate: this.getConsistentExamDate(1)
      },
      {
        id: 2,
        name: "Programming Fundamentals", 
        code: "PF102",
        semester: "Winter 2024",
        studentsEnrolled: 38,
        gradingDeadline: "2024-12-25",
        examDate: this.getConsistentExamDate(2)
      },
      {
        id: 3,
        name: "Web Technologies",
        code: "WT202", 
        semester: "Summer 2024",
        studentsEnrolled: 32,
        gradingDeadline: "2025-01-15",
        examDate: this.getConsistentExamDate(3)
      },
      {
        id: 4,
        name: "Database Systems",
        code: "DB301", 
        semester: "Winter 2024",
        studentsEnrolled: 28,
        gradingDeadline: "2025-01-10",
        examDate: this.getConsistentExamDate(4)
      },
      {
        id: 5,
        name: "Software Engineering",
        code: "SE401", 
        semester: "Winter 2024",
        studentsEnrolled: 35,
        gradingDeadline: "2024-12-28",
        examDate: this.getConsistentExamDate(5)
      }
    ]
  }

  // Get students enrolled in a course
  async getCourseStudents(courseId?: string): Promise<Student[]> {
    // Mock data with students enrolled in different courses
    const allStudents = [
      // IT101 Students
      {
        id: 1,
        firstName: "John",
        lastName: "Doe", 
        indexNumber: "2021/001",
        email: "john.doe@student.edu",
        courseId: 1,
        enrollments: [{
          id: 1,
          courseId: 1,
          course: { id: 1, name: "Introduction to Information Technologies", code: "IT101" },
          attendance: 85,
          assignments: 78,
          midterm: 82,
          final: 88,
          status: "Completed"
        }]
      },
      {
        id: 2,
        firstName: "Sarah",
        lastName: "Johnson",
        indexNumber: "2021/002", 
        email: "sarah.johnson@student.edu",
        courseId: 1,
        enrollments: [{
          id: 2,
          courseId: 1,
          course: { id: 1, name: "Introduction to Information Technologies", code: "IT101" },
          attendance: 92,
          assignments: 89,
          midterm: 91,
          final: 94,
          status: "Completed"
        }]
      },
      {
        id: 3,
        firstName: "Michael",
        lastName: "Brown",
        indexNumber: "2022/001",
        email: "michael.brown@student.edu",
        courseId: 1,
        enrollments: [{
          id: 3,
          courseId: 1,
          course: { id: 1, name: "Introduction to Information Technologies", code: "IT101" },
          attendance: 75,
          assignments: 0,
          midterm: 0,
          final: 0,
          status: "Pending"
        }]
      },
      // PF102 Students  
      {
        id: 4,
        firstName: "Emily", 
        lastName: "Davis",
        indexNumber: "2020/003",
        email: "emily.davis@student.edu",
        courseId: 2,
        enrollments: [{
          id: 4,
          courseId: 2,
          course: { id: 2, name: "Programming Fundamentals", code: "PF102" },
          attendance: 88,
          assignments: 92,
          midterm: 85,
          final: 89,
          status: "Completed"
        }]
      },
      {
        id: 5,
        firstName: "David",
        lastName: "Wilson",
        indexNumber: "2021/003",
        email: "david.wilson@student.edu",
        courseId: 2,
        enrollments: [{
          id: 5,
          courseId: 2,
          course: { id: 2, name: "Programming Fundamentals", code: "PF102" },
          attendance: 79,
          assignments: 84,
          midterm: 0,
          final: 0,
          status: "Pending"
        }]
      },
      {
        id: 6,
        firstName: "Lisa",
        lastName: "Anderson",
        indexNumber: "2022/002",
        email: "lisa.anderson@student.edu",
        courseId: 2,
        enrollments: [{
          id: 6,
          courseId: 2,
          course: { id: 2, name: "Programming Fundamentals", code: "PF102" },
          attendance: 95,
          assignments: 91,
          midterm: 93,
          final: 96,
          status: "Completed"
        }]
      },
      // WT202 Students
      {
        id: 7,
        firstName: "Robert",
        lastName: "Miller",
        indexNumber: "2020/004",
        email: "robert.miller@student.edu",
        courseId: 3,
        enrollments: [{
          id: 7,
          courseId: 3,
          course: { id: 3, name: "Web Technologies", code: "WT202" },
          attendance: 82,
          assignments: 87,
          midterm: 79,
          final: 85,
          status: "Completed"
        }]
      },
      {
        id: 8,
        firstName: "Jennifer",
        lastName: "Taylor",
        indexNumber: "2021/004",
        email: "jennifer.taylor@student.edu",
        courseId: 3,
        enrollments: [{
          id: 8,
          courseId: 3,
          course: { id: 3, name: "Web Technologies", code: "WT202" },
          attendance: 90,
          assignments: 0,
          midterm: 0,
          final: 0,
          status: "Pending"
        }]
      }
    ]

    // Filter by course if specified
    if (courseId && courseId !== "all") {
      return allStudents.filter(student => student.courseId === parseInt(courseId))
    }
    
    return allStudents
  }

  // Save all grades
  async saveGrades(grades: Record<string, string>, courseId?: string): Promise<void> {
    console.log('Saving grades:', { grades, courseId })
    
    // Transform grades data into proper format
    const gradeEntries: GradeEntry[] = []
    const studentIds = new Set<string>()
    
    // Extract unique student IDs
    Object.keys(grades).forEach(key => {
      const [studentId] = key.split('_')
      studentIds.add(studentId)
    })

    // Create grade entries for each student
    studentIds.forEach(studentId => {
      const attendance = parseFloat(grades[`${studentId}_attendance`] || '0')
      const assignments = parseFloat(grades[`${studentId}_assignments`] || '0') 
      const midterm = parseFloat(grades[`${studentId}_midterm`] || '0')
      const final = parseFloat(grades[`${studentId}_final`] || '0')

      if (attendance || assignments || midterm || final) {
        gradeEntries.push({
          studentId: parseInt(studentId),
          courseId: courseId ? parseInt(courseId) : 1, // Default course ID
          attendance,
          assignments,
          midterm,
          final,
          status: final > 0 ? 'Completed' : 'Pending'
        })
      }
    })

    // TODO: Replace with actual API call
    console.log('Processed grade entries:', gradeEntries)
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1000))
    
    return Promise.resolve()
  }

  // Check if grade entry is allowed (within 15 days of exam date)
  isGradeEntryAllowed(examDate: string): { allowed: boolean; daysElapsed: number; message?: string } {
    const examDateTime = new Date(examDate)
    const currentDate = new Date()
    const timeDiff = currentDate.getTime() - examDateTime.getTime()
    const daysElapsed = Math.floor(timeDiff / (1000 * 3600 * 24))
    
    if (daysElapsed > 15) {
      return {
        allowed: false,
        daysElapsed,
        message: `Grade entry is no longer allowed. Exam was ${daysElapsed} days ago (maximum 15 days allowed).`
      }
    }
    
    if (daysElapsed < 0) {
      return {
        allowed: false,
        daysElapsed,
        message: `Cannot enter grades for future exam date.`
      }
    }
    
    return {
      allowed: true,
      daysElapsed,
      message: `${15 - daysElapsed} days remaining to enter grades.`
    }
  }

  // Export grades
  async exportGrades(courseId?: string, format: 'csv' | 'pdf' = 'csv'): Promise<void> {
    console.log('Exporting grades:', { courseId, format })
    
    // Get students and course info
    const data = await this.getCourseStudents(courseId)
    const courses = await this.getProfessorCourses()
    const selectedCourse = courseId ? courses.find(c => c.id === parseInt(courseId)) : null
    
    if (format === 'csv') {
      const csvContent = this.generateCSV(data, selectedCourse)
      this.downloadFile(csvContent, `grades_${selectedCourse?.code || 'all'}.csv`, 'text/csv')
    } else if (format === 'pdf') {
      // Generate HTML and use browser print to PDF
      this.generateAndPrintPDF(data, selectedCourse)
    }
    
    return Promise.resolve()
  }

  private generateCSV(students: Student[], course?: Course | null): string {
    const headers = ['Student ID', 'First Name', 'Last Name', 'Index Number', 'Email', 'Course', 'Attendance (10%)', 'Assignments (20%)', 'Midterm (30%)', 'Final (40%)', 'Total', 'Status']
    const rows = students.map(student => {
      const enrollment = student.enrollments?.[0]
      const attendance = enrollment?.attendance || 0
      const assignments = enrollment?.assignments || 0
      const midterm = enrollment?.midterm || 0
      const final = enrollment?.final || 0
      const total = Math.round(attendance * 0.1 + assignments * 0.2 + midterm * 0.3 + final * 0.4)
      
      return [
        student.id,
        student.firstName,
        student.lastName, 
        student.indexNumber,
        student.email,
        course?.name || enrollment?.course.name || 'N/A',
        attendance,
        assignments,
        midterm,
        final,
        total,
        enrollment?.status || 'Pending'
      ]
    })
    
    return [headers, ...rows].map(row => row.join(',')).join('\n')
  }

  private generatePDF(students: Student[], course?: Course | null): string {
    // Generate a simple text-based PDF content that browsers can handle
    const courseInfo = course ? `${course.code} - ${course.name}` : 'All Courses'
    const date = new Date().toLocaleDateString()
    
    let content = `GRADE REPORT\n`
    content += `Course: ${courseInfo}\n`
    content += `Generated on: ${date}\n`
    content += `Generated by: ISA KWA University LMS\n\n`
    content += `${'='.repeat(80)}\n\n`
    
    // Table header
    content += `${'Student'.padEnd(25)} ${'Index'.padEnd(12)} ${'Attend'.padEnd(8)} ${'Assign'.padEnd(8)} ${'Midterm'.padEnd(8)} ${'Final'.padEnd(8)} ${'Total'.padEnd(8)} Status\n`
    content += `${'-'.repeat(80)}\n`
    
    // Student data
    students.forEach(student => {
      const enrollment = student.enrollments?.[0]
      const attendance = enrollment?.attendance || 0
      const assignments = enrollment?.assignments || 0
      const midterm = enrollment?.midterm || 0
      const final = enrollment?.final || 0
      const total = Math.round(attendance * 0.1 + assignments * 0.2 + midterm * 0.3 + final * 0.4)
      const status = enrollment?.status || 'Pending'
      
      const studentName = `${student.firstName} ${student.lastName}`.padEnd(25).substring(0, 25)
      const indexNumber = student.indexNumber.padEnd(12).substring(0, 12)
      
      content += `${studentName} ${indexNumber} ${attendance.toString().padEnd(8)} ${assignments.toString().padEnd(8)} ${midterm.toString().padEnd(8)} ${final.toString().padEnd(8)} ${total.toString().padEnd(8)} ${status}\n`
    })
    
    content += `\n${'='.repeat(80)}\n`
    content += `\nGrading Scale:\n`
    content += `Attendance (10%) + Assignments (20%) + Midterm (30%) + Final (40%) = Total\n\n`
    content += `Total students: ${students.length}\n`
    content += `Completed: ${students.filter(s => s.enrollments?.[0]?.status === 'Completed').length}\n`
    content += `Pending: ${students.filter(s => s.enrollments?.[0]?.status === 'Pending').length}\n`
    
    return content
  }

  private generateAndPrintPDF(students: Student[], course?: Course | null): void {
    const courseInfo = course ? `${course.code} - ${course.name}` : 'All Courses'
    const date = new Date().toLocaleDateString()
    
    const htmlContent = `
<!DOCTYPE html>
<html>
<head>
    <meta charset="utf-8">
    <title>Grade Report - ${courseInfo}</title>
    <style>
        @media print { 
            body { margin: 0; }
            .no-print { display: none; }
        }
        body { font-family: Arial, sans-serif; margin: 20px; font-size: 12px; }
        .header { text-align: center; margin-bottom: 30px; }
        table { width: 100%; border-collapse: collapse; margin-top: 20px; }
        th, td { border: 1px solid #ddd; padding: 6px; text-align: left; font-size: 11px; }
        th { background-color: #f5f5f5; font-weight: bold; }
        .center { text-align: center; }
        .completed { color: green; font-weight: bold; }
        .pending { color: orange; }
        .footer { margin-top: 30px; font-size: 10px; color: #666; }
    </style>
</head>
<body>
    <div class="header">
        <h1>Grade Report</h1>
        <h2>${courseInfo}</h2>
        <p>Generated on: ${date}</p>
    </div>
    
    <table>
        <thead>
            <tr>
                <th>Student</th>
                <th>Index</th>
                <th>Attendance (10%)</th>
                <th>Assignments (20%)</th>
                <th>Midterm (30%)</th>
                <th>Final (40%)</th>
                <th>Total</th>
                <th>Status</th>
            </tr>
        </thead>
        <tbody>
${students.map(student => {
  const enrollment = student.enrollments?.[0]
  const attendance = enrollment?.attendance || 0
  const assignments = enrollment?.assignments || 0
  const midterm = enrollment?.midterm || 0
  const final = enrollment?.final || 0
  const total = Math.round(attendance * 0.1 + assignments * 0.2 + midterm * 0.3 + final * 0.4)
  const status = enrollment?.status || 'Pending'
  const statusClass = status === 'Completed' ? 'completed' : 'pending'
  
  return `
            <tr>
                <td>${student.firstName} ${student.lastName}</td>
                <td class="center">${student.indexNumber}</td>
                <td class="center">${attendance}</td>
                <td class="center">${assignments}</td>
                <td class="center">${midterm}</td>
                <td class="center">${final}</td>
                <td class="center"><strong>${total}</strong></td>
                <td class="center ${statusClass}">${status}</td>
            </tr>`
}).join('')}
        </tbody>
    </table>
    
    <div class="footer">
        <p><strong>Grading Scale:</strong> Attendance (10%) + Assignments (20%) + Midterm (30%) + Final (40%) = Total</p>
        <p><strong>Generated by:</strong> ISA KWA University LMS</p>
        <p><strong>Total students:</strong> ${students.length} | 
           <strong>Completed:</strong> ${students.filter(s => s.enrollments?.[0]?.status === 'Completed').length} | 
           <strong>Pending:</strong> ${students.filter(s => s.enrollments?.[0]?.status === 'Pending').length}</p>
    </div>
    
    <div class="no-print" style="text-align: center; margin-top: 20px;">
        <button onclick="window.print()" style="padding: 10px 20px; font-size: 14px;">Print to PDF</button>
        <button onclick="window.close()" style="padding: 10px 20px; font-size: 14px; margin-left: 10px;">Close</button>
    </div>
</body>
</html>`

    // Open in new window and trigger print
    const printWindow = window.open('', '_blank')
    if (printWindow) {
      printWindow.document.write(htmlContent)
      printWindow.document.close()
      
      // Auto-trigger print dialog after content loads
      printWindow.onload = () => {
        setTimeout(() => {
          printWindow.print()
        }, 500)
      }
    }
  }

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

export const gradeEntryService = new GradeEntryService()
