"use client"

import * as React from "react"
import { 
  Users, 
  Clock, 
  AlertTriangle, 
  Search, 
  Filter, 
  Eye, 
  UserCheck,
  AlertCircle,
  Loader2
} from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Card, CardContent } from "@/components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { requestsService, StudentRequest, RequestsResponse } from "@/lib/requests.service"
import { useAuth } from "@/components/auth"
import { RequestServiceCard } from "./components/request-service-card"
import { RequestDetailsServiceModal } from "./components/request-details-service-modal"
import { AssignedRequestsView } from "./components/assigned-requests-view"

export default function StudentServiceRequestsPage() {
  const { user } = useAuth()
  const [allRequests, setAllRequests] = React.useState<StudentRequest[]>([])
  const [assignedRequests, setAssignedRequests] = React.useState<StudentRequest[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [filterStatus, setFilterStatus] = React.useState<string>("ALL")
  const [filterCategory, setFilterCategory] = React.useState<string>("ALL")
  const [selectedRequestId, setSelectedRequestId] = React.useState<number | null>(null)
  const [activeTab, setActiveTab] = React.useState("all")
  const [pagination, setPagination] = React.useState({
    page: 1,
    total: 0,
    pages: 0
  })

  const fetchAllRequests = React.useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      const response: RequestsResponse = await requestsService.getRequests(pagination.page, 20)
      setAllRequests(response.requests)
      setPagination({
        page: response.pagination.page,
        total: response.pagination.total,
        pages: response.pagination.pages
      })
    } catch (err) {
      console.error('Failed to fetch all requests:', err)
      setError(err instanceof Error ? err.message : 'Failed to load requests')
    } finally {
      setIsLoading(false)
    }
  }, [pagination.page])

  const fetchAssignedRequests = React.useCallback(async () => {
    try {
      const response = await requestsService.getAssignedRequests()
      setAssignedRequests(response.requests)
    } catch (err) {
      console.error('Failed to fetch assigned requests:', err)
    }
  }, [])

  React.useEffect(() => {
    fetchAllRequests()
    fetchAssignedRequests()
  }, [fetchAllRequests, fetchAssignedRequests])

  const handleRequestUpdate = async () => {
    await fetchAllRequests()
    await fetchAssignedRequests()
  }

  const filteredRequests = React.useMemo(() => {
    const requests = activeTab === "assigned" ? assignedRequests : allRequests
    
    return requests.filter(request => {
      const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           request.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           request.student?.firstName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           request.student?.lastName?.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesStatus = filterStatus === "ALL" || request.status === filterStatus
      const matchesCategory = filterCategory === "ALL" || request.category === filterCategory
      return matchesSearch && matchesStatus && matchesCategory
    })
  }, [activeTab, allRequests, assignedRequests, searchTerm, filterStatus, filterCategory])

  const stats = React.useMemo(() => {
    return {
      total: allRequests.length,
      pending: allRequests.filter(r => r.status === 'PENDING').length,
      inReview: allRequests.filter(r => r.status === 'IN_REVIEW').length,
      myAssigned: assignedRequests.length,
      overdue: allRequests.filter(r => r.dueDate && new Date(r.dueDate) < new Date()).length,
      complaints: allRequests.filter(r => r.type === 'COMPLAINT').length
    }
  }, [allRequests, assignedRequests])

  if (isLoading) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Request Management</h1>
            <p className="text-slate-600">Manage student requests and complaints</p>
          </div>
        </div>
        
        <div className="flex items-center justify-center py-12">
          <div className="flex items-center space-x-2">
            <Loader2 className="h-5 w-5 animate-spin text-slate-600" />
            <span className="text-slate-600">Loading requests...</span>
          </div>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">Request Management</h1>
            <p className="text-slate-600">Manage student requests and complaints</p>
          </div>
        </div>
        
        <div className="bg-red-50 border border-red-200 rounded-lg p-4">
          <div className="flex items-center space-x-2">
            <AlertCircle className="h-4 w-4 text-red-600" />
            <span className="text-red-800 text-sm">Failed to load requests</span>
          </div>
          <p className="text-red-700 text-sm mt-1">{error}</p>
          <Button 
            variant="outline" 
            size="sm" 
            className="mt-3"
            onClick={fetchAllRequests}
          >
            Try again
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Request Management</h1>
          <p className="text-slate-600">Manage student requests and complaints</p>
        </div>
        <div className="text-sm text-slate-500">
          Welcome, {user?.firstName} {user?.lastName}
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-6 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Users className="h-4 w-4 text-slate-600" />
              <div>
                <div className="text-2xl font-semibold text-slate-900">{stats.total}</div>
                <div className="text-sm text-slate-600">Total Requests</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <div>
                <div className="text-2xl font-semibold text-yellow-600">{stats.pending}</div>
                <div className="text-sm text-slate-600">Pending</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <Eye className="h-4 w-4 text-blue-600" />
              <div>
                <div className="text-2xl font-semibold text-blue-600">{stats.inReview}</div>
                <div className="text-sm text-slate-600">In Review</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <UserCheck className="h-4 w-4 text-green-600" />
              <div>
                <div className="text-2xl font-semibold text-green-600">{stats.myAssigned}</div>
                <div className="text-sm text-slate-600">Assigned to Me</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertTriangle className="h-4 w-4 text-red-600" />
              <div>
                <div className="text-2xl font-semibold text-red-600">{stats.overdue}</div>
                <div className="text-sm text-slate-600">Overdue</div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2">
              <AlertCircle className="h-4 w-4 text-orange-600" />
              <div>
                <div className="text-2xl font-semibold text-orange-600">{stats.complaints}</div>
                <div className="text-sm text-slate-600">Complaints</div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="all">All Requests ({stats.total})</TabsTrigger>
          <TabsTrigger value="assigned">My Assigned ({stats.myAssigned})</TabsTrigger>
        </TabsList>

        {/* Search and Filter */}
        <div className="flex items-center gap-4 mt-6">
          <div className="relative flex-1 max-w-sm">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              placeholder="Search requests or students..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter className="h-4 w-4 text-slate-600" />
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Status</option>
              <option value="PENDING">Pending</option>
              <option value="IN_REVIEW">In Review</option>
              <option value="APPROVED">Approved</option>
              <option value="REJECTED">Rejected</option>
            </select>
            
            <select
              value={filterCategory}
              onChange={(e) => setFilterCategory(e.target.value)}
              className="px-3 py-2 border border-slate-200 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ALL">All Categories</option>
              <option value="ACADEMIC">Academic</option>
              <option value="ADMINISTRATIVE">Administrative</option>
              <option value="FINANCIAL">Financial</option>
              <option value="DISCIPLINARY">Disciplinary</option>
              <option value="TECHNICAL">Technical</option>
              <option value="OTHER">Other</option>
            </select>
          </div>
        </div>

        <TabsContent value="all" className="space-y-4">
          {filteredRequests.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <Users className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                <h3 className="font-medium text-slate-900 mb-1">No requests found</h3>
                <p className="text-sm text-slate-600">
                  {allRequests.length === 0 
                    ? "No requests have been submitted yet."
                    : "Try adjusting your search or filter criteria."
                  }
                </p>
              </CardContent>
            </Card>
          ) : (
            filteredRequests.map((request) => (
              <RequestServiceCard 
                key={request.id} 
                request={request} 
                onSelect={setSelectedRequestId}
                onUpdate={handleRequestUpdate}
              />
            ))
          )}
        </TabsContent>

        <TabsContent value="assigned">
          <AssignedRequestsView 
            requests={filteredRequests}
            onSelect={setSelectedRequestId}
            onUpdate={handleRequestUpdate}
          />
        </TabsContent>
      </Tabs>

      {/* Request Details Modal */}
      {selectedRequestId && (
        <RequestDetailsServiceModal
          requestId={selectedRequestId}
          isOpen={!!selectedRequestId}
          onClose={() => setSelectedRequestId(null)}
          onUpdate={handleRequestUpdate}
        />
      )}
    </div>
  )
}
