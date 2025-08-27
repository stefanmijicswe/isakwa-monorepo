import { authService } from './auth.service';

export interface Course {
  id: number;
  name: string;
  acronym: string;
  ects: number;
  semester: string;
  professor: string;
  schedule: string;
  room: string;
  progress: number;
  grade: string | null;
  status: 'Active' | 'Upcoming' | 'Completed';
}

export interface CourseStats {
  totalCourses: number;
  activeCourses: number;
  totalEcts: number;
  averageGrade: number;
}

export interface Grade {
  id: number;
  courseId: number;
  courseName: string;
  courseAcronym: string;
  assessmentType: 'Final Exam' | 'Midterm' | 'Project' | 'Assignment' | 'Quiz';
  assessmentDate: string;
  grade: string;
  numericalGrade: number;
  ects: number;
  semester: string;
  professor: string;
  comments?: string;
}

export interface GradeStats {
  totalAssessments: number;
  averageGrade: number;
  highestGrade: string;
  lowestGrade: string;
  totalEcts: number;
  gpa: number;
}

// New interfaces for exam registration
export interface ExamPeriod {
  id: number;
  name: string;
  startDate: string;
  endDate: string;
  isActive: boolean;
}

export interface Exam {
  id: number;
  subjectId: number;
  examPeriodId: number;
  examDate: string;
  maxPoints: number;
  isActive: boolean;
  subject?: {
    id: number;
    name: string;
    code: string;
    credits: number;
  };
}

export interface AvailableExam {
  id: number;
  courseId: number;
  courseName: string;
  courseCode: string;
  courseCredits: number;
  examDate: string;
  examTime: string;
  examPeriodName: string;
  totalPoints: number;
  isActive: boolean;
}

export interface ExamRegistration {
  id: number;
  studentId: number;
  examId: number;
  registrationDate: string;
  status: 'REGISTERED' | 'CANCELLED';
  exam?: Exam;
}

export interface StudyHistoryItem {
  id: number;
  subjectId: number;
  subjectName: string;
  subjectCode: string;
  subjectCredits: number;
  professor: string;
  academicYear: string;
  semesterType: string;
  enrollmentDate: string;
  finalGrade: string | null;
  finalPoints: number | null;
  attempts: number;
  status: 'passed' | 'failed' | 'in_progress';
}

export interface StudyHistoryStats {
  totalCourses: number;
  passedCourses: number;
  failedCourses: number;
  totalEcts: number;
  averageGrade: number;
  totalAttempts: number;
}

export interface Notification {
  id: number;
  title: string;
  message: string;
  type: 'INFO' | 'WARNING' | 'SUCCESS' | 'ERROR';
  priority: 'LOW' | 'MEDIUM' | 'HIGH';
  isRead: boolean;
  createdAt: string;
  updatedAt: string;
  senderId: number;
  senderName: string;
  senderRole: string;
  relatedEntityType?: 'COURSE' | 'EXAM' | 'ASSIGNMENT' | 'GENERAL';
  relatedEntityId?: number;
  relatedEntityName?: string;
}

export interface RegisteredExam {
  id: number;
  courseId: number;
  courseName: string;
  courseCode: string;
  courseCredits: number;
  examDate: string;
  examTime: string;
  examPeriodName: string;
  totalPoints: number;
  registrationDate: string;
  status: 'REGISTERED' | 'CANCELLED';
}

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001/api';

class CoursesService {
  private async request<T>(endpoint: string, options: RequestInit = {}): Promise<T> {
    const url = `${API_BASE_URL}${endpoint}`;
    
    const config: RequestInit = {
      headers: {
        'Content-Type': 'application/json',
        ...options.headers,
      },
      ...options,
    };

    // Add auth token if available
    const token = authService.getToken();
    if (token) {
      config.headers = {
        ...config.headers,
        Authorization: `Bearer ${token}`,
      };
    }

    try {
      const response = await fetch(url, config);
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        
        try {
          const errorData = await response.json();
          errorMessage = errorData.message || errorData.error || errorMessage;
        } catch (parseError) {
          errorMessage = response.statusText || errorMessage;
        }
        
        throw new Error(errorMessage);
      }

      return await response.json();
    } catch (error) {
      console.error('Courses service error:', error);
      throw error;
    }
  }

  async getEnrolledCourses(): Promise<Course[]> {
    try {
      // Get current user to extract student ID
      const user = await authService.getCurrentUser();
      if (!user || !user.id) {
        throw new Error('User not authenticated or missing ID');
      }

      // Use the correct endpoint with student ID parameter
      const response = await this.request<{currentCourses: any[]}>(`/academic-records/current-enrollments/${user.id}`);
      
      // Transform backend data to frontend Course format
      return response.currentCourses.map((enrollment: any) => ({
        id: enrollment.id,
        name: enrollment.subject?.name || 'Unknown Course',
        acronym: enrollment.subject?.code || 'N/A',
        ects: enrollment.subject?.credits || 0,
        semester: enrollment.semesterType || 'Unknown',
        professor: enrollment.subject?.professor?.firstName && enrollment.subject?.professor?.lastName 
          ? `${enrollment.subject.professor.firstName} ${enrollment.subject.professor.lastName}`
          : 'TBD',
        schedule: 'To be scheduled', // Backend doesn't have schedule info yet
        room: 'TBD', // Backend doesn't have room info yet
        progress: enrollment.finalGrade ? 100 : 0, // 100% if graded, 0% if not
        grade: enrollment.finalGrade || null,
        status: enrollment.isActive ? 'Active' : 'Completed'
      }));
    } catch (error) {
      console.warn('Failed to fetch from backend, using fallback data:', error);
      // Return empty array if backend fails
      return [];
    }
  }

  async getCourseStats(): Promise<CourseStats> {
    try {
      const courses = await this.getEnrolledCourses();
      
      const totalCourses = courses.length;
      const activeCourses = courses.filter(course => course.status === 'Active').length;
      const totalEcts = courses.reduce((sum, course) => sum + course.ects, 0);
      
      const gradedCourses = courses.filter(course => course.grade);
      const averageGrade = gradedCourses.length > 0 
        ? gradedCourses.reduce((sum, course) => {
            const gradeValue = this.convertGradeToNumber(course.grade!);
            return sum + gradeValue;
          }, 0) / gradedCourses.length
        : 0;

      return {
        totalCourses,
        activeCourses,
        totalEcts,
        averageGrade: Math.round(averageGrade * 10) / 10 // Round to 1 decimal place
      };
    } catch (error) {
      console.error('Failed to calculate course stats:', error);
      return {
        totalCourses: 0,
        activeCourses: 0,
        totalEcts: 0,
        averageGrade: 0
      };
    }
  }

  async getGrades(): Promise<Grade[]> {
    try {
      // Get current user to extract student ID
      const user = await authService.getCurrentUser();
      if (!user || !user.id) {
        throw new Error('User not authenticated or missing ID');
      }

      // Use the academic history endpoint to get grades
      const response = await this.request<any>(`/academic-records/current-enrollments/${user.id}`);
      
      // Transform backend data to frontend Grade format
      return response.currentCourses
        .filter((enrollment: any) => enrollment.finalGrade) // Only courses with grades
        .map((enrollment: any) => ({
          id: enrollment.id,
          courseId: enrollment.subjectId,
          courseName: enrollment.subject?.name || 'Unknown Course',
          courseAcronym: enrollment.subject?.code || 'N/A',
          assessmentType: 'Final Exam', // Backend doesn't have assessment type yet
          assessmentDate: enrollment.enrollmentDate || new Date().toISOString(),
          grade: enrollment.finalGrade,
          numericalGrade: enrollment.finalGrade, // Use the grade directly since it's already numeric
          ects: enrollment.subject?.credits || 0,
          semester: enrollment.semesterType || 'Unknown',
          professor: enrollment.subject?.professor?.firstName && enrollment.subject?.professor?.lastName 
            ? `${enrollment.subject.professor.firstName} ${enrollment.subject.professor.lastName}`
            : 'TBD',
          comments: undefined
        }));
    } catch (error) {
      console.warn('Failed to fetch grades from backend, using fallback data:', error);
      // Return empty array if backend fails
      return [];
    }
  }

  async getGradeStats(): Promise<GradeStats> {
    try {
      const grades = await this.getGrades();
      
      if (grades.length === 0) {
        return {
          totalAssessments: 0,
          averageGrade: 0,
          highestGrade: 'N/A',
          lowestGrade: 'N/A',
          totalEcts: 0,
          gpa: 0
        };
      }

      const totalAssessments = grades.length;
      const totalEcts = grades.reduce((sum, grade) => sum + grade.ects, 0);
      
      const numericalGrades = grades.map(grade => grade.numericalGrade);
      const averageGrade = numericalGrades.reduce((sum, grade) => sum + grade, 0) / numericalGrades.length;
      
      const highestGrade = grades.reduce((max, grade) => 
        grade.numericalGrade > max.numericalGrade ? grade : max
      ).grade;
      
      const lowestGrade = grades.reduce((min, grade) => 
        grade.numericalGrade < min.numericalGrade ? grade : min
      ).grade;

      // Calculate GPA (Grade Point Average) - use numerical grades directly
      const gpa = grades.reduce((sum, grade) => {
        return sum + grade.numericalGrade;
      }, 0) / grades.length;

      return {
        totalAssessments,
        averageGrade: Math.round(averageGrade * 10) / 10,
        highestGrade,
        lowestGrade,
        totalEcts,
        gpa: Math.round(gpa * 100) / 100
      };
    } catch (error) {
      console.error('Failed to calculate grade stats:', error);
      return {
        totalAssessments: 0,
        averageGrade: 0,
        highestGrade: 'N/A',
        lowestGrade: 'N/A',
        totalEcts: 0,
        gpa: 0
      };
    }
  }

  // Make convertGradeToNumber public so it can be used by other functions
  convertGradeToNumber(grade: string | number): number {
    // If grade is already a number, return it
    if (typeof grade === 'number') {
      return grade;
    }
    
    // Handle string grades (both numeric and letter grades)
    const gradeMap: { [key: string]: number } = {
      'A': 4.0,
      'A-': 3.7,
      'B+': 3.3,
      'B': 3.0,
      'B-': 2.7,
      'C+': 2.3,
      'C': 2.0,
      'C-': 1.7,
      'D+': 1.3,
      'D': 1.0,
      'F': 0.0
    };
    
    // If it's a letter grade, use the map
    if (gradeMap[grade]) {
      return gradeMap[grade];
    }
    
    // If it's a numeric string, convert to number
    const numericGrade = parseFloat(grade);
    if (!isNaN(numericGrade)) {
      return numericGrade;
    }
    
    return 0.0;
  }

  getGradeColor(grade: string): string {
    const gradeValue = this.convertGradeToNumber(grade);
    
    if (gradeValue >= 3.7) return 'text-green-600';
    if (gradeValue >= 3.0) return 'text-blue-600';
    if (gradeValue >= 2.0) return 'text-yellow-600';
    return 'text-red-600';
  }

  getGradeDescription(grade: string): string {
    const gradeValue = this.convertGradeToNumber(grade);
    
    if (gradeValue >= 3.7) return 'Excellent';
    if (gradeValue >= 3.0) return 'Very Good';
    if (gradeValue >= 2.0) return 'Good';
    return 'Needs Improvement';
  }

  // Exam registration methods
  async getRegisteredExams(): Promise<RegisteredExam[]> {
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) return [];

      // Call the backend API to get registered exams
      const response = await this.request<any>(`/academic-records/exam-registrations/${currentUser.id}`);
      
      // Transform backend data to frontend RegisteredExam format
      return response.map((registration: any) => ({
        id: registration.id,
        courseId: registration.exam?.subjectId || registration.examId,
        courseName: registration.exam?.subject?.name || 'Unknown Course',
        courseCode: registration.exam?.subject?.code || 'N/A',
        courseCredits: registration.exam?.subject?.credits || 0,
        examDate: registration.exam?.examDate || new Date().toISOString(),
        examTime: "10:00 AM", // Backend doesn't have time yet
        examPeriodName: "Active Period", // Backend doesn't have period name yet
        totalPoints: registration.exam?.maxPoints || 100,
        registrationDate: registration.registrationDate || new Date().toISOString(),
        status: registration.status || 'REGISTERED'
      }));
    } catch (error) {
      console.warn('Failed to fetch registered exams from backend:', error);
      // Return empty array if backend fails
      return [];
    }
  }

  async registerForExam(examId: number): Promise<boolean> {
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) return false;

      // Call the backend API to register for exam
      const response = await this.request<any>('/academic-records/register-exam', {
        method: 'POST',
        body: JSON.stringify({
          studentId: currentUser.id,
          examId: examId
        })
      });

      console.log(`Student ${currentUser.id} successfully registered for exam ${examId}:`, response);
      return true;
    } catch (error) {
      console.error('Error registering for exam:', error);
      return false;
    }
  }

  async cancelExamRegistration(registrationId: number): Promise<boolean> {
    try {
      const currentUser = await authService.getCurrentUser();
      if (!currentUser) return false;

      // Call the backend API to cancel exam registration
      const response = await this.request<any>(`/academic-records/exam-registrations/${registrationId}/cancel`, {
        method: 'PATCH',
        body: JSON.stringify({
          status: 'CANCELLED'
        })
      });

      console.log(`Successfully cancelled exam registration ${registrationId}:`, response);
      return true;
    } catch (error) {
      console.error('Error cancelling exam registration:', error);
      return false;
    }
  }
}

export const coursesService = new CoursesService();

// New methods for exam registration
export async function getActiveExamPeriods(): Promise<ExamPeriod[]> {
  try {
    const response = await coursesService.getEnrolledCourses();
    // For now, return mock data since the API endpoint might not exist yet
    return [
      {
        id: 1,
        name: "January 2025",
        startDate: "2025-01-15",
        endDate: "2025-01-30",
        isActive: true
      },
      {
        id: 2,
        name: "February 2025",
        startDate: "2025-02-15",
        endDate: "2025-02-28",
        isActive: true
      }
    ];
  } catch (error) {
    console.error('Error fetching active exam periods:', error);
    return [];
  }
}

export async function getAvailableExams(): Promise<AvailableExam[]> {
  try {
    const currentUser = await authService.getCurrentUser();
    if (!currentUser) return [];

    // Get student's current enrollments
    const enrollments = await coursesService.getEnrolledCourses();
    
    // Get already registered exams to filter them out
    const registeredExams = await coursesService.getRegisteredExams();
    const registeredCourseIds = new Set(registeredExams.map(exam => exam.courseId));
    
    // Get active exam periods
    const examPeriods = await getActiveExamPeriods();
    
    // Create available exams based on enrollments, excluding already registered ones
    const availableExams: AvailableExam[] = [];
    
    for (const enrollment of enrollments) {
      // Skip if student is already registered for this course's exam
      if (registeredCourseIds.has(enrollment.id)) {
        continue;
      }
      
      // Create exam for each enrolled subject with realistic dates
      const examDate = new Date();
      examDate.setDate(examDate.getDate() + Math.floor(Math.random() * 30) + 7); // Random date 7-37 days from now
      
      // Format date as YYYY-MM-DD
      const year = examDate.getFullYear();
      const month = String(examDate.getMonth() + 1).padStart(2, '0');
      const day = String(examDate.getDate()).padStart(2, '0');
      const formattedDate = `${year}-${month}-${day}`;
      
      availableExams.push({
        id: enrollment.id,
        courseId: enrollment.id,
        courseName: enrollment.name, // Using enrollment.name (Course interface)
        courseCode: enrollment.acronym, // Using enrollment.acronym (Course interface)
        courseCredits: enrollment.ects,
        examDate: formattedDate,
        examTime: "10:00 AM", // Mock time for now
        examPeriodName: examPeriods[0]?.name || "Upcoming",
        totalPoints: 100,
        isActive: true
      });
    }

    return availableExams;
  } catch (error) {
    console.error('Error fetching available exams:', error);
    return [];
  }
}

export async function getRegisteredExams(): Promise<RegisteredExam[]> {
  return coursesService.getRegisteredExams();
}

export async function registerForExam(examId: number): Promise<boolean> {
  return coursesService.registerForExam(examId);
}

export async function cancelExamRegistration(registrationId: number): Promise<boolean> {
  return coursesService.cancelExamRegistration(registrationId);
}

// New method for study history
export async function getStudyHistory(): Promise<StudyHistoryItem[]> {
  try {
    const currentUser = await authService.getCurrentUser();
    if (!currentUser) return [];

    // Use the existing getEnrolledCourses method instead of private request
    const enrollments = await coursesService.getEnrolledCourses();
    
    // Transform the data to match StudyHistoryItem format
    return enrollments.map((enrollment) => ({
      id: enrollment.id,
      subjectId: enrollment.id, // Using enrollment.id as subjectId for now
      subjectName: enrollment.name,
      subjectCode: enrollment.acronym,
      subjectCredits: enrollment.ects,
      professor: enrollment.professor,
      academicYear: enrollment.semester, // Using semester as academicYear for now
      semesterType: enrollment.semester,
      enrollmentDate: new Date().toISOString(), // Mock date for now
      finalGrade: enrollment.grade,
      finalPoints: enrollment.grade ? 85 : null, // Mock points for now
      attempts: 1, // Mock attempts for now
      status: enrollment.grade 
        ? (parseInt(enrollment.grade) >= 6 ? 'passed' : 'failed')
        : 'in_progress'
    }));
  } catch (error) {
    console.warn('Failed to fetch study history from backend, using fallback data:', error);
    // Return empty array if backend fails
    return [];
  }
}

export async function getStudyHistoryStats(): Promise<StudyHistoryStats> {
  try {
    const history = await getStudyHistory();
    
    if (history.length === 0) {
      return {
        totalCourses: 0,
        passedCourses: 0,
        failedCourses: 0,
        totalEcts: 0,
        averageGrade: 0,
        totalAttempts: 0
      };
    }

    const totalCourses = history.length;
    const passedCourses = history.filter(item => item.status === 'passed').length;
    const failedCourses = history.filter(item => item.status === 'failed').length;
    const totalEcts = history.reduce((sum, item) => sum + item.subjectCredits, 0);
    const totalAttempts = history.reduce((sum, item) => sum + item.attempts, 0);
    
    const gradedCourses = history.filter(item => item.finalGrade);
    const averageGrade = gradedCourses.length > 0 
      ? gradedCourses.reduce((sum, item) => {
          const gradeValue = coursesService.convertGradeToNumber(item.finalGrade!);
          return sum + gradeValue;
        }, 0) / gradedCourses.length
      : 0;

    return {
      totalCourses,
      passedCourses,
      failedCourses,
      totalEcts,
      averageGrade: Math.round(averageGrade * 10) / 10,
      totalAttempts
    };
  } catch (error) {
    console.error('Failed to calculate study history stats:', error);
    return {
      totalCourses: 0,
      passedCourses: 0,
      failedCourses: 0,
      totalEcts: 0,
      averageGrade: 0,
      totalAttempts: 0
    };
  }
}

// New method for notifications
export async function getNotifications(): Promise<Notification[]> {
  try {
    const currentUser = await authService.getCurrentUser();
    if (!currentUser) return [];

    // For now, we'll use a mock approach since the notifications endpoint might not be fully implemented
    // In real implementation, this would call the backend notifications endpoint
    console.log(`Fetching notifications for user ${currentUser.id}`);
    
    // Return empty array for now - this will be replaced with real API call when backend is ready
    return [];
  } catch (error) {
    console.warn('Failed to fetch notifications from backend:', error);
    // Return empty array if backend fails
    return [];
  }
}

export async function markNotificationAsRead(notificationId: number): Promise<boolean> {
  try {
    const currentUser = await authService.getCurrentUser();
    if (!currentUser) return false;

    // Mark notification as read (this would be a PATCH request in real implementation)
    // For now, we'll just simulate success
    console.log(`Marking notification ${notificationId} as read for user ${currentUser.id}`);
    return true;
  } catch (error) {
    console.error('Failed to mark notification as read:', error);
    return false;
  }
}

export async function deleteNotification(notificationId: number): Promise<boolean> {
  try {
    const currentUser = await authService.getCurrentUser();
    if (!currentUser) return false;

    // Delete notification (this would be a DELETE request in real implementation)
    // For now, we'll just simulate success
    console.log(`Deleting notification ${notificationId} for user ${currentUser.id}`);
    return true;
  } catch (error) {
    console.error('Failed to delete notification:', error);
    return false;
  }
}

// New interfaces for schedule management
export interface Subject {
  id: number;
  name: string;
  code: string;
  credits: number;
}

// Schedule management functions
export async function getSubjects(): Promise<Subject[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/subjects`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authService.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching subjects:', error);
    return [];
  }
}

export async function createCourseSchedule(scheduleData: {
  subjectId: string;
  academicYear: string;
  semesterType: string;
}): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/course-schedules`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authService.getToken()}`,
      },
      body: JSON.stringify({
        subjectId: parseInt(scheduleData.subjectId),
        academicYear: scheduleData.academicYear,
        semesterType: scheduleData.semesterType,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating course schedule:', error);
    throw error;
  }
}

export async function getCourseSchedules(): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/course-schedules`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authService.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching course schedules:', error);
    return [];
  }
}

export async function createCourseSession(sessionData: {
  scheduleId: number;
  title: string;
  description?: string;
  sessionDate: string;
  startTime: string;
  endTime: string;
  room: string;
  sessionType: string;
}): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/course-schedules/sessions`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authService.getToken()}`,
      },
      body: JSON.stringify(sessionData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating course session:', error);
    throw error;
  }
}

export async function createExamPeriod(periodData: {
  name: string;
  startDate: string;
  endDate: string;
  academicYear: string;
  semesterType: string;
  registrationStartDate: string;
  registrationEndDate: string;
}): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/academic-records/exam-periods`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authService.getToken()}`,
      },
      body: JSON.stringify(periodData),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating exam period:', error);
    throw error;
  }
}

export async function getExamPeriods(): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/academic-records/exam-periods`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authService.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching exam periods:', error);
    return [];
  }
}

export async function createExam(examData: {
  subjectId: string;
  examPeriodId: string;
  examDate: string;
  examTime: string;
  duration: number;
  location?: string;
  maxPoints: number;
  status: string;
}): Promise<any> {
  try {
    const response = await fetch(`${API_BASE_URL}/academic-records/exams`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authService.getToken()}`,
      },
      body: JSON.stringify({
        subjectId: parseInt(examData.subjectId),
        examPeriodId: parseInt(examData.examPeriodId),
        examDate: examData.examDate,
        examTime: examData.examTime,
        duration: examData.duration,
        location: examData.location,
        maxPoints: examData.maxPoints,
        status: examData.status,
      }),
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error creating exam:', error);
    throw error;
  }
}

export async function getExams(): Promise<any[]> {
  try {
    const response = await fetch(`${API_BASE_URL}/academic-records/exams`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authService.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Error fetching exams:', error);
    return [];
  }
}
