export interface CreatePersonnelDto {
  email: string;
  firstName: string;
  lastName: string;
  role: 'PROFESSOR' | 'STUDENT_SERVICE';
  departmentId: number;
  title?: string;
  phoneNumber?: string;
  officeRoom?: string;
}

export interface Personnel {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  role: 'PROFESSOR' | 'STUDENT_SERVICE';
  isActive: boolean;
  createdAt: string;
  professorProfile?: {
    id: number;
    userId: number;
    title: string;
    department: {
      id: number;
      name: string;
    };
    phoneNumber?: string;
    officeRoom?: string;
  };
  studentServiceProfile?: {
    id: number;
    userId: number;
    department: {
      id: number;
      name: string;
    };
    position: string;
    phoneNumber?: string;
    officeRoom?: string;
  };
}

export interface Department {
  id: number;
  name: string;
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export async function createPersonnel(data: CreatePersonnelDto): Promise<Personnel> {
  try {
    const response = await fetch(`${API_BASE_URL}/users`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      },
      body: JSON.stringify(data)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error creating personnel:', error);
    throw error;
  }
}

export async function getDepartments(): Promise<Department[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/departments`, {
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('auth_token')}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const result = await response.json();
    return result;
  } catch (error) {
    console.error('Error fetching departments:', error);
    // Return some default departments if API fails
    return [
      { id: 1, name: 'Faculty of Information Technology' },
      { id: 2, name: 'Faculty of Business Administration' },
      { id: 3, name: 'Department of Computer Science' },
      { id: 4, name: 'Department of Mathematics' }
    ];
  }
}
