"use client"

import * as React from "react"
import { Calendar, BookOpen, X, Edit3, Eye, Loader2 } from "lucide-react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Textarea } from "@/components/ui/textarea"
import { scheduleService, Schedule, Course, ScheduleItem } from "@/lib/schedule.service"

export default function SchedulePlanningPage() {
  const [showEditor, setShowEditor] = React.useState(false)
  const [showSavedView, setShowSavedView] = React.useState(false)
  const [selectedCourse, setSelectedCourse] = React.useState<Course | null>(null)
  const [editingScheduleId, setEditingScheduleId] = React.useState<number | null>(null)
  const [scheduleData, setScheduleData] = React.useState<{
    lectures: ScheduleItem[]
    practice: ScheduleItem[]
  }>({
    lectures: [],
    practice: []
  })

  // Data states
  const [courses, setCourses] = React.useState<Course[]>([])
  const [savedSchedules, setSavedSchedules] = React.useState<Schedule[]>([])
  const [loading, setLoading] = React.useState(true)
  const [saving, setSaving] = React.useState(false)
  const [error, setError] = React.useState<string | null>(null)

  // Load data on component mount
  React.useEffect(() => {
    loadData()
  }, [])

  const loadData = async () => {
    try {
      setLoading(true)
      setError(null)
      
      const [coursesData, schedulesData] = await Promise.all([
        scheduleService.getProfessorCourses(),
        scheduleService.getSchedules()
      ])
      
      setCourses(coursesData)
      setSavedSchedules(schedulesData)
    } catch (err) {
      console.error('Failed to load data:', err)
      setError('Failed to load courses and schedules')
    } finally {
      setLoading(false)
    }
  }

  const handleCourseClick = (course: Course) => {
    setSelectedCourse(course)
    setEditingScheduleId(null)
    
    // Check if there's already a saved schedule for this course
    const existingSchedule = savedSchedules.find(s => s.courseId === course.id)
    
    if (existingSchedule) {
      // Load existing schedule for editing
      setEditingScheduleId(existingSchedule.id)
      setScheduleData({
        lectures: existingSchedule.lectures,
        practice: existingSchedule.practice
      })
    } else {
      // Create new schedule
      setScheduleData({
        lectures: [],
        practice: []
      })
    }
    
    setShowEditor(true)
    setShowSavedView(false)
  }

  const handleViewSaved = () => {
    setShowSavedView(true)
    setShowEditor(false)
    setSelectedCourse(null)
  }

  const handleEditSchedule = (schedule: Schedule) => {
    const course = courses.find(c => c.id === schedule.courseId)
    if (course) {
      setSelectedCourse(course)
      setEditingScheduleId(schedule.id)
      setScheduleData({
        lectures: schedule.lectures,
        practice: schedule.practice
      })
      setShowEditor(true)
      setShowSavedView(false)
    }
  }

  const addLecture = () => {
    const newLecture: ScheduleItem = {
      id: Date.now(),
      week: scheduleData.lectures.length + 1,
      topic: "",
      description: "",
      duration: "90 min",
      room: "Room 301",
      type: "lecture"
    }
    setScheduleData({
      ...scheduleData,
      lectures: [...scheduleData.lectures, newLecture]
    })
  }

  const addPractice = () => {
    const newPractice: ScheduleItem = {
      id: Date.now(),
      week: scheduleData.practice.length + 1,
      topic: "",
      description: "",
      duration: "90 min",
      room: "Lab 205",
      type: "practice"
    }
    setScheduleData({
      ...scheduleData,
      practice: [...scheduleData.practice, newPractice]
    })
  }

  const updateLecture = (id: number, field: keyof ScheduleItem, value: string) => {
    setScheduleData({
      ...scheduleData,
      lectures: scheduleData.lectures.map((lecture) =>
        lecture.id === id ? { ...lecture, [field]: value } : lecture
      )
    })
  }

  const updatePractice = (id: number, field: keyof ScheduleItem, value: string) => {
    setScheduleData({
      ...scheduleData,
      practice: scheduleData.practice.map((practice) =>
        practice.id === id ? { ...practice, [field]: value } : practice
      )
    })
  }

  const removeLecture = (id: number) => {
    setScheduleData({
      ...scheduleData,
      lectures: scheduleData.lectures.filter((lecture) => lecture.id !== id)
    })
  }

  const removePractice = (id: number) => {
    setScheduleData({
      ...scheduleData,
      practice: scheduleData.practice.filter((practice) => practice.id !== id)
    })
  }

  const handleSave = async () => {
    if (!selectedCourse) return
    
    try {
      setSaving(true)
      setError(null)
      
      const lectureData = scheduleData.lectures.map(({ id: _id, type: _type, ...rest }) => rest)
      const practiceData = scheduleData.practice.map(({ id: _id2, type: _type2, ...rest }) => rest)
      
      if (editingScheduleId) {
        // Update existing schedule
        await scheduleService.updateSchedule({
          id: editingScheduleId,
          courseId: selectedCourse.id,
          lectures: lectureData,
          practice: practiceData
        })
      } else {
        // Create new schedule
        await scheduleService.createSchedule({
          courseId: selectedCourse.id,
          lectures: lectureData,
          practice: practiceData
        })
      }
      
      // Refresh data and close editor
      await loadData()
      handleCancel()
    } catch (err) {
      console.error('Failed to save schedule:', err)
      setError('Failed to save schedule. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleCancel = () => {
    setShowEditor(false)
    setShowSavedView(false)
    setSelectedCourse(null)
    setEditingScheduleId(null)
    setScheduleData({ lectures: [], practice: [] })
  }

  // Loading state
  if (loading) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Schedule Planning</h1>
          <p className="text-slate-600">Loading your courses...</p>
        </div>
        <div className="flex items-center justify-center py-12">
          <Loader2 className="h-8 w-8 animate-spin text-slate-400" />
          <span className="ml-2 text-slate-600">Loading courses and schedules...</span>
        </div>
      </div>
    )
  }

  // Error state
  if (error) {
    return (
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Schedule Planning</h1>
          <p className="text-slate-600">Plan course schedules and topics for each session</p>
        </div>
        <Card className="border-red-200 bg-red-50">
          <CardContent className="p-6">
            <div className="text-red-800">
              <p className="font-medium">Error loading data</p>
              <p className="text-sm mt-1">{error}</p>
              <Button 
                onClick={loadData} 
                variant="outline" 
                className="mt-3 border-red-300 text-red-700 hover:bg-red-100"
              >
                Retry
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-semibold text-slate-900">Schedule Planning</h1>
          <p className="text-slate-600">Plan course schedules and topics for each session</p>
        </div>
        <Button
          onClick={handleViewSaved}
          variant="outline"
          className="gap-2"
        >
          <Eye className="h-4 w-4" />
          View Saved ({savedSchedules.length})
        </Button>
      </div>

      {/* Course Selection - Always visible when no editor/saved view */}
      {!showEditor && !showSavedView && (
        <div className="space-y-4">
          <h2 className="text-lg font-medium text-slate-900">Select a Course to Plan</h2>
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => {
              const hasSchedule = savedSchedules.some(s => s.courseId === course.id)
              return (
                <Card 
                  key={course.id} 
                  className="hover:shadow-md transition-shadow cursor-pointer"
                  onClick={() => handleCourseClick(course)}
                >
                  <CardContent className="p-6">
                    <div className="space-y-3">
                      <div className="flex items-center justify-between">
                        <span className="font-mono text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded">
                          {course.acronym}
                        </span>
                        {hasSchedule && (
                          <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                            ✓ Saved
                          </span>
                        )}
                      </div>
                      <h3 className="font-medium text-slate-900">{course.name}</h3>
                      <p className="text-sm text-slate-500">
                        {course.studentsEnrolled} students • {course.ects} ECTS
                      </p>
                    </div>
                  </CardContent>
                </Card>
              )
            })}
          </div>
        </div>
      )}

      {/* Saved Schedules View */}
      {showSavedView && (
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-xl">Saved Schedules</CardTitle>
                  <p className="text-slate-600 mt-1">
                    View and edit your saved course schedules
                  </p>
                </div>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleCancel}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
          </Card>

          <div className="space-y-4">
            {savedSchedules.length === 0 ? (
              <Card>
                <CardContent className="p-8 text-center">
                  <Calendar className="h-12 w-12 text-slate-300 mx-auto mb-4" />
                  <h3 className="font-medium text-slate-900 mb-2">No Saved Schedules</h3>
                  <p className="text-sm text-slate-500">
                    You haven&apos;t created any schedules yet. Click on a course to start planning.
                  </p>
                </CardContent>
              </Card>
            ) : (
              savedSchedules.map((schedule) => (
                <Card key={schedule.id} className="hover:shadow-sm transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-center justify-between">
                      <div className="space-y-2">
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-sm text-slate-600 bg-slate-100 px-2 py-1 rounded">
                            {schedule.courseCode}
                          </span>
                          <span className="text-sm text-slate-500">
                            {schedule.academicYear}
                          </span>
                        </div>
                        <h3 className="font-medium text-slate-900">{schedule.courseName}</h3>
                        <div className="flex items-center gap-4 text-sm text-slate-500">
                          <span className="flex items-center gap-1">
                            <BookOpen className="h-4 w-4" />
                            {schedule.lectures.length} lectures
                          </span>
                          <span className="flex items-center gap-1">
                            <Calendar className="h-4 w-4" />
                            {schedule.practice.length} practice sessions
                          </span>
                        </div>
                        <p className="text-xs text-slate-400">
                          Updated: {new Date(schedule.updatedAt).toLocaleDateString()}
                        </p>
                      </div>
                      <Button
                        onClick={() => handleEditSchedule(schedule)}
                        variant="outline"
                        className="gap-2"
                      >
                        <Edit3 className="h-4 w-4" />
                        Edit
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}

      {/* Schedule Editor - Only when course selected */}
      {showEditor && selectedCourse && (
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-xl">
                  {selectedCourse?.name} ({selectedCourse?.acronym})
                </CardTitle>
                <p className="text-slate-600 text-sm mt-1">
                  Plan your course schedule
                </p>
              </div>
              <Button variant="ghost" size="sm" onClick={handleCancel}>
                <X className="h-4 w-4" />
              </Button>
            </div>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Combined Sessions List */}
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium">Course Sessions</h3>
                <div className="flex gap-2">
                  <Button onClick={addLecture} size="sm" className="gap-2">
                    <BookOpen className="h-4 w-4" />
                    Add Lecture
                  </Button>
                  <Button onClick={addPractice} size="sm" variant="outline" className="gap-2">
                    <Calendar className="h-4 w-4" />
                    Add Practice
                  </Button>
                </div>
              </div>

              {/* All Sessions in One List */}
              <div className="space-y-3">
                {[...scheduleData.lectures, ...scheduleData.practice]
                  .sort((a, b) => a.week - b.week)
                  .map((session) => (
                  <div key={session.id} className="border rounded-lg p-4 space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className={`text-sm font-medium px-2 py-1 rounded-full ${
                          session.type === 'lecture' 
                            ? 'bg-blue-100 text-blue-700' 
                            : 'bg-green-100 text-green-700'
                        }`}>
                          {session.type === 'lecture' ? 'Lecture' : 'Practice'} - Week {session.week}
                        </span>
                      </div>
                      <Button
                        onClick={() => session.type === 'lecture' ? removeLecture(session.id) : removePractice(session.id)}
                        variant="ghost"
                        size="sm"
                        className="text-red-500 hover:text-red-700"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                    
                    <div className="grid gap-3">
                      <Input
                        placeholder={`${session.type === 'lecture' ? 'Lecture' : 'Practice'} topic`}
                        value={session.topic}
                        onChange={(e) => session.type === 'lecture' 
                          ? updateLecture(session.id, 'topic', e.target.value)
                          : updatePractice(session.id, 'topic', e.target.value)
                        }
                      />
                      <Textarea
                        placeholder="Description..."
                        value={session.description}
                        onChange={(e) => session.type === 'lecture'
                          ? updateLecture(session.id, 'description', e.target.value)
                          : updatePractice(session.id, 'description', e.target.value)
                        }
                        rows={2}
                        className="resize-none"
                      />
                      <div className="grid grid-cols-2 gap-3">
                        <Input
                          placeholder="Duration (e.g., 90 min)"
                          value={session.duration}
                          onChange={(e) => session.type === 'lecture'
                            ? updateLecture(session.id, 'duration', e.target.value)
                            : updatePractice(session.id, 'duration', e.target.value)
                          }
                        />
                        <Input
                          placeholder={session.type === 'lecture' ? 'Room (e.g., Room 301)' : 'Lab (e.g., Lab 205)'}
                          value={session.room}
                          onChange={(e) => session.type === 'lecture'
                            ? updateLecture(session.id, 'room', e.target.value)
                            : updatePractice(session.id, 'room', e.target.value)
                          }
                        />
                      </div>
                    </div>
                  </div>
                ))}
                
                {scheduleData.lectures.length === 0 && scheduleData.practice.length === 0 && (
                  <div className="text-center py-8 text-slate-500">
                    <Calendar className="h-12 w-12 mx-auto mb-4 text-slate-300" />
                    <h3 className="font-medium mb-2">No sessions added yet</h3>
                    <p className="text-sm">Add lectures and practice sessions to plan your course</p>
                  </div>
                )}
              </div>
            </div>
            
            {/* Save Actions */}
            <div className="flex justify-end gap-3 pt-4 border-t">
              <Button variant="outline" onClick={handleCancel} disabled={saving}>
                Cancel
              </Button>
              <Button onClick={handleSave} disabled={saving} className="gap-2">
                {saving ? (
                  <>
                    <Loader2 className="h-4 w-4 animate-spin" />
                    {editingScheduleId ? 'Updating...' : 'Saving...'}
                  </>
                ) : (
                  <>
                    {editingScheduleId ? 'Update Schedule' : 'Save Schedule'}
                  </>
                )}
              </Button>
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}