"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import { 
  BookOpen, 
  User, 
  CheckCircle,
  Calendar,
  Clock
} from "lucide-react";

interface LibraryItem {
  id: number;
  title: string;
  author?: string;
  isbn?: string;
  type: string;
  category?: string;
  totalCopies: number;
  availableCopies: number;
}

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  studentProfile?: {
    year: number;
    studyProgram?: {
      name: string;
    };
  };
}

interface LibraryBorrowing {
  id: number;
  libraryItem: {
    title: string;
    author?: string;
    type: string;
  };
  student: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
  borrowedAt: string;
  dueDate: string;
  status: string;
  notes?: string;
  isActive: boolean;
}

export default function LibraryPage() {
  const [activeTab, setActiveTab] = useState("borrow");
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [borrowings, setBorrowings] = useState<LibraryBorrowing[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [dueDate, setDueDate] = useState<string>("");
  const [notes, setNotes] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch library items
  useEffect(() => {
    const fetchLibraryItems = async () => {
      console.log('fetchLibraryItems function called');
      try {
        const response = await fetch('http://localhost:3001/api/library/items', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          }
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Library items API response:', data);
          const itemsData = data.data || data;
          console.log('Loaded library items:', itemsData);
          setLibraryItems(itemsData);
        }
      } catch (error) {
        console.error('Error fetching library items:', error);
      }
    };

    console.log('useEffect for library items triggered');
    fetchLibraryItems();
  }, []);

  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      console.log('fetchStudents function called');
      try {
        const response = await fetch('http://localhost:3001/api/users/students', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          }
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Students API response:', data);
          const studentsData = data.users || data;
          console.log('Loaded students:', studentsData);
          setStudents(studentsData);
        } else {
          console.error('Failed to fetch students:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    console.log('useEffect for students triggered');
    fetchStudents();
  }, []);

  // Fetch borrowings
  useEffect(() => {
    const fetchBorrowings = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/library/borrowings', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          }
        });
        if (response.ok) {
          const data = await response.json();
          setBorrowings(data);
        } else {
          console.error('Failed to fetch borrowings:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching borrowings:', error);
      }
    };

    fetchBorrowings();
  }, []);

  // Helper function to refresh borrowings
  const refreshBorrowings = async () => {
    try {
      const response = await fetch('http://localhost:3001/api/library/borrowings', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        }
      });
      if (response.ok) {
        const data = await response.json();
        setBorrowings(data);
      }
    } catch (error) {
      console.error('Error refreshing borrowings:', error);
    }
  };

  // Handle borrowing
  const handleBorrow = async () => {
    if (!selectedItem || !selectedStudent || !dueDate) {
      alert('Please select book, student and enter due date');
      return;
    }

    console.log('Borrowing request:', {
      selectedItem,
      selectedStudent,
      dueDate,
      notes,
      selectedStudentType: typeof selectedStudent
    });

    setLoading(true);
    try {
      const requestBody = {
        libraryItemId: selectedItem,
        studentId: selectedStudent,
        dueDate: dueDate,
        notes: notes || undefined,
      };
      
      console.log('Request body:', requestBody);
      
      const response = await fetch('http://localhost:3001/api/library/borrow', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(requestBody),
      });

      if (response.ok) {
        const data = await response.json();
        console.log('Borrowing response:', data);
        
        // Reset form
        setSelectedItem(null);
        setSelectedStudent(null);
        setDueDate("");
        setNotes("");
        
        // Refresh borrowings to show the new borrowing
        await refreshBorrowings();
        alert('Book borrowed successfully!');
      } else {
        const error = await response.json();
        console.error('Borrowing error response:', error);
        alert(`Error: ${error.message || 'Failed to borrow book'}`);
      }
    } catch (error) {
      console.error('Error borrowing book:', error);
      alert('Error borrowing book');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsReturned = async (borrowingId: number) => {
    if (!confirm('Are you sure you want to mark this book as returned?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/library/return/${borrowingId}`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          notes: 'Book returned by student service',
        }),
      });

      if (response.ok) {
        // Refresh borrowings to show updated status
        await refreshBorrowings();
        
        alert('Book marked as returned successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to mark book as returned'}`);
      }
    } catch (error) {
      console.error('Error marking book as returned:', error);
      alert('Error marking book as returned');
    }
  };

  const filteredStudents = students.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  };

  const formatBookType = (type: string) => {
    return type
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'BORROWED':
        return 'bg-blue-100 text-blue-800';
      case 'RETURNED':
        return 'bg-green-100 text-green-800';
      case 'OVERDUE':
        return 'bg-red-100 text-red-800';
      case 'LOST':
        return 'bg-orange-100 text-orange-800';
      default:
        return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Library Management
            </h1>
            <p className="text-slate-600">
              Borrow books and track library items
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 w-full">
        <TabsList className="grid w-full grid-cols-2 mb-6 min-w-full">
          <TabsTrigger value="borrow" className="flex-1">Borrow Books</TabsTrigger>
          <TabsTrigger value="history" className="flex-1">Borrowing History</TabsTrigger>
        </TabsList>

        <TabsContent value="borrow" className="space-y-6 min-h-[600px] w-full">
          <Card className="border-0 shadow-sm bg-white w-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Borrow Library Book</CardTitle>
              <p className="text-sm text-slate-600 mt-2">Select books, choose students, and set due dates</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Step 1: Select Book */}
              <div>
                <h3 className="text-md font-medium text-slate-900 mb-3">1. Select Book</h3>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                  {libraryItems.map((item) => (
                    <div
                      key={item.id}
                      className={`p-3 border rounded-lg cursor-pointer transition-all hover:shadow-md ${
                        selectedItem === item.id
                          ? 'border-blue-500 bg-blue-50 shadow-md'
                          : 'border-slate-200 hover:border-slate-300'
                      }`}
                      onClick={() => setSelectedItem(item.id)}
                    >
                      <div className="text-center">
                        <div className="h-8 w-8 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-2">
                          <BookOpen className="h-4 w-4 text-blue-600" />
                        </div>
                        <div className="font-medium text-slate-900 text-sm truncate">{item.title}</div>
                        <div className="text-xs text-slate-500 truncate">{item.author || 'Unknown Author'}</div>
                        <div className="text-xs font-medium text-slate-700 mt-1">
                          {item.availableCopies}/{item.totalCopies} available
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Step 2: Select Student */}
              <div>
                <h3 className="text-md font-medium text-slate-900 mb-3">2. Select Student</h3>
                <div className="mb-4">
                  <Command className="rounded-lg border border-slate-200">
                    <CommandInput 
                      placeholder="Search students by name or email..." 
                      value={searchTerm}
                      onValueChange={setSearchTerm}
                    />
                    <CommandList>
                      <CommandEmpty>No students found.</CommandEmpty>
                      <CommandGroup>
                        {filteredStudents.map((student) => (
                          <CommandItem
                            key={student.id}
                            value={`${student.firstName} ${student.lastName} ${student.email}`}
                            onSelect={() => {
                              console.log('Student selected:', {
                                id: student.id,
                                firstName: student.firstName,
                                lastName: student.lastName,
                                email: student.email
                              });
                              setSelectedStudent(student.id);
                            }}
                            className="cursor-pointer"
                          >
                            <div className="flex items-center space-x-3 w-full">
                              <div className="h-8 w-8 bg-green-100 rounded-lg flex items-center justify-center">
                                <User className="h-4 w-4 text-green-600" />
                              </div>
                              <div className="flex-1">
                                <div className="font-medium text-slate-900">
                                  {student.firstName} {student.lastName}
                                </div>
                                <div className="text-sm text-slate-500">{student.email}</div>
                                <div className="text-sm text-slate-500">
                                  Year {student.studentProfile?.year || 'N/A'} • {student.studentProfile?.studyProgram?.name || 'N/A'}
                                </div>
                              </div>
                              {selectedStudent === student.id && (
                                <div className="h-4 w-4 bg-green-500 rounded-full flex items-center justify-center">
                                  <CheckCircle className="h-3 w-3 text-white" />
                                </div>
                              )}
                            </div>
                          </CommandItem>
                        ))}
                      </CommandGroup>
                    </CommandList>
                  </Command>
                </div>
                
                {/* Selected Student Display */}
                {selectedStudent && (
                  <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-green-100 rounded-lg flex items-center justify-center">
                        <User className="h-5 w-5 text-green-600" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">
                          {students.find(s => s.id === selectedStudent)?.firstName} {students.find(s => s.id === selectedStudent)?.lastName}
                        </div>
                        <div className="text-sm text-slate-600">
                          {students.find(s => s.id === selectedStudent)?.email}
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Step 3: Due Date and Notes */}
              <div>
                <h3 className="text-md font-medium text-slate-900 mb-3">3. Due Date & Notes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Due Date
                    </label>
                    <Input
                      type="date"
                      value={dueDate}
                      onChange={(e) => setDueDate(e.target.value)}
                      className="border-slate-200"
                      min={new Date().toISOString().split('T')[0]}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Notes (optional)
                    </label>
                    <Input
                      placeholder="e.g., Student needs for research project"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="border-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* Borrow Button */}
              <div className="pt-4">
                <Button
                  onClick={handleBorrow}
                  disabled={loading || !selectedItem || !selectedStudent || !dueDate}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <BookOpen className="h-4 w-4 mr-2" />
                  )}
                  Borrow Book
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="history" className="space-y-6 min-h-[600px] w-full">
          <Card className="border-0 shadow-sm bg-white w-full">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Recent Borrowings</CardTitle>
              <p className="text-sm text-slate-600 mt-2">Track all books borrowed by students</p>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Borrowings List */}
              <div className="space-y-4">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="text-lg font-medium text-slate-900">Borrowing History</h3>
                  <div className="text-sm text-slate-500">
                    Showing {borrowings.length} recent borrowings
                  </div>
                </div>
                
                {borrowings.length === 0 ? (
                  <div className="text-center py-12">
                    <BookOpen className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                    <p className="text-lg text-slate-600 mb-2">No books have been borrowed yet</p>
                    <p className="text-sm text-slate-500">Start by borrowing books from the Borrow Books tab</p>
                  </div>
                ) : (
                  borrowings.map((borrowing) => (
                    <div key={borrowing.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                      <div className="flex items-center space-x-3">
                        <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                          <BookOpen className="h-5 w-5 text-blue-600" />
                        </div>
                        <div className="flex-1">
                          <div className="font-medium text-slate-900">
                            {borrowing.libraryItem.title}
                          </div>
                          <div className="text-sm text-slate-600">
                            Borrowed by: {borrowing.student.user.firstName} {borrowing.student.user.lastName}
                          </div>
                          {borrowing.notes && (
                            <div className="text-sm text-slate-500 italic mt-1">
                              &ldquo;{borrowing.notes}&rdquo;
                            </div>
                          )}
                        </div>
                      </div>
                      <div className="text-right ml-4">
                        <div className="text-sm font-medium text-slate-900">
                          <span className={`px-2 py-1 rounded-full text-xs ${getStatusColor(borrowing.status)}`}>
                            {borrowing.status}
                          </span>
                        </div>
                        <div className="text-sm text-slate-500 mt-1">
                          Due: {formatDate(borrowing.dueDate)}
                        </div>
                        {borrowing.isActive && borrowing.status === 'BORROWED' && (
                          <Button
                            size="sm"
                            variant="outline"
                            className="mt-2 text-xs"
                            onClick={() => handleMarkAsReturned(borrowing.id)}
                          >
                            Mark as Returned
                          </Button>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
