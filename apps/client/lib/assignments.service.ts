import { authService } from './auth.service';

const API_BASE_URL = 'http://localhost:3001/api';

export interface Assignment {
  id: number;
  title: string;
  description: string;
  subject: string;
  subjectCode: string;
  dueDate: string | null;
  maxPoints: number;
  type: 'PROJECT' | 'ASSIGNMENT' | 'PRESENTATION' | 'LABORATORY' | 'TEST' | 'QUIZ' | 'EXAM' | 'MIDTERM' | 'FINAL';
  status: 'pending' | 'submitted' | 'graded';
  submission?: {
    id: number;
    fileName: string;
    submittedAt: string;
    grade?: number;
    feedback?: string;
  };
}

export interface CreateSubmissionDto {
  instrumentId: number;
  file: File;
}

class AssignmentsService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const token = authService.getToken();
    const url = `${API_BASE_URL}${endpoint}`;

    const config: RequestInit = {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    };

    const response = await fetch(url, config);

    if (!response.ok) {
      const errorText = await response.text();
      throw new Error(`HTTP ${response.status}: ${errorText}`);
    }

    return response.json();
  }

  // Get all assignments for the current student
  async getAssignments(): Promise<Assignment[]> {
    try {
      const assignments = await this.request<Assignment[]>('/evaluation-instruments/student/assignments');
      return assignments;
    } catch (error) {
      console.error('❌ Failed to fetch assignments:', error);
      throw new Error('Failed to load assignments');
    }
  }

  // Mark assignment as submitted (no file upload)
  async markAsSubmitted(assignmentId: number): Promise<boolean> {
    try {
      
      const submission = await this.request('/evaluation-instruments/student/submissions', {
        method: 'POST',
        body: JSON.stringify({
          instrumentId: assignmentId,
          // No file data - just marking as submitted
        }),
      });

      return true;
    } catch (error) {
      console.error('❌ Failed to mark assignment as submitted:', error);
      
      // Parse the error message for better user feedback
      const errorMessage = error.message || 'Unknown error occurred';
      if (errorMessage.includes('already submitted')) {
        throw new Error('This assignment has already been submitted');
      } else if (errorMessage.includes('HTTP 400')) {
        throw new Error('Assignment submission failed - please try again');
      } else {
        throw new Error('Failed to mark assignment as submitted');
      }
    }
  }

  // Download submission file
  async downloadSubmission(submissionId: number): Promise<void> {
    try {
      const token = authService.getToken();
      const response = await fetch(`${API_BASE_URL}/evaluation-instruments/submissions/${submissionId}/download`, {
        headers: {
          ...(token && { Authorization: `Bearer ${token}` }),
        },
      });

      if (!response.ok) {
        throw new Error(`Download failed: ${response.status}`);
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement('a');
      link.href = url;
      link.download = `submission-${submissionId}.pdf`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('❌ Failed to download submission:', error);
      throw new Error('Failed to download submission');
    }
  }

  // Get assignment details
  async getAssignment(id: number): Promise<Assignment> {
    try {
      return await this.request<Assignment>(`/evaluation-instruments/${id}`);
    } catch (error) {
      console.error('❌ Failed to fetch assignment details:', error);
      throw new Error('Failed to load assignment details');
    }
  }
}

export const assignmentsService = new AssignmentsService();
