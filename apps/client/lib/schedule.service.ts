// Schedule Planning Service
export interface ScheduleItem {
  id: number
  week: number
  topic: string
  description: string
  duration: string
  room: string
  type: 'lecture' | 'practice'
}

export interface Schedule {
  id: number
  courseId: number
  courseName: string
  courseCode: string
  academicYear: string
  lectures: ScheduleItem[]
  practice: ScheduleItem[]
  createdAt: string
  updatedAt: string
}

export interface Course {
  id: number
  name: string
  acronym: string
  ects: number
  semester: string
  studentsEnrolled: number
  status: string
}

export interface CreateScheduleDto {
  courseId: number
  lectures: Omit<ScheduleItem, 'id' | 'type'>[]
  practice: Omit<ScheduleItem, 'id' | 'type'>[]
}

export interface UpdateScheduleDto extends CreateScheduleDto {
  id: number
}

class ScheduleService {
  private readonly API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

  private async request<T>(url: string, options: RequestInit = {}): Promise<T> {
    const token = localStorage.getItem('auth_token')
    
    try {
      const response = await fetch(`${this.API_BASE_URL}${url}`, {
        headers: {
          'Content-Type': 'application/json',
          ...(token && { Authorization: `Bearer ${token}` }),
        },
        ...options,
      })

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Schedule API Error:', { 
          status: response.status, 
          statusText: response.statusText,
          errorText,
          url,
          hasToken: !!token,
          requestBody: options.body
        })
        throw new Error(`HTTP ${response.status}: ${errorText}`)
      }

      const data = await response.json()
      // console.log('✅ Schedule API Response:', data)
      return data
    } catch (error) {
      console.error('💥 Schedule API Request failed:', error)
      throw error
    }
  }

  // Get professor courses
  async getProfessorCourses(): Promise<Course[]> {
    // console.log('Getting professor courses for schedule planning')
    
    try {
      // Try to get from real API first
      const assignments = await this.request<any[]>('/academic-records/my-subjects')
      
      // Map assignments to Course format
      return assignments.map(assignment => ({
        id: assignment.subject.id,
        name: assignment.subject.name,
        code: assignment.subject.code,
        semester: assignment.academicYear,
        credits: assignment.subject.ects,
        students: 0, // Will be populated later if needed
        type: assignment.subject.semesterType || 'WINTER'
      }))
    } catch (error) {
      console.warn('API not available, using mock data:', error)
      
      // Fallback to mock courses
      return this.getMockCourses()
    }
  }

    // Get saved schedules
  async getSchedules(): Promise<Schedule[]> {
    // console.log('Getting saved schedules')

    try {
      // Try to get from real API first
      const apiSchedules = await this.request<any[]>('/course-schedules/my-schedules')
      // console.log('✅ Retrieved schedules from API:', apiSchedules.length)
      
      // Transform API data to our Schedule format
      return apiSchedules.map(apiSchedule => ({
        id: apiSchedule.id,
        courseId: apiSchedule.subjectId,
        courseName: apiSchedule.subject?.name || 'Unknown Course',
        courseCode: apiSchedule.subject?.code || 'UNK',
        academicYear: apiSchedule.academicYear,
        lectures: apiSchedule.sessions
          ?.filter((session: any) => session.sessionType === 'LECTURE')
          ?.map((session: any, index: number) => ({
            id: session.id,
            week: index + 1,
            topic: session.title,
            description: session.description || '',
            duration: '90 min',
            room: session.room || 'TBD',
            type: 'lecture' as const
          })) || [],
        practice: apiSchedule.sessions
          ?.filter((session: any) => session.sessionType === 'EXERCISE')
          ?.map((session: any, index: number) => ({
            id: session.id,
            week: index + 1,
            topic: session.title,
            description: session.description || '',
            duration: '90 min',
            room: session.room || 'TBD',
            type: 'practice' as const
          })) || [],
        createdAt: apiSchedule.createdAt,
        updatedAt: apiSchedule.updatedAt
      }))
    } catch (error) {
      console.warn('⚠️ API not available, falling back to localStorage + mock data')
      
      // Fallback to localStorage + mock data
      const storedSchedules = this.getStoredSchedules()
      const mockSchedules = this.getMockSchedules()

      const allSchedules = [...storedSchedules]
      mockSchedules.forEach(mockSchedule => {
        if (!storedSchedules.find(s => s.courseId === mockSchedule.courseId)) {
          allSchedules.push(mockSchedule)
        }
      })

      return allSchedules
    }
  }

  // Get schedule by ID
  async getScheduleById(id: number): Promise<Schedule> {
    // console.log('Getting schedule by ID:', id)
    
    // Return mock schedule for presentation
    const schedules = this.getMockSchedules()
    const schedule = schedules.find(s => s.id === id)
    if (!schedule) {
      throw new Error(`Schedule with ID ${id} not found`)
    }
    return schedule
    
    /* TODO: Enable API when auth is properly set up
    return this.request<Schedule>(`/academic-records/schedules/${id}`)
    */
  }

    // Create new schedule
  async createSchedule(data: CreateScheduleDto): Promise<Schedule> {
    // console.log('Creating schedule:', data)

    try {
      // Step 1: Create CourseSchedule
      const schedulePayload = {
        subjectId: data.courseId,
        academicYear: '2024/2025',
        semesterType: 'WINTER',
        isActive: true
      }

      const scheduleResponse = await this.request<any>('/course-schedules', {
        method: 'POST',
        body: JSON.stringify(schedulePayload),
      })

      // console.log('✅ Schedule created via API:', scheduleResponse.id)
      
      // Step 2: Create sessions for lectures and practice
      const allSessions = []
      
      // Add lectures
      for (const lecture of data.lectures) {
        const sessionPayload = {
          scheduleId: scheduleResponse.id,
          title: lecture.topic,
          description: lecture.description,
          sessionType: 'LECTURE',
          sessionDate: '2024-09-09', // Default date
          startTime: '09:00',
          endTime: '10:30',
          room: lecture.room || 'TBD',
          isActive: true
        }
        
        const sessionResponse = await this.request<any>('/course-schedules/sessions', {
          method: 'POST',
          body: JSON.stringify(sessionPayload),
        })
        
        allSessions.push(sessionResponse)
        // console.log('✅ Lecture session created:', sessionResponse.id)
      }
      
      // Add practice sessions  
      for (const practice of data.practice) {
        const sessionPayload = {
          scheduleId: scheduleResponse.id,
          title: practice.topic,
          description: practice.description,
          sessionType: 'EXERCISE',
          sessionDate: '2024-09-11', // Default date
          startTime: '11:00',
          endTime: '12:30',
          room: practice.room || 'TBD',
          isActive: true
        }
        
        const sessionResponse = await this.request<any>('/course-schedules/sessions', {
          method: 'POST',
          body: JSON.stringify(sessionPayload),
        })
        
        allSessions.push(sessionResponse)
        // console.log('✅ Practice session created:', sessionResponse.id)
      }

      // Transform API response to our Schedule format
      const course = this.getMockCourses().find(c => c.id === data.courseId)
      return {
        id: scheduleResponse.id,
        courseId: data.courseId,
        courseName: course?.name || 'Unknown Course',
        courseCode: course?.acronym || 'UNK',
        academicYear: scheduleResponse.academicYear,
        lectures: allSessions
          ?.filter((session: any) => session.sessionType === 'LECTURE')
          ?.map((session: any, index: number) => ({
            id: session.id,
            week: index + 1,
            topic: session.title,
            description: session.description || '',
            duration: '90 min',
            room: session.room || 'TBD',
            type: 'lecture' as const
          })) || [],
        practice: allSessions
          ?.filter((session: any) => session.sessionType === 'EXERCISE')
          ?.map((session: any, index: number) => ({
            id: session.id,
            week: index + 1,
            topic: session.title,
            description: session.description || '',
            duration: '90 min',
            room: session.room || 'TBD',
            type: 'practice' as const
          })) || [],
        createdAt: scheduleResponse.createdAt,
        updatedAt: scheduleResponse.updatedAt
      }
    } catch (error) {
      console.warn('⚠️ API not available, falling back to localStorage')
      
      // Fallback to localStorage
      const course = this.getMockCourses().find(c => c.id === data.courseId)
      const newSchedule: Schedule = {
        id: Date.now(),
        courseId: data.courseId,
        courseName: course?.name || 'Unknown Course',
        courseCode: course?.acronym || 'UNK',
        academicYear: '2024/2025',
        lectures: data.lectures.map((lecture, index) => ({
          ...lecture,
          id: Date.now() + index,
          type: 'lecture' as const
        })),
        practice: data.practice.map((practice, index) => ({
          ...practice,
          id: Date.now() + index + 1000,
          type: 'practice' as const
        })),
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString()
      }

      // Save to localStorage
      this.saveSchedulesToStorage([...this.getStoredSchedules(), newSchedule])
      return newSchedule
    }
  }

    // Update existing schedule
  async updateSchedule(data: UpdateScheduleDto): Promise<Schedule> {
    // console.log('Updating schedule:', data)

    // Use localStorage for stable demonstration
    // console.log('📱 Using localStorage for schedule update')
    const allSchedules = await this.getSchedules()
    const existingSchedule = allSchedules.find(s => s.id === data.id)

    if (!existingSchedule) {
      throw new Error(`Schedule with ID ${data.id} not found`)
    }

    const course = this.getMockCourses().find(c => c.id === data.courseId)
    const updatedSchedule: Schedule = {
      ...existingSchedule,
      courseId: data.courseId,
      courseName: course?.name || existingSchedule.courseName,
      courseCode: course?.acronym || existingSchedule.courseCode,
      lectures: data.lectures.map((lecture, index) => ({
        ...lecture,
        id: existingSchedule.lectures[index]?.id || Date.now() + index,
        type: 'lecture' as const
      })),
      practice: data.practice.map((practice, index) => ({
        ...practice,
        id: existingSchedule.practice[index]?.id || Date.now() + index + 1000,
        type: 'practice' as const
      })),
      updatedAt: new Date().toISOString()
    }

    // Update in localStorage
    const storedSchedules = this.getStoredSchedules()
    const updatedStoredSchedules = storedSchedules.map(s =>
      s.id === data.id ? updatedSchedule : s
    )

    // If schedule wasn't in stored schedules, add it
    if (!storedSchedules.find(s => s.id === data.id)) {
      updatedStoredSchedules.push(updatedSchedule)
    }

    this.saveSchedulesToStorage(updatedStoredSchedules)
    return updatedSchedule

    /* TODO: Re-enable API when backend is properly configured
    try {
      // Prepare API payload
      const apiPayload = {
        subjectId: data.courseId,
        academicYear: '2024/2025',
        semesterType: 'WINTER',
        sessions: [
          // Add lectures
          ...data.lectures.map((lecture) => ({
            title: lecture.topic,
            description: lecture.description,
            sessionType: 'LECTURE',
            dayOfWeek: 1, // Monday
            startTime: '09:00',
            endTime: '10:30',
            room: lecture.room || 'TBD'
          })),
          // Add practice sessions
          ...data.practice.map((practice) => ({
            title: practice.topic,
            description: practice.description,
            sessionType: 'EXERCISE',
            dayOfWeek: 3, // Wednesday
            startTime: '11:00',
            endTime: '12:30',
            room: practice.room || 'TBD'
          }))
        ]
      }

      const apiResponse = await this.request<any>(`/course-schedules/${data.id}`, {
        method: 'PUT',
        body: JSON.stringify(apiPayload),
      })

      // console.log('✅ Schedule updated via API:', apiResponse.id)

      // Transform API response to our Schedule format
      const course = this.getMockCourses().find(c => c.id === data.courseId)
      return {
        id: apiResponse.id,
        courseId: data.courseId,
        courseName: course?.name || 'Unknown Course',
        courseCode: course?.acronym || 'UNK',
        academicYear: apiResponse.academicYear,
        lectures: data.lectures.map((lecture, index) => ({
          ...lecture,
          id: Date.now() + index,
          type: 'lecture' as const
        })),
        practice: data.practice.map((practice, index) => ({
          ...practice,
          id: Date.now() + index + 1000,
          type: 'practice' as const
        })),
        createdAt: apiResponse.createdAt,
        updatedAt: apiResponse.updatedAt
      }
    } catch (error) {
      console.warn('⚠️ API not available, falling back to localStorage')
      
      // Fallback to localStorage
      const allSchedules = await this.getSchedules()
      const existingSchedule = allSchedules.find(s => s.id === data.id)

      if (!existingSchedule) {
        throw new Error(`Schedule with ID ${data.id} not found`)
      }

      const course = this.getMockCourses().find(c => c.id === data.courseId)
      const updatedSchedule: Schedule = {
        ...existingSchedule,
        courseId: data.courseId,
        courseName: course?.name || existingSchedule.courseName,
        courseCode: course?.acronym || existingSchedule.courseCode,
        lectures: data.lectures.map((lecture, index) => ({
          ...lecture,
          id: existingSchedule.lectures[index]?.id || Date.now() + index,
          type: 'lecture' as const
        })),
        practice: data.practice.map((practice, index) => ({
          ...practice,
          id: existingSchedule.practice[index]?.id || Date.now() + index + 1000,
          type: 'practice' as const
        })),
        updatedAt: new Date().toISOString()
      }

      // Update in localStorage
      const storedSchedules = this.getStoredSchedules()
      const updatedStoredSchedules = storedSchedules.map(s =>
        s.id === data.id ? updatedSchedule : s
      )

      // If schedule wasn't in stored schedules, add it
      if (!storedSchedules.find(s => s.id === data.id)) {
        updatedStoredSchedules.push(updatedSchedule)
      }

      this.saveSchedulesToStorage(updatedStoredSchedules)
      return updatedSchedule
    }
    */
  }

  // Delete schedule
  async deleteSchedule(id: number): Promise<void> {
    // console.log('Deleting schedule (mock):', id)
    
    // For presentation, just resolve
    return Promise.resolve()
    
    /* TODO: Enable API when auth is properly set up
    return this.request<void>(`/academic-records/schedules/${id}`, {
      method: 'DELETE',
    })
    */
  }

  // Mock data for demonstration
  private getMockCourses(): Course[] {
    return [
      {
        id: 1,
        name: "Introduction to Information Technologies",
        acronym: "IT101",
        ects: 6,
        semester: "Winter",
        studentsEnrolled: 45,
        status: "Active"
      },
      {
        id: 2,
        name: "Programming Fundamentals",
        acronym: "PF102",
        ects: 6,
        semester: "Winter",
        studentsEnrolled: 38,
        status: "Active"
      },
      {
        id: 3,
        name: "Web Technologies",
        acronym: "WT202",
        ects: 6,
        semester: "Summer",
        studentsEnrolled: 32,
        status: "Active"
      },
      {
        id: 4,
        name: "Database Systems",
        acronym: "DB203",
        ects: 6,
        semester: "Summer",
        studentsEnrolled: 28,
        status: "Active"
      }
    ]
  }

  private getMockSchedules(): Schedule[] {
    return [
      {
        id: 1,
        courseId: 1,
        courseName: "Introduction to Information Technologies",
        courseCode: "IT101",
        academicYear: "2024/2025",
        lectures: [
          {
            id: 1,
            week: 1,
            topic: "Course Introduction and IT Overview",
            description: "Introduction to the course, syllabus overview, and basic concepts of information technologies",
            duration: "90 min",
            room: "Room 301",
            type: "lecture"
          },
          {
            id: 2,
            week: 2,
            topic: "Computer Systems and Hardware",
            description: "Understanding computer architecture, CPU, memory, storage devices, and input/output systems",
            duration: "90 min",
            room: "Room 301",
            type: "lecture"
          },
          {
            id: 3,
            week: 3,
            topic: "Operating Systems Fundamentals",
            description: "Introduction to operating systems, file systems, process management, and system security",
            duration: "90 min",
            room: "Room 301",
            type: "lecture"
          },
          {
            id: 4,
            week: 4,
            topic: "Network Technologies",
            description: "Basic networking concepts, TCP/IP, internet protocols, and network security basics",
            duration: "90 min",
            room: "Room 301",
            type: "lecture"
          }
        ],
        practice: [
          {
            id: 5,
            week: 1,
            topic: "Lab Setup and Basic Computer Operations",
            description: "Setting up lab environment, basic computer operations, file management exercises",
            duration: "90 min",
            room: "Lab 205",
            type: "practice"
          },
          {
            id: 6,
            week: 2,
            topic: "Hardware Identification Exercise",
            description: "Hands-on identification of computer components, assembly/disassembly exercise",
            duration: "90 min",
            room: "Lab 205",
            type: "practice"
          },
          {
            id: 7,
            week: 3,
            topic: "Operating System Installation and Configuration",
            description: "Installing and configuring different operating systems, user management exercises",
            duration: "90 min",
            room: "Lab 205",
            type: "practice"
          }
        ],
        createdAt: "2024-01-15T10:00:00Z",
        updatedAt: "2024-01-20T14:30:00Z"
      },
      {
        id: 2,
        courseId: 2,
        courseName: "Programming Fundamentals",
        courseCode: "PF102",
        academicYear: "2024/2025",
        lectures: [
          {
            id: 8,
            week: 1,
            topic: "Introduction to Programming",
            description: "Basic programming concepts, algorithms, flowcharts, and pseudocode",
            duration: "90 min",
            room: "Room 302",
            type: "lecture"
          },
          {
            id: 9,
            week: 2,
            topic: "Variables and Data Types",
            description: "Understanding variables, primitive data types, operators, and expressions",
            duration: "90 min",
            room: "Room 302",
            type: "lecture"
          },
          {
            id: 10,
            week: 3,
            topic: "Control Structures",
            description: "Conditional statements, loops, and decision-making structures in programming",
            duration: "90 min",
            room: "Room 302",
            type: "lecture"
          }
        ],
        practice: [
          {
            id: 11,
            week: 1,
            topic: "Development Environment Setup",
            description: "Installing IDE, writing first program, understanding compiler and interpreter",
            duration: "90 min",
            room: "Lab 203",
            type: "practice"
          },
          {
            id: 12,
            week: 2,
            topic: "Basic Programming Exercises",
            description: "Simple variable exercises, arithmetic operations, input/output programs",
            duration: "90 min",
            room: "Lab 203",
            type: "practice"
          }
        ],
        createdAt: "2024-01-10T08:00:00Z",
        updatedAt: "2024-01-25T16:45:00Z"
      },
      {
        id: 3,
        courseId: 3,
        courseName: "Web Technologies",
        courseCode: "WT202",
        academicYear: "2024/2025",
        lectures: [
          {
            id: 13,
            week: 1,
            topic: "Web Development Introduction",
            description: "Overview of web technologies, client-server architecture, HTTP protocol basics",
            duration: "90 min",
            room: "Room 304",
            type: "lecture"
          },
          {
            id: 14,
            week: 2,
            topic: "HTML and CSS Fundamentals",
            description: "HTML structure, semantic elements, CSS styling, responsive design principles",
            duration: "90 min",
            room: "Room 304",
            type: "lecture"
          }
        ],
        practice: [
          {
            id: 15,
            week: 1,
            topic: "Web Development Environment Setup",
            description: "Setting up code editor, browser dev tools, creating first HTML page",
            duration: "90 min",
            room: "Lab 201",
            type: "practice"
          }
        ],
        createdAt: "2024-01-12T09:30:00Z",
        updatedAt: "2024-01-12T09:30:00Z"
      }
    ]
  }

  // Helper functions
  getSemesterColor(semester: string): string {
    return semester === "Winter" 
      ? "bg-blue-100 text-blue-800" 
      : "bg-orange-100 text-orange-800"
  }

  getStatusColor(status: string): string {
    return status === "Active" 
      ? "bg-green-100 text-green-800" 
      : "bg-slate-100 text-slate-800"
  }

  // localStorage helpers
  private getStoredSchedules(): Schedule[] {
    try {
      const stored = localStorage.getItem('professor_schedules')
      return stored ? JSON.parse(stored) : []
    } catch (error) {
      console.error('Error reading schedules from localStorage:', error)
      return []
    }
  }

  private saveSchedulesToStorage(schedules: Schedule[]): void {
    try {
      localStorage.setItem('professor_schedules', JSON.stringify(schedules))
      // console.log('✅ Schedules saved to localStorage:', schedules.length)
    } catch (error) {
      console.error('Error saving schedules to localStorage:', error)
    }
  }
}

export const scheduleService = new ScheduleService()
