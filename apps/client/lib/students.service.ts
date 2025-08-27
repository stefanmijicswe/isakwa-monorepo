import { authService } from './auth.service';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  studentProfile?: {
    studentIndex: string;
    enrollmentYear: string;
    studyProgram?: {
      name: string;
      faculty?: {
        name: string;
      };
    };
  };
}

export interface StudentsResponse {
  users: Student[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export async function getStudents(page = 1, limit = 100, search?: string): Promise<StudentsResponse> {
  try {
    const url = new URL(`${API_BASE_URL}/users/students`);
    url.searchParams.set('page', page.toString());
    url.searchParams.set('limit', limit.toString());
    if (search) {
      url.searchParams.set('search', search);
    }

    const response = await fetch(url.toString(), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authService.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching students:', error);
    throw error;
  }
}
