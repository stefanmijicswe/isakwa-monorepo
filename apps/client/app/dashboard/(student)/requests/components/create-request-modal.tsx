"use client"

import * as React from "react"
import { X, Send, AlertCircle } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { requestsService, CreateRequestDto } from "@/lib/requests.service"

interface CreateRequestModalProps {
  isOpen: boolean
  onClose: () => void
  onSuccess: () => void
}

export function CreateRequestModal({ isOpen, onClose, onSuccess }: CreateRequestModalProps) {
  const [formData, setFormData] = React.useState<CreateRequestDto>({
    type: 'REQUEST',
    title: '',
    description: '',
    category: 'OTHER',
    priority: 'NORMAL'
  })
  const [isSubmitting, setIsSubmitting] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!formData.title.trim() || !formData.description.trim()) {
      setError('Title and description are required')
      return
    }

    try {
      setIsSubmitting(true)
      setError(null)
      
      await requestsService.createRequest(formData)
      
      // Reset form
      setFormData({
        type: 'REQUEST',
        title: '',
        description: '',
        category: 'OTHER',
        priority: 'NORMAL'
      })
      
      onSuccess()
    } catch (err) {
      console.error('Failed to create request:', err)
      setError(err instanceof Error ? err.message : 'Failed to create request')
    } finally {
      setIsSubmitting(false)
    }
  }

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-lg shadow-lg w-full max-w-lg">
        {/* Header */}
        <div className="flex items-center justify-between p-6 border-b border-slate-200">
          <h2 className="text-lg font-semibold text-slate-900">New Request</h2>
          <Button variant="ghost" size="sm" onClick={onClose}>
            <X className="h-4 w-4" />
          </Button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4">
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-lg p-3">
              <div className="flex items-center space-x-2">
                <AlertCircle className="h-4 w-4 text-red-600" />
                <span className="text-red-800 text-sm">{error}</span>
              </div>
            </div>
          )}

          {/* Type */}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'REQUEST' }))}
                className={`p-3 text-sm border rounded-lg transition-colors ${
                  formData.type === 'REQUEST'
                    ? 'border-blue-200 bg-blue-50 text-blue-700'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                📋 Request
              </button>
              <button
                type="button"
                onClick={() => setFormData(prev => ({ ...prev, type: 'COMPLAINT' }))}
                className={`p-3 text-sm border rounded-lg transition-colors ${
                  formData.type === 'COMPLAINT'
                    ? 'border-red-200 bg-red-50 text-red-700'
                    : 'border-slate-200 hover:border-slate-300'
                }`}
              >
                ⚠️ Complaint
              </button>
            </div>
          </div>

          {/* Category */}
          <div>
            <label htmlFor="category" className="block text-sm font-medium text-slate-700 mb-2">
              Category
            </label>
            <select
              id="category"
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value as CreateRequestDto['category'] }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="ACADEMIC">📚 Academic</option>
              <option value="ADMINISTRATIVE">📋 Administrative</option>
              <option value="FINANCIAL">💰 Financial</option>
              <option value="DISCIPLINARY">⚖️ Disciplinary</option>
              <option value="TECHNICAL">🔧 Technical</option>
              <option value="OTHER">📄 Other</option>
            </select>
          </div>

          {/* Title */}
          <div>
            <label htmlFor="title" className="block text-sm font-medium text-slate-700 mb-2">
              Title
            </label>
            <Input
              id="title"
              placeholder="Brief description of your request..."
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              required
            />
          </div>

          {/* Description */}
          <div>
            <label htmlFor="description" className="block text-sm font-medium text-slate-700 mb-2">
              Description
            </label>
            <Textarea
              id="description"
              placeholder="Please provide detailed information about your request..."
              rows={4}
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              required
            />
          </div>

          {/* Priority */}
          <div>
            <label htmlFor="priority" className="block text-sm font-medium text-slate-700 mb-2">
              Priority
            </label>
            <select
              id="priority"
              value={formData.priority}
              onChange={(e) => setFormData(prev => ({ ...prev, priority: e.target.value as CreateRequestDto['priority'] }))}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="LOW">Low</option>
              <option value="NORMAL">Normal</option>
              <option value="HIGH">High</option>
              <option value="URGENT">Urgent</option>
            </select>
          </div>

          {/* Actions */}
          <div className="flex items-center justify-end gap-3 pt-4">
            <Button type="button" variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button type="submit" disabled={isSubmitting} className="gap-2">
              {isSubmitting ? (
                <>
                  <div className="h-4 w-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                  Submitting...
                </>
              ) : (
                <>
                  <Send className="h-4 w-4" />
                  Submit Request
                </>
              )}
            </Button>
          </div>
        </form>
      </div>
    </div>
  )
}
