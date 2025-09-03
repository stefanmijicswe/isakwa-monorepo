const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

// TypeScript interfaces
export interface Subject {
  id: number
  name: string
  code: string
  ects: number
  semesterType: 'WINTER' | 'SUMMER'
  academicYear: string
  description?: string
  credits?: number
  lectureHours?: number
  practicalHours?: number
  studyProgramId?: number
}

export interface Syllabus {
  id: number
  subjectId: number
  title: string
  description?: string
  objectives?: string
  academicYear?: string
  isActive: boolean
  createdAt: string
  updatedAt: string
  subject?: Subject
  topics?: SyllabusTopic[]
  materials?: SyllabusMaterial[]
}

export interface SyllabusTopic {
  id: number
  syllabusId: number
  title: string
  description?: string
  weekNumber?: number
  isActive: boolean
}

export interface SyllabusMaterial {
  id: number
  syllabusId: number
  title: string
  description?: string
  filePath?: string
  isActive: boolean
}

export interface CreateSyllabusDto {
  subjectId: number
  academicYear: string
  semesterType: 'WINTER' | 'SUMMER'
  description: string
  objectives: string
  isActive?: boolean
}

export interface UpdateSyllabusDto {
  description?: string
  objectives?: string
  isActive?: boolean
}

export interface GetSyllabusDto {
  subjectId?: number
  academicYear?: string
  semesterType?: 'WINTER' | 'SUMMER'
}

class SyllabiService {
  private getAuthToken(): string | null {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth_token')
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = this.getAuthToken()
    const url = `${API_BASE_URL}${endpoint}`

    console.log('🔑 Auth token from localStorage:', token ? `${token.substring(0, 10)}...` : 'NO TOKEN')

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    }

    console.log('📡 Syllabi API Request:', { 
      url, 
      method: config.method || 'GET',
      hasToken: !!token,
      headers: config.headers,
      body: options.body
    })

    try {
      const response = await fetch(url, config)
      
      console.log('📊 Response status:', response.status, response.statusText)

      if (!response.ok) {
        const errorText = await response.text()
        console.error('❌ Syllabi API Error:', { 
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
      console.log('✅ Syllabi API Response:', data)
      return data
    } catch (error) {
      console.error('💥 Syllabi API Request failed:', error)
      throw error
    }
  }

  // Get professor's subjects
  async getProfessorSubjects(academicYear?: string): Promise<Subject[]> {
    console.log('Getting professor subjects for academic year:', academicYear)
    
    try {
      // Try to get from real API first
      const queryParams = academicYear ? `?academicYear=${academicYear}` : ''
      const assignments = await this.request<any[]>(`/academic-records/my-subjects${queryParams}`)
      
      // Map ProfessorAssignment objects to Subject objects
      return assignments.map(assignment => ({
        id: assignment.subject.id,
        name: assignment.subject.name,
        code: assignment.subject.code,
        ects: assignment.subject.ects,
        semesterType: assignment.subject.semesterType || 'WINTER', // Default to WINTER if null
        academicYear: assignment.academicYear || assignment.subject.academicYear || '2024/2025',
        description: assignment.subject.description,
        credits: assignment.subject.credits,
        lectureHours: assignment.subject.lectureHours,
        practicalHours: assignment.subject.practicalHours,
        studyProgramId: assignment.subject.studyProgramId
      }))
    } catch (error) {
      console.warn('API not available, using mock data:', error)
      
      // Fallback to mock subjects only if API fails
      return this.getMockSubjects()
    }
  }

  // Mock subjects for demonstration
  private getMockSubjects(): Subject[] {
    return [
      {
        id: 1,
        name: 'Introduction to Programming',
        code: 'CS101',
        ects: 6,
        semesterType: 'WINTER',
        academicYear: '2024/2025',
        description: 'Introduction to programming concepts and fundamentals',
        credits: 6,
        lectureHours: 30,
        practicalHours: 15,
        studyProgramId: 1
      },
      {
        id: 2,
        name: 'Data Structures and Algorithms',
        code: 'CS201',
        ects: 7,
        semesterType: 'SUMMER',
        academicYear: '2024/2025',
        description: 'Comprehensive course covering fundamental data structures and algorithmic techniques',
        credits: 7,
        lectureHours: 45,
        practicalHours: 30,
        studyProgramId: 1
      },
      {
        id: 3,
        name: 'Introduction to Management',
        code: 'BUS101',
        ects: 6,
        semesterType: 'WINTER',
        academicYear: '2024/2025',
        description: 'Introduction to business management principles',
        credits: 6,
        lectureHours: 30,
        practicalHours: 15,
        studyProgramId: 2
      },
      {
        id: 4,
        name: 'Introduction to Information Technologies',
        code: 'IT101',
        ects: 6,
        semesterType: 'WINTER',
        academicYear: '2024/2025',
        description: 'Introduction to information technology concepts',
        credits: 6,
        lectureHours: 30,
        practicalHours: 15,
        studyProgramId: 1
      },
      {
        id: 5,
        name: 'Database Systems',
        code: 'CS301',
        ects: 6,
        semesterType: 'WINTER',
        academicYear: '2024/2025',
        description: 'Database design, SQL, and database management systems',
        credits: 6,
        lectureHours: 30,
        practicalHours: 30,
        studyProgramId: 1
      },
      {
        id: 4,
        name: 'Web Development',
        code: 'CS401',
        ects: 5,
        semesterType: 'SUMMER',
        academicYear: '2024/2025',
        description: 'Modern web development technologies and frameworks',
        credits: 5,
        lectureHours: 30,
        practicalHours: 45,
        studyProgramId: 1
      }
    ]
  }

  // Get syllabi (with optional filters)
  async getSyllabi(filters: GetSyllabusDto = {}): Promise<Syllabus[]> {
    console.log('Getting syllabi with filters:', filters)
    
    try {
      // Try to get from real API first
      const queryParams = new URLSearchParams()
      if (filters.subjectId) queryParams.append('subjectId', filters.subjectId.toString())
      if (filters.academicYear) queryParams.append('academicYear', filters.academicYear)
      if (filters.semesterType) queryParams.append('semesterType', filters.semesterType)
      
      const query = queryParams.toString()
      return await this.request<Syllabus[]>(`/academic-records/syllabus${query ? `?${query}` : ''}`)
    } catch (error) {
      console.warn('API not available, using mock data:', error)
      
      // Fallback to mock syllabi
      return this.getMockSyllabi(filters)
    }
  }

  // Mock syllabi for demonstration
  private getMockSyllabi(filters: GetSyllabusDto = {}): Syllabus[] {
    const allSyllabi: Syllabus[] = [
      {
        id: 1,
        subjectId: 1,
        title: 'Data Structures and Algorithms Syllabus',
        description: 'This course introduces students to fundamental data structures and algorithms essential for computer science. Students will learn to analyze algorithmic complexity, implement various data structures, and apply appropriate algorithms for problem-solving.',
        objectives: 'By the end of this course, students will be able to understand and implement fundamental data structures, analyze time and space complexity, and design efficient solutions for computational problems.',
        academicYear: '2024/2025',
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        topics: [
          { id: 1, syllabusId: 1, title: 'Introduction to Algorithms', description: 'Basic concepts and complexity analysis', weekNumber: 1, isActive: true },
          { id: 2, syllabusId: 1, title: 'Arrays and Dynamic Arrays', description: 'Array operations and implementations', weekNumber: 2, isActive: true },
          { id: 3, syllabusId: 1, title: 'Linked Lists', description: 'Various types of linked lists', weekNumber: 3, isActive: true }
        ],
        materials: [
          { id: 1, syllabusId: 1, title: 'Introduction to Algorithms (CLRS)', description: 'Primary textbook', filePath: '/materials/cs101/clrs.pdf', isActive: true },
          { id: 2, syllabusId: 1, title: 'Lecture Slides', description: 'Course presentation slides', filePath: '/materials/cs101/slides.pdf', isActive: true }
        ]
      },
      {
        id: 3,
        subjectId: 3,
        title: 'Database Systems Syllabus',
        description: 'This course covers the fundamental concepts of database systems, including data modeling, database design, SQL programming, and database management.',
        objectives: 'Students will learn to design normalized databases, write complex SQL queries, and understand database internals including indexing and transactions.',
        academicYear: '2024/2025',
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        topics: [
          { id: 4, syllabusId: 3, title: 'Introduction to Database Systems', description: 'Database concepts and DBMS architecture', weekNumber: 1, isActive: true },
          { id: 5, syllabusId: 3, title: 'Entity-Relationship Modeling', description: 'ER diagrams and database design', weekNumber: 2, isActive: true },
          { id: 6, syllabusId: 3, title: 'SQL Fundamentals', description: 'Basic SQL queries and operations', weekNumber: 3, isActive: true }
        ],
        materials: [
          { id: 3, syllabusId: 3, title: 'Database System Concepts', description: 'Primary database textbook', filePath: '/materials/cs301/database_concepts.pdf', isActive: true }
        ]
      },
      {
        id: 4,
        subjectId: 4,
        title: 'Web Development Syllabus',
        description: 'This course introduces modern web development technologies and practices for building responsive and interactive web applications.',
        objectives: 'Students will learn both front-end and back-end development, working with HTML5, CSS3, JavaScript, and popular frameworks.',
        academicYear: '2024/2025',
        isActive: true,
        createdAt: '2024-01-15T10:00:00Z',
        updatedAt: '2024-01-15T10:00:00Z',
        topics: [
          { id: 7, syllabusId: 4, title: 'Web Fundamentals', description: 'HTML5, CSS3, and JavaScript basics', weekNumber: 1, isActive: true },
          { id: 8, syllabusId: 4, title: 'Frontend Frameworks', description: 'React.js and modern frontend development', weekNumber: 2, isActive: true },
          { id: 9, syllabusId: 4, title: 'Backend Development', description: 'Node.js and Express.js fundamentals', weekNumber: 3, isActive: true }
        ],
        materials: [
          { id: 4, syllabusId: 4, title: 'MDN Web Docs', description: 'Web development documentation', filePath: '/materials/cs401/mdn_docs.pdf', isActive: true }
        ]
      }
    ]

    // Apply filters
    return allSyllabi.filter(syllabus => {
      if (filters.subjectId && syllabus.subjectId !== filters.subjectId) return false
      if (filters.academicYear && syllabus.academicYear !== filters.academicYear) return false
      return true
    })
  }

  // Get single syllabus by ID
  async getSyllabusById(id: number): Promise<Syllabus> {
    console.log('Getting syllabus by ID:', id)
    
    try {
      // Try to get from real API first
      return await this.request<Syllabus>(`/academic-records/syllabus/${id}`)
    } catch (error) {
      console.warn('API not available, using mock data:', error)
      
      // Fallback to mock syllabus
      const mockSyllabi = this.getMockSyllabi()
      const syllabus = mockSyllabi.find(s => s.id === id)
      
      if (!syllabus) {
        throw new Error(`Syllabus with ID ${id} not found`)
      }
      
      return syllabus
    }
  }

  // Create new syllabus
  async createSyllabus(data: CreateSyllabusDto): Promise<Syllabus> {
    console.log('Creating syllabus:', data)
    
    try {
      // Try to send to real API first
      return await this.request<Syllabus>('/academic-records/syllabus', {
        method: 'POST',
        body: JSON.stringify(data),
      })
    } catch (error) {
      console.warn('API not available, using mock data:', error)
      
      // Fallback to mock response
      const newSyllabus: Syllabus = {
        id: Date.now(), // Use timestamp as unique ID
        subjectId: data.subjectId,
        title: `Syllabus for Subject ${data.subjectId}`,
        description: data.description || 'Course description',
        objectives: data.objectives || 'Learning objectives',
        academicYear: data.academicYear,
        isActive: data.isActive ?? true,
        createdAt: new Date().toISOString(),
        updatedAt: new Date().toISOString(),
        topics: [],
        materials: []
      }
      
      return newSyllabus
    }
  }

  // Update existing syllabus
  async updateSyllabus(id: number, data: UpdateSyllabusDto): Promise<Syllabus> {
    console.log('Updating syllabus:', { id, data })
    
    try {
      // Try to update via real API first
      return await this.request<Syllabus>(`/academic-records/syllabus/${id}`, {
        method: 'PUT',
        body: JSON.stringify(data),
      })
    } catch (error) {
      console.warn('API not available, using mock data:', error)
      
      // Fallback to mock update
      const mockSyllabi = this.getMockSyllabi()
      const existingSyllabus = mockSyllabi.find(s => s.id === id)
      
      if (!existingSyllabus) {
        throw new Error(`Syllabus with ID ${id} not found`)
      }
      
      const updatedSyllabus: Syllabus = {
        ...existingSyllabus,
        ...data,
        id, // Keep original ID
        updatedAt: new Date().toISOString()
      }
      
      return updatedSyllabus
    }
  }

  // Delete syllabus
  async deleteSyllabus(id: number): Promise<void> {
    console.log('Deleting syllabus (mock):', id)
    
    // For presentation, just log the action
    return Promise.resolve()
    
    /* TODO: Enable API when auth is properly set up
    return this.request<void>(`/academic-records/syllabus/${id}`, {
      method: 'DELETE',
    })
    */
  }

  // Topic management
  async createTopic(data: { syllabusId: number; title: string; description?: string; weekNumber?: number }): Promise<SyllabusTopic> {
    console.log('Creating topic (mock):', data)
    
    // For presentation, return mock topic
    const newTopic: SyllabusTopic = {
      id: Date.now(),
      syllabusId: data.syllabusId,
      title: data.title,
      description: data.description,
      weekNumber: data.weekNumber,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    return newTopic
    
    /* TODO: Enable API when auth is properly set up
    return this.request<SyllabusTopic>('/academic-records/syllabus/topic', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    */
  }

  async updateTopic(id: number, data: { title?: string; description?: string; weekNumber?: number }): Promise<SyllabusTopic> {
    console.log('Updating topic (mock):', { id, data })
    
    // For presentation, return mock updated topic
    const updatedTopic: SyllabusTopic = {
      id,
      syllabusId: 1, // Mock syllabusId
      title: data.title || 'Updated Topic',
      description: data.description,
      weekNumber: data.weekNumber,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    return updatedTopic
    
    /* TODO: Enable API when auth is properly set up
    return this.request<SyllabusTopic>(`/academic-records/syllabus/topic/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    */
  }

  async deleteTopic(id: number): Promise<void> {
    console.log('Deleting topic (mock):', id)
    
    // For presentation, just resolve
    return Promise.resolve()
    
    /* TODO: Enable API when auth is properly set up
    return this.request<void>(`/academic-records/syllabus/topic/${id}`, {
      method: 'DELETE',
    })
    */
  }

  // Material management
  async createMaterial(data: { syllabusId: number; title: string; description?: string; filePath?: string }): Promise<SyllabusMaterial> {
    console.log('Creating material (mock):', data)
    
    // For presentation, return mock material
    const newMaterial: SyllabusMaterial = {
      id: Date.now(),
      syllabusId: data.syllabusId,
      title: data.title,
      description: data.description,
      filePath: data.filePath,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    return newMaterial
    
    /* TODO: Enable API when auth is properly set up
    return this.request<SyllabusMaterial>('/academic-records/syllabus/material', {
      method: 'POST',
      body: JSON.stringify(data),
    })
    */
  }

  async updateMaterial(id: number, data: { title?: string; description?: string; filePath?: string }): Promise<SyllabusMaterial> {
    console.log('Updating material (mock):', { id, data })
    
    // For presentation, return mock updated material
    const updatedMaterial: SyllabusMaterial = {
      id,
      syllabusId: 1, // Mock syllabusId
      title: data.title || 'Updated Material',
      description: data.description,
      filePath: data.filePath,
      isActive: true,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    }
    
    return updatedMaterial
    
    /* TODO: Enable API when auth is properly set up
    return this.request<SyllabusMaterial>(`/academic-records/syllabus/material/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
    })
    */
  }

  async deleteMaterial(id: number): Promise<void> {
    console.log('Deleting material (mock):', id)
    
    // For presentation, just resolve
    return Promise.resolve()
    
    /* TODO: Enable API when auth is properly set up
    return this.request<void>(`/academic-records/syllabus/material/${id}`, {
      method: 'DELETE',
    })
    */
  }

  // Helper functions
  getSemesterDisplayName(semester: 'WINTER' | 'SUMMER'): string {
    return semester === 'WINTER' ? 'Winter' : 'Summer'
  }

  getCurrentAcademicYear(): string {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() + 1 // 1-12
    
    // Academic year typically starts in September
    if (month >= 9) {
      return `${year}/${year + 1}`
    } else {
      return `${year - 1}/${year}`
    }
  }
}

export const syllabiService = new SyllabiService()
