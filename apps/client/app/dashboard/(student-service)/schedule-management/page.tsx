'use client';

import { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Textarea } from '@/components/ui/textarea';
import { Calendar, Clock, Target, Plus, Search, Filter, Users, BookOpen, MapPin, FileText, Award } from 'lucide-react';
import { getSubjects, Subject, createCourseSchedule, getCourseSchedules, createCourseSession, createExamPeriod, getExamPeriods, createExam, getExams } from '@/lib/courses.service';
import { Badge } from '@/components/ui/badge';

interface CourseSchedule {
  id: number;
  subjectId: number;
  academicYear: string;
  semesterType: string;
  isActive: boolean;
  subject?: {
    name: string;
  };
  sessions?: CourseSession[]; // Added sessions to interface
}

interface CourseSession {
  id: number;
  scheduleId: number;
  title: string;
  description?: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  room?: string;
  sessionType: string;
  isActive: boolean;
}

interface ExamPeriod {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  academicYear: string;
  semesterType: string;
  isActive: boolean;
}

interface Exam {
  id: number;
  subjectId: number;
  examPeriodId: number;
  examDate: string;
  examTime: string;
  duration: number;
  location?: string;
  maxPoints: number;
  status: string;
  subject?: {
    name: string;
    code: string;
  };
  examPeriod?: {
    name: string;
    startDate: string;
    endDate: string;
  };
}

interface EvaluationInstrument {
  id: number;
  name: string;
  description: string;
  courseId: number;
  type: string;
  maxPoints: number;
  dueDate: string;
  isActive: boolean;
  course?: {
    name: string;
  };
}

export default function ScheduleManagementPage() {
  const [activeTab, setActiveTab] = useState('course-schedules');
  const [schedules, setSchedules] = useState<CourseSchedule[]>([]);
  const [sessions, setSessions] = useState<CourseSession[]>([]);
  const [examPeriods, setExamPeriods] = useState<ExamPeriod[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [evaluationInstruments, setEvaluationInstruments] = useState<EvaluationInstrument[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  
  // Modal states
  const [showCreateSchedule, setShowCreateSchedule] = useState(false);
  const [showAddSession, setShowAddSession] = useState(false);
  const [showCreateExamPeriod, setShowCreateExamPeriod] = useState(false);
  const [showAddExam, setShowAddExam] = useState(false);
  const [showCreateEvaluation, setShowCreateEvaluation] = useState(false);
  
  const [selectedScheduleId, setSelectedScheduleId] = useState<number | null>(null);
  const [selectedSchedule, setSelectedSchedule] = useState<CourseSchedule | null>(null); // Added selectedSchedule state
  const [selectedExamPeriodId, setSelectedExamPeriodId] = useState<number | null>(null);

  // New state for expanded schedules
  const [expandedSchedules, setExpandedSchedules] = useState<{ [key: number]: boolean }>({});

  // Fetch subjects on component mount
  useEffect(() => {
    const fetchSubjects = async () => {
      try {
        console.log('Fetching subjects...');
        const subjectsData = await getSubjects();
        console.log('Subjects fetched:', subjectsData);
        setSubjects(subjectsData);
      } catch (error) {
        console.error('Failed to fetch subjects:', error);
      }
    };

    fetchSubjects();
  }, []);

  // Fetch schedules after subjects are loaded
  useEffect(() => {
    console.log('Subjects changed, length:', subjects.length);
    if (subjects.length > 0) {
      const fetchSchedules = async () => {
        try {
          console.log('Fetching schedules...');
          const schedulesData = await getCourseSchedules();
          console.log('Schedules fetched:', schedulesData);
          setSchedules(schedulesData.map((schedule: any) => ({
            id: schedule.id,
            subjectId: schedule.subjectId,
            academicYear: schedule.academicYear,
            semesterType: schedule.semesterType,
            isActive: schedule.isActive,
            // Use subject data directly from backend response
            subject: schedule.subject ? {
              id: schedule.subjectId,
              name: schedule.subject.name,
              code: schedule.subject.code
            } : undefined,
            sessions: schedule.sessions // Assuming sessions are part of the schedule object
          })));
        } catch (error) {
          console.error('Failed to fetch schedules:', error);
        }
      };

      fetchSchedules();
    }
  }, [subjects]);

  // Fetch exam periods and exams when switching to exam-schedules tab
  useEffect(() => {
    if (activeTab === 'exam-schedules') {
      const fetchData = async () => {
        try {
          // Fetch exam periods
          console.log('Fetching exam periods...');
          const periodsData = await getExamPeriods();
          console.log('Exam periods fetched:', periodsData);
          setExamPeriods(periodsData);

          // Fetch exams
          console.log('Fetching exams...');
          const examsData = await getExams();
          console.log('Exams fetched:', examsData);
          setExams(examsData);
        } catch (error) {
          console.error('Failed to fetch data:', error);
        }
      };

      fetchData();
    }
  }, [activeTab]);

  // Form states
  const [scheduleForm, setScheduleForm] = useState({
    subjectId: '',
    academicYear: '',
    semesterType: 'WINTER'
  });

  const [sessionForm, setSessionForm] = useState({
    title: '',
    description: '',
    sessionDate: '',
    startTime: '',
    endTime: '',
    room: '',
    sessionType: 'LECTURE' as 'LECTURE' | 'EXERCISE' | 'LABORATORY' | 'SEMINAR'
  });

  const [examPeriodForm, setExamPeriodForm] = useState({
    name: '',
    startDate: '',
    endDate: '',
    registrationStartDate: '',
    registrationEndDate: '',
    academicYear: '',
    semesterType: 'WINTER'
  });

  const [examForm, setExamForm] = useState({
    subjectId: '',
    examDate: '',
    examTime: '',
    duration: '',
    location: '',
    maxPoints: '100',
    status: 'SCHEDULED'
  });

  const [evaluationForm, setEvaluationForm] = useState({
    name: '',
    description: '',
    courseId: '',
    type: 'PROJECT',
    maxPoints: '',
    dueDate: ''
  });

  const tabs = [
    {
      id: 'course-schedules',
      title: 'Course Schedules',
      icon: Calendar,
      description: 'Manage class schedules and course sessions'
    },
    {
      id: 'exam-schedules',
      title: 'Exam Schedules', 
      icon: Clock,
      description: 'Plan and organize exam periods'
    },
    {
      id: 'evaluation-tools',
      title: 'Evaluation Tools',
      icon: Target,
      description: 'Create and manage assessment instruments'
    }
  ];

  const handleCreateSchedule = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data
      if (!scheduleForm.subjectId || !scheduleForm.academicYear || !scheduleForm.semesterType) {
        alert('Please fill in all required fields');
        return;
      }

      // Create course schedule via API
      const newSchedule = await createCourseSchedule(scheduleForm);
      
      // Add new schedule to local state
      setSchedules(prev => [...prev, {
        id: newSchedule.id,
        subjectId: parseInt(scheduleForm.subjectId),
        academicYear: scheduleForm.academicYear,
        semesterType: scheduleForm.semesterType,
        isActive: true,
        subject: subjects.find(s => s.id.toString() === scheduleForm.subjectId)
      }]);

      // Close modal and reset form
      setShowCreateSchedule(false);
      setScheduleForm({ subjectId: '', academicYear: '', semesterType: 'WINTER' });
      
      console.log('Course schedule created successfully:', newSchedule);
    } catch (error) {
      console.error('Failed to create course schedule:', error);
      alert(`Failed to create course schedule: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleAddSession = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedSchedule) return;
    
    try {
      // Validate form data
      if (!sessionForm.title || !sessionForm.sessionDate || !sessionForm.startTime || !sessionForm.endTime || !sessionForm.room || !sessionForm.sessionType) {
        alert('Please fill in all required fields');
        return;
      }

      // Create course session via API
      const newSession = await createCourseSession({
        scheduleId: selectedSchedule.id,
        title: sessionForm.title,
        description: sessionForm.description,
        sessionDate: sessionForm.sessionDate,
        startTime: sessionForm.startTime,
        endTime: sessionForm.endTime,
        room: sessionForm.room,
        sessionType: sessionForm.sessionType,
      });
      
      // Close modal and reset form
      setShowAddSession(false);
              setSessionForm({ 
          title: '', 
          description: '', 
          sessionDate: '', 
          startTime: '', 
          endTime: '', 
          room: '', 
          sessionType: 'LECTURE'
        });
      
      console.log('Course session created successfully:', newSession);
      alert('Session created successfully!');
      
      // Refresh schedules to show new session
      const updatedSchedules = await getCourseSchedules();
      setSchedules(updatedSchedules);
    } catch (error) {
      console.error('Failed to create course session:', error);
      alert(`Failed to create session: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCreateExamPeriod = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Validate form data
      if (!examPeriodForm.name || !examPeriodForm.startDate || !examPeriodForm.endDate || !examPeriodForm.registrationStartDate || !examPeriodForm.registrationEndDate || !examPeriodForm.academicYear || !examPeriodForm.semesterType) {
        alert('Please fill in all required fields');
        return;
      }

      // Create exam period via API
      const newPeriod = await createExamPeriod({
        name: examPeriodForm.name,
        startDate: examPeriodForm.startDate,
        endDate: examPeriodForm.endDate,
        registrationStartDate: examPeriodForm.registrationStartDate,
        registrationEndDate: examPeriodForm.registrationEndDate,
        academicYear: examPeriodForm.academicYear,
        semesterType: examPeriodForm.semesterType
      });
      
      // Add new period to local state
      setExamPeriods(prev => [...prev, {
        id: newPeriod.id,
        name: newPeriod.name,
        startDate: newPeriod.startDate,
        endDate: newPeriod.endDate,
        academicYear: newPeriod.academicYear,
        semesterType: newPeriod.semesterType,
        isActive: newPeriod.isActive
      }]);

      // Close modal and reset form
      setShowCreateExamPeriod(false);
      setExamPeriodForm({ name: '', startDate: '', endDate: '', registrationStartDate: '', registrationEndDate: '', academicYear: '', semesterType: 'WINTER' });
      
      console.log('Exam period created successfully:', newPeriod);
      alert('Exam period created successfully!');
    } catch (error) {
      console.error('Failed to create exam period:', error);
      alert(`Failed to create exam period: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleAddExam = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedExamPeriodId) return;
    
    try {
      // Validate form data
      if (!examForm.subjectId || !examForm.examDate || !examForm.examTime || !examForm.duration) {
        alert('Please fill in all required fields');
        return;
      }

      // Create exam via API
      const newExam = await createExam({
        subjectId: parseInt(examForm.subjectId),
        examPeriodId: selectedExamPeriodId,
        examDate: examForm.examDate,
        examTime: examForm.examTime,
        duration: parseInt(examForm.duration),
        location: examForm.location || undefined,
        maxPoints: parseInt(examForm.maxPoints),
      });
      
      // Close modal and reset form
      setShowAddExam(false);
      setExamForm({ subjectId: '', examDate: '', examTime: '', duration: '', location: '', maxPoints: '100', status: 'SCHEDULED' });
      
      console.log('Exam created successfully:', newExam);
      alert('Exam created successfully!');
      
      // Refresh exams list
      const updatedExams = await getExams();
      setExams(updatedExams);
    } catch (error) {
      console.error('Failed to create exam:', error);
      alert(`Failed to create exam: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  const handleCreateEvaluation = async (e: React.FormEvent) => {
    e.preventDefault();
    // TODO: Implement API call
    console.log('Creating evaluation:', evaluationForm);
    setShowCreateEvaluation(false);
    setEvaluationForm({ name: '', description: '', courseId: '', type: 'PROJECT', maxPoints: '', dueDate: '' });
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto px-6 py-4">
        {/* Header */}
        <div className="mb-6">
          <h1 className="text-2xl font-semibold text-gray-900 mb-2">Schedule Management</h1>
          <p className="text-sm text-gray-600">Manage course schedules, exam periods, and evaluation tools</p>
        </div>

        {/* Tabs */}
        <div className="mb-6">
          <div className="flex space-x-1 bg-white p-1 rounded-lg border border-gray-200 shadow-sm">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-2 px-4 py-2.5 rounded-md text-sm font-medium transition-all duration-200 ${
                  activeTab === tab.id
                    ? 'bg-blue-600 text-white shadow-sm'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50'
                }`}
              >
                <tab.icon className="h-4 w-4" />
                {tab.title}
              </button>
            ))}
          </div>
        </div>

        {/* Content based on active tab */}
        <div className="space-y-6">
          {activeTab === 'course-schedules' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Course Schedules</h2>
                <Dialog open={showCreateSchedule} onOpenChange={setShowCreateSchedule}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-3 w-3 mr-1" />
                      New Schedule
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-lg font-semibold">Create Course Schedule</DialogTitle>
                      <DialogDescription className="text-sm text-gray-600">
                        Set up a new schedule for the academic period
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateSchedule} className="space-y-4">
                                                   <div>
                               <Label htmlFor="subjectId" className="text-sm font-medium">Subject</Label>
                               <Select value={scheduleForm.subjectId} onValueChange={(value) => setScheduleForm(prev => ({ ...prev, subjectId: value }))}>
                                 <SelectTrigger className="h-9">
                                   <SelectValue placeholder="Select a subject" />
                                 </SelectTrigger>
                                 <SelectContent>
                                   {subjects.map((subject) => (
                                     <SelectItem key={subject.id} value={subject.id.toString()}>
                                       {subject.name} ({subject.code})
                                     </SelectItem>
                                   ))}
                                 </SelectContent>
                               </Select>
                             </div>
                      <div>
                        <Label htmlFor="academicYear" className="text-sm font-medium">Academic Year</Label>
                        <Input
                          id="academicYear"
                          type="text"
                          placeholder="2024/2025"
                          value={scheduleForm.academicYear}
                          onChange={(e) => setScheduleForm(prev => ({ ...prev, academicYear: e.target.value }))}
                          className="h-9"
                        />
                      </div>
                      <div>
                        <Label htmlFor="semesterType" className="text-sm font-medium">Semester</Label>
                        <Select value={scheduleForm.semesterType} onValueChange={(value) => setScheduleForm(prev => ({ ...prev, semesterType: value }))}>
                          <SelectTrigger className="h-9">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="WINTER">Winter</SelectItem>
                            <SelectItem value="SUMMER">Summer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <Button type="submit" className="flex-1 h-9 bg-blue-600 hover:bg-blue-700">
                          Create Schedule
                        </Button>
                        <Button type="button" variant="outline" className="flex-1 h-9" onClick={() => setShowCreateSchedule(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              
              {/* Schedules Table */}
              <Card className="border border-gray-200 bg-white shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-900">Current Schedules</CardTitle>
                  <CardDescription className="text-xs text-gray-500">
                    Manage existing course schedules and sessions
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {schedules.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Calendar className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">No course schedules created yet</p>
                      <p className="text-xs text-gray-400 mt-1">Create your first schedule to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-3">
                       {schedules.map((schedule) => (
                         <div key={schedule.id} className="border rounded-lg p-4 bg-card">
                           <div className="flex items-center justify-between mb-3">
                             <div className="flex items-center space-x-3">
                               <div className="p-2 bg-primary/10 rounded-lg">
                                 <BookOpen className="h-5 w-5 text-primary" />
                               </div>
                               <div>
                                 <h4 className="font-medium">{schedule.subject?.name || 'Unknown Subject'}</h4>
                                 <p className="text-sm text-muted-foreground">
                                   {schedule.academicYear} • {schedule.semesterType}
                                 </p>
                               </div>
                             </div>
                             <div className="flex items-center space-x-2">
                               <Badge variant="secondary" className="text-xs">
                                 {schedule.sessions?.length || 0} sessions
                               </Badge>
                               <Button
                                 variant="outline"
                                 size="sm"
                                 onClick={() => {
                                   setSelectedScheduleId(schedule.id);
                                   setSelectedSchedule(schedule);
                                   setShowAddSession(true);
                                 }}
                               >
                                 <Plus className="h-4 w-4 mr-2" />
                                 Add Session
                               </Button>
                             </div>
                           </div>

                           {/* Sessions List - Collapsible */}
                           {schedule.sessions && schedule.sessions.length > 0 && (
                             <div className="border-t pt-3">
                               <div className="flex items-center justify-between mb-2">
                                 <span className="text-sm font-medium text-muted-foreground">Sessions</span>
                                 <Button
                                   variant="ghost"
                                   size="sm"
                                   onClick={() => setExpandedSchedules(prev => ({
                                     ...prev,
                                     [schedule.id]: !prev[schedule.id]
                                   }))}
                                   className="h-6 px-2 text-xs"
                                 >
                                   {expandedSchedules[schedule.id] ? 'Hide' : 'Show'} sessions
                                 </Button>
                               </div>
                               
                               {expandedSchedules[schedule.id] && (
                                 <div className="space-y-2">
                                   {schedule.sessions.map((session) => (
                                     <div key={session.id} className="flex items-center justify-between p-2 bg-muted/50 rounded text-sm">
                                       <div className="flex items-center space-x-3">
                                         <div className="w-2 h-2 bg-primary rounded-full"></div>
                                         <span className="font-medium">{session.title}</span>
                                         <span className="text-muted-foreground">
                                           {new Date(session.sessionDate).toLocaleDateString()}
                                         </span>
                                         <span className="text-muted-foreground">
                                           {session.startTime} - {session.endTime}
                                         </span>
                                         <span className="text-muted-foreground">{session.room}</span>
                                       </div>
                                       <Badge variant="outline" className="text-xs">
                                         {session.sessionType}
                                       </Badge>
                                     </div>
                                   ))}
                                 </div>
                               )}
                             </div>
                           )}
                         </div>
                       ))}
                     </div>
                  )}
                </CardContent>
              </Card>

              {/* Add Session Modal */}
              <Dialog open={showAddSession} onOpenChange={setShowAddSession}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">Add Course Session</DialogTitle>
                    <DialogDescription className="text-sm text-gray-600">
                      Schedule a new session for this course
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddSession} className="space-y-4">
                    <div>
                      <Label htmlFor="title" className="text-sm font-medium">Session Title</Label>
                      <Input
                        id="title"
                        type="text"
                        placeholder="e.g., Introduction to Calculus"
                        value={sessionForm.title}
                        onChange={(e) => setSessionForm(prev => ({ ...prev, title: e.target.value }))}
                        className="h-9"
                      />
                    </div>
                    <div>
                      <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                      <Input
                        id="description"
                        type="text"
                        placeholder="Session description"
                        value={sessionForm.description}
                        onChange={(e) => setSessionForm(prev => ({ ...prev, description: e.target.value }))}
                        className="h-9"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="sessionDate" className="text-sm font-medium">Date</Label>
                        <Input
                          id="sessionDate"
                          type="date"
                          value={sessionForm.sessionDate}
                          onChange={(e) => setSessionForm(prev => ({ ...prev, sessionDate: e.target.value }))}
                          className="h-9"
                        />
                      </div>
                      <div>
                        <Label htmlFor="startTime" className="text-sm font-medium">Start Time</Label>
                        <Input
                          id="startTime"
                          type="time"
                          value={sessionForm.startTime}
                          onChange={(e) => setSessionForm(prev => ({ ...prev, startTime: e.target.value }))}
                          className="h-9"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="endTime" className="text-sm font-medium">End Time</Label>
                        <Input
                          id="endTime"
                          type="time"
                          value={sessionForm.endTime}
                          onChange={(e) => setSessionForm(prev => ({ ...prev, endTime: e.target.value }))}
                          className="h-9"
                        />
                      </div>
                      <div>
                        <Label htmlFor="room" className="text-sm font-medium">Room</Label>
                        <Input
                          id="room"
                          type="text"
                          placeholder="A101"
                          value={sessionForm.room}
                          onChange={(e) => setSessionForm(prev => ({ ...prev, room: e.target.value }))}
                          className="h-9"
                        />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="sessionType" className="text-sm font-medium">Session Type</Label>
                      <Select value={sessionForm.sessionType} onValueChange={(value) => setSessionForm(prev => ({ ...prev, sessionType: value as 'LECTURE' | 'EXERCISE' | 'LABORATORY' | 'SEMINAR' }))}>
                        <SelectTrigger className="h-9">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LECTURE">Lecture</SelectItem>
                          <SelectItem value="EXERCISE">Exercise</SelectItem>
                          <SelectItem value="LABORATORY">Laboratory</SelectItem>
                          <SelectItem value="SEMINAR">Seminar</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button type="submit" className="flex-1 h-9 bg-blue-600 hover:bg-blue-700">
                        Add Session
                      </Button>
                      <Button type="button" variant="outline" className="flex-1 h-9" onClick={() => setShowAddSession(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {activeTab === 'exam-schedules' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Exam Schedules</h2>
                <Dialog open={showCreateExamPeriod} onOpenChange={setShowCreateExamPeriod}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-3 w-3 mr-1" />
                      New Exam Period
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-lg font-semibold">Create Exam Period</DialogTitle>
                      <DialogDescription className="text-sm text-gray-600">
                        Set up a new exam period for student assessments
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateExamPeriod} className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-sm font-medium">Period Name</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="e.g., January 2024"
                          value={examPeriodForm.name}
                          onChange={(e) => setExamPeriodForm(prev => ({ ...prev, name: e.target.value }))}
                          className="h-9"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="startDate" className="text-sm font-medium">Start Date</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={examPeriodForm.startDate}
                            onChange={(e) => setExamPeriodForm(prev => ({ ...prev, startDate: e.target.value }))}
                            className="h-9"
                          />
                        </div>
                        <div>
                          <Label htmlFor="endDate" className="text-sm font-medium">End Date</Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={examPeriodForm.endDate}
                            onChange={(e) => setExamPeriodForm(prev => ({ ...prev, endDate: e.target.value }))}
                            className="h-9"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="registrationStartDate" className="text-sm font-medium">Registration Start Date</Label>
                          <Input
                            id="registrationStartDate"
                            type="date"
                            value={examPeriodForm.registrationStartDate}
                            onChange={(e) => setExamPeriodForm(prev => ({ ...prev, registrationStartDate: e.target.value }))}
                            className="h-9"
                          />
                        </div>
                        <div>
                          <Label htmlFor="registrationEndDate" className="text-sm font-medium">Registration End Date</Label>
                          <Input
                            id="registrationEndDate"
                            type="date"
                            value={examPeriodForm.registrationEndDate}
                            onChange={(e) => setExamPeriodForm(prev => ({ ...prev, registrationEndDate: e.target.value }))}
                            className="h-9"
                          />
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="academicYear" className="text-sm font-medium">Academic Year</Label>
                          <Input
                            id="academicYear"
                            type="text"
                            placeholder="2024/2025"
                            value={examPeriodForm.academicYear}
                            onChange={(e) => setExamPeriodForm(prev => ({ ...prev, academicYear: e.target.value }))}
                            className="h-9"
                          />
                        </div>
                        <div>
                          <Label htmlFor="semesterType" className="text-sm font-medium">Semester</Label>
                          <Select value={examPeriodForm.semesterType} onValueChange={(value) => setExamPeriodForm(prev => ({ ...prev, semesterType: value }))}>
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="WINTER">Winter</SelectItem>
                              <SelectItem value="SUMMER">Summer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <Button type="submit" className="flex-1 h-9 bg-blue-600 hover:bg-blue-700">
                          Create Period
                        </Button>
                        <Button type="button" variant="outline" className="flex-1 h-9" onClick={() => setShowCreateExamPeriod(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              
                             {/* Exam Periods Table */}
               <Card className="border border-gray-200 bg-white shadow-sm">
                 <CardHeader className="pb-3">
                   <CardTitle className="text-sm font-medium text-gray-900">Exam Periods</CardTitle>
                   <CardDescription className="text-xs text-gray-500">
                     Plan and organize exam schedules for different periods
                   </CardDescription>
                 </CardHeader>
                 <CardContent className="pt-0">
                   {examPeriods.length === 0 ? (
                     <div className="text-center py-8 text-gray-500">
                       <Clock className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                       <p className="text-sm">No exam periods configured yet</p>
                       <p className="text-xs text-gray-400 mt-1">Set up exam periods to organize student assessments</p>
                     </div>
                   ) : (
                     <div className="space-y-3">
                       {examPeriods.map((period) => (
                         <div key={period.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                           <div className="flex items-center gap-3">
                             <div className="p-2 rounded-lg bg-orange-50 text-orange-600">
                               <Clock className="h-4 w-4" />
                             </div>
                             <div>
                               <p className="text-sm font-medium text-gray-900">{period.name}</p>
                               <p className="text-xs text-gray-500">{period.startDate} - {period.endDate} • {period.academicYear}</p>
                             </div>
                           </div>
                           <div className="flex items-center gap-2">
                             <Button
                               size="sm"
                               variant="outline"
                               className="h-7 px-2 text-xs"
                               onClick={() => {
                                 setSelectedExamPeriodId(period.id);
                                 setShowAddExam(true);
                               }}
                             >
                               <Plus className="h-3 w-3 mr-1" />
                               Add Exam
                             </Button>
                           </div>
                         </div>
                       ))}
                     </div>
                   )}
                 </CardContent>
               </Card>

               {/* Exams Table */}
               <Card className="border border-gray-200 bg-white shadow-sm">
                 <CardHeader className="pb-3">
                   <CardTitle className="text-sm font-medium text-gray-900">Scheduled Exams</CardTitle>
                   <CardDescription className="text-xs text-gray-500">
                     View and manage individual exams within periods
                   </CardDescription>
                 </CardHeader>
                 <CardContent className="pt-0">
                   {exams.length === 0 ? (
                     <div className="text-center py-8 text-gray-500">
                       <FileText className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                       <p className="text-sm">No exams scheduled yet</p>
                       <p className="text-xs text-gray-400 mt-1">Add exams to exam periods to get started</p>
                     </div>
                   ) : (
                     <div className="space-y-3">
                       {exams.map((exam) => (
                         <div key={exam.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                           <div className="flex items-center gap-3">
                             <div className="p-2 rounded-lg bg-blue-50 text-blue-600">
                               <FileText className="h-4 w-4" />
                             </div>
                             <div>
                               <p className="text-sm font-medium text-gray-900">{exam.subject?.name || 'Unknown Subject'}</p>
                               <p className="text-xs text-gray-500">
                                 {new Date(exam.examDate).toLocaleDateString()} • {exam.examTime} • {exam.duration}min • {exam.location || 'TBD'}
                               </p>
                               <p className="text-xs text-gray-400">{exam.examPeriod?.name} • {exam.maxPoints} points</p>
                             </div>
                           </div>
                           <div className="flex items-center gap-2">
                             <Badge variant="outline" className="text-xs">
                               {exam.status}
                             </Badge>
                           </div>
                         </div>
                       ))}
                     </div>
                   )}
                 </CardContent>
               </Card>

              {/* Add Exam Modal */}
              <Dialog open={showAddExam} onOpenChange={setShowAddExam}>
                <DialogContent className="sm:max-w-md">
                  <DialogHeader>
                    <DialogTitle className="text-lg font-semibold">Add Exam</DialogTitle>
                    <DialogDescription className="text-sm text-gray-600">
                      Schedule a new exam in this period
                    </DialogDescription>
                  </DialogHeader>
                  <form onSubmit={handleAddExam} className="space-y-4">
                                         <div>
                       <Label htmlFor="subjectId" className="text-sm font-medium">Subject</Label>
                       <Select value={examForm.subjectId} onValueChange={(value) => setExamForm(prev => ({ ...prev, subjectId: value }))}>
                         <SelectTrigger className="h-9">
                           <SelectValue placeholder="Select a subject" />
                         </SelectTrigger>
                         <SelectContent>
                           {subjects.map((subject) => (
                             <SelectItem key={subject.id} value={subject.id.toString()}>
                               {subject.name} ({subject.code})
                             </SelectItem>
                           ))}
                         </SelectContent>
                       </Select>
                     </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <Label htmlFor="examDate" className="text-sm font-medium">Exam Date</Label>
                        <Input
                          id="examDate"
                          type="date"
                          value={examForm.examDate}
                          onChange={(e) => setExamForm(prev => ({ ...prev, examDate: e.target.value }))}
                          className="h-9"
                        />
                      </div>
                                             <div>
                         <Label htmlFor="examTime" className="text-sm font-medium">Exam Time</Label>
                         <Input
                           id="examTime"
                           type="time"
                           value={examForm.examTime}
                           onChange={(e) => setExamForm(prev => ({ ...prev, examTime: e.target.value }))}
                           className="h-9"
                         />
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                                             <div>
                         <Label htmlFor="duration" className="text-sm font-medium">Duration (minutes)</Label>
                         <Input
                           id="duration"
                           type="number"
                           placeholder="90"
                           value={examForm.duration}
                           onChange={(e) => setExamForm(prev => ({ ...prev, duration: e.target.value }))}
                           className="h-9"
                         />
                       </div>
                                             <div>
                         <Label htmlFor="location" className="text-sm font-medium">Location</Label>
                         <Input
                           id="location"
                           type="text"
                           placeholder="A101"
                           value={examForm.location}
                           onChange={(e) => setExamForm(prev => ({ ...prev, location: e.target.value }))}
                           className="h-9"
                         />
                       </div>
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                                             <div>
                         <Label htmlFor="maxPoints" className="text-sm font-medium">Max Points</Label>
                         <Input
                           id="maxPoints"
                           type="number"
                           placeholder="100"
                           value={examForm.maxPoints}
                           onChange={(e) => setExamForm(prev => ({ ...prev, maxPoints: e.target.value }))}
                           className="h-9"
                         />
                       </div>
                                             <div>
                         <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                         <Select value={examForm.status || 'SCHEDULED'} onValueChange={(value) => setExamForm(prev => ({ ...prev, status: value }))}>
                           <SelectTrigger className="h-9">
                             <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="SCHEDULED">Scheduled</SelectItem>
                             <SelectItem value="COMPLETED">Completed</SelectItem>
                             <SelectItem value="CANCELLED">Cancelled</SelectItem>
                           </SelectContent>
                         </Select>
                       </div>
                    </div>
                    <div className="flex gap-3 pt-2">
                      <Button type="submit" className="flex-1 h-9 bg-blue-600 hover:bg-blue-700">
                        Add Exam
                      </Button>
                      <Button type="button" variant="outline" className="flex-1 h-9" onClick={() => setShowAddExam(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {activeTab === 'evaluation-tools' && (
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-medium text-gray-900">Evaluation Tools</h2>
                <Dialog open={showCreateEvaluation} onOpenChange={setShowCreateEvaluation}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="h-8 px-3 text-xs bg-blue-600 hover:bg-blue-700">
                      <Plus className="h-3 w-3 mr-1" />
                      New Tool
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="sm:max-w-md">
                    <DialogHeader>
                      <DialogTitle className="text-lg font-semibold">Create Evaluation Tool</DialogTitle>
                      <DialogDescription className="text-sm text-gray-600">
                        Create a new assessment instrument for students
                      </DialogDescription>
                    </DialogHeader>
                    <form onSubmit={handleCreateEvaluation} className="space-y-4">
                      <div>
                        <Label htmlFor="name" className="text-sm font-medium">Tool Name</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="e.g., Project Assignment 1"
                          value={evaluationForm.name}
                          onChange={(e) => setEvaluationForm(prev => ({ ...prev, name: e.target.value }))}
                          className="h-9"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe the assignment or assessment..."
                          value={evaluationForm.description}
                          onChange={(e) => setEvaluationForm(prev => ({ ...prev, description: e.target.value }))}
                          className="h-20 resize-none"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="courseId" className="text-sm font-medium">Course</Label>
                          <Select value={evaluationForm.courseId} onValueChange={(value) => setEvaluationForm(prev => ({ ...prev, courseId: value }))}>
                            <SelectTrigger className="h-9">
                              <SelectValue placeholder="Select a course" />
                            </SelectTrigger>
                            <SelectContent>
                              {subjects.map((subject) => (
                                <SelectItem key={subject.id} value={subject.id.toString()}>
                                  {subject.name} ({subject.code})
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                        <div>
                          <Label htmlFor="type" className="text-sm font-medium">Type</Label>
                          <Select value={evaluationForm.type} onValueChange={(value) => setEvaluationForm(prev => ({ ...prev, type: value }))}>
                            <SelectTrigger className="h-9">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="PROJECT">Project</SelectItem>
                              <SelectItem value="ASSIGNMENT">Assignment</SelectItem>
                              <SelectItem value="TEST">Test</SelectItem>
                              <SelectItem value="PRESENTATION">Presentation</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="maxPoints" className="text-sm font-medium">Max Points</Label>
                          <Input
                            id="maxPoints"
                            type="number"
                            placeholder="100"
                            value={evaluationForm.maxPoints}
                            onChange={(e) => setEvaluationForm(prev => ({ ...prev, maxPoints: e.target.value }))}
                            className="h-9"
                          />
                        </div>
                        <div>
                          <Label htmlFor="dueDate" className="text-sm font-medium">Due Date</Label>
                          <Input
                            id="dueDate"
                            type="date"
                            value={evaluationForm.dueDate}
                            onChange={(e) => setEvaluationForm(prev => ({ ...prev, dueDate: e.target.value }))}
                            className="h-9"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3 pt-2">
                        <Button type="submit" className="flex-1 h-9 bg-blue-600 hover:bg-blue-700">
                          Create Tool
                        </Button>
                        <Button type="button" variant="outline" className="flex-1 h-9" onClick={() => setShowCreateEvaluation(false)}>
                          Cancel
                        </Button>
                      </div>
                    </form>
                  </DialogContent>
                </Dialog>
              </div>
              
              {/* Evaluation Tools Table */}
              <Card className="border border-gray-200 bg-white shadow-sm">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium text-gray-900">Assessment Instruments</CardTitle>
                  <CardDescription className="text-xs text-gray-500">
                    Create and manage evaluation tools for different subjects
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {evaluationInstruments.length === 0 ? (
                    <div className="text-center py-8 text-gray-500">
                      <Target className="h-12 w-12 mx-auto mb-3 text-gray-300" />
                      <p className="text-sm">No evaluation tools created yet</p>
                      <p className="text-xs text-gray-400 mt-1">Create assessment instruments to evaluate student performance</p>
                    </div>
                    ) : (
                    <div className="space-y-3">
                      {evaluationInstruments.map((tool) => (
                        <div key={tool.id} className="flex items-center justify-between p-3 rounded-lg border border-gray-100 hover:border-gray-200 transition-colors">
                          <div className="flex items-center gap-3">
                            <div className="p-2 rounded-lg bg-green-50 text-green-600">
                              <Award className="h-4 w-4" />
                            </div>
                            <div>
                              <p className="text-sm font-medium text-gray-900">{tool.name}</p>
                              <p className="text-xs text-gray-500">{tool.course?.name || 'Unknown Course'} • {tool.type} • {tool.maxPoints} points</p>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <span className="text-xs text-gray-500">Due: {tool.dueDate}</span>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
