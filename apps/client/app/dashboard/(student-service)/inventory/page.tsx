"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  Package, 
  Plus, 
  Search, 
  Calendar, 
  AlertTriangle, 
  CheckCircle, 
  Clock,
  FileText,
  PenTool,
  Printer,
  Monitor,
  BookOpen
} from "lucide-react";

interface SupplyRequest {
  id: string;
  itemName: string;
  category: string;
  quantity: number;
  priority: "low" | "medium" | "high" | "urgent";
  status: "pending" | "approved" | "rejected" | "delivered";
  requestedBy: string;
  requestDate: string;
  notes?: string;
  estimatedCost?: number;
  approvedBy?: string;
  approvedDate?: string;
  deliveryDate?: string;
}

const supplyCategories = [
  { id: "stationery", name: "Stationery", icon: PenTool, color: "bg-blue-100 text-blue-800" },
  { id: "paper", name: "Paper & Printing", icon: Printer, color: "bg-green-100 text-green-800" },
  { id: "electronics", name: "Electronics", icon: Monitor, color: "bg-purple-100 text-purple-800" },
  { id: "furniture", name: "Furniture", icon: Package, color: "bg-orange-100 text-orange-800" },
  { id: "books", name: "Books & Manuals", icon: BookOpen, color: "bg-red-100 text-red-800" },
  { id: "other", name: "Other Supplies", icon: FileText, color: "bg-gray-100 text-gray-800" }
];

const commonSupplies = {
  stationery: ["Pens", "Pencils", "Markers", "Highlighters", "Staplers", "Paper Clips", "Sticky Notes", "Tape", "Scissors", "Rulers"],
  paper: ["A4 Paper", "Printer Ink", "Toner Cartridges", "Notebooks", "Folders", "Envelopes", "Labels", "Cardstock"],
  electronics: ["USB Cables", "Power Adapters", "Mouse Pads", "Webcams", "Microphones", "Speakers", "Extension Cords"],
  furniture: ["Desk Chairs", "Filing Cabinets", "Bookshelves", "Desk Organizers", "Whiteboards", "Notice Boards"],
  books: ["Office Manuals", "Reference Books", "Training Materials", "Procedure Guides"],
  other: ["First Aid Kits", "Cleaning Supplies", "Storage Boxes", "Cable Organizers"]
};

const mockRequests: SupplyRequest[] = [
  {
    id: "1",
    itemName: "A4 Paper",
    category: "paper",
    quantity: 50,
    priority: "high",
    status: "pending",
    requestedBy: "John Doe",
    requestDate: "2025-01-15",
    notes: "Running low on paper, need for upcoming exams",
    estimatedCost: 25.00
  },
  {
    id: "2",
    itemName: "Office Chairs",
    category: "furniture",
    quantity: 5,
    priority: "medium",
    status: "approved",
    requestedBy: "Jane Smith",
    requestDate: "2025-01-10",
    notes: "New staff members need proper seating",
    estimatedCost: 750.00,
    approvedBy: "Admin Manager",
    approvedDate: "2025-01-12"
  },
  {
    id: "3",
    itemName: "Printer Ink",
    category: "paper",
    quantity: 10,
    priority: "urgent",
    status: "delivered",
    requestedBy: "Mike Johnson",
    requestDate: "2025-01-05",
    notes: "Printer completely out of ink",
    estimatedCost: 120.00,
    approvedBy: "Admin Manager",
    approvedDate: "2025-01-06",
    deliveryDate: "2025-01-08"
  }
];

export default function InventoryPage() {
  const [activeTab, setActiveTab] = useState("new-request");
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("");
  const [showNewRequestModal, setShowNewRequestModal] = useState(false);
  const [newRequest, setNewRequest] = useState({
    itemName: "",
    category: "",
    quantity: "",
    priority: "medium" as const,
    notes: ""
  });

  const filteredRequests = mockRequests.filter(request => {
    const matchesSearch = request.itemName.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         request.requestedBy.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = !selectedCategory || request.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const handleSubmitRequest = () => {
    if (!newRequest.itemName || !newRequest.category || !newRequest.quantity) return;

    const request: SupplyRequest = {
      id: Date.now().toString(),
      itemName: newRequest.itemName,
      category: newRequest.category,
      quantity: parseInt(newRequest.quantity),
      priority: newRequest.priority,
      status: "pending",
      requestedBy: "John Doe",
      requestDate: new Date().toISOString().split('T')[0],
      notes: newRequest.notes,
      estimatedCost: Math.random() * 100 + 10
    };

    mockRequests.unshift(request);
    
    setNewRequest({
      itemName: "",
      category: "",
      quantity: "",
      priority: "medium",
      notes: ""
    });
    setShowNewRequestModal(false);
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "low": return "bg-gray-100 text-gray-800";
      case "medium": return "bg-blue-100 text-blue-800";
      case "high": return "bg-orange-100 text-orange-800";
      case "urgent": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "pending": return "bg-yellow-100 text-yellow-800";
      case "approved": return "bg-blue-100 text-blue-800";
      case "rejected": return "bg-red-100 text-red-800";
      case "delivered": return "bg-green-100 text-green-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "pending": return <Clock className="h-4 w-4" />;
      case "approved": return <CheckCircle className="h-4 w-4" />;
      case "rejected": return <AlertTriangle className="h-4 w-4" />;
      case "delivered": return <CheckCircle className="h-4 w-4" />;
      default: return <Clock className="h-4 w-4" />;
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Office Supplies Management</h1>
          <p className="text-gray-600">Request and track office supplies for student services</p>
        </div>
        <Button onClick={() => setShowNewRequestModal(true)} className="flex items-center space-x-2">
          <Plus className="h-4 w-4" />
          <span>New Request</span>
        </Button>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="new-request">New Request</TabsTrigger>
          <TabsTrigger value="my-requests">My Requests</TabsTrigger>
          <TabsTrigger value="all-requests">All Requests</TabsTrigger>
          <TabsTrigger value="categories">Categories</TabsTrigger>
        </TabsList>

        <TabsContent value="new-request" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center space-x-2">
                <Package className="h-5 w-5" />
                <span>Request New Supplies</span>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <Label htmlFor="itemName">Item Name *</Label>
                  <Input
                    id="itemName"
                    placeholder="Enter item name"
                    value={newRequest.itemName}
                    onChange={(e) => setNewRequest({ ...newRequest, itemName: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category *</Label>
                  <select
                    id="category"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newRequest.category}
                    onChange={(e) => setNewRequest({ ...newRequest, category: e.target.value })}
                  >
                    <option value="">Select category</option>
                    {supplyCategories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="quantity">Quantity *</Label>
                  <Input
                    id="quantity"
                    type="number"
                    min="1"
                    placeholder="Enter quantity"
                    value={newRequest.quantity}
                    onChange={(e) => setNewRequest({ ...newRequest, quantity: e.target.value })}
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="priority">Priority Level</Label>
                  <select
                    id="priority"
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={newRequest.priority}
                    onChange={(e) => setNewRequest({ ...newRequest, priority: e.target.value as any })}
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="urgent">Urgent</option>
                  </select>
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="notes">Additional Notes</Label>
                <textarea
                  id="notes"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  placeholder="Any additional details about your request..."
                  value={newRequest.notes}
                  onChange={(e) => setNewRequest({ ...newRequest, notes: e.target.value })}
                />
              </div>
              
              <div className="flex justify-end space-x-3">
                <Button
                  onClick={handleSubmitRequest}
                  disabled={!newRequest.itemName || !newRequest.category || !newRequest.quantity}
                  className="px-6"
                >
                  Submit Request
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="my-requests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>My Supply Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {mockRequests.filter(r => r.requestedBy === "John Doe").map((request) => (
                  <div key={request.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium">{request.itemName}</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>Category: {supplyCategories.find(c => c.id === request.category)?.name}</p>
                          <p>Quantity: {request.quantity}</p>
                          <p>Requested: {request.requestDate}</p>
                          {request.notes && <p>Notes: {request.notes}</p>}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className={getPriorityColor(request.priority)}>
                          {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                        </Badge>
                        <Badge className={getStatusColor(request.status)}>
                          {getStatusIcon(request.status)}
                          <span className="ml-1">{request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span>
                        </Badge>
                      </div>
                    </div>
                    
                    {request.status === "approved" && (
                      <div className="border-t pt-3 text-sm text-gray-600">
                        <p>Approved by: {request.approvedBy} on {request.approvedDate}</p>
                        {request.estimatedCost && <p>Estimated cost: ${request.estimatedCost.toFixed(2)}</p>}
                      </div>
                    )}
                    
                    {request.status === "delivered" && (
                      <div className="border-t pt-3 text-sm text-gray-600">
                        <p>Delivered on: {request.deliveryDate}</p>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="all-requests" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>All Supply Requests</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex space-x-4 mb-4">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
                    <Input
                      placeholder="Search requests..."
                      value={searchTerm}
                      onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                  <select
                    className="px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    value={selectedCategory}
                    onChange={(e) => setSelectedCategory(e.target.value)}
                  >
                    <option value="">All Categories</option>
                    {supplyCategories.map(category => (
                      <option key={category.id} value={category.id}>{category.name}</option>
                    ))}
                  </select>
                </div>
                
                <div className="space-y-3">
                  {filteredRequests.map((request) => (
                    <div key={request.id} className="border rounded-lg p-4">
                      <div className="flex items-center justify-between mb-3">
                        <div className="flex-1">
                          <h3 className="font-medium">{request.itemName}</h3>
                          <div className="text-sm text-gray-600 space-y-1">
                            <p>Requested by: {request.requestedBy}</p>
                            <p>Category: {supplyCategories.find(c => c.id === request.category)?.name}</p>
                            <p>Quantity: {request.quantity}</p>
                            <p>Requested: {request.requestDate}</p>
                            {request.notes && <p>Notes: {request.notes}</p>}
                          </div>
                        </div>
                        <div className="flex items-center space-x-2">
                          <Badge className={getPriorityColor(request.priority)}>
                            {request.priority.charAt(0).toUpperCase() + request.priority.slice(1)}
                          </Badge>
                          <Badge className={getStatusColor(request.status)}>
                            {getStatusIcon(request.status)}
                            <span className="ml-1">{request.status.charAt(0).toUpperCase() + request.status.slice(1)}</span>
                          </Badge>
                        </div>
                      </div>
                      
                      {request.status === "approved" && (
                        <div className="border-t pt-3 text-sm text-gray-600">
                          <p>Approved by: {request.approvedBy} on {request.approvedDate}</p>
                          {request.estimatedCost && <p>Estimated cost: ${request.estimatedCost.toFixed(2)}</p>}
                        </div>
                      )}
                      
                      {request.status === "delivered" && (
                        <div className="border-t pt-3 text-sm text-gray-600">
                          <p>Delivered on: {request.deliveryDate}</p>
                        </div>
                      )}
                    </div>
                  ))}
                  
                  {filteredRequests.length === 0 && (
                    <p className="text-center text-gray-500 py-8">
                      {searchTerm || selectedCategory ? "No requests found matching your criteria" : "No requests found"}
                    </p>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="categories" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {supplyCategories.map((category) => {
              const IconComponent = category.icon;
              const categorySupplies = commonSupplies[category.id as keyof typeof commonSupplies] || [];
              
              return (
                <Card key={category.id}>
                  <CardHeader>
                    <CardTitle className="flex items-center space-x-2">
                      <div className={`p-2 rounded-lg ${category.color}`}>
                        <IconComponent className="h-5 w-5" />
                      </div>
                      <span>{category.name}</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-2">
                      {categorySupplies.map((supply, index) => (
                        <div key={index} className="text-sm text-gray-600 flex items-center space-x-2">
                          <Package className="h-3 w-3 text-gray-400" />
                          <span>{supply}</span>
                        </div>
                      ))}
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
