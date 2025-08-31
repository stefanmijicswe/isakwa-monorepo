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
  Package, 
  Search, 
  Clock,
  CheckCircle, 
  ArrowRight,
  Check,
  Info,
  Plus
} from "lucide-react";
import { 
  getInventoryItems, 
  getAllInventoryIssuances, 
  createInventoryIssuance, 
  markAsReturned,
  type InventoryItem,
  type InventoryIssuance
} from "@/lib/inventory.service";
import { getStudents, type Student } from "@/lib/students.service";

export default function InventoryPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [activeTab, setActiveTab] = useState("borrow");
  const [inventoryItems, setInventoryItems] = useState<InventoryItem[]>([]);
  const [issuances, setIssuances] = useState<InventoryIssuance[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [showBorrowModal, setShowBorrowModal] = useState(false);
  const [selectedItem, setSelectedItem] = useState<InventoryItem | null>(null);
  const [borrowForm, setBorrowForm] = useState({
    studentId: "",
    quantity: "",
    notes: ""
  });
  const [showReturnModal, setShowReturnModal] = useState(false);
  const [selectedIssuance, setSelectedIssuance] = useState<InventoryIssuance | null>(null);
  const [returnNotes, setReturnNotes] = useState("");

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
      const [itemsResponse, issuancesResponse] = await Promise.all([
        getInventoryItems(1, 100),
        getAllInventoryIssuances(1, 100)
      ]);
      
      setInventoryItems(itemsResponse.data);
      setIssuances(issuancesResponse.issuances);
    } catch (error) {
      console.error("Error fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleBorrow = async () => {
    if (!selectedItem || !borrowForm.studentId || !borrowForm.quantity) return;

    try {
      await createInventoryIssuance({
        inventoryItemId: selectedItem.id,
        studentId: parseInt(borrowForm.studentId),
        quantityIssued: parseInt(borrowForm.quantity),
        notes: borrowForm.notes
      });

      await fetchData();
      setBorrowForm({ studentId: "", quantity: "", notes: "" });
      setSelectedItem(null);
      setShowBorrowModal(false);
    } catch (error) {
      console.error("Error creating issuance:", error);
    }
  };

  const handleReturn = async () => {
    if (!selectedIssuance) return;

    try {
      await markAsReturned(selectedIssuance.id, returnNotes);
      await fetchData();
      setReturnNotes("");
      setSelectedIssuance(null);
      setShowReturnModal(false);
    } catch (error) {
      console.error("Error marking as returned:", error);
    }
  };

  const filteredItems = inventoryItems.filter(item => {
    const matchesSearch = item.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         (item.description && item.description.toLowerCase().includes(searchTerm.toLowerCase()));
    const matchesCategory = selectedCategory === "all" || !selectedCategory || item.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const activeIssuances = issuances.filter(issuance => issuance.isActive);
  const returnedIssuances = issuances.filter(issuance => !issuance.isActive);

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
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-gray-900">Inventory</h1>
          <p className="text-gray-600">Manage and track inventory items</p>
        </div>
        <Button onClick={() => setShowBorrowModal(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Borrow Item
        </Button>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="borrow">Borrow Items</TabsTrigger>
          <TabsTrigger value="history">History</TabsTrigger>
        </TabsList>

        {/* Borrow Items Tab */}
        <TabsContent value="borrow" className="space-y-6">
          {/* Search and Filter */}
          <div className="flex gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                  <Input
                placeholder="Search items..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
                  />
                </div>
            <Select value={selectedCategory} onValueChange={setSelectedCategory}>
              <SelectTrigger className="w-48">
                <SelectValue placeholder="All Categories" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="all">All Categories</SelectItem>
                <SelectItem value="stationery">Stationery</SelectItem>
                <SelectItem value="electronics">Electronics</SelectItem>
                <SelectItem value="books">Books</SelectItem>
                <SelectItem value="printing">Printing</SelectItem>
              </SelectContent>
            </Select>
                </div>
                
          {/* Items Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {filteredItems.map((item) => (
              <Card 
                key={item.id} 
                className="cursor-pointer hover:shadow-md transition-shadow"
                onClick={() => {
                  setSelectedItem(item);
                  setShowBorrowModal(true);
                }}
              >
                <CardHeader className="pb-3">
                  <div className="flex items-center justify-between">
                    <div className="p-2 bg-gray-100 rounded-lg">
                      <Package className="h-4 w-4 text-gray-600" />
                    </div>
                    <Badge variant={item.isLowStock ? "destructive" : "secondary"}>
                      {item.isLowStock ? "Low Stock" : "In Stock"}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <h3 className="font-medium text-gray-900 mb-2">{item.name}</h3>
                  {item.description && (
                    <p className="text-sm text-gray-600 mb-3">{item.description}</p>
                  )}
                  <div className="space-y-2 text-sm">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Available:</span>
                      <span className="font-medium">{item.quantity} {item.unit || 'units'}</span>
                </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Category:</span>
                      <Badge variant="outline" className="text-xs">
                        {item.category}
                      </Badge>
                </div>
              </div>
                  <div className="mt-3 pt-3 border-t border-gray-100">
                    <div className="flex items-center text-blue-600 text-sm font-medium">
                      <span>Click to borrow</span>
                      <ArrowRight className="h-4 w-4 ml-1" />
              </div>
              </div>
            </CardContent>
          </Card>
            ))}
          </div>

          {filteredItems.length === 0 && (
            <Card>
              <CardContent className="p-8 text-center">
                <Package className="h-8 w-8 text-gray-400 mx-auto mb-2" />
                <p className="text-gray-600">No items found</p>
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
                Active Borrowings ({activeIssuances.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {activeIssuances.length === 0 ? (
                <div className="text-center py-6">
                  <CheckCircle className="h-8 w-8 text-green-500 mx-auto mb-2" />
                  <p className="text-gray-600">No active borrowings</p>
                </div>
              ) : (
                activeIssuances.map((issuance) => (
                  <div key={issuance.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-2">
                          {issuance.item?.name || 'Unknown Item'}
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Student:</span>
                            <p>{issuance.student?.firstName} {issuance.student?.lastName}</p>
                          </div>
                          <div>
                            <span className="font-medium">Quantity:</span>
                            <p>{issuance.quantityIssued} units</p>
                        </div>
                          <div>
                            <span className="font-medium">Borrowed:</span>
                            <p>{new Date(issuance.issuedAt).toLocaleDateString()}</p>
                      </div>
                          <div>
                            <span className="font-medium">Issued by:</span>
                            <p>{issuance.issuedByUser?.firstName} {issuance.issuedByUser?.lastName}</p>
                      </div>
                    </div>
                        {issuance.notes && (
                          <div className="mt-3 p-3 bg-gray-50 rounded text-sm">
                            <span className="font-medium">Notes:</span>
                            <p className="text-gray-600 mt-1">{issuance.notes}</p>
                      </div>
                    )}
                      </div>
                      <Button
                        onClick={() => {
                          setSelectedIssuance(issuance);
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

          {/* Returned Items */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <CheckCircle className="h-5 w-5" />
                Returned Items ({returnedIssuances.length})
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {returnedIssuances.length === 0 ? (
                <div className="text-center py-6">
                  <Info className="h-8 w-8 text-blue-500 mx-auto mb-2" />
                  <p className="text-gray-600">No returned items yet</p>
                </div>
              ) : (
                returnedIssuances.map((issuance) => (
                  <div key={issuance.id} className="border rounded-lg p-4 bg-gray-50">
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <h4 className="font-medium text-gray-900 mb-2">
                          {issuance.item?.name || 'Unknown Item'}
                        </h4>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm text-gray-600">
                          <div>
                            <span className="font-medium">Student:</span>
                            <p>{issuance.student?.firstName} {issuance.student?.lastName}</p>
                          </div>
                          <div>
                            <span className="font-medium">Quantity:</span>
                            <p>{issuance.quantityIssued} units</p>
                          </div>
                          <div>
                            <span className="font-medium">Returned:</span>
                            <p>{issuance.returnedAt ? new Date(issuance.returnedAt).toLocaleDateString() : 'N/A'}</p>
                          </div>
                          <div>
                            <span className="font-medium">Borrowed:</span>
                            <p>{new Date(issuance.issuedAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                        {issuance.returnNotes && (
                          <div className="mt-3 p-3 bg-green-50 rounded text-sm border border-green-200">
                            <span className="font-medium text-green-700">Return Notes:</span>
                            <p className="text-green-600 mt-1">{issuance.returnNotes}</p>
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
            <DialogTitle>Borrow Item</DialogTitle>
          </DialogHeader>
          {selectedItem && (
              <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">{selectedItem.name}</h4>
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="font-medium text-gray-700">Available:</span>
                    <p className="text-gray-600">{selectedItem.quantity} {selectedItem.unit || 'units'}</p>
                  </div>
                  <div>
                    <span className="font-medium text-gray-700">Category:</span>
                    <p className="text-gray-600">{selectedItem.category}</p>
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
                  <Label htmlFor="quantity">Quantity</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    max={selectedItem.quantity}
                    placeholder="Enter quantity"
                    value={borrowForm.quantity}
                    onChange={(e) => setBorrowForm({...borrowForm, quantity: e.target.value})}
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    Maximum available: {selectedItem.quantity} {selectedItem.unit || 'units'}
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
                  disabled={!borrowForm.studentId || !borrowForm.quantity || parseInt(borrowForm.quantity) > selectedItem.quantity}
                >
                  Borrow Item
                </Button>
              </div>
                        </div>
                      )}
        </DialogContent>
      </Dialog>

      {/* Return Modal */}
      <Dialog open={showReturnModal} onOpenChange={setShowReturnModal}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Mark as Returned</DialogTitle>
          </DialogHeader>
          {selectedIssuance && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h4 className="font-medium text-gray-900 mb-2">
                  {selectedIssuance.item?.name || 'Unknown Item'}
                </h4>
                                   <div className="grid grid-cols-2 gap-4 text-sm">
                     <div>
                       <span className="font-medium text-gray-700">Student:</span>
                       <p className="text-gray-600">
                         {selectedIssuance.student?.firstName} {selectedIssuance.student?.lastName}
                       </p>
                        </div>
                  <div>
                    <span className="font-medium text-gray-700">Quantity:</span>
                    <p className="text-gray-600">
                      {selectedIssuance.quantityIssued} units
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
