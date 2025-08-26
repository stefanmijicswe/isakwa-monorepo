'use client';

import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Bell, Send } from 'lucide-react';

export default function CreateNotificationPage() {
  const [title, setTitle] = useState('');
  const [message, setMessage] = useState('');
  const [type, setType] = useState('GENERAL');
  const [priority, setPriority] = useState('NORMAL');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('http://localhost:3001/api/notifications', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          title,
          message,
          type,
          priority,
        }),
      });

      if (response.ok) {
        // Reset form
        setTitle('');
        setMessage('');
        setType('GENERAL');
        setPriority('NORMAL');
        alert('Notification created successfully!');
      } else {
        alert('Failed to create notification');
      }
    } catch (error) {
      console.error('Error creating notification:', error);
      alert('Error creating notification');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto px-6 py-4">
        {/* Header */}
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Create Notification</h1>
          <p className="text-xs text-gray-600">Send announcements to all users</p>
        </div>

        {/* Main Content */}
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-sm border border-gray-200 bg-white">
            <CardHeader className="pb-2">
              <CardTitle className="text-sm font-medium text-gray-900 flex items-center gap-2">
                <Bell className="h-4 w-4" />
                New Notification
              </CardTitle>
              <CardDescription className="text-xs text-gray-500">
                This notification will be sent to all active users
              </CardDescription>
            </CardHeader>
            <CardContent className="pt-0 pb-4">
              <form onSubmit={handleSubmit} className="space-y-3">
                {/* Title */}
                <div className="space-y-1">
                  <Label htmlFor="title" className="text-xs font-medium text-gray-700">
                    Title *
                  </Label>
                  <Input
                    id="title"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Enter notification title"
                    className="h-8 text-xs"
                    required
                  />
                </div>

                {/* Message */}
                <div className="space-y-1">
                  <Label htmlFor="message" className="text-xs font-medium text-gray-700">
                    Message *
                  </Label>
                  <Textarea
                    id="message"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Enter notification message"
                    className="min-h-[100px] text-xs resize-none"
                    required
                  />
                </div>

                {/* Type and Priority */}
                <div className="grid grid-cols-2 gap-3">
                  <div className="space-y-1">
                    <Label htmlFor="type" className="text-xs font-medium text-gray-700">
                      Type
                    </Label>
                    <Select value={type} onValueChange={setType}>
                      <SelectTrigger className="h-8 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="GENERAL">General</SelectItem>
                        <SelectItem value="COURSE_ANNOUNCEMENT">Course Announcement</SelectItem>
                        <SelectItem value="EXAM_REMINDER">Exam Reminder</SelectItem>
                        <SelectItem value="ASSIGNMENT_DUE">Assignment Due</SelectItem>
                        <SelectItem value="SYSTEM">System</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>

                  <div className="space-y-1">
                    <Label htmlFor="priority" className="text-xs font-medium text-gray-700">
                      Priority
                    </Label>
                    <Select value={priority} onValueChange={setPriority}>
                      <SelectTrigger className="h-8 text-xs">
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

                {/* Submit Button */}
                <Button
                  type="submit"
                  disabled={loading || !title || !message}
                  className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 h-8 text-xs"
                >
                  {loading ? (
                    'Creating...'
                  ) : (
                    <>
                      <Send className="mr-2 h-3 w-3" />
                      Send Notification
                    </>
                  )}
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
