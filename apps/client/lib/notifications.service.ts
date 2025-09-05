const API_BASE_URL = 'http://localhost:3001/api';

// Helper function to get auth token (with auto-set for development)
const getAuthToken = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  // Try to get token from localStorage first
  let token = localStorage.getItem('auth_token');
  
  // If no token exists, set a test token for development
  if (!token) {
    const testToken = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOjEsImVtYWlsIjoiam9obi5zbWl0aEBpc2Frd2EuZWR1Iiwicm9sZSI6IlBST0ZFU1NPUiIsImZpcnN0TmFtZSI6IkpvaG4iLCJsYXN0TmFtZSI6IlNtaXRoIiwiaWF0IjoxNzU2OTAyNjEzLCJleHAiOjE3NTc1MDc0MTN9.Siqy9TGJr2ZGB5UJ20cJPv6rcDRIM4aMg0qKlqlaeho';
    localStorage.setItem('auth_token', testToken);
    // console.log('🔑 Auto-set test authentication token for Notifications');
    token = testToken;
  }
  
  return token;
};

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: NotificationType;
  priority: NotificationPriority;
  createdAt: string;
  isActive: boolean;
  createdBy: number;
  creator: {
    id: number;
    firstName: string;
    lastName: string;
    role: string;
  };
  recipients: NotificationRecipient[];
}

export interface NotificationRecipient {
  id: number;
  notificationId: number;
  userId: number;
  isRead: boolean;
  readAt: string | null;
  user: {
    id: number;
    firstName: string;
    lastName: string;
    role: string;
  };
  notification: {
    id: number;
    title: string;
    message: string;
    type: NotificationType;
    priority: NotificationPriority;
    createdAt: string;
    isActive: boolean;
    createdBy: number;
    creator: {
      id: number;
      firstName: string;
      lastName: string;
      role: string;
    };
  };
}

export interface CreateNotificationDto {
  title: string;
  message: string;
  type?: NotificationType;
  priority?: NotificationPriority;
}

export enum NotificationType {
  GENERAL = 'GENERAL',
  COURSE_ANNOUNCEMENT = 'COURSE_ANNOUNCEMENT',
  EXAM_REMINDER = 'EXAM_REMINDER',
  ASSIGNMENT_DUE = 'ASSIGNMENT_DUE',
  SYSTEM = 'SYSTEM',
  ADMINISTRATIVE = 'ADMINISTRATIVE'
}

export enum NotificationPriority {
  LOW = 'LOW',
  NORMAL = 'NORMAL',
  HIGH = 'HIGH',
  URGENT = 'URGENT'
}

// Get all notifications (admin/student service only)
export const getAllNotifications = async (): Promise<Notification[]> => {
  const response = await fetch(`${API_BASE_URL}/notifications`, {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch notifications');
  }

  return response.json();
};

// Create course notification (for professors)
export const createCourseNotification = async (notificationData: {
  title: string;
  message: string;
  subjectId?: number;
  type?: NotificationType;
  priority?: 'LOW' | 'NORMAL' | 'HIGH';
}): Promise<Notification> => {
  // console.log('📤 Creating course notification:', notificationData);
  
  const response = await fetch(`${API_BASE_URL}/notifications/course`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(notificationData),
  });

  if (!response.ok) {
    const errorData = await response.text();
    console.error('❌ Failed to create course notification:', errorData);
    throw new Error(`Failed to create notification: ${errorData}`);
  }

  const result = await response.json();
  // console.log('✅ Course notification created successfully:', result);
  return result;
};

// Get notifications for current user
export const getUserNotifications = async (): Promise<NotificationRecipient[]> => {
  const response = await fetch(`${API_BASE_URL}/notifications/my`, {
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch user notifications');
  }

  return response.json();
};

// Create new notification
export const createNotification = async (data: CreateNotificationDto): Promise<Notification> => {
  const response = await fetch(`${API_BASE_URL}/notifications`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${getAuthToken()}`,
    },
    body: JSON.stringify(data),
  });

  if (!response.ok) {
    throw new Error('Failed to create notification');
  }

  return response.json();
};

// Mark notification as read
export const markAsRead = async (notificationId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}/read`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to mark notification as read');
  }
};

// Mark all notifications as read
export const markAllAsRead = async (): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/notifications/mark-all-read`, {
    method: 'PATCH',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to mark all notifications as read');
  }
};

// Delete notification
export const deleteNotification = async (notificationId: number): Promise<void> => {
  const response = await fetch(`${API_BASE_URL}/notifications/${notificationId}`, {
    method: 'DELETE',
    headers: {
      'Authorization': `Bearer ${getAuthToken()}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to delete notification');
  }
};

// Get unread count for current user
export const getUnreadCount = async (): Promise<number> => {
  const notifications = await getUserNotifications();
  return notifications.filter(recipient => !recipient.isRead).length;
};
