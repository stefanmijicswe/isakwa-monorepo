"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  BookOpen, 
  Search, 
  Plus, 
  User, 
  Calendar, 
  Clock, 
  CheckCircle, 
  XCircle,
  Library,
  BookMarked,
  Users,
  FileText
} from "lucide-react";

interface Book {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  available: boolean;
  totalCopies: number;
  availableCopies: number;
}

interface Rental {
  id: string;
  bookId: string;
  bookTitle: string;
  studentId: string;
  studentName: string;
  rentalDate: string;
  dueDate: string;
  returned: boolean;
  overdue: boolean;
}

interface BookRequest {
  id: string;
  title: string;
  author: string;
  isbn: string;
  category: string;
  requestedBy: string;
  requestDate: string;
  status: "pending" | "approved" | "rejected";
  priority: "low" | "medium" | "high";
}

const books: Book[] = [
  {
    id: "1",
    title: "Introduction to Computer Science",
    author: "John Smith",
    isbn: "978-0-123456-78-9",
    category: "Computer Science",
    available: true,
    totalCopies: 5,
    availableCopies: 3
  },
  {
    id: "2",
    title: "Advanced Mathematics",
    author: "Sarah Johnson",
    isbn: "978-0-987654-32-1",
    category: "Mathematics",
    available: true,
    totalCopies: 3,
    availableCopies: 1
  },
  {
    id: "3",
    title: "Business Management Principles",
    author: "Michael Brown",
    isbn: "978-0-456789-12-3",
    category: "Business",
    available: false,
    totalCopies: 4,
    availableCopies: 0
  },
  {
    id: "4",
    title: "English Literature Classics",
    author: "Emily Davis",
    isbn: "978-0-321098-76-5",
    category: "Literature",
    available: true,
    totalCopies: 6,
    availableCopies: 4
  }
];

const rentals: Rental[] = [
  {
    id: "1",
    bookId: "1",
    bookTitle: "Introduction to Computer Science",
    studentId: "2021001",
    studentName: "John Doe",
    rentalDate: "2024-12-01",
    dueDate: "2024-12-15",
    returned: false,
    overdue: false
  },
  {
    id: "2",
    bookId: "2",
    bookTitle: "Advanced Mathematics",
    studentId: "2021002",
    studentName: "Jane Smith",
    rentalDate: "2024-11-20",
    dueDate: "2024-12-05",
    returned: false,
    overdue: true
  }
];

const bookRequests: BookRequest[] = [
  {
    id: "1",
    title: "Machine Learning Fundamentals",
    author: "David Wilson",
    isbn: "978-0-555555-55-5",
    category: "Computer Science",
    requestedBy: "Prof. Johnson",
    requestDate: "2024-12-10",
    status: "pending",
    priority: "high"
  },
  {
    id: "2",
    title: "Data Structures and Algorithms",
    author: "Lisa Chen",
    isbn: "978-0-666666-66-6",
    category: "Computer Science",
    requestedBy: "Prof. Brown",
    requestDate: "2024-12-08",
    status: "approved",
    priority: "medium"
  }
];

export default function LibraryPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [showRentalModal, setShowRentalModal] = useState(false);
  const [showRequestModal, setShowRequestModal] = useState(false);
  const [studentId, setStudentId] = useState("");
  const [studentName, setStudentName] = useState("");
  const [rentalDuration, setRentalDuration] = useState("14");
  const [newBookRequest, setNewBookRequest] = useState({
    title: "",
    author: "",
    isbn: "",
    category: "",
    priority: "medium" as const
  });

  const filteredBooks = books.filter(book =>
    book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
    book.isbn.includes(searchTerm)
  );

  const handleRentBook = (book: Book) => {
    setSelectedBook(book);
    setShowRentalModal(true);
  };

  const confirmRental = () => {
    if (selectedBook && studentId && studentName) {
      const newRental: Rental = {
        id: Date.now().toString(),
        bookId: selectedBook.id,
        bookTitle: selectedBook.title,
        studentId,
        studentName,
        rentalDate: new Date().toISOString().split('T')[0],
        dueDate: new Date(Date.now() + parseInt(rentalDuration) * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
        returned: false,
        overdue: false
      };
      rentals.push(newRental);
      
      const bookIndex = books.findIndex(b => b.id === selectedBook.id);
      if (bookIndex !== -1) {
        books[bookIndex].availableCopies--;
        if (books[bookIndex].availableCopies === 0) {
          books[bookIndex].available = false;
        }
      }
      
      setShowRentalModal(false);
      setSelectedBook(null);
      setStudentId("");
      setStudentName("");
      setRentalDuration("14");
    }
  };

  const handleReturnBook = (rentalId: string) => {
    const rentalIndex = rentals.findIndex(r => r.id === rentalId);
    if (rentalIndex !== -1) {
      const rental = rentals[rentalIndex];
      rentals[rentalIndex].returned = true;
      
      const bookIndex = books.findIndex(b => b.id === rental.bookId);
      if (bookIndex !== -1) {
        books[bookIndex].availableCopies++;
        if (books[bookIndex].available) {
          books[bookIndex].available = true;
        }
      }
    }
  };

  const submitBookRequest = () => {
    if (newBookRequest.title && newBookRequest.author && newBookRequest.isbn && newBookRequest.category) {
      const request: BookRequest = {
        id: Date.now().toString(),
        ...newBookRequest,
        requestedBy: "Student Services",
        requestDate: new Date().toISOString().split('T')[0],
        status: "pending"
      };
      bookRequests.push(request);
      
      setNewBookRequest({
        title: "",
        author: "",
        isbn: "",
        category: "",
        priority: "medium"
      });
      setShowRequestModal(false);
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-green-100 text-green-800";
      case "rejected": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-800";
      case "medium": return "bg-yellow-100 text-yellow-800";
      case "low": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Library Management</h1>
          <p className="text-gray-600">Manage book rentals and requests for students</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Library className="h-5 w-5" />
            <span>{books.filter(b => b.available).length} books available</span>
          </div>
          <div className="flex items-center space-x-2 text-sm text-gray-600">
            <Users className="h-5 w-5" />
            <span>{rentals.filter(r => !r.returned).length} active rentals</span>
          </div>
        </div>
      </div>

      <Tabs defaultValue="books" className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="books" className="flex items-center space-x-2">
            <BookOpen className="h-4 w-4" />
            <span>Books</span>
          </TabsTrigger>
          <TabsTrigger value="rentals" className="flex items-center space-x-2">
            <User className="h-4 w-4" />
            <span>Rentals</span>
          </TabsTrigger>
          <TabsTrigger value="requests" className="flex items-center space-x-2">
            <FileText className="h-4 w-4" />
            <span>Book Requests</span>
          </TabsTrigger>
          <TabsTrigger value="new-request" className="flex items-center space-x-2">
            <Plus className="h-4 w-4" />
            <span>New Request</span>
          </TabsTrigger>
        </TabsList>

        <TabsContent value="books" className="space-y-6">
          <div className="flex items-center space-x-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search books by title, author, or ISBN..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>

          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {filteredBooks.map((book) => (
              <Card key={book.id} className="hover:shadow-md transition-shadow">
                <CardHeader className="pb-3">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <CardTitle className="text-lg">{book.title}</CardTitle>
                      <p className="text-sm text-gray-600">{book.author}</p>
                    </div>
                    <Badge variant={book.available ? "default" : "secondary"}>
                      {book.available ? "Available" : "Unavailable"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="space-y-3">
                  <div className="text-sm text-gray-600">
                    <p><span className="font-medium">ISBN:</span> {book.isbn}</p>
                    <p><span className="font-medium">Category:</span> {book.category}</p>
                    <p><span className="font-medium">Copies:</span> {book.availableCopies}/{book.totalCopies}</p>
                  </div>
                  <Button
                    onClick={() => handleRentBook(book)}
                    disabled={!book.available}
                    className="w-full"
                  >
                    Rent Book
                  </Button>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="rentals" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Active Book Rentals</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {rentals.filter(r => !r.returned).map((rental) => (
                  <div key={rental.id} className="flex items-center justify-between p-4 border rounded-lg">
                    <div className="flex-1">
                      <h3 className="font-medium">{rental.bookTitle}</h3>
                      <div className="text-sm text-gray-600 space-y-1">
                        <p>Student: {rental.studentName} (ID: {rental.studentId})</p>
                        <p>Rented: {rental.rentalDate}</p>
                        <p>Due: {rental.dueDate}</p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      {rental.overdue && (
                        <Badge variant="destructive">Overdue</Badge>
                      )}
                      <Button
                        onClick={() => handleReturnBook(rental.id)}
                        variant="outline"
                        size="sm"
                      >
                        Return Book
                      </Button>
                    </div>
                  </div>
                ))}
                {rentals.filter(r => !r.returned).length === 0 && (
                  <p className="text-center text-gray-500 py-8">No active rentals</p>
                )}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="requests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Book Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {bookRequests.map((request) => (
                  <div key={request.id} className="p-4 border rounded-lg">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-medium">{request.title}</h3>
                        <p className="text-sm text-gray-600">{request.author}</p>
                        <div className="text-sm text-gray-600 space-y-1 mt-2">
                          <p><span className="font-medium">ISBN:</span> {request.isbn}</p>
                          <p><span className="font-medium">Category:</span> {request.category}</p>
                          <p><span className="font-medium">Requested by:</span> {request.requestedBy}</p>
                          <p><span className="font-medium">Date:</span> {request.requestDate}</p>
                        </div>
                      </div>
                      <div className="flex flex-col space-y-2">
                        <Badge className={getStatusColor(request.status)}>
                          {request.status}
                        </Badge>
                        <Badge className={getPriorityColor(request.priority)}>
                          {request.priority} priority
                        </Badge>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="new-request" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Request New Book</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="title">Book Title</Label>
                    <Input
                      id="title"
                      value={newBookRequest.title}
                      onChange={(e) => setNewBookRequest({...newBookRequest, title: e.target.value})}
                      placeholder="Enter book title"
                    />
                  </div>
                  <div>
                    <Label htmlFor="author">Author</Label>
                    <Input
                      id="author"
                      value={newBookRequest.author}
                      onChange={(e) => setNewBookRequest({...newBookRequest, author: e.target.value})}
                      placeholder="Enter author name"
                    />
                  </div>
                </div>
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="isbn">ISBN</Label>
                    <Input
                      id="isbn"
                      value={newBookRequest.isbn}
                      onChange={(e) => setNewBookRequest({...newBookRequest, isbn: e.target.value})}
                      placeholder="Enter ISBN"
                    />
                  </div>
                  <div>
                    <Label htmlFor="category">Category</Label>
                    <Input
                      id="category"
                      value={newBookRequest.category}
                      onChange={(e) => setNewBookRequest({...newBookRequest, category: e.target.value})}
                      placeholder="Enter category"
                    />
                  </div>
                </div>
                <div>
                  <Label htmlFor="priority">Priority</Label>
                  <select
                    id="priority"
                    value={newBookRequest.priority}
                    onChange={(e) => setNewBookRequest({...newBookRequest, priority: e.target.value as any})}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <Button onClick={submitBookRequest} className="w-full">
                  Submit Book Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {showRentalModal && selectedBook && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Rent Book</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="book-title">Book</Label>
                <Input
                  id="book-title"
                  value={selectedBook.title}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label htmlFor="student-id">Student ID</Label>
                <Input
                  id="student-id"
                  value={studentId}
                  onChange={(e) => setStudentId(e.target.value)}
                  placeholder="Enter student ID"
                />
              </div>
              <div>
                <Label htmlFor="student-name">Student Name</Label>
                <Input
                  id="student-name"
                  value={studentName}
                  onChange={(e) => setStudentName(e.target.value)}
                  placeholder="Enter student name"
                />
              </div>
              <div>
                <Label htmlFor="duration">Rental Duration (days)</Label>
                <Input
                  id="duration"
                  type="number"
                  value={rentalDuration}
                  onChange={(e) => setRentalDuration(e.target.value)}
                  min="1"
                  max="30"
                />
              </div>
              <div className="flex space-x-2">
                <Button onClick={confirmRental} className="flex-1">
                  Confirm Rental
                </Button>
                <Button 
                  onClick={() => setShowRentalModal(false)} 
                  variant="outline" 
                  className="flex-1"
                >
                  Cancel
                </Button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
