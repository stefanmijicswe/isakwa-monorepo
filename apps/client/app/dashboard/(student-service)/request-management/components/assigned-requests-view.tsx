"use client"

import * as React from "react"
import { AlertTriangle, CheckCircle2, Users } from "lucide-react"
import { Card, CardContent } from "@/components/ui/card"
import { StudentRequest } from "@/lib/requests.service"
import { RequestServiceCard } from "./request-service-card"

interface AssignedRequestsViewProps {
  requests: StudentRequest[]
  onSelect: (id: number) => void
  onUpdate: () => void
}

export function AssignedRequestsView({ requests, onSelect, onUpdate }: AssignedRequestsViewProps) {
  const urgentRequests = requests.filter(r => 
    r.type === 'COMPLAINT' || 
    (r.dueDate && new Date(r.dueDate) < new Date()) ||
    r.priority === 'HIGH' || 
    r.priority === 'URGENT'
  )

  const normalRequests = requests.filter(r => !urgentRequests.includes(r))

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <Users className="h-8 w-8 text-slate-400 mx-auto mb-3" />
          <h3 className="font-medium text-slate-900 mb-1">No assigned requests</h3>
          <p className="text-sm text-slate-600">
            You don&apos;t have any requests assigned to you at the moment.
          </p>
        </CardContent>
      </Card>
    )
  }

  return (
    <div className="space-y-6">
      {/* Urgent Requests */}
      {urgentRequests.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <AlertTriangle className="h-5 w-5 text-red-600" />
            <h3 className="font-medium text-slate-900">
              Urgent Attention Required ({urgentRequests.length})
            </h3>
          </div>
          <div className="space-y-3">
            {urgentRequests.map((request) => (
              <RequestServiceCard
                key={request.id}
                request={request}
                onSelect={onSelect}
                onUpdate={onUpdate}
              />
            ))}
          </div>
        </div>
      )}

      {/* Normal Requests */}
      {normalRequests.length > 0 && (
        <div>
          <div className="flex items-center gap-2 mb-4">
            <CheckCircle2 className="h-5 w-5 text-blue-600" />
            <h3 className="font-medium text-slate-900">
              Regular Requests ({normalRequests.length})
            </h3>
          </div>
          <div className="space-y-3">
            {normalRequests.map((request) => (
              <RequestServiceCard
                key={request.id}
                request={request}
                onSelect={onSelect}
                onUpdate={onUpdate}
              />
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
