"use client"

import * as React from "react"
import { 
  Plus, 
  Edit3, 
  Trash2, 
  Download, 
  Upload, 
  FileText, 
  Users, 
  BarChart3,
  CheckCircle,
  Clock,
  AlertCircle
} from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Textarea } from "@/components/ui/textarea"
import { evaluationInstrumentsService, type EvaluationInstrument as ServiceEvaluationInstrument, type CreateEvaluationInstrumentData } from "@/lib/evaluation-instruments.service"

export default function EvaluationInstrumentsPage() {
  const [showCreateModal, setShowCreateModal] = React.useState(false)
  const [showImportModal, setShowImportModal] = React.useState(false)
  const [activeTab, setActiveTab] = React.useState("instruments")
  const [editingInstrument, setEditingInstrument] = React.useState<ServiceEvaluationInstrument | null>(null)
  
  // Data state
  const [instruments, setInstruments] = React.useState<ServiceEvaluationInstrument[]>([])
  const [subjects, setSubjects] = React.useState<any[]>([])
  const [submissions, setSubmissions] = React.useState<any[]>([])
  
  // Loading states
  const [loading, setLoading] = React.useState(true)
  const [creating, setCreating] = React.useState(false)
  const [updating, setUpdating] = React.useState(false)
  const [deleting, setDeleting] = React.useState<number | null>(null)
  const [importing, setImporting] = React.useState(false)
  const [exporting, setExporting] = React.useState<number | null>(null)
  
  // Form state
  const [formData, setFormData] = React.useState<CreateEvaluationInstrumentData>({
    subjectId: 0,
    title: '',
    description: '',
    type: 'EXAM',
    maxPoints: 100,
    dueDate: '',
    isActive: true
  })
  const [xmlContent, setXmlContent] = React.useState('')
  const [error, setError] = React.useState<string | null>(null)

  // Load data on component mount
  React.useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      const [instrumentsData, subjectsData, submissionsData] = await Promise.all([
        evaluationInstrumentsService.getEvaluationInstruments(),
        evaluationInstrumentsService.getProfessorSubjects(),
        evaluationInstrumentsService.getEvaluationSubmissions()
      ])
      setInstruments(instrumentsData)
      setSubjects(subjectsData)
      setSubmissions(submissionsData.slice(0, 10)) // Last 10 submissions
    } catch (err: any) {
      console.error('Failed to load data:', err)
      setError(err.message || 'Failed to load data')
    } finally {
      setLoading(false)
    }
  }

  const resetForm = () => {
    setFormData({
      subjectId: 0,
      title: '',
      description: '',
      type: 'EXAM',
      maxPoints: 100,
      dueDate: '',
      isActive: true
    })
    setEditingInstrument(null)
    setError(null)
  }

  const handleCreate = async () => {
    if (!formData.title || !formData.subjectId) {
      setError('Title and Subject are required')
      return
    }

    try {
      setCreating(true)
      setError(null)
      const newInstrument = await evaluationInstrumentsService.createEvaluationInstrument(formData)
      setInstruments(prev => [newInstrument, ...prev])
      setShowCreateModal(false)
      resetForm()
    } catch (err: any) {
      console.error('Failed to create instrument:', err)
      setError(err.message || 'Failed to create instrument')
    } finally {
      setCreating(false)
    }
  }

  const handleEdit = async () => {
    if (!editingInstrument) return

    try {
      setUpdating(true)
      setError(null)
      const updatedInstrument = await evaluationInstrumentsService.updateEvaluationInstrument(
        editingInstrument.id,
        formData
      )
      setInstruments(prev => prev.map(inst => 
        inst.id === editingInstrument.id ? updatedInstrument : inst
      ))
      setShowCreateModal(false)
      resetForm()
    } catch (err: any) {
      console.error('Failed to update instrument:', err)
      setError(err.message || 'Failed to update instrument')
    } finally {
      setUpdating(false)
    }
  }

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this instrument?')) return

    try {
      setDeleting(id)
      await evaluationInstrumentsService.deleteEvaluationInstrument(id)
      setInstruments(prev => prev.filter(inst => inst.id !== id))
    } catch (err: any) {
      console.error('Failed to delete instrument:', err)
      setError(err.message || 'Failed to delete instrument')
    } finally {
      setDeleting(null)
    }
  }

  const handleExport = async (id: number, format: 'xml' | 'pdf') => {
    try {
      setExporting(id)
      if (format === 'xml') {
        await evaluationInstrumentsService.exportToXML(id)
      } else {
        await evaluationInstrumentsService.exportToPDF(id)
      }
    } catch (err: any) {
      console.error('Failed to export:', err)
      setError(err.message || 'Failed to export')
    } finally {
      setExporting(null)
    }
  }

  const handleImport = async () => {
    if (!xmlContent.trim()) {
      setError('Please provide XML content')
      return
    }

    try {
      setImporting(true)
      setError(null)
      await evaluationInstrumentsService.importFromXML(xmlContent)
      setShowImportModal(false)
      setXmlContent('')
      loadData() // Reload data after import
    } catch (err: any) {
      console.error('Failed to import:', err)
      setError(err.message || 'Failed to import XML')
    } finally {
      setImporting(false)
    }
  }

  const openEditModal = (instrument: ServiceEvaluationInstrument) => {
    setEditingInstrument(instrument)
    setFormData({
      subjectId: instrument.subjectId,
      title: instrument.title,
      description: instrument.description || '',
      type: instrument.type,
      maxPoints: instrument.maxPoints,
      dueDate: instrument.dueDate ? instrument.dueDate.split('T')[0] : '',
      isActive: instrument.isActive
    })
    setShowCreateModal(true)
  }

  const getTypeColor = (type: string) => {
    switch (type) {
      case "EXAM": return "bg-red-100 text-red-800"
      case "TEST": return "bg-blue-100 text-blue-800"
      case "QUIZ": return "bg-green-100 text-green-800"
      case "PROJECT": return "bg-purple-100 text-purple-800"
      default: return "bg-slate-100 text-slate-800"
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case "PUBLISHED": return "bg-green-100 text-green-800"
      case "COMPLETED": return "bg-blue-100 text-blue-800"
      case "DRAFT": return "bg-yellow-100 text-yellow-800"
      default: return "bg-slate-100 text-slate-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "PUBLISHED": return <CheckCircle className="h-4 w-4" />
      case "COMPLETED": return <CheckCircle className="h-4 w-4" />
      case "DRAFT": return <Clock className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }



  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Evaluation Instruments</h1>
          <p className="text-slate-600">Create and manage tests, exams, quizzes, and project assessments</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={() => setShowImportModal(true)} className="gap-2">
            <Upload className="h-4 w-4" />
            Import XML
          </Button>
          <Button onClick={() => {resetForm(); setShowCreateModal(true)}} className="gap-2">
            <Plus className="h-4 w-4" />
            Create Instrument
          </Button>
        </div>
      </div>

      {/* Error Message */}
      {error && (
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-4">
            <div className="flex items-center gap-2 text-red-600">
              <AlertCircle className="h-4 w-4" />
              <span>{error}</span>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Tabs */}
      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="instruments">Instruments ({instruments.length})</TabsTrigger>
          <TabsTrigger value="submissions">Recent Submissions ({submissions.length})</TabsTrigger>
        </TabsList>

        {/* Instruments Tab */}
        <TabsContent value="instruments" className="space-y-4">
          {loading ? (
            <Card>
              <CardContent className="p-8 text-center">
                <div className="flex items-center justify-center">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                  <span className="ml-3 text-slate-600">Loading instruments...</span>
                </div>
              </CardContent>
            </Card>
          ) : instruments.length === 0 ? (
            <Card>
              <CardContent className="p-8 text-center">
                <FileText className="h-8 w-8 text-slate-400 mx-auto mb-3" />
                <h3 className="font-medium text-slate-900 mb-1">No instruments created</h3>
                <p className="text-sm text-slate-600">Create your first evaluation instrument to get started.</p>
                <Button className="mt-4" onClick={() => setShowCreateModal(true)}>
                  <Plus className="h-4 w-4 mr-2" />
                  Create Instrument
                </Button>
              </CardContent>
            </Card>
          ) : (
            instruments.map((instrument) => (
              <Card key={instrument.id} className="hover:shadow-sm transition-shadow">
                <CardContent className="p-6">
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      {/* Badges */}
                      <div className="flex items-center gap-2 mb-3">
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${getTypeColor(instrument.type)}`}>
                          {instrument.type}
                        </span>
                        <span className={`px-2 py-1 text-xs font-medium rounded-full ${instrument.isActive ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}`}>
                          <span className="flex items-center gap-1">
                            {instrument.isActive ? <CheckCircle className="h-4 w-4" /> : <Clock className="h-4 w-4" />}
                            {instrument.isActive ? 'Active' : 'Inactive'}
                          </span>
                        </span>
                        {instrument.subject && (
                          <span className="font-mono text-xs text-slate-600 bg-slate-100 px-2 py-1 rounded">
                            {instrument.subject.code}
                          </span>
                        )}
                      </div>
                      
                      {/* Title and Subject */}
                      <h3 className="font-semibold text-slate-900 mb-1">{instrument.title}</h3>
                      <p className="text-sm text-slate-600 mb-4">{instrument.subject?.name || 'Unknown Subject'}</p>
                      {instrument.description && (
                        <p className="text-sm text-slate-500 mb-4">{instrument.description}</p>
                      )}
                      
                      {/* Metadata Grid */}
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <BarChart3 className="h-4 w-4" />
                          <span>Points: {instrument.maxPoints}</span>
                        </div>
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <FileText className="h-4 w-4" />
                          <span>Questions: {instrument.questions}</span>
                        </div>
                        {instrument.duration && (
                          <div className="flex items-center gap-2 text-sm text-slate-600">
                            <Clock className="h-4 w-4" />
                            <span>Duration: {instrument.duration}min</span>
                          </div>
                        )}
                        <div className="flex items-center gap-2 text-sm text-slate-600">
                          <Users className="h-4 w-4" />
                          <span>Submissions: {instrument.submissions}</span>
                        </div>
                      </div>

                      {/* Progress Bar for Published/Completed */}
                      {instrument.averageScore && (
                        <div className="mb-4">
                          <div className="flex items-center justify-between text-sm mb-2">
                            <span className="text-slate-600">Average Score</span>
                            <span className="font-semibold">{instrument.averageScore}%</span>
                          </div>
                          <div className="w-full bg-slate-200 rounded-full h-2">
                            <div 
                              className="h-2 rounded-full bg-blue-500 transition-all duration-300"
                              style={{ width: `${instrument.averageScore}%` }}
                            />
                          </div>
                        </div>
                      )}
                    </div>
                    
                    {/* Action Buttons */}
                    <div className="flex flex-col gap-2 ml-6">
                      <Button 
                        variant="outline"
                        size="sm"
                        className="gap-2"
                        onClick={() => openEditModal(instrument)}
                        disabled={updating}
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-blue-600 border-blue-600 hover:bg-blue-50 gap-2 flex-1"
                        onClick={() => handleExport(instrument.id, 'xml')}
                        disabled={exporting === instrument.id}
                      >
                        <Download className="h-4 w-4" />
                        XML
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-green-600 border-green-600 hover:bg-green-50 gap-2 flex-1"
                        onClick={() => handleExport(instrument.id, 'pdf')}
                        disabled={exporting === instrument.id}
                      >
                        <Download className="h-4 w-4" />
                        PDF
                      </Button>
                      <Button 
                        variant="outline" 
                        size="sm"
                        className="text-red-600 border-red-600 hover:bg-red-50 gap-2"
                        onClick={() => handleDelete(instrument.id)}
                        disabled={deleting === instrument.id}
                      >
                        <Trash2 className="h-4 w-4" />
                        {deleting === instrument.id ? 'Deleting...' : 'Delete'}
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))
          )}
        </TabsContent>

        {/* Submissions Tab */}
        <TabsContent value="submissions">
          <Card>
            <CardHeader>
              <CardTitle>Recent Submissions</CardTitle>
              <p className="text-sm text-slate-600">Latest student submissions across all instruments</p>
            </CardHeader>
            <CardContent>
              <div className="space-y-3">
                {submissions.map((submission) => (
                  <div key={submission.id} className="flex items-center justify-between p-4 border border-slate-200 rounded-lg">
                    <div className="flex items-center gap-4">
                      <div>
                        <h4 className="font-medium text-slate-900">
                          {submission.student ? `${submission.student.firstName} ${submission.student.lastName}` : 'Unknown Student'}
                        </h4>
                        <p className="text-sm text-slate-600">{submission.student?.email || 'No email'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-4">
                      <div className="text-right">
                        <div className="font-semibold text-slate-900">
                          {submission.points || 0} pts
                        </div>
                        <div className="text-sm text-slate-600">
                          {submission.grade ? `Grade: ${submission.grade}` : 'Not graded'}
                        </div>
                      </div>
                      <span className={`px-2 py-1 text-xs font-medium rounded-full ${
                        submission.gradedAt ? 'bg-green-100 text-green-800' :
                        submission.submittedAt ? 'bg-yellow-100 text-yellow-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {submission.gradedAt ? 'Graded' : submission.submittedAt ? 'Submitted' : 'Draft'}
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Create/Edit Modal */}
      <Dialog open={showCreateModal} onOpenChange={setShowCreateModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>
              {editingInstrument ? 'Edit Evaluation Instrument' : 'Create Evaluation Instrument'}
            </DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="title">Instrument Title</Label>
                <Input
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
                  placeholder="e.g., Midterm Exam"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="type">Type</Label>
                <Select 
                  value={formData.type} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, type: value as any }))}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="EXAM">Exam</SelectItem>
                    <SelectItem value="PROJECT">Project</SelectItem>
                    <SelectItem value="QUIZ">Quiz</SelectItem>
                    <SelectItem value="ASSIGNMENT">Assignment</SelectItem>
                    <SelectItem value="HOMEWORK">Homework</SelectItem>
                    <SelectItem value="LAB_EXERCISE">Lab Exercise</SelectItem>
                    <SelectItem value="PRESENTATION">Presentation</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="subject">Subject</Label>
                <Select 
                  value={formData.subjectId.toString()} 
                  onValueChange={(value) => setFormData(prev => ({ ...prev, subjectId: parseInt(value) }))}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select subject" />
                  </SelectTrigger>
                  <SelectContent>
                    {subjects.map(subject => (
                      <SelectItem key={subject.id} value={subject.id.toString()}>
                        {subject.code} - {subject.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="maxPoints">Maximum Points</Label>
                <Input
                  id="maxPoints"
                  type="number"
                  value={formData.maxPoints}
                  onChange={(e) => setFormData(prev => ({ ...prev, maxPoints: parseInt(e.target.value) || 0 }))}
                  placeholder="100"
                  min="1"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date (Optional)</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={formData.dueDate}
                  onChange={(e) => setFormData(prev => ({ ...prev, dueDate: e.target.value }))}
                />
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="description">Description (Optional)</Label>
              <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                placeholder="Describe the evaluation instrument..."
                rows={3}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => { setShowCreateModal(false); resetForm() }}
              disabled={creating || updating}
            >
              Cancel
            </Button>
            <Button
              onClick={editingInstrument ? handleEdit : handleCreate}
              disabled={creating || updating}
            >
              {creating || updating ? 'Saving...' : editingInstrument ? 'Update' : 'Create'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Import XML Modal */}
      <Dialog open={showImportModal} onOpenChange={setShowImportModal}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Import XML</DialogTitle>
          </DialogHeader>
          
          <div className="space-y-4">
            {error && (
              <div className="flex items-center gap-2 text-red-600 text-sm">
                <AlertCircle className="h-4 w-4" />
                <span className="text-sm">{error}</span>
              </div>
            )}
            
            <div className="space-y-2">
              <Label htmlFor="xmlContent">XML Content</Label>
              <Textarea
                id="xmlContent"
                value={xmlContent}
                onChange={(e) => setXmlContent(e.target.value)}
                placeholder="Paste your XML content here..."
                rows={10}
              />
            </div>
          </div>
          
          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => { setShowImportModal(false); setXmlContent('') }}
              disabled={importing}
            >
              Cancel
            </Button>
            <Button
              onClick={handleImport}
              disabled={importing}
            >
              {importing ? 'Importing...' : 'Import'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  )
}
