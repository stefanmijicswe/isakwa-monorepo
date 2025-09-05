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
    
    // Try to get token from localStorage first
    let token = localStorage.getItem('auth_token')
    
    // If no token exists, set a test token for development
    if (!token) {
      const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjYsImVtYWlsIjoiam9obi5zbWl0aEBpc2Frd2EuZWR1Iiwicm9sZSI6IlBST0ZFU1NPUiIsImZpcnN0TmFtZSI6IkpvaG4iLCJsYXN0TmFtZSI6IlNtaXRoIiwiaWF0IjoxNzU3MDg2NDI0LCJleHAiOjE3NTc2OTEyMjR9.6bwFkS_v9bo2tUBSpPJkPS5iPgXRrCkJb-MTJNI5Oug'
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
        console.error('❌ GradeEntry API Error:', response.status, errorData)
        throw new Error(`HTTP ${response.status}: ${errorData}`)
      }

      const data = await response.json()
      return data
    } catch (error) {
      console.error('💥 GradeEntry API Error:', error)
      throw error
    }
  }



  // Get professor's courses
  async getProfessorCourses(): Promise<Course[]> {
    
    try {
      const response = await this.request<Course[]>('/academic-records/professor/courses')
      return response
    } catch (error) {
      console.error('❌ Failed to fetch professor courses from backend:', error)
      throw new Error('Failed to load professor courses')
    }
  }

  // Get students enrolled in a course
  async getCourseStudents(courseId?: string): Promise<Student[]> {
    
    if (!courseId || courseId === "all") {
      try {
        const response = await this.request<Student[]>('/academic-records/professor/all-students')
        return response
      } catch (error) {
        console.error('❌ Failed to fetch all professor students from backend:', error)
        throw new Error('Failed to load all professor students')
      }
    }
    
    try {
      const response = await this.request<Student[]>(`/academic-records/professor/courses/${courseId}/students`)
      return response
    } catch (error) {
      console.error('❌ Failed to fetch course students from backend:', error)
      throw new Error('Failed to load course students')
    }
  }

  // Save all grades
  async saveGrades(grades: Record<string, string>, courseId?: string): Promise<void> {
    
    if (!courseId || courseId === "all") {
      throw new Error('Course ID is required for saving grades')
    }
    
    // Transform grades data into backend format
    const studentIds = new Set<string>()
    
    // Extract unique student IDs
    Object.keys(grades).forEach(key => {
      const [studentId] = key.split('_')
      studentIds.add(studentId)
    })

    // Create grade entries for each student
    const gradeEntries = Array.from(studentIds).map(studentId => {
      const gradeData: any = {
        studentId: parseInt(studentId)
      }
      
      // Only include grades that have been entered/modified
      const attendance = grades[`${studentId}_attendance`]
      const assignments = grades[`${studentId}_assignments`]
      const midterm = grades[`${studentId}_midterm`]
      const final = grades[`${studentId}_final`]
      
      if (attendance !== undefined && attendance !== '') {
        gradeData.attendance = parseFloat(attendance)
      }
      if (assignments !== undefined && assignments !== '') {
        gradeData.assignments = parseFloat(assignments)
      }
      if (midterm !== undefined && midterm !== '') {
        gradeData.midterm = parseFloat(midterm)
      }
      if (final !== undefined && final !== '') {
        gradeData.final = parseFloat(final)
      }
      
      return gradeData
    }).filter(entry => {
      // Only include entries that have at least one grade
      return entry.attendance !== undefined || 
             entry.assignments !== undefined || 
             entry.midterm !== undefined || 
             entry.final !== undefined
    })

    
    try {
      const response = await this.request<any>(`/academic-records/professor/courses/${courseId}/grades`, {
        method: 'POST',
        body: JSON.stringify(gradeEntries)
      })
      
      return response
    } catch (error) {
      console.error('❌ Failed to save grades to backend:', error)
      throw new Error('Failed to save grades')
    }
  }

  // Check if grade entry is allowed (within 15 days of exam date)
  isGradeEntryAllowed(examDate: string): { allowed: boolean; daysElapsed: number; message?: string } {
    const examDateTime = new Date(examDate)
    const currentDate = new Date()
    const timeDiff = currentDate.getTime() - examDateTime.getTime()
    const daysElapsed = Math.floor(timeDiff / (1000 * 3600 * 24))
    const maxDays = 15 // 15 days after exam
    
    // If exam is more than 15 days ago, grade entry is not allowed
    if (daysElapsed > maxDays) {
      return {
        allowed: false,
        daysElapsed,
        message: `Grade entry is no longer allowed. Exam was ${daysElapsed} days ago (maximum ${maxDays} days allowed).`
      }
    }
    
    // If exam is in the future (more than today), grade entry is not allowed yet
    if (daysElapsed < 0) {
      return {
        allowed: false,
        daysElapsed,
        message: `Cannot enter grades yet. Exam is in ${Math.abs(daysElapsed)} days.`
      }
    }
    
    // Grade entry is allowed from exam date (day 0) to 15 days after
    return {
      allowed: true,
      daysElapsed,
      message: `${maxDays - daysElapsed} days remaining to enter grades.`
    }
  }

  // Export grades
  async exportGrades(courseId?: string, format: 'csv' | 'pdf' = 'csv'): Promise<void> {
    
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
