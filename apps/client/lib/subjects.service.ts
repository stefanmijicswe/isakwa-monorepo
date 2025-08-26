export interface Subject {
  id: number;
  name: string;
  code: string;
  description?: string;
  credits: number;
  semester: number;
  lectureHours: number;
  exerciseHours: number;
  studyProgramId: number;
  studyPrograms?: Array<{
    studyProgram: {
      id: number;
      name: string;
      faculty: {
        id: number;
        name: string;
      };
    };
  }>;
}

export interface SubjectsResponse {
  data: Subject[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface UpdateSubjectDto {
  name?: string;
  code?: string;
  description?: string;
  credits?: number;
  semester?: number;
  lectureHours?: number;
  exerciseHours?: number;
  studyProgramId?: number;
}

export interface CreateSubjectDto {
  name: string;
  code: string;
  description?: string;
  credits: number;
  semester: number;
  lectureHours: number;
  exerciseHours: number;
  studyProgramId: number;
}

export async function getSubjects(params?: {
  page?: number;
  limit?: number;
  studyProgramId?: number;
  semester?: number;
  search?: string;
  credits?: number;
}): Promise<SubjectsResponse> {
  const searchParams = new URLSearchParams();
  
  if (params?.page) searchParams.append('page', params.page.toString());
  if (params?.limit) searchParams.append('limit', params.limit.toString());
  if (params?.studyProgramId) searchParams.append('studyProgramId', params.studyProgramId.toString());
  if (params?.semester) searchParams.append('semester', params.semester.toString());
  if (params?.search) searchParams.append('search', params.search);
  if (params?.credits) searchParams.append('credits', params.credits.toString());

  const url = `http://localhost:3001/api/subjects${searchParams.toString() ? `?${searchParams.toString()}` : ''}`;
  
  try {
    const response = await fetch(url);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching subjects:', error);
    throw error;
  }
}

export async function getSubjectById(id: number): Promise<Subject> {
  try {
    const response = await fetch(`http://localhost:3001/api/subjects/${id}`);
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching subject:', error);
    throw error;
  }
}

export async function updateSubject(id: number, updateData: UpdateSubjectDto): Promise<Subject> {
  try {
    const response = await fetch(`http://localhost:3001/api/subjects/${id}`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        // TODO: Add Authorization header when auth is implemented
        // 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(updateData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error updating subject:', error);
    throw error;
  }
}

export async function deleteSubject(id: number): Promise<void> {
  try {
    const response = await fetch(`http://localhost:3001/api/subjects/${id}`, {
      method: 'DELETE',
      headers: {
        // TODO: Add Authorization header when auth is implemented
        // 'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
  } catch (error) {
    console.error('Error deleting subject:', error);
    throw error;
  }
}

export async function createSubject(createData: CreateSubjectDto): Promise<Subject> {
  try {
    const response = await fetch(`http://localhost:3001/api/subjects`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        // TODO: Add Authorization header when auth is implemented
        // 'Authorization': `Bearer ${token}`
      },
      body: JSON.stringify(createData)
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error creating subject:', error);
    throw error;
  }
}

// TODO: Implement this when backend supports it
export async function checkSubjectEnrollments(id: number): Promise<{ hasEnrollments: boolean; count: number }> {
  // For now, return false - in real implementation, this would check if students are enrolled
  // This prevents accidental deletion of subjects with students
  return { hasEnrollments: false, count: 0 };
}

export interface StudyProgram {
  id: number;
  name: string;
  description?: string;
  degree: string;
  duration: number;
  facultyId: number;
}

export async function getStudyPrograms(): Promise<StudyProgram[]> {
  try {
    const response = await fetch(`http://localhost:3001/api/study-programs`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    const data = await response.json();
    return data.data || [];
  } catch (error) {
    console.error('Error fetching study programs:', error);
    throw error;
  }
}
