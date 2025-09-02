const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api'

export interface StudentRequest {
  id: number
  studentId: number
  type: 'REQUEST' | 'COMPLAINT'
  title: string
  description: string
  category: 'ACADEMIC' | 'ADMINISTRATIVE' | 'FINANCIAL' | 'DISCIPLINARY' | 'TECHNICAL' | 'OTHER'
  status: 'PENDING' | 'IN_REVIEW' | 'APPROVED' | 'REJECTED'
  assignedTo?: number
  priority: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
  dueDate?: string
  createdAt: string
  updatedAt: string
  student?: {
    id: number
    firstName: string
    lastName: string
    email: string
    studentProfile?: {
      studentIndex: string
    }
  }
  assignedStaff?: {
    id: number
    firstName: string
    lastName: string
    role: string
  }
  _count?: {
    comments: number
    attachments: number
  }
}

export interface RequestComment {
  id: number
  requestId: number
  userId: number
  content: string
  comment?: string
  createdAt: string
  user: {
    id: number
    firstName: string
    lastName: string
    role: string
  }
}

export interface WorkflowStatus {
  id: number
  title: string
  status: string
  workflow: {
    progress: number
    nextPossibleStatuses: string[]
    isOverdue: boolean
    daysSinceCreated: number
    daysUntilDue?: number
  }
  comments: RequestComment[]
}

export interface CreateRequestDto {
  type: 'REQUEST' | 'COMPLAINT'
  title: string
  description: string
  category?: 'ACADEMIC' | 'ADMINISTRATIVE' | 'FINANCIAL' | 'DISCIPLINARY' | 'TECHNICAL' | 'OTHER'
  priority?: 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
}

export interface RequestsResponse {
  requests: StudentRequest[]
  pagination: {
    page: number
    limit: number
    total: number
    pages: number
  }
}

export interface WorkflowStatus extends StudentRequest {
  workflow: {
    progress: number
    daysSinceCreated: number
    daysUntilDue: number | null
    isOverdue: boolean
  }
}

class RequestsService {
  private async getAuthToken(): Promise<string | null> {
    if (typeof window === 'undefined') return null
    return localStorage.getItem('auth_token')
  }

  private async request<T>(
    endpoint: string,
    options: RequestInit = {}
  ): Promise<T> {
    const token = await this.getAuthToken()
    
    // Debug logging
    console.log('RequestsService debug:', {
      endpoint,
      hasToken: !!token,
      tokenLength: token?.length,
      tokenStart: token?.substring(0, 20) + '...'
    })
    
    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    }

    const response = await fetch(`${API_BASE_URL}${endpoint}`, config)

    if (!response.ok) {
      const error = await response.text()
      console.error('RequestsService error:', {
        status: response.status,
        statusText: response.statusText,
        error,
        endpoint
      })
      throw new Error(error || `HTTP error! status: ${response.status}`)
    }

    return response.json()
  }

  async getRequests(page = 1, limit = 10): Promise<RequestsResponse> {
    return this.request<RequestsResponse>(`/student-requests?page=${page}&limit=${limit}`)
  }

  async getAssignedRequests(page = 1, limit = 10): Promise<RequestsResponse> {
    return this.request<RequestsResponse>(`/student-requests/assigned/me?page=${page}&limit=${limit}`)
  }

  async createRequest(data: CreateRequestDto): Promise<StudentRequest> {
    return this.request<StudentRequest>('/student-requests', {
      method: 'POST',
      body: JSON.stringify(data),
    })
  }

  async getRequestById(id: number): Promise<StudentRequest> {
    return this.request<StudentRequest>(`/student-requests/${id}`)
  }

  async getRequestWorkflow(id: number): Promise<WorkflowStatus> {
    const request = await this.request<StudentRequest>(`/student-requests/${id}`)
    
    // Calculate workflow data
    const createdDate = new Date(request.createdAt)
    const now = new Date()
    const daysSinceCreated = Math.floor((now.getTime() - createdDate.getTime()) / (1000 * 60 * 60 * 24))
    
    let daysUntilDue = null
    let isOverdue = false
    if (request.dueDate) {
      const dueDate = new Date(request.dueDate)
      daysUntilDue = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24))
      isOverdue = daysUntilDue < 0
    }

    let progress = 0
    switch (request.status) {
      case 'PENDING': progress = 10; break
      case 'IN_REVIEW': progress = 50; break
      case 'APPROVED':
      case 'REJECTED': progress = 100; break
    }

    return {
      ...request,
      workflow: {
        progress,
        daysSinceCreated,
        daysUntilDue,
        isOverdue
      }
    }
  }

  async updateRequestStatus(requestId: number, data: { status: string }): Promise<StudentRequest> {
    return this.request<StudentRequest>(`/student-requests/${requestId}/status`, {
      method: 'PATCH',
      body: JSON.stringify(data),
    })
  }

  async addComment(requestId: number, comment: string): Promise<RequestComment> {
    return this.request<RequestComment>(`/student-requests/${requestId}/comments`, {
      method: 'POST',
      body: JSON.stringify({ comment }),
    })
  }

  async getComments(requestId: number): Promise<RequestComment[]> {
    return this.request<RequestComment[]>(`/student-requests/${requestId}/comments`)
  }

  getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING': return 'text-yellow-600 bg-yellow-50'
      case 'IN_REVIEW': return 'text-blue-600 bg-blue-50'
      case 'APPROVED': return 'text-green-600 bg-green-50'
      case 'REJECTED': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  getPriorityColor(priority: string): string {
    switch (priority) {
      case 'LOW': return 'text-gray-600 bg-gray-50'
      case 'NORMAL': return 'text-blue-600 bg-blue-50'
      case 'HIGH': return 'text-orange-600 bg-orange-50'
      case 'URGENT': return 'text-red-600 bg-red-50'
      default: return 'text-gray-600 bg-gray-50'
    }
  }

  getCategoryIcon(category: string): string {
    switch (category) {
      case 'ACADEMIC': return '📚'
      case 'ADMINISTRATIVE': return '📋'
      case 'FINANCIAL': return '💰'
      case 'DISCIPLINARY': return '⚖️'
      case 'TECHNICAL': return '🔧'
      default: return '📄'
    }
  }
}

class RequestsServiceHelpers {
  static getStatusColor(status: string): string {
    switch (status) {
      case 'PENDING': return 'text-yellow-600 bg-yellow-50'
      case 'IN_REVIEW': return 'text-blue-600 bg-blue-50'
      case 'APPROVED': return 'text-green-600 bg-green-50'
      case 'REJECTED': return 'text-red-600 bg-red-50'
      default: return 'text-slate-600 bg-slate-50'
    }
  }

  static getPriorityColor(priority: string): string {
    switch (priority) {
      case 'HIGH': return 'text-orange-600 bg-orange-50'
      case 'URGENT': return 'text-red-600 bg-red-50'
      default: return 'text-slate-600 bg-slate-50'
    }
  }

  static getCategoryIcon(category: string): string {
    switch (category) {
      case 'ACADEMIC': return '🎓'
      case 'ADMINISTRATIVE': return '📋'
      case 'FINANCIAL': return '💰'
      case 'DISCIPLINARY': return '⚖️'
      case 'TECHNICAL': return '🔧'
      default: return '📄'
    }
  }
}

// Merge helpers into service
const serviceInstance = new RequestsService()
Object.assign(serviceInstance, RequestsServiceHelpers)

export const requestsService = serviceInstance as RequestsService & typeof RequestsServiceHelpers
