'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Bell, Search, Clock, User, CheckCircle, X, Plus, Send, Users } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { 
  getAllNotifications, 
  getUserNotifications,
  markAsRead, 
  markAllAsRead, 
  deleteNotification,
  createCourseNotification,
  Notification,
  NotificationType 
} from '@/lib/notifications.service';

export default function NotificationsPage() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedType, setSelectedType] = useState('all');
  const [error, setError] = useState('');
  const [userRole, setUserRole] = useState<string>('');
  const [unreadCount, setUnreadCount] = useState(0);
  
  // Professor notification creation states
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [newNotification, setNewNotification] = useState({
    title: '',
    message: '',
    type: 'GENERAL' as NotificationType,
    subjectId: '',
    priority: 'NORMAL' as 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
  });
  const [professorCourses, setProfessorCourses] = useState<Array<{id: number, name: string, code: string}>>([]);
  const [creating, setCreating] = useState(false);

  useEffect(() => {
    // Set default role if not exists (for development)
    let role = localStorage.getItem('user_role');
    if (!role) {
      role = 'PROFESSOR'; // Default for professor dashboard
      localStorage.setItem('user_role', role);
      localStorage.setItem('user_id', '1'); // John Smith ID
      localStorage.setItem('user_email', 'john.smith@isakwa.edu');
      // console.log('🔑 Auto-set user role and info for Notifications');
    }
    
    setUserRole(role);
    fetchNotifications(role);
    
    // Load professor courses if user is a professor
    if (role === 'PROFESSOR') {
      loadProfessorCourses();
    }
  }, []);
  
  const loadProfessorCourses = async () => {
    try {
      // Get professor's subjects from teaching courses API
      const token = localStorage.getItem('auth_token');
      if (!token) return;

      const response = await fetch('http://localhost:3001/api/academic-records/my-subjects', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        }
      });

      if (response.ok) {
        const assignments = await response.json();
        const courses = assignments.map((assignment: any) => ({
          id: assignment.subject.id,
          name: assignment.subject.name,
          code: assignment.subject.code
        }));
        setProfessorCourses(courses);
        // console.log('✅ Loaded professor courses for notifications:', courses);
      } else {
        console.warn('Failed to load professor courses, using fallback');
        // Fallback to basic courses
        const fallbackCourses = [
          { id: 4, name: 'Introduction to Information Technologies', code: 'IT101' },
          { id: 5, name: 'Programming Fundamentals', code: 'PF102' },
          { id: 6, name: 'Web Technologies', code: 'WT202' }
        ];
        setProfessorCourses(fallbackCourses);
      }
    } catch (error) {
      console.error('Error loading professor courses:', error);
      // Fallback courses
      const fallbackCourses = [
        { id: 4, name: 'Introduction to Information Technologies', code: 'IT101' },
        { id: 5, name: 'Programming Fundamentals', code: 'PF102' },
        { id: 6, name: 'Web Technologies', code: 'WT202' }
      ];
      setProfessorCourses(fallbackCourses);
    }
  };

  // Update unread count whenever notifications change
  useEffect(() => {
    const count = notifications.reduce((count, notification) => {
      const currentUserRecipient = notification.recipients.find(
        recipient => recipient.user && recipient.user.id === parseInt(localStorage.getItem('user_id') || '0')
      );
      return count + (currentUserRecipient?.isRead ? 0 : 1);
    }, 0);
    setUnreadCount(count);
  }, [notifications]);

  const fetchNotifications = async (role: string) => {
    try {
      // console.log('🔍 fetchNotifications called with role:', role);
      
      if (role === 'ADMIN' || role === 'STUDENT_SERVICE') {
        const data = await getAllNotifications();
        // console.log('🔍 getAllNotifications returned:', data);
        setNotifications(data);
      } else {
        const data = await getUserNotifications();
        // console.log('🔍 getUserNotifications returned:', data);
        const transformedData = data.map(recipient => ({
          id: recipient.notificationId,
          title: recipient.notification.title,
          message: recipient.notification.message,
          type: recipient.notification.type,
          priority: recipient.notification.priority,
          createdAt: recipient.notification.createdAt,
          isActive: recipient.notification.isActive,
          createdBy: recipient.notification.createdBy,
          creator: recipient.notification.creator,
          recipients: [recipient]
        }));
        // console.log('🔍 Transformed data:', transformedData);
        setNotifications(transformedData);
      }
      
      // console.log('🔍 State updated with notifications:', notifications);
    } catch (error) {
      console.error('❌ Error in fetchNotifications:', error);
      setError('Failed to fetch notifications');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsRead = async (notificationId: number) => {
    try {
      // console.log('Marking as read:', notificationId);
      // console.log('Auth token:', localStorage.getItem('auth_token'));
      // console.log('User ID:', localStorage.getItem('user_id'));
      
      await markAsRead(notificationId);
      // console.log('Successfully marked as read');
      
      // Force refresh notifications to get updated state from backend
      const role = localStorage.getItem('user_role') || '';
      await fetchNotifications(role);
      
      // console.log('Notifications refreshed after mark as read');
    } catch (error) {
      console.error('Error marking as read:', error);
      setError(`Failed to mark as read: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleMarkAllAsRead = async () => {
    try {
      // console.log('Marking all as read');
      // console.log('Auth token:', localStorage.getItem('auth_token'));
      // console.log('User ID:', localStorage.getItem('user_id'));
      
      await markAllAsRead();
      // console.log('Successfully marked all as read');
      
      // Force refresh notifications to get updated state from backend
      const role = localStorage.getItem('user_role') || '';
      await fetchNotifications(role);
      
      // console.log('Notifications refreshed after mark all as read');
    } catch (error) {
      console.error('Error marking all as read:', error);
      setError(`Failed to mark all as read: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleDeleteNotification = async (notificationId: number) => {
    if (!confirm('Are you sure you want to delete this notification?')) return;

    try {
      await deleteNotification(notificationId);
      setNotifications(prev => prev.filter(n => n.id !== notificationId));
    } catch (error) {
      console.error('Error deleting notification:', error);
    }
  };

  const handleCreateNotification = async () => {
    if (!newNotification.title || !newNotification.message || !newNotification.subjectId) {
      setError('Please fill in all required fields');
      return;
    }

    setCreating(true);
    try {
      // console.log('🔄 Creating notification with data:', newNotification);

      // Prepare notification data for backend
      const notificationData = {
        title: newNotification.title,
        message: newNotification.message,
        subjectId: parseInt(newNotification.subjectId),
        type: newNotification.type,
        priority: newNotification.priority
      };

      // Call backend API to create notification
      const createdNotification = await createCourseNotification(notificationData);
      // console.log('✅ Notification created successfully:', createdNotification);

      // Reset form
      setNewNotification({
        title: '',
        message: '',
        type: 'GENERAL' as NotificationType,
        subjectId: '',
        priority: 'NORMAL' as 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'
      });
      
      setIsCreateModalOpen(false);
      setError('');

      // Refresh notifications to show the new one
      const role = localStorage.getItem('user_role') || '';
      await fetchNotifications(role);
      
    } catch (error) {
      console.error('❌ Failed to create notification:', error);
      setError(error instanceof Error ? error.message : 'Failed to create notification');
    } finally {
      setCreating(false);
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case 'URGENT':
        return 'bg-red-50 text-red-700 border-red-200';
      case 'HIGH':
        return 'bg-orange-50 text-orange-700 border-orange-200';
      case 'NORMAL':
        return 'bg-blue-50 text-blue-700 border-blue-200';
      case 'LOW':
        return 'bg-gray-50 text-gray-700 border-gray-200';
      default:
        return 'bg-gray-50 text-gray-700 border-gray-200';
    }
  };

  const filteredNotifications = notifications.filter(notification => {
    const matchesSearch = notification.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         notification.message.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesType = selectedType === 'all' || notification.type === selectedType;
    return matchesSearch && matchesType;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-gray-900 mx-auto mb-3"></div>
          <p className="text-gray-600 text-sm">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-white">
      <div className="max-w-4xl mx-auto px-6 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-medium text-gray-900 mb-2">Notifications</h1>
          <p className="text-gray-600 text-sm">
            {userRole === 'ADMIN' || userRole === 'STUDENT_SERVICE' 
              ? 'Manage system notifications'
              : 'Your notifications'
            }
          </p>
        </div>

        {/* Controls */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex gap-3 flex-1 max-w-md">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 h-9 text-sm border-gray-200 focus:border-gray-400 focus:ring-0"
              />
            </div>
            <select
              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
              className="h-9 px-3 border border-gray-200 rounded-md text-sm bg-white focus:border-gray-400 focus:outline-none focus:ring-0"
            >
              <option value="all">All</option>
              <option value="GENERAL">General</option>
              <option value="COURSE_ANNOUNCEMENT">Course</option>
              <option value="EXAM_REMINDER">Exam</option>
              <option value="ASSIGNMENT_DUE">Assignment</option>
              <option value="SYSTEM">System</option>
            </select>
          </div>
          
          <div className="flex items-center gap-3">
            {unreadCount > 0 && (
              <span className="text-sm text-gray-600">{unreadCount} unread</span>
            )}
            
            {userRole === 'PROFESSOR' && (
              <Dialog open={isCreateModalOpen} onOpenChange={setIsCreateModalOpen}>
                <DialogTrigger asChild>
                  <Button
                    variant="default"
                    size="sm"
                    className="h-8 px-3 text-xs gap-1"
                  >
                    <Plus className="h-3 w-3" />
                    Create
                  </Button>
                </DialogTrigger>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle>Create Course Notification</DialogTitle>
                  </DialogHeader>
                  
                  <div className="space-y-4">
                    <div>
                      <label className="text-sm font-medium">Subject</label>
                      <Select 
                        value={newNotification.subjectId} 
                        onValueChange={(value) => setNewNotification({...newNotification, subjectId: value})}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select subject" />
                        </SelectTrigger>
                        <SelectContent>
                          {professorCourses.map(course => (
                            <SelectItem key={course.id} value={course.id.toString()}>
                              {course.code} - {course.name}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Title</label>
                      <Input
                        value={newNotification.title}
                        onChange={(e) => setNewNotification({...newNotification, title: e.target.value})}
                        placeholder="Notification title"
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium">Message</label>
                      <Textarea
                        value={newNotification.message}
                        onChange={(e) => setNewNotification({...newNotification, message: e.target.value})}
                        placeholder="Write your message..."
                        rows={3}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="text-sm font-medium">Type</label>
                        <Select 
                          value={newNotification.type} 
                          onValueChange={(value) => setNewNotification({...newNotification, type: value as NotificationType})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="GENERAL">General</SelectItem>
                            <SelectItem value="COURSE_ANNOUNCEMENT">Course Announcement</SelectItem>
                            <SelectItem value="EXAM_REMINDER">Exam Reminder</SelectItem>
                            <SelectItem value="ASSIGNMENT_DUE">Assignment Due</SelectItem>
                            <SelectItem value="SYSTEM">System</SelectItem>
                            <SelectItem value="ADMINISTRATIVE">Administrative</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      
                      <div>
                        <label className="text-sm font-medium">Priority</label>
                        <Select 
                          value={newNotification.priority} 
                          onValueChange={(value) => setNewNotification({...newNotification, priority: value as 'LOW' | 'NORMAL' | 'HIGH' | 'URGENT'})}
                        >
                          <SelectTrigger>
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="LOW">Low</SelectItem>
                            <SelectItem value="NORMAL">Normal</SelectItem>
                            <SelectItem value="HIGH">High</SelectItem>
                            <SelectItem value="URGENT">Urgent</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                    </div>
                    
                    <div className="flex gap-2 pt-4">
                      <Button 
                        variant="outline" 
                        onClick={() => setIsCreateModalOpen(false)}
                        className="flex-1"
                      >
                        Cancel
                      </Button>
                      <Button 
                        onClick={handleCreateNotification}
                        disabled={creating}
                        className="flex-1 gap-2"
                      >
                        {creating ? (
                          <>
                            <div className="h-3 w-3 animate-spin rounded-full border-2 border-white border-t-transparent" />
                            Creating...
                          </>
                        ) : (
                          <>
                            <Send className="h-3 w-3" />
                            Send
                          </>
                        )}
                      </Button>
                    </div>
                  </div>
                </DialogContent>
              </Dialog>
            )}
            
            <Button
              onClick={handleMarkAllAsRead}
              variant="outline"
              size="sm"
              className="h-8 px-3 text-xs border-gray-200 hover:bg-gray-50"
            >
              Mark all read
            </Button>
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <Alert className="mb-6 border-red-200 bg-red-50">
            <AlertDescription className="text-red-800 text-sm">{error}</AlertDescription>
          </Alert>
        )}

        {/* Notifications List */}
        <div className="space-y-3">
          {filteredNotifications.length === 0 ? (
            <div className="text-center py-16">
              <Bell className="h-12 w-12 text-gray-300 mx-auto mb-4" />
              <h3 className="text-lg font-medium text-gray-900 mb-2">No notifications</h3>
              <p className="text-gray-600 text-sm">
                {searchTerm || selectedType !== 'all' 
                  ? 'Try adjusting your search or filters'
                  : 'No notifications have been created yet'
                }
              </p>
            </div>
          ) : (
            filteredNotifications.map((notification) => {
              const currentUserRecipient = notification.recipients.find(
                recipient => recipient.user && recipient.user.id === parseInt(localStorage.getItem('user_id') || '0')
              );
              const isRead = currentUserRecipient?.isRead || false;

              return (
                <Card 
                  key={notification.id} 
                  className={`border border-gray-100 hover:border-gray-200 transition-colors ${
                    isRead ? 'bg-white' : 'bg-blue-50 border-blue-200'
                  }`}
                >
                  <CardContent className="p-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1 min-w-0">
                        <div className="flex items-start gap-3 mb-2">
                          <div className="flex-shrink-0">
                            <Bell className={`h-4 w-4 ${isRead ? 'text-gray-400' : 'text-blue-600'}`} />
                          </div>
                          <div className="flex-1 min-w-0">
                            <div className="flex items-center gap-2 mb-1">
                              <h3 className={`text-sm font-medium ${
                                isRead ? 'text-gray-900' : 'text-blue-900'
                              }`}>
                                {notification.title}
                              </h3>
                              {!isRead && (
                                <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-100 text-blue-800">
                                  New
                                </span>
                              )}
                            </div>
                            <p className="text-sm text-gray-600 mb-2">{notification.message}</p>
                            <div className="flex items-center gap-4 text-xs text-gray-500">
                              <span className="flex items-center gap-1">
                                <User className="h-3 w-3" />
                                {notification.creator?.firstName || 'Unknown'} {notification.creator?.lastName || 'User'}
                              </span>
                              <span className="flex items-center gap-1">
                                <Clock className="h-3 w-3" />
                                {new Date(notification.createdAt).toLocaleDateString()}
                              </span>
                            </div>
                          </div>
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        <Badge 
                          variant="outline" 
                          className={`text-xs ${getPriorityColor(notification.priority)}`}
                        >
                          {notification.priority}
                        </Badge>
                        
                        {(userRole === 'ADMIN' || userRole === 'STUDENT_SERVICE') && (
                          <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => handleDeleteNotification(notification.id)}
                            className="h-6 w-6 p-0 text-gray-400 hover:text-red-500 hover:bg-red-50"
                          >
                            <X className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between mt-3 pt-3 border-t border-gray-100">
                      <span className="text-xs text-gray-500">
                        {userRole === 'ADMIN' || userRole === 'STUDENT_SERVICE'
                          ? `${notification.recipients.length} recipients`
                          : 'Personal notification'
                        }
                      </span>
                      
                      {!isRead && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => handleMarkAsRead(notification.id)}
                          className="h-7 px-3 text-xs border-gray-200 hover:bg-gray-50"
                        >
                          Mark as read
                        </Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
