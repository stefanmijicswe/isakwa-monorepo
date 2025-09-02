"use client"

import * as React from "react"
import { Plus, FileText, Search, Filter, AlertCircle, Loader2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { requestsService, StudentRequest, RequestsResponse } from "@/lib/requests.service"
import { useAuth } from "@/components/auth"
import { CreateRequestModal } from "./components/create-request-modal"
import { RequestCard } from "./components/request-card"

export default function RequestsPage() {
  const { user, isAuthenticated } = useAuth()
  const [requests, setRequests] = React.useState<StudentRequest[]>([])
  const [isLoading, setIsLoading] = React.useState(true)
  const [error, setError] = React.useState<string | null>(null)
  const [searchTerm, setSearchTerm] = React.useState("")
  const [filterStatus, setFilterStatus] = React.useState<string>("ALL")
  const [isCreateModalOpen, setIsCreateModalOpen] = React.useState(false)
  const [pagination, setPagination] = React.useState({
    page: 1,
    total: 0,
    pages: 0
  })

  const fetchRequests = React.useCallback(async () => {
    try {
      setIsLoading(true)
      setError(null)
      
      // Debug auth state
      const token = localStorage.getItem('auth_token')
      console.log('Requests page debug:', {
        isAuthenticated,
        hasUser: !!user,
        hasToken: !!token,
        tokenLength: token?.length,
        userId: user?.id
      })
      
      const response: RequestsResponse = await requestsService.getRequests(pagination.page)
      setRequests(response.requests)
      setPagination({
        page: response.pagination.page,
        total: response.pagination.total,
        pages: response.pagination.pages
      })
    } catch (err) {
      console.error('Failed to fetch requests:', err)
      setError(err instanceof Error ? err.message : 'Failed to load requests')
    } finally {
      setIsLoading(false)
    }
  }, [pagination.page, isAuthenticated, user])

  React.useEffect(() => {
    fetchRequests()
  }, [fetchRequests])

  const handleCreateRequest = async () => {
    await fetchRequests()
    setIsCreateModalOpen(false)
  }

  const filteredRequests = React.useMemo(() => {
    return requests.filter(request => {
      const matchesSearch = request.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                           request.description.toLowerCase().includes(searchTerm.toLowerCase())
      const matchesFilter = filterStatus === "ALL" || request.status === filterStatus
      return matchesSearch && matchesFilter
    })
  }, [requests, searchTerm, filterStatus])

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Temporary Auth Debug Panel */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-medium text-yellow-800 mb-2">🔧 Auth Debug Info</h3>
          <div className="text-sm text-yellow-700 space-y-1">
            <div>Auth: {isAuthenticated ? '✅ Authenticated' : '❌ Not authenticated'}</div>
            <div>User: {user ? `✅ ${user.firstName} ${user.lastName}` : '❌ No user'}</div>
            <div>Token: {typeof window !== 'undefined' && localStorage.getItem('auth_token') ? '✅ Present' : '❌ Missing'}</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">My Requests</h1>
            <p className="text-slate-600">Submit and track your requests and complaints</p>
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
        {/* Temporary Auth Debug Panel */}
        <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
          <h3 className="font-medium text-yellow-800 mb-2">🔧 Auth Debug Info</h3>
          <div className="text-sm text-yellow-700 space-y-1">
            <div>Auth: {isAuthenticated ? '✅ Authenticated' : '❌ Not authenticated'}</div>
            <div>User: {user ? `✅ ${user.firstName} ${user.lastName}` : '❌ No user'}</div>
            <div>Token: {typeof window !== 'undefined' && localStorage.getItem('auth_token') ? '✅ Present' : '❌ Missing'}</div>
          </div>
        </div>
        
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-semibold text-slate-900">My Requests</h1>
            <p className="text-slate-600">Submit and track your requests and complaints</p>
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
            onClick={fetchRequests}
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
          <h1 className="text-2xl font-semibold text-slate-900">My Requests</h1>
          <p className="text-slate-600">Submit and track your requests and complaints</p>
        </div>
        <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          New Request
        </Button>
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-4 gap-4">
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="text-2xl font-semibold text-slate-900">{requests.length}</div>
          <div className="text-sm text-slate-600">Total Requests</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="text-2xl font-semibold text-yellow-600">
            {requests.filter(r => r.status === 'PENDING').length}
          </div>
          <div className="text-sm text-slate-600">Pending</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="text-2xl font-semibold text-blue-600">
            {requests.filter(r => r.status === 'IN_REVIEW').length}
          </div>
          <div className="text-sm text-slate-600">In Review</div>
        </div>
        <div className="bg-white p-4 rounded-lg border border-slate-200">
          <div className="text-2xl font-semibold text-green-600">
            {requests.filter(r => r.status === 'APPROVED').length}
          </div>
          <div className="text-sm text-slate-600">Resolved</div>
        </div>
      </div>

      {/* Search and Filter */}
      <div className="flex items-center gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            placeholder="Search requests..."
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
        </div>
      </div>

      {/* Requests List */}
      <div className="space-y-4">
        {filteredRequests.length === 0 ? (
          <div className="bg-white rounded-lg border border-slate-200 p-8 text-center">
            <FileText className="h-8 w-8 text-slate-400 mx-auto mb-3" />
            <h3 className="font-medium text-slate-900 mb-1">
              {requests.length === 0 ? "No requests yet" : "No matching requests"}
            </h3>
            <p className="text-sm text-slate-600 mb-4">
              {requests.length === 0 
                ? "Submit your first request or complaint to get started."
                : "Try adjusting your search or filter criteria."
              }
            </p>
            {requests.length === 0 && (
              <Button onClick={() => setIsCreateModalOpen(true)} className="gap-2">
                <Plus className="h-4 w-4" />
                Create your first request
              </Button>
            )}
          </div>
        ) : (
          filteredRequests.map((request) => (
            <RequestCard key={request.id} request={request} />
          ))
        )}
      </div>

      {/* Pagination */}
      {pagination.pages > 1 && (
        <div className="flex items-center justify-center gap-2">
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPagination(prev => ({ ...prev, page: Math.max(1, prev.page - 1) }))}
            disabled={pagination.page === 1}
          >
            Previous
          </Button>
          <span className="text-sm text-slate-600">
            Page {pagination.page} of {pagination.pages}
          </span>
          <Button
            variant="outline"
            size="sm"
            onClick={() => setPagination(prev => ({ ...prev, page: Math.min(prev.pages, prev.page + 1) }))}
            disabled={pagination.page === pagination.pages}
          >
            Next
          </Button>
        </div>
      )}

      {/* Create Request Modal */}
      <CreateRequestModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
        onSuccess={handleCreateRequest}
      />
    </div>
  )
}
