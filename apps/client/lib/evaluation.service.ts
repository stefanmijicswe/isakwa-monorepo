import { authService } from './auth.service';

const API_BASE_URL = 'http://localhost:3001/api';

export interface EvaluationInstrument {
  id: number;
  title: string;
  description?: string;
  type: EvaluationType;
  subjectId: number;
  maxPoints: number;
  dueDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  subject?: {
    id: number;
    name: string;
    code: string;
  };
}

export interface CreateEvaluationInstrumentDto {
  title: string;
  description?: string;
  type: EvaluationType;
  subjectId: number;
  maxPoints: number;
  dueDate?: string;
  isActive?: boolean;
}

export interface UpdateEvaluationInstrumentDto {
  title?: string;
  description?: string;
  type?: EvaluationType;
  subjectId?: number;
  maxPoints?: number;
  dueDate?: string;
  isActive?: boolean;
}

export enum EvaluationType {
  PROJECT = 'PROJECT',
  TEST = 'TEST',
  QUIZ = 'QUIZ',
  ASSIGNMENT = 'ASSIGNMENT',
  EXAM = 'EXAM',
  MIDTERM = 'MIDTERM',
  LABORATORY = 'LABORATORY',
  PRESENTATION = 'PRESENTATION',
  FINAL = 'FINAL'
}

// Get all evaluation instruments
export async function getEvaluationInstruments(params?: {
  subjectId?: number;
  type?: EvaluationType;
  isActive?: boolean;
}): Promise<EvaluationInstrument[]> {
  try {
    const searchParams = new URLSearchParams();
    
    if (params?.subjectId) searchParams.append('subjectId', params.subjectId.toString());
    if (params?.type) searchParams.append('type', params.type);
    if (params?.isActive !== undefined) searchParams.append('isActive', params.isActive.toString());

    const response = await fetch(`${API_BASE_URL}/evaluation-instruments?${searchParams}`, {
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
    console.error('Error fetching evaluation instruments:', error);
    throw error;
  }
}

// Create evaluation instrument
export async function createEvaluationInstrument(data: CreateEvaluationInstrumentDto): Promise<EvaluationInstrument> {
  try {
    const response = await fetch(`${API_BASE_URL}/evaluation-instruments`, {
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
    console.error('Error creating evaluation instrument:', error);
    throw error;
  }
}

// Get evaluation instrument by ID
export async function getEvaluationInstrumentById(id: number): Promise<EvaluationInstrument> {
  try {
    const response = await fetch(`${API_BASE_URL}/evaluation-instruments/${id}`, {
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
    console.error('Error fetching evaluation instrument:', error);
    throw error;
  }
}

// Update evaluation instrument
export async function updateEvaluationInstrument(id: number, data: UpdateEvaluationInstrumentDto): Promise<EvaluationInstrument> {
  try {
    const response = await fetch(`${API_BASE_URL}/evaluation-instruments/${id}`, {
      method: 'PATCH',
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
    console.error('Error updating evaluation instrument:', error);
    throw error;
  }
}

// Delete evaluation instrument
export async function deleteEvaluationInstrument(id: number): Promise<void> {
  try {
    const response = await fetch(`${API_BASE_URL}/evaluation-instruments/${id}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authService.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting evaluation instrument:', error);
    throw error;
  }
}
