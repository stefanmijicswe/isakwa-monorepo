export interface Faculty {
  id: number;
  universityId: number;
  name: string;
  description?: string;
  addressId?: number;
  phone?: string;
  email?: string;
  deanName?: string;
  deanTitle?: string;
  createdAt: string;
  updatedAt: string;
}

export async function getFaculties(params?: {
  page?: number;
  limit?: number;
  search?: string;
}): Promise<Faculty[]> {
  try {
    const searchParams = new URLSearchParams();
    
    if (params?.page) searchParams.append('page', params.page.toString());
    if (params?.limit) searchParams.append('limit', params.limit.toString());
    if (params?.search) searchParams.append('search', params.search);

    const response = await fetch(`http://localhost:3001/api/faculties?${searchParams}`);
    
    if (!response.ok) {
      const errorText = await response.text();
      console.error('Backend error response:', errorText);
      throw new Error(`HTTP error! status: ${response.status}, message: ${errorText}`);
    }
    
    const data = await response.json();
    // API vraća direktno array, ne { data: [...] }
    return Array.isArray(data) ? data : [];
  } catch (error) {
    console.error('Error fetching faculties:', error);
    throw error;
  }
}
