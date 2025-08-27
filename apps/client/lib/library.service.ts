import { authService } from './auth.service';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

export interface LibraryItem {
  id: number;
  title: string;
  author?: string;
  isbn?: string;
  type: 'BOOK' | 'JOURNAL' | 'MAGAZINE' | 'THESIS' | 'OTHER';
  category?: string;
  description?: string;
  totalCopies: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
  _count?: {
    borrowings: number;
  };
}

export interface LibraryBorrowing {
  id: number;
  studentId: number;
  libraryItemId: number;
  borrowedAt: string;
  dueDate: string;
  returnedAt?: string;
  isActive: boolean;
  notes?: string;
  returnNotes?: string;
  libraryItem?: {
    title: string;
    author?: string;
    type: string;
  };
  student?: {
    user: {
      firstName: string;
      lastName: string;
      email: string;
    };
  };
}

export interface CreateLibraryItemDto {
  title: string;
  author?: string;
  isbn?: string;
  type: 'BOOK' | 'JOURNAL' | 'MAGAZINE' | 'THESIS' | 'OTHER';
  category?: string;
  description?: string;
  totalCopies?: number;
}

export interface BorrowItemDto {
  studentId: number;
  libraryItemId: number;
  dueDate: string;
  notes?: string;
}

export interface ReturnItemDto {
  notes?: string;
  status?: 'BORROWED' | 'RETURNED' | 'OVERDUE';
}

// Library Items
export async function getLibraryItems(page = 1, limit = 10): Promise<{
  data: LibraryItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/library/items?page=${page}&limit=${limit}`, {
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
    console.error('Error fetching library items:', error);
    throw error;
  }
}

export async function searchLibraryItems(query: string): Promise<LibraryItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/library/items/search?q=${encodeURIComponent(query)}`, {
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
    console.error('Error searching library items:', error);
    throw error;
  }
}

export async function createLibraryItem(data: CreateLibraryItemDto): Promise<LibraryItem> {
  try {
    const response = await fetch(`${API_BASE_URL}/library/items`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authService.getToken()}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating library item:', error);
    throw error;
  }
}

// Library Borrowings
export async function getAllBorrowings(): Promise<LibraryBorrowing[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/library/borrowings`, {
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
    console.error('Error fetching all borrowings:', error);
    throw error;
  }
}

export async function borrowItem(data: BorrowItemDto): Promise<LibraryBorrowing> {
  try {
    const response = await fetch(`${API_BASE_URL}/library/borrow`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authService.getToken()}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error borrowing item:', error);
    throw error;
  }
}

export async function returnItem(borrowingId: number, data: ReturnItemDto): Promise<LibraryBorrowing> {
  try {
    const response = await fetch(`${API_BASE_URL}/library/return/${borrowingId}`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authService.getToken()}`,
      },
      body: JSON.stringify(data),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error returning item:', error);
    throw error;
  }
}

export async function getStudentBorrowings(studentId: number): Promise<LibraryBorrowing[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/library/borrowings/student/${studentId}`, {
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
    console.error('Error fetching student borrowings:', error);
    throw error;
  }
}

export async function getOverdueItems(): Promise<LibraryBorrowing[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/library/borrowings/overdue`, {
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
    console.error('Error fetching overdue items:', error);
    throw error;
  }
}
