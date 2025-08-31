import { authService } from './auth.service';

const API_BASE_URL = 'http://localhost:3001/api';

export interface EnrollStudentDto {
  studentId: number;
  studyProgramId: number;
  academicYear: string;
  year: number;
  status?: 'ACTIVE' | 'INACTIVE' | 'GRADUATED' | 'DROPPED';
}

export interface StudentEnrollment {
  id: number;
  studentId: number;
  studyProgramId: number;
  academicYear: string;
  year: number;
  status: string;
  createdAt: string;
  student: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
  studyProgram: {
    id: number;
    name: string;
    faculty: {
      name: string;
    };
  };
}

// Enroll student in study program
export async function enrollStudent(data: EnrollStudentDto): Promise<StudentEnrollment> {
  try {
    const response = await fetch(`${API_BASE_URL}/academic-records/enroll-student`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authService.getToken()}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error enrolling student:', error);
    throw error;
  }
}

// Get all enrollments
export async function getEnrollments(): Promise<StudentEnrollment[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/academic-records/enrollments`, {
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
    console.error('Error fetching enrollments:', error);
    throw error;
  }
}
