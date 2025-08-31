import { authService } from './auth.service';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export interface InventoryItem {
  id: number;
  name: string;
  category: string;
  description?: string;
  quantity: number;
  unit?: string;
  minStock: number;
  isActive: boolean;
  isLowStock: boolean;
  hasPendingRequests: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface InventoryIssuance {
  id: number;
  inventoryItemId: number;
  studentId: number;
  quantityIssued: number;
  notes?: string;
  issuedAt: string;
  isActive: boolean;
  returnNotes?: string;
  returnedAt?: string;
  item?: {
    id: number;
    name: string;
    description?: string;
    category: string;
    quantity: number;
    unit?: string;
  };
  student?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    studentProfile?: {
      studentIndex: string;
      year: number;
      studyProgram?: {
        name: string;
        code: string;
      };
    };
  };
  issuedByUser?: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
  };
}

export interface InventoryRequest {
  id: number;
  requesterId: number;
  inventoryItemId: number;
  quantityRequested: number;
  reason: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED' | 'FULFILLED';
  notes?: string;
  createdAt: string;
  updatedAt: string;
  requester?: {
    firstName: string;
    lastName: string;
    email: string;
    role: string;
  };
  approver?: {
    firstName: string;
    lastName: string;
    email: string;
  };
  inventoryItem?: {
    name: string;
    category: string;
    unit?: string;
    quantity: number;
  };
}

export interface CreateInventoryItemDto {
  name: string;
  category: string;
  description?: string;
  quantity: number;
  unit?: string;
  minStock?: number;
}

export interface CreateInventoryIssuanceDto {
  inventoryItemId: number;
  studentId: number;
  quantityIssued: number;
  notes?: string;
}

export interface MarkAsReturnedDto {
  returnNotes?: string;
}

// Inventory Items
export async function getInventoryItems(page = 1, limit = 10): Promise<{
  data: InventoryItem[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/inventory/items?page=${page}&limit=${limit}`, {
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
    console.error('Error fetching inventory items:', error);
    throw error;
  }
}

export async function searchInventoryItems(query: string): Promise<InventoryItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/inventory/items/search?q=${encodeURIComponent(query)}`, {
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
    console.error('Error searching inventory items:', error);
    throw error;
  }
}

export async function getLowStockItems(): Promise<InventoryItem[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/inventory/items/low-stock`, {
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
    console.error('Error fetching low stock items:', error);
    throw error;
  }
}

export async function createInventoryItem(data: CreateInventoryItemDto): Promise<InventoryItem> {
  try {
    const response = await fetch(`${API_BASE_URL}/inventory/items`, {
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
    console.error('Error creating inventory item:', error);
    throw error;
  }
}

// Inventory Issuances
export async function getInventoryIssuances(page = 1, limit = 10): Promise<{
  issuances: InventoryIssuance[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/inventory/issuances?page=${page}&limit=${limit}`, {
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
    console.error('Error fetching inventory issuances:', error);
    throw error;
  }
}

export async function getAllInventoryIssuances(page = 1, limit = 10): Promise<{
  issuances: InventoryIssuance[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}> {
  try {
    const response = await fetch(`${API_BASE_URL}/inventory/issuances/all?page=${page}&limit=${limit}`, {
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
    console.error('Error fetching all inventory issuances:', error);
    throw error;
  }
}

export async function createInventoryIssuance(data: CreateInventoryIssuanceDto): Promise<InventoryIssuance> {
  try {
    const response = await fetch(`${API_BASE_URL}/inventory/issuances`, {
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
    console.error('Error creating inventory issuance:', error);
    throw error;
  }
}

export async function markAsReturned(issuanceId: number, returnNotes?: string): Promise<InventoryIssuance> {
  try {
    const response = await fetch(`${API_BASE_URL}/inventory/issuances/${issuanceId}/return`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authService.getToken()}`,
      },
      body: JSON.stringify({ returnNotes }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error marking issuance as returned:', error);
    throw error;
  }
}

// Inventory Requests
export async function getInventoryRequests(page = 1, limit = 10, status?: string): Promise<{
  data: InventoryRequest[];
  meta: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}> {
  try {
    const url = new URL(`${API_BASE_URL}/inventory/requests`);
    url.searchParams.set('page', page.toString());
    url.searchParams.set('limit', limit.toString());
    if (status) {
      url.searchParams.set('status', status);
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
    console.error('Error fetching inventory requests:', error);
    throw error;
  }
}

export async function getUserRequests(): Promise<InventoryRequest[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/inventory/requests/my`, {
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
    console.error('Error fetching user requests:', error);
    throw error;
  }
}
