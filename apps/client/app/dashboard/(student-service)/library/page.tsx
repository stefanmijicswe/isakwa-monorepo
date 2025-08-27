"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  Book, 
  Search, 
  Clock,
  CheckCircle,
  ArrowRight,
  Check,
  Info,
  Plus,
  Calendar
} from "lucide-react";
import { 
  getLibraryItems, 
  getAllBorrowings, 
  borrowItem, 
  returnItem,
  type LibraryItem,
  type LibraryBorrowing
} from "@/lib/library.service";
import { getStudents, type Student } from "@/lib/students.service";

export default function LibraryManagementPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [activeTab, setActiveTab] = useState("borrow");
  const [libraryItems, setLibraryItems] = useState<LibraryItem[]>([]);
  const [borrowings, setBorrowings] = useState<LibraryBorrowing[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedType, setSelectedType] = useState("all");
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<LibraryItem | null>(null);
  const [borrowForm, setBorrowForm] = useState({
    studentId: "",
    dueDate: "",
    notes: ""
  });
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedBorrowing, setSelectedBorrowing] = useState<LibraryBorrowing | null>(null);
  const [returnNotes, setReturnNotes] = useState("");
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetchData();
    fetchStudents();
  }, []);

  const fetchStudents = async () => {
    try {
      const studentsResponse = await getStudents(1, 100);
      setStudents(studentsResponse.users);
    } catch (error) {
      console.error("Error fetching students:", error);
    }
  };

  const fetchData = async () => {
    try {
      setLoading(true);
      const [itemsResponse, borrowingsResponse] = await Promise.all([
        getLibraryItems(1, 100),
        getAllBorrowings()
      ]);
      
      setLibraryItems(itemsResponse.data);
      setBorrowings(borrowingsResponse);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async () => {
    if (!selectedItem || !borrowForm.studentId || !borrowForm.dueDate) return;

    try {
      await borrowItem({
        studentId: parseInt(borrowForm.studentId),
        libraryItemId: selectedItem.id,
        dueDate: borrowForm.dueDate,
        notes: borrowForm.notes
      });

             await fetchData();
       setBorrowForm({ studentId: "", dueDate: "", notes: "" });
       setSelectedItem(null);
       setShowBorrowModal(false);
       setError(null); // Clear any previous errors
    } catch (error: any) {
      console.error("Error borrowing item:", error);
      // Extract error message from backend response
      if (error.message && error.message.includes("HTTP error!")) {
        // Try to parse the response body for more details
        setError("Failed to borrow book. Please try again.");
      } else {
        setError(error.message || "Failed to borrow book. Please try again.");
      }
    }
  };

  const handleReturn = async () => {
    if (!selectedBorrowing) return;

    try {
      await returnItem(selectedBorrowing.id, { notes: returnNotes });
      await fetchData();
      setReturnNotes("");
      setSelectedBorrowing(null);
      setShowReturnModal(false);
    } catch (error) {
      console.error("Error returning item:", error);
    }
  };

  const filteredItems = libraryItems.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.author && item.author.toLowerCase().includes(searchTerm.toLowerCase())) ||
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesType = selectedType === "all" || !selectedType || item.type === selectedType;
    return matchesSearch && matchesType;
  });

  const activeBorrowings = borrowings.filter(borrowing => borrowing.isActive);
  const returnedBorrowings = borrowings.filter(borrowing => !borrowing.isActive);

  const getAvailableCopies = (item: LibraryItem) => {
    const borrowedCount = item._count?.borrowings || 0;
    return item.totalCopies - borrowedCount;
  };

  const isOverdue = (borrowing: LibraryBorrowing) => {
    return new Date(borrowing.dueDate) < new Date() && borrowing.isActive;
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-gray-900 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Error Alert */}
      {error && (
        <div className="bg-red-50 border border-red-200 rounded-md p-4">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <h3 className="text-sm font-medium text-red-800">Error</h3>
              <div className="mt-2 text-sm text-red-700">
                <p>{error}</p>
              </div>
            </div>
            <div className="ml-auto pl-3">
              <div className="-mx-1.5 -my-1.5">
                <button
                  onClick={() => setError(null)}
                  className="inline-flex rounded-md bg-red-50 p-1.5 text-red-500 hover:bg-red-100 focus:outline-none focus:ring-2 focus:ring-red-600 focus:ring-offset-2 focus:ring-offset-red-50"
                >
                  <span className="sr-only">Dismiss</span>
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414L11.414 12l3.293 3.293a1 1 0 01-1.414 1.414L10 13.414l-3.293 3.293a1 1 0 01-1.414-1.414L8.586 12 5.293 8.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Library Management</h1>
          <p className="text-gray-600">Manage and track library books and borrowings</p>
        </div>
        <Button onClick={() => setShowBorrowModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Borrow Book
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="borrow">Borrow Books</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Borrow Books Tab */}
        <TabsContent value="borrow" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search books, authors..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <Select value={selectedType} onValueChange={setSelectedType}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Types" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Types</SelectItem>
                <SelectItem value="BOOK">Books</SelectItem>
                <SelectItem value="JOURNAL">Journals</SelectItem>
                <SelectItem value="MAGAZINE">Magazines</SelectItem>
                <SelectItem value="THESIS">Theses</SelectItem>
                <SelectItem value="OTHER">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          {/* Books Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => {
              const availableCopies = getAvailableCopies(item);
              const canBorrow = availableCopies > 0;
              
              return (
                <Card 
                  key={item.id} 
                  className={`cursor-pointer hover:shadow-md transition-shadow ${!canBorrow ? 'opacity-60' : ''}`}
                  onClick={() => {
                    if (canBorrow) {
                      setSelectedItem(item);
                      setShowBorrowModal(true);
                    }
                  }}
                >
                  <CardHeader className="pb-3">
                    <div className="flex items-center justify-between">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <Book className="h-4 w-4 text-gray-600" />
                      </div>
                      <Badge variant={availableCopies === 0 ? "destructive" : availableCopies <= 2 ? "secondary" : "default"}>
                        {availableCopies === 0 ? "Out of Stock" : availableCopies <= 2 ? "Low Stock" : "Available"}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent className="pt-0">
                    <h3 className="font-medium text-gray-900 mb-2">{item.title}</h3>
                    {item.author && (
                      <p className="text-sm text-gray-600 mb-2">by {item.author}</p>
                    )}
                    {item.description && (
                      <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                    )}
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-500">Available:</span>
                        <span className="font-medium">{availableCopies} of {item.totalCopies} copies</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-500">Type:</span>
                        <Badge variant="outline" className="text-xs">
                          {item.type}
                        </Badge>
                      </div>
                      {item.isbn && (
                        <div className="flex justify-between">
                          <span className="text-gray-500">ISBN:</span>
                          <span className="font-medium text-xs">{item.isbn}</span>
                        </div>
                      )}
                    </div>
                    <div className="mt-3 pt-3 border-t border-gray-100">
                      {canBorrow ? (
                        <div className="flex items-center text-blue-600 text-sm font-medium">
                          <span>Click to borrow</span>
                          <ArrowRight className="h-4 w-4 ml-1" />
                        </div>
                      ) : (
                        <div className="text-gray-500 text-sm">
                          No copies available
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>

          {filteredItems.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Book className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No books found</p>
              </CardContent>
            </Card>
          )}
        </TabsContent>

        {/* History Tab */}
        <TabsContent value="history" className="space-y-6">
          {/* Active Borrowings */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Clock className="h-5 w-5" />
                Active Borrowings ({activeBorrowings.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeBorrowings.length === 0 ? (
                <div className="text-center py-6">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-gray-600">No active borrowings</p>
                </div>
              ) : (
                activeBorrowings.map((borrowing) => (
                  <div key={borrowing.id} className={`border rounded-lg p-4 ${isOverdue(borrowing) ? 'border-red-200 bg-red-50' : ''}`}>
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h4 className="font-medium text-gray-900">
                            {borrowing.libraryItem?.title || 'Unknown Book'}
                          </h4>
                          {isOverdue(borrowing) && (
                            <Badge variant="destructive" className="text-xs">Overdue</Badge>
                          )}
                        </div>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Student:</span>
                            <p>{borrowing.student?.user?.firstName} {borrowing.student?.user?.lastName}</p>
                          </div>
                          <div>
                            <span className="font-medium">Borrowed:</span>
                            <p>{new Date(borrowing.borrowedAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className="font-medium">Due Date:</span>
                            <p className={isOverdue(borrowing) ? 'text-red-600 font-medium' : ''}>
                              {new Date(borrowing.dueDate).toLocaleDateString()}
                            </p>
                          </div>
                          <div>
                            <span className="font-medium">Author:</span>
                            <p>{borrowing.libraryItem?.author || 'Unknown'}</p>
                          </div>
                        </div>
                        {borrowing.notes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                            <span className="font-medium">Notes:</span>
                            <p className="text-gray-600 mt-1">{borrowing.notes}</p>
                          </div>
                        )}
                      </div>
                      <Button
                        onClick={() => {
                          setSelectedBorrowing(borrowing);
                          setShowReturnModal(true);
                        }}
                        className="ml-4"
                      >
                        <Check className="h-4 w-4 mr-2" />
                        Mark Returned
                      </Button>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>

          {/* Returned Books */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Returned Books ({returnedBorrowings.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {returnedBorrowings.length === 0 ? (
                <div className="text-center py-6">
                  <Info className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-gray-600">No returned books yet</p>
                </div>
              ) : (
                returnedBorrowings.map((borrowing) => (
                  <div key={borrowing.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-2">
                          {borrowing.libraryItem?.title || 'Unknown Book'}
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Student:</span>
                            <p>{borrowing.student?.user?.firstName} {borrowing.student?.user?.lastName}</p>
                          </div>
                          <div>
                            <span className="font-medium">Returned:</span>
                            <p>{borrowing.returnedAt ? new Date(borrowing.returnedAt).toLocaleDateString() : 'N/A'}</p>
                          </div>
                          <div>
                            <span className="font-medium">Borrowed:</span>
                            <p>{new Date(borrowing.borrowedAt).toLocaleDateString()}</p>
                          </div>
                          <div>
                            <span className="font-medium">Author:</span>
                            <p>{borrowing.libraryItem?.author || 'Unknown'}</p>
                          </div>
                        </div>
                        {borrowing.notes && (
                          <div className="mt-3 p-3 bg-green-50 rounded text-sm border border-green-200">
                            <span className="font-medium text-green-700">Return Notes:</span>
                            <p className="text-green-600 mt-1">{borrowing.notes}</p>
                          </div>
                        )}
                        {!borrowing.notes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded text-sm border border-gray-200">
                            <span className="font-medium text-gray-700">Return Notes:</span>
                            <p className="text-gray-600 mt-1">No comment</p>
                          </div>
                        )}
                      </div>
                      <Badge variant="outline" className="ml-4">Returned</Badge>
                    </div>
                  </div>
                ))
              )}
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

             {/* Borrow Modal */}
       <Dialog open={showBorrowModal} onOpenChange={setShowBorrowModal}>
         <DialogContent>
           <DialogHeader>
             <DialogTitle>Borrow Book</DialogTitle>
           </DialogHeader>
           {selectedItem && (
             <>
                              {/* Error Alert in Modal */}
               {error && (
                 <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
                   <div className="flex">
                     <div className="flex-shrink-0">
                       <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                         <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                       </svg>
                     </div>
                     <div className="ml-3">
                       <h3 className="text-sm font-medium text-red-800">Error</h3>
                       <div className="mt-2 text-sm text-red-700">
                         <p>{error}</p>
                       </div>
                     </div>
                   </div>
                 </div>
               )}
               <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{selectedItem.title}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Available:</span>
                    <p className="text-gray-600">{getAvailableCopies(selectedItem)} of {selectedItem.totalCopies} copies</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Author:</span>
                    <p className="text-gray-600">{selectedItem.author || 'Unknown'}</p>
                  </div>
                </div>
              </div>

              <div className="space-y-4">
                <div>
                  <Label htmlFor="student">Student</Label>
                  <Select value={borrowForm.studentId} onValueChange={(value) => setBorrowForm({...borrowForm, studentId: value})}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select a student" />
                    </SelectTrigger>
                    <SelectContent>
                      {students.map((student) => (
                        <SelectItem key={student.id} value={student.id.toString()}>
                          {student.firstName} {student.lastName} ({student.studentProfile?.studentIndex || 'N/A'})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div>
                  <Label htmlFor="dueDate">Due Date</Label>
                  <Input
                    id="dueDate"
                    type="date"
                    min={new Date().toISOString().split('T')[0]}
                    placeholder="Select due date"
                    value={borrowForm.dueDate}
                    onChange={(e) => setBorrowForm({...borrowForm, dueDate: e.target.value})}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Select when the book should be returned
                  </p>
                </div>

                <div>
                  <Label htmlFor="notes">Notes (Optional)</Label>
                  <Textarea
                    id="notes"
                    placeholder="Any additional notes..."
                    value={borrowForm.notes}
                    onChange={(e) => setBorrowForm({...borrowForm, notes: e.target.value})}
                    rows={3}
                  />
                </div>
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowBorrowModal(false)}>
                  Cancel
                </Button>
                <Button
                  onClick={handleBorrow}
                  disabled={!borrowForm.studentId || !borrowForm.dueDate}
                >
                  Borrow Book
                </Button>
              </div>
            </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Return Modal */}
      <Dialog open={showReturnModal} onOpenChange={setShowReturnModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Returned</DialogTitle>
          </DialogHeader>
          {selectedBorrowing && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  {selectedBorrowing.libraryItem?.title || 'Unknown Book'}
                </h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Student:</span>
                    <p className="text-gray-600">
                      {selectedBorrowing.student?.user?.firstName} {selectedBorrowing.student?.user?.lastName}
                    </p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Due Date:</span>
                    <p className="text-gray-600">
                      {new Date(selectedBorrowing.dueDate).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </div>

              <div>
                <Label htmlFor="returnNotes">Return Notes (Optional)</Label>
                <Textarea
                  id="returnNotes"
                  placeholder="Any notes about the return..."
                  value={returnNotes}
                  onChange={(e) => setReturnNotes(e.target.value)}
                  rows={3}
                />
              </div>

              <div className="flex justify-end gap-3 pt-4">
                <Button variant="outline" onClick={() => setShowReturnModal(false)}>
                  Cancel
                </Button>
                <Button onClick={handleReturn}>
                  <Check className="h-4 w-4 mr-2" />
                  Mark Returned
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
