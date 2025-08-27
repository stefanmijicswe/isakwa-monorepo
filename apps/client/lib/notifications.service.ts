const API_BASE_URL = 'http://localhost:3001/api';

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
  SYSTEM = 'SYSTEM'
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
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
    },
  });

  if (!response.ok) {
    throw new Error('Failed to fetch notifications');
  }

  return response.json();
};

// Get notifications for current user
export const getUserNotifications = async (): Promise<NotificationRecipient[]> => {
  const response = await fetch(`${API_BASE_URL}/notifications/my`, {
    headers: {
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
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
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
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
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
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
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
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
      'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
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
