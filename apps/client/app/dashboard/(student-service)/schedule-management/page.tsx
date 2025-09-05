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
import { createEvaluationInstrument, getEvaluationInstruments, EvaluationType, type EvaluationInstrument, type CreateEvaluationInstrumentDto } from '@/lib/evaluation.service';
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



export default function ScheduleManagementPage() {
  const [activeTab, setActiveTab] = useState('course-schedules');
  const [schedules, setSchedules] = useState<CourseSchedule[]>([]);
  const [sessions, setSessions] = useState<CourseSession[]>([]);
  const [examPeriods, setExamPeriods] = useState<ExamPeriod[]>([]);
  const [exams, setExams] = useState<Exam[]>([]);
  const [evaluationInstruments, setEvaluationInstruments] = useState<EvaluationInstrument[]>([]);
  const [subjects, setSubjects] = useState<Subject[]>([]);
  const [subjectsLoading, setSubjectsLoading] = useState(true);
  
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
        setSubjectsLoading(true); 
        const subjectsData = await getSubjects();
        setSubjects(subjectsData || []);
      } catch (error) {
        console.error('Failed to fetch subjects:', error);
        setSubjects([]);
      } finally {
        setSubjectsLoading(false);
      }
    };

    fetchSubjects();
  }, []);

  // Fetch schedules after subjects are loaded
  useEffect(() => {
    if (subjects.length > 0) {
      const fetchSchedules = async () => {
        try {
          const schedulesData = await getCourseSchedules();
          setSchedules(schedulesData.map((schedule: any) => ({
            id: schedule.id,
            subjectId: schedule.subjectId,
            academicYear: schedule.academicYear,
            semesterType: schedule.semesterType,
            isActive: schedule.isActive,
            subject: schedule.subject ? {
              id: schedule.subjectId,
              name: schedule.subject.name,
              code: schedule.subject.code
            } : undefined,
            sessions: schedule.sessions || []
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
          const periodsData = await getExamPeriods();
          setExamPeriods(periodsData);

          const examsData = await getExams();
          setExams(examsData);
        } catch (error) {
          console.error('Failed to fetch data:', error);
        }
      };

      fetchData();
    }
  }, [activeTab]);

  // Fetch evaluation instruments when switching to evaluation-instruments tab
  useEffect(() => {
    if (activeTab === 'evaluation-instruments') {
      const fetchEvaluationInstruments = async () => {
        try {
          const evaluationData = await getEvaluationInstruments();
          setEvaluationInstruments(evaluationData);
        } catch (error) {
          console.error('Failed to fetch evaluation instruments:', error);
          setEvaluationInstruments([]);
        }
      };
      fetchEvaluationInstruments();
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
    sessionType: 'LECTURE' as 'LECTURE' | 'EXERCISE' | 'MENTORING'
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
    status: 'ACTIVE'
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
      id: 'evaluation-instruments',
      title: 'Evaluation Instruments',
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
      
      // console.log('Course schedule created successfully:', newSchedule);
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
          sessionType: 'LECTURE' as 'LECTURE' | 'EXERCISE' | 'MENTORING'
        });
      
      // console.log('Course session created successfully:', newSession);
      alert('Session created successfully!');
      
      // Refresh schedules to show new session
      const updatedSchedules = await getCourseSchedules();
      setSchedules(updatedSchedules.map((schedule: any) => ({
        id: schedule.id,
        subjectId: schedule.subjectId,
        academicYear: schedule.academicYear,
        semesterType: schedule.semesterType,
        isActive: schedule.isActive,
        subject: schedule.subject ? {
          id: schedule.subjectId,
          name: schedule.subject.name,
          code: schedule.subject.code
        } : undefined,
        sessions: schedule.sessions || []
      })));
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
      
      // console.log('Exam period created successfully:', newPeriod);
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
        subjectId: examForm.subjectId,
        examPeriodId: selectedExamPeriodId.toString(),
        examDate: examForm.examDate,
        examTime: examForm.examTime,
        duration: parseInt(examForm.duration),
        location: examForm.location || undefined,
        maxPoints: parseInt(examForm.maxPoints),
        status: examForm.status,
      });
      
      // Close modal and reset form
      setShowAddExam(false);
      setExamForm({ subjectId: '', examDate: '', examTime: '', duration: '', location: '', maxPoints: '100', status: 'SCHEDULED' });
      
      // console.log('Exam created successfully:', newExam);
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
    
    try {
      // Validate form data
      if (!evaluationForm.name || !evaluationForm.courseId || !evaluationForm.type || !evaluationForm.maxPoints) {
        alert('Please fill in all required fields');
        return;
      }

      // Create evaluation instrument via API
      const evaluationData: CreateEvaluationInstrumentDto = {
        title: evaluationForm.name,
        description: evaluationForm.description || undefined,
        type: evaluationForm.type as EvaluationType,
        subjectId: parseInt(evaluationForm.courseId),
        maxPoints: parseInt(evaluationForm.maxPoints),
        dueDate: evaluationForm.dueDate || undefined,
        isActive: true
      };

      const newEvaluation = await createEvaluationInstrument(evaluationData);
      
      // Close modal and reset form
      setShowCreateEvaluation(false);
      setEvaluationForm({ name: '', description: '', courseId: '', type: 'PROJECT', maxPoints: '', dueDate: '' });
      
      // console.log('Evaluation created successfully:', newEvaluation);
      alert('Evaluation tool created successfully!');
      
      // Refresh evaluation instruments list
      try {
        const updatedEvaluations = await getEvaluationInstruments();
        setEvaluationInstruments(updatedEvaluations);
      } catch (error) {
        console.error('Failed to refresh evaluation instruments:', error);
      }
    } catch (error) {
      console.error('Failed to create evaluation:', error);
      alert(`Failed to create evaluation tool: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-indigo-50/30">
              <div className="container mx-auto px-8 py-8">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center space-x-3 mb-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Calendar className="h-6 w-6 text-blue-600" />
            </div>
            <h1 className="text-3xl font-bold text-gray-900">Schedule Management</h1>
          </div>
          <p className="text-lg text-gray-600 ml-11">Manage course schedules, exam periods, and evaluation instruments for academic planning</p>
        </div>

        {/* Tabs */}
        <div className="mb-8">
          <div className="flex space-x-2 bg-white p-2 rounded-xl border border-gray-200 shadow-lg">
            {tabs.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex-1 flex items-center justify-center gap-3 px-6 py-4 rounded-lg text-sm font-semibold transition-all duration-300 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-blue-600 to-blue-700 text-white shadow-lg transform scale-105'
                    : 'text-gray-600 hover:text-gray-900 hover:bg-gray-50 hover:shadow-md'
                }`}
              >
                <tab.icon className={`h-5 w-5 ${activeTab === tab.id ? 'text-white' : 'text-gray-500'}`} />
                {tab.title}
              </button>
            ))}
          </div>
        </div>

        {/* Content based on active tab */}
        <div className="space-y-8">
          {activeTab === 'course-schedules' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <BookOpen className="h-5 w-5 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Course Schedules</h2>
                </div>
                <Dialog open={showCreateSchedule} onOpenChange={setShowCreateSchedule}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="h-9 px-4 text-sm bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md">
                      <Plus className="h-4 w-4 mr-2" />
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
                    <form onSubmit={handleCreateSchedule} className="space-y-5">
                                                   <div>
                               <Label htmlFor="subjectId" className="text-sm font-medium">Subject</Label>
                               <Select value={scheduleForm.subjectId} onValueChange={(value) => setScheduleForm(prev => ({ ...prev, subjectId: value }))}>
                                 <SelectTrigger className="h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                                   <SelectValue placeholder="Select a subject" />
                                 </SelectTrigger>
                                 <SelectContent>
                                   {subjectsLoading ? (
                                     <SelectItem value="loading" disabled>
                                       Loading subjects...
                                     </SelectItem>
                                   ) : subjects && subjects.length > 0 ? (
                                     subjects.map((subject) => (
                                       <SelectItem key={subject.id} value={subject.id.toString()}>
                                         {subject.name} ({subject.code})
                                       </SelectItem>
                                     ))
                                   ) : (
                                     <SelectItem value="no-subjects" disabled>
                                       No subjects available
                                     </SelectItem>
                                   )}
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
                          className="h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="semesterType" className="text-sm font-medium">Semester</Label>
                                                 <Select value={scheduleForm.semesterType} onValueChange={(value) => setScheduleForm(prev => ({ ...prev, semesterType: value }))}>
                           <SelectTrigger className="h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="WINTER">Winter</SelectItem>
                            <SelectItem value="SUMMER">Summer</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button type="submit" className="flex-1 h-10 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md">
                          Create Schedule
                        </Button>
                        <Button type="button" variant="outline" className="flex-1 h-10" onClick={() => setShowCreateSchedule(false)}>
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
                    <div className="text-center py-12 text-gray-500">
                      <Calendar className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-base font-medium">No course schedules created yet</p>
                      <p className="text-sm text-gray-400 mt-2">Create your first schedule to get started</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                       {schedules.map((schedule) => (
                         <div key={schedule.id} className="border border-gray-200 rounded-lg p-5 bg-white shadow-sm hover:shadow-md transition-all duration-200">
                           <div className="flex items-center justify-between mb-4">
                             <div className="flex items-center space-x-4">
                               <div className="p-3 bg-blue-100 rounded-lg">
                                 <BookOpen className="h-6 w-6 text-blue-600" />
                               </div>
                               <div>
                                 <h4 className="text-lg font-semibold text-gray-900">{schedule.subject?.name || 'Unknown Subject'}</h4>
                                 <div className="flex items-center space-x-3 text-sm text-gray-500 mt-1">
                                   <span className="flex items-center">
                                     <Calendar className="h-4 w-4 mr-1" />
                                     {schedule.academicYear}
                                   </span>
                                   <span className="text-gray-300">•</span>
                                   <span className="font-medium text-blue-600">{schedule.semesterType}</span>
                                 </div>
                               </div>
                             </div>
                             <div className="flex items-center space-x-3">
                               <Badge variant="secondary" className="text-xs font-medium bg-blue-50 text-blue-700 border-blue-200">
                                 {schedule.sessions?.length || 0} sessions
                               </Badge>
                               <Button
                                 variant="outline"
                                 size="sm"
                                 className="border-blue-200 text-blue-700 hover:bg-blue-50"
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
                             <div className="border-t border-gray-100 pt-4">
                               <div className="flex items-center justify-between mb-3">
                                 <span className="text-sm font-medium text-gray-700 flex items-center">
                                   <Users className="h-4 w-4 mr-2 text-gray-500" />
                                   Sessions ({schedule.sessions.length})
                                 </span>
                                 <Button
                                   variant="ghost"
                                   size="sm"
                                   onClick={() => setExpandedSchedules(prev => ({
                                     ...prev,
                                     [schedule.id]: !prev[schedule.id]
                                   }))}
                                   className="h-7 px-3 text-xs text-gray-600 hover:text-gray-900 hover:bg-gray-50"
                                 >
                                   {expandedSchedules[schedule.id] ? 'Hide' : 'Show'} sessions
                                 </Button>
                               </div>
                               
                               {expandedSchedules[schedule.id] && (
                                 <div className="space-y-3">
                                   {schedule.sessions.map((session) => (
                                     <div key={session.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg border border-gray-100">
                                       <div className="flex items-center space-x-4">
                                         <div className="w-3 h-3 bg-blue-500 rounded-full"></div>
                                         <div className="flex flex-col">
                                           <span className="font-medium text-gray-900">{session.title}</span>
                                           <div className="flex items-center space-x-4 text-xs text-gray-500 mt-1">
                                             <span className="flex items-center">
                                               <Calendar className="h-3 w-3 mr-1" />
                                               {new Date(session.sessionDate).toLocaleDateString()}
                                             </span>
                                             <span className="flex items-center">
                                               <Clock className="h-3 w-3 mr-1" />
                                               {session.startTime} - {session.endTime}
                                             </span>
                                             <span className="flex items-center">
                                               <MapPin className="h-3 w-3 mr-1" />
                                               {session.room}
                                             </span>
                                           </div>
                                         </div>
                                       </div>
                                       <Badge variant="secondary" className="text-xs font-medium">
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
                  <form onSubmit={handleAddSession} className="space-y-5">
                    <div>
                      <Label htmlFor="title" className="text-sm font-medium">Session Title</Label>
                                              <Input
                          id="title"
                          type="text"
                          placeholder="e.g., Introduction to Calculus"
                          value={sessionForm.title}
                          onChange={(e) => setSessionForm(prev => ({ ...prev, title: e.target.value }))}
                          className="h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
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
                          className="h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
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
                          className="h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="startTime" className="text-sm font-medium">Start Time</Label>
                                                 <Input
                           id="startTime"
                           type="time"
                           value={sessionForm.startTime}
                           onChange={(e) => setSessionForm(prev => ({ ...prev, startTime: e.target.value }))}
                           className="h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
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
                           className="h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
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
                           className="h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500"
                         />
                      </div>
                    </div>
                    <div>
                      <Label htmlFor="sessionType" className="text-sm font-medium">Session Type</Label>
                                             <Select value={sessionForm.sessionType} onValueChange={(value) => setSessionForm(prev => ({ ...prev, sessionType: value as 'LECTURE' | 'EXERCISE' | 'MENTORING' }))}>
                         <SelectTrigger className="h-10 border-gray-200 focus:border-blue-500 focus:ring-blue-500">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="LECTURE">Lecture</SelectItem>
                          <SelectItem value="EXERCISE">Exercise</SelectItem>
                          <SelectItem value="MENTORING">Mentoring</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button type="submit" className="flex-1 h-10 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 shadow-md">
                        Add Session
                      </Button>
                      <Button type="button" variant="outline" className="flex-1 h-10" onClick={() => setShowAddSession(false)}>
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
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-orange-100 rounded-lg">
                    <Clock className="h-5 w-5 text-orange-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Exam Schedules</h2>
                </div>
                <Dialog open={showCreateExamPeriod} onOpenChange={setShowCreateExamPeriod}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="h-9 px-4 text-sm bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 shadow-md">
                      <Plus className="h-4 w-4 mr-2" />
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
                    <form onSubmit={handleCreateExamPeriod} className="space-y-5">
                      <div>
                        <Label htmlFor="name" className="text-sm font-medium">Period Name</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="e.g., January 2024"
                          value={examPeriodForm.name}
                          onChange={(e) => setExamPeriodForm(prev => ({ ...prev, name: e.target.value }))}
                          className="h-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
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
                            className="h-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="endDate" className="text-sm font-medium">End Date</Label>
                          <Input
                            id="endDate"
                            type="date"
                            value={examPeriodForm.endDate}
                            onChange={(e) => setExamPeriodForm(prev => ({ ...prev, endDate: e.target.value }))}
                            className="h-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
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
                            className="h-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="registrationEndDate" className="text-sm font-medium">Registration End Date</Label>
                          <Input
                            id="registrationEndDate"
                            type="date"
                            value={examPeriodForm.registrationEndDate}
                            onChange={(e) => setExamPeriodForm(prev => ({ ...prev, registrationEndDate: e.target.value }))}
                            className="h-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
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
                            className="h-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="semesterType" className="text-sm font-medium">Semester</Label>
                          <Select value={examPeriodForm.semesterType} onValueChange={(value) => setExamPeriodForm(prev => ({ ...prev, semesterType: value }))}>
                            <SelectTrigger className="h-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              <SelectItem value="WINTER">Winter</SelectItem>
                              <SelectItem value="SUMMER">Summer</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button type="submit" className="flex-1 h-10 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 shadow-md">
                          Create Period
                        </Button>
                        <Button type="button" variant="outline" className="flex-1 h-10" onClick={() => setShowCreateExamPeriod(false)}>
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
                     <div className="text-center py-12 text-gray-500">
                       <Clock className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                       <p className="text-base font-medium">No exam periods configured yet</p>
                       <p className="text-sm text-gray-400 mt-2">Set up exam periods to organize student assessments</p>
                     </div>
                   ) : (
                     <div className="space-y-4">
                       {examPeriods.map((period) => (
                         <div key={period.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition-all duration-200 shadow-sm">
                           <div className="flex items-center gap-4">
                             <div className="p-3 rounded-lg bg-orange-100 text-orange-600">
                               <Clock className="h-5 w-5" />
                             </div>
                             <div>
                               <h4 className="text-sm font-semibold text-gray-900">{period.name}</h4>
                               <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                                 <span className="flex items-center">
                                   <Calendar className="h-3 w-3 mr-1" />
                                   {new Date(period.startDate).toLocaleDateString()} - {new Date(period.endDate).toLocaleDateString()}
                                 </span>
                                 <span className="text-gray-400">•</span>
                                 <span>{period.academicYear}</span>
                               </div>
                             </div>
                           </div>
                           <div className="flex items-center gap-2">
                             <Button
                               size="sm"
                               variant="outline"
                               className="h-8 px-3 text-xs border-orange-200 text-orange-700 hover:bg-orange-50"
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
                     <div className="text-center py-12 text-gray-500">
                       <FileText className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                       <p className="text-base font-medium">No exams scheduled yet</p>
                       <p className="text-sm text-gray-400 mt-2">Add exams to exam periods to get started</p>
                     </div>
                   ) : (
                     <div className="space-y-4">
                       {exams.map((exam) => (
                         <div key={exam.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition-all duration-200 shadow-sm">
                           <div className="flex items-center gap-4">
                             <div className="p-3 rounded-lg bg-blue-100 text-blue-600">
                               <FileText className="h-5 w-5" />
                             </div>
                             <div>
                               <h4 className="text-sm font-semibold text-gray-900">{exam.subject?.name || 'Unknown Subject'}</h4>
                               <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                                 <span className="flex items-center">
                                   <Calendar className="h-3 w-3 mr-1" />
                                   {new Date(exam.examDate).toLocaleDateString()}
                                 </span>
                                 <span className="flex items-center">
                                   <Clock className="h-3 w-3 mr-1" />
                                   {exam.examTime}
                                 </span>
                                 <span>{exam.duration}min</span>
                                 <span className="text-gray-400">•</span>
                                 <span className="flex items-center">
                                   <MapPin className="h-3 w-3 mr-1" />
                                   {exam.location || 'TBD'}
                                 </span>
                               </div>
                               <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
                                 <span>{exam.examPeriod?.name}</span>
                                 <span className="text-gray-300">•</span>
                                 <span className="font-medium text-blue-600">{exam.maxPoints} points</span>
                               </div>
                             </div>
                           </div>
                           <div className="flex items-center gap-2">
                             <Badge 
                               variant={exam.status === 'COMPLETED' ? 'default' : exam.status === 'CANCELLED' ? 'destructive' : 'secondary'} 
                               className="text-xs font-medium"
                             >
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
                  <form onSubmit={handleAddExam} className="space-y-5">
                                         <div>
                       <Label htmlFor="subjectId" className="text-sm font-medium">Subject</Label>
                       <Select value={examForm.subjectId} onValueChange={(value) => setExamForm(prev => ({ ...prev, subjectId: value }))}>
                         <SelectTrigger className="h-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500">
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
                           className="h-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                         />
                      </div>
                                             <div>
                         <Label htmlFor="examTime" className="text-sm font-medium">Exam Time</Label>
                         <Input
                           id="examTime"
                           type="time"
                           value={examForm.examTime}
                           onChange={(e) => setExamForm(prev => ({ ...prev, examTime: e.target.value }))}
                           className="h-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
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
                           className="h-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
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
                           className="h-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
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
                           className="h-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500"
                         />
                       </div>
                                             <div>
                         <Label htmlFor="status" className="text-sm font-medium">Status</Label>
                         <Select value={examForm.status || 'ACTIVE'} onValueChange={(value) => setExamForm(prev => ({ ...prev, status: value }))}>
                           <SelectTrigger className="h-10 border-gray-200 focus:border-orange-500 focus:ring-orange-500">
                             <SelectValue />
                           </SelectTrigger>
                           <SelectContent>
                             <SelectItem value="ACTIVE">Active</SelectItem>
                             <SelectItem value="INACTIVE">Inactive</SelectItem>
                             <SelectItem value="COMPLETED">Completed</SelectItem>
                           </SelectContent>
                         </Select>
                       </div>
                    </div>
                    <div className="flex gap-3 pt-4">
                      <Button type="submit" className="flex-1 h-10 bg-gradient-to-r from-orange-600 to-orange-700 hover:from-orange-700 hover:to-orange-800 shadow-md">
                        Add Exam
                      </Button>
                      <Button type="button" variant="outline" className="flex-1 h-10" onClick={() => setShowAddExam(false)}>
                        Cancel
                      </Button>
                    </div>
                  </form>
                </DialogContent>
              </Dialog>
            </div>
          )}

          {activeTab === 'evaluation-instruments' && (
            <div>
              <div className="flex items-center justify-between mb-6">
                <div className="flex items-center space-x-3">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Target className="h-5 w-5 text-green-600" />
                  </div>
                  <h2 className="text-xl font-semibold text-gray-900">Evaluation Tools</h2>
                </div>
                <Dialog open={showCreateEvaluation} onOpenChange={setShowCreateEvaluation}>
                  <DialogTrigger asChild>
                    <Button size="sm" className="h-9 px-4 text-sm bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-md">
                      <Plus className="h-4 w-4 mr-2" />
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
                    <form onSubmit={handleCreateEvaluation} className="space-y-5">
                      <div>
                        <Label htmlFor="name" className="text-sm font-medium">Tool Name</Label>
                        <Input
                          id="name"
                          type="text"
                          placeholder="e.g., Project Assignment 1"
                          value={evaluationForm.name}
                          onChange={(e) => setEvaluationForm(prev => ({ ...prev, name: e.target.value }))}
                          className="h-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                      <div>
                        <Label htmlFor="description" className="text-sm font-medium">Description</Label>
                        <Textarea
                          id="description"
                          placeholder="Describe the assignment or assessment..."
                          value={evaluationForm.description}
                          onChange={(e) => setEvaluationForm(prev => ({ ...prev, description: e.target.value }))}
                          className="h-24 resize-none border-gray-200 focus:border-green-500 focus:ring-green-500"
                        />
                      </div>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <Label htmlFor="courseId" className="text-sm font-medium">Course</Label>
                          <Select value={evaluationForm.courseId} onValueChange={(value) => setEvaluationForm(prev => ({ ...prev, courseId: value }))}>
                            <SelectTrigger className="h-10 border-gray-200 focus:border-green-500 focus:ring-green-500">
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
                            <SelectTrigger className="h-10 border-gray-200 focus:border-green-500 focus:ring-green-500">
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
                            className="h-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
                          />
                        </div>
                        <div>
                          <Label htmlFor="dueDate" className="text-sm font-medium">Due Date</Label>
                          <Input
                            id="dueDate"
                            type="date"
                            value={evaluationForm.dueDate}
                            onChange={(e) => setEvaluationForm(prev => ({ ...prev, dueDate: e.target.value }))}
                            className="h-10 border-gray-200 focus:border-green-500 focus:ring-green-500"
                          />
                        </div>
                      </div>
                      <div className="flex gap-3 pt-4">
                        <Button type="submit" className="flex-1 h-10 bg-gradient-to-r from-green-600 to-green-700 hover:from-green-700 hover:to-green-800 shadow-md">
                          Create Tool
                        </Button>
                        <Button type="button" variant="outline" className="flex-1 h-10" onClick={() => setShowCreateEvaluation(false)}>
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
                    Create and manage evaluation instruments for different subjects
                  </CardDescription>
                </CardHeader>
                <CardContent className="pt-0">
                  {evaluationInstruments.length === 0 ? (
                    <div className="text-center py-12 text-gray-500">
                      <Target className="h-16 w-16 mx-auto mb-4 text-gray-300" />
                      <p className="text-base font-medium">No evaluation instruments created yet</p>
                      <p className="text-sm text-gray-400 mt-2">Create assessment instruments to evaluate student performance</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {evaluationInstruments.map((tool) => (
                        <div key={tool.id} className="flex items-center justify-between p-4 rounded-lg border border-gray-200 bg-white hover:border-gray-300 transition-all duration-200 shadow-sm">
                          <div className="flex items-center gap-4">
                            <div className="p-3 rounded-lg bg-green-100 text-green-600">
                              <Award className="h-5 w-5" />
                            </div>
                            <div>
                              <h4 className="text-sm font-semibold text-gray-900">{tool.title}</h4>
                              <div className="flex items-center space-x-3 text-xs text-gray-500 mt-1">
                                <span className="flex items-center">
                                  <BookOpen className="h-3 w-3 mr-1" />
                                  {tool.subject?.name || 'Unknown Course'}
                                </span>
                                <span className="text-gray-400">•</span>
                                <span className="font-medium text-green-600">{tool.type}</span>
                                <span className="text-gray-400">•</span>
                                <span className="font-medium text-blue-600">{tool.maxPoints} points</span>
                              </div>
                              <div className="flex items-center space-x-2 text-xs text-gray-400 mt-1">
                                <span className="flex items-center">
                                  <Calendar className="h-3 w-3 mr-1" />
                                  Due: {tool.dueDate ? new Date(tool.dueDate).toLocaleDateString() : 'No due date'}
                                </span>
                              </div>
                            </div>
                          </div>
                          <div className="flex items-center gap-2">
                            <Badge variant="outline" className="text-xs font-medium border-green-200 text-green-700">
                              Active
                            </Badge>
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
