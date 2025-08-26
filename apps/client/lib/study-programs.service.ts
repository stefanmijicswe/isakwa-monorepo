export interface StudyProgram {
  id: number;
  facultyId: number;
  name: string;
  description?: string;
  duration: number;
  directorName?: string;
  directorTitle?: string;
  createdAt: string;
  updatedAt: string;
  faculty?: {
    id: number;
    name: string;
  };
}

export interface StudyProgramsResponse {
  data: StudyProgram[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface CreateStudyProgramDto {
  name: string;
  description?: string;
  duration: number;
  directorName?: string;
  directorTitle?: string;
  facultyId: number;
}

export interface UpdateStudyProgramDto {
  name?: string;
  description?: string;
  duration?: number;
  directorName?: string;
  directorTitle?: string;
  facultyId?: number;
}

export async function getStudyPrograms(params?: {
  page?: number;
  limit?: number;
  facultyId?: number;
  search?: string;
  duration?: number;
}): Promise<StudyProgramsResponse> {
  try {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.facultyId) searchParams.append('facultyId', params.facultyId.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.duration) searchParams.append('duration', params.duration.toString());

    const response = await fetch(`http://localhost:3001/api/study-programs?${searchParams}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching study programs:', error);
    throw error;
  }
}

export async function getStudyProgramById(id: number): Promise<StudyProgram> {
  try {
    const response = await fetch(`http://localhost:3001/api/study-programs/${id}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching study program:', error);
    throw error;
  }
}

export async function createStudyProgram(createData: CreateStudyProgramDto): Promise<StudyProgram> {
  try {
    const response = await fetch(`http://localhost:3001/api/study-programs`, {
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
    console.error('Error creating study program:', error);
    throw error;
  }
}

export async function updateStudyProgram(id: number, updateData: UpdateStudyProgramDto): Promise<StudyProgram> {
  try {
    const response = await fetch(`http://localhost:3001/api/study-programs/${id}`, {
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
    console.error('Error updating study program:', error);
    throw error;
  }
}

export async function deleteStudyProgram(id: number): Promise<void> {
  try {
    const response = await fetch(`http://localhost:3001/api/study-programs/${id}`, {
      method: 'DELETE',
      headers: {
        // TODO: Add Authorization header when auth is implemented
        // 'Authorization': `Bearer ${token}`
      }
    });
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
  } catch (error) {
    console.error('Error deleting study program:', error);
    throw error;
  }
}

export async function checkStudyProgramEnrollments(id: number): Promise<{ hasEnrollments: boolean; count: number }> {
  // For now, return false - in real implementation, this would check if students are enrolled
  // This prevents accidental deletion of study programs with students
  return { hasEnrollments: false, count: 0 };
}

// Re-export faculties service for convenience
export { getFaculties, type Faculty } from './faculties.service';
