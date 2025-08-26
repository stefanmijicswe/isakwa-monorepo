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
  Package, 
  User, 
  CheckCircle
} from "lucide-react";

interface InventoryItem {
  id: number;
  name: string;
  category: string;
  quantity: number;
  unit: string;
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

interface InventoryIssuance {
  id: number;
  inventoryItem: {
    name: string;
    category: string;
  };
  student: {
    user: {
      firstName: string;
      lastName: string;
    };
  };
  quantityIssued: number;
  issuedAt: string;
  notes?: string;
  isActive: boolean;
}

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState("issue");
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [issuances, setIssuances] = useState<InventoryIssuance[]>([]);
  const [loading, setLoading] = useState(false);
  
  // Form state
  const [selectedItem, setSelectedItem] = useState<number | null>(null);
  const [selectedStudent, setSelectedStudent] = useState<number | null>(null);
  const [quantity, setQuantity] = useState<number>(1);
  const [notes, setNotes] = useState<string>("");
  const [searchTerm, setSearchTerm] = useState("");

  // Fetch inventory items
  useEffect(() => {
    const fetchInventoryItems = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/inventory/items', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          }
        });
        if (response.ok) {
          const data = await response.json();
          setInventoryItems(data.data || data);
        }
      } catch (error) {
        console.error('Error fetching inventory items:', error);
      }
    };

    fetchInventoryItems();
  }, []);

  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/users/students', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          }
        });
        if (response.ok) {
          const data = await response.json();
          console.log('Students data:', data);
          setStudents(data.users || data);
        } else {
          console.error('Failed to fetch students:', response.status, response.statusText);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  // Fetch issuances
  useEffect(() => {
    const fetchIssuances = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/inventory/issuances', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          }
        });
        if (response.ok) {
          const data = await response.json();
          setIssuances(data.issuances || data);
        }
      } catch (error) {
        console.error('Error fetching issuances:', error);
      }
    };

    fetchIssuances();
  }, []);

  // Handle issuance
  const handleIssue = async () => {
    if (!selectedItem || !selectedStudent || quantity < 1) {
      alert('Please select item, student and enter quantity');
      return;
    }

    setLoading(true);
    try {
      const response = await fetch('http://localhost:3001/api/inventory/issuances', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          inventoryItemId: selectedItem,
          studentId: selectedStudent,
          quantityIssued: quantity,
          notes: notes || undefined,
        }),
      });

      if (response.ok) {
        // Reset form
        setSelectedItem(null);
        setSelectedStudent(null);
        setQuantity(1);
        setNotes("");
        
        // Refresh issuances
        const data = await response.json();
        setIssuances(prev => [data, ...prev]);
        
        alert('Item issued successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to issue item'}`);
      }
    } catch (error) {
      console.error('Error issuing item:', error);
      alert('Error issuing item');
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsReturned = async (issuanceId: number) => {
    if (!confirm('Are you sure you want to mark this item as returned?')) {
      return;
    }

    try {
      const response = await fetch(`http://localhost:3001/api/inventory/issuances/${issuanceId}/return`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          returnNotes: 'Item returned by student service',
        }),
      });

      if (response.ok) {
        // Refresh issuances to show updated status
        const updatedIssuances = issuances.map(issuance => 
          issuance.id === issuanceId 
            ? { ...issuance, isActive: false }
            : issuance
        );
        setIssuances(updatedIssuances);
        
        alert('Item marked as returned successfully!');
      } else {
        const error = await response.json();
        alert(`Error: ${error.message || 'Failed to mark item as returned'}`);
      }
    } catch (error) {
      console.error('Error marking item as returned:', error);
      alert('Error marking item as returned');
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
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const formatCategory = (category: string) => {
    return category
      .split('_')
      .map(word => word.charAt(0) + word.slice(1).toLowerCase())
      .join(' ');
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Inventory Management
            </h1>
            <p className="text-slate-600">
              Issue office supplies and track inventory
            </p>
          </div>
        </div>
      </div>

                           {/* Main Content */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6 w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6 min-w-full">
            <TabsTrigger value="issue" className="flex-1">Issue Items</TabsTrigger>
            <TabsTrigger value="history" className="flex-1">Issue History</TabsTrigger>
          </TabsList>

                                                                                                           <TabsContent value="issue" className="space-y-6 min-h-[600px] w-full">
             <Card className="border-0 shadow-sm bg-white w-full">
              <CardHeader>
                <CardTitle className="text-lg font-semibold text-slate-900">Issue Inventory Item</CardTitle>
                <p className="text-sm text-slate-600 mt-2">Select items, choose students, and issue inventory</p>
              </CardHeader>
              <CardContent className="space-y-6">
                             {/* Step 1: Select Item */}
               <div>
                 <h3 className="text-md font-medium text-slate-900 mb-3">1. Select Item</h3>
                 <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-3">
                   {inventoryItems.map((item) => (
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
                           <Package className="h-4 w-4 text-blue-600" />
                         </div>
                         <div className="font-medium text-slate-900 text-sm truncate">{item.name}</div>
                         <div className="text-xs text-slate-500 truncate">{formatCategory(item.category)}</div>
                         <div className="text-xs font-medium text-slate-700 mt-1">
                           {item.quantity} {item.unit}
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
                             onSelect={() => setSelectedStudent(student.id)}
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

              {/* Step 3: Quantity and Notes */}
              <div>
                <h3 className="text-md font-medium text-slate-900 mb-3">3. Quantity & Notes</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Quantity
                    </label>
                    <Input
                      type="number"
                      min="1"
                      value={quantity}
                      onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                      className="border-slate-200"
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Notes (optional)
                    </label>
                    <Input
                      placeholder="e.g., Student took scissors for project"
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="border-slate-200"
                    />
                  </div>
                </div>
              </div>

              {/* Issue Button */}
              <div className="pt-4">
                <Button
                  onClick={handleIssue}
                  disabled={loading || !selectedItem || !selectedStudent}
                  className="w-full bg-blue-600 hover:bg-blue-700"
                >
                  {loading ? (
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  ) : (
                    <Package className="h-4 w-4 mr-2" />
                  )}
                  Issue Item
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

                                                                       <TabsContent value="history" className="space-y-6 min-h-[600px] w-full">
            <Card className="border-0 shadow-sm bg-white w-full">
             <CardHeader>
               <CardTitle className="text-lg font-semibold text-slate-900">Recent Issues</CardTitle>
               <p className="text-sm text-slate-600 mt-2">Track all inventory items issued to students</p>
             </CardHeader>
                           <CardContent className="space-y-6">
                {/* Issues List */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between mb-4">
                    <h3 className="text-lg font-medium text-slate-900">Issue History</h3>
                    <div className="text-sm text-slate-500">
                      Showing {issuances.length} recent issues
                    </div>
                  </div>
                 
                 {issuances.length === 0 ? (
                   <div className="text-center py-12">
                     <Package className="h-16 w-16 text-slate-400 mx-auto mb-4" />
                     <p className="text-lg text-slate-600 mb-2">No items have been issued yet</p>
                     <p className="text-sm text-slate-500">Start by issuing items from the Issue Items tab</p>
                   </div>
                 ) : (
                   issuances.map((issuance) => (
                     <div key={issuance.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg border border-slate-200 hover:bg-slate-100 transition-colors">
                       <div className="flex items-center space-x-3">
                         <div className="h-10 w-10 bg-blue-100 rounded-lg flex items-center justify-center">
                           <Package className="h-5 w-5 text-blue-600" />
                         </div>
                         <div className="flex-1">
                           <div className="font-medium text-slate-900">
                             {issuance.inventoryItem.name}
                           </div>
                           <div className="text-sm text-slate-600">
                             Issued to: {issuance.student.user.firstName} {issuance.student.user.lastName}
                           </div>
                           {issuance.notes && (
                             <div className="text-sm text-slate-500 italic mt-1">
                               &ldquo;{issuance.notes}&rdquo;
                             </div>
                           )}
                         </div>
                       </div>
                                               <div className="text-right ml-4">
                          <div className="text-sm font-medium text-slate-900">
                            {issuance.quantityIssued} items
                          </div>
                          <div className="text-sm text-slate-500">
                            {formatDate(issuance.issuedAt)}
                          </div>
                          {issuance.isActive && (
                            <Button
                              size="sm"
                              variant="outline"
                              className="mt-2 text-xs"
                              onClick={() => handleMarkAsReturned(issuance.id)}
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
