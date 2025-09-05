import { authService } from './auth.service';

export interface Course {
  id: number;
  subjectId?: number; // Add subjectId for API calls
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
  examId: number; // Add examId for filtering
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
      // Get current user to extract student profile ID
      const user = await authService.getCurrentUser();
      if (!user || !user.studentProfile?.id) {
        throw new Error('User not authenticated or missing student profile');
      }

      // Use the correct endpoint with student profile ID
      const response = await this.request<any>(`/academic-records/students/${user.studentProfile.id}/academic-history`);
      
      // Transform backend data to frontend Course format
      // Combine current enrollments and passed subjects with unique prefixes
      const currentEnrollments = (response.currentEnrollments || []).map((e: any) => ({ ...e, _type: 'current' }));
      const passedSubjects = (response.passedSubjects || []).map((e: any) => ({ ...e, _type: 'passed' }));
      const courseEnrollments = (response.student?.courseEnrollments || []).map((e: any) => ({ ...e, _type: 'enrollment' }));
      
      const allCourses = [...currentEnrollments, ...passedSubjects, ...courseEnrollments];

      return allCourses.map((enrollment: any, index: number) => ({
        id: `${enrollment._type}-${enrollment.id || enrollment.subjectId || index}`, // Guaranteed unique ID
        subjectId: enrollment.subjectId || enrollment.subject?.id || null, // Store subjectId for API calls
        name: enrollment.subject?.name || enrollment.name || 'Unknown Course',
        acronym: enrollment.subject?.code || enrollment.code || 'N/A',
        ects: enrollment.subject?.credits || enrollment.credits || 0,
        semester: enrollment.semesterType || enrollment.semester || 'Unknown',
        professor: enrollment.professor 
          ? (typeof enrollment.professor === 'string' 
             ? enrollment.professor 
             : `${enrollment.professor.firstName || ''} ${enrollment.professor.lastName || ''}`.trim())
          : 'TBD',
        schedule: 'To be scheduled',
        room: 'TBD',
        progress: enrollment.finalGrade || enrollment.grade ? 100 : 0,
        grade: enrollment.finalGrade || enrollment.grade || null,
        status: enrollment.isActive !== false ? 'Active' : 'Completed'
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
      // Get current user to extract student profile ID
      const user = await authService.getCurrentUser();
      if (!user || !user.studentProfile?.id) {
        throw new Error('User not authenticated or missing student profile');
      }

      // Use the academic history endpoint to get grades
      const response = await this.request<any>(`/academic-records/students/${user.studentProfile.id}/academic-history`);
      
      // Transform backend data to frontend Grade format
      // UPDATED: Get grades from courseEnrollments (where professor entered them)
      const courseEnrollments = response.student?.courseEnrollments || [];
      const grades = response.student?.grades || [];
      
      
      // Create grades from courseEnrollments that have completed grading
      const enrollmentGrades = courseEnrollments
        .filter((enrollment: any) => {
          const isCompleted = enrollment.status === 'Completed';
          const hasAttendance = enrollment.attendance !== null && enrollment.attendance !== 0;
          const hasFinal = enrollment.final !== null && enrollment.final !== 0;
          
          return isCompleted && hasAttendance && hasFinal;
        })
        .map((enrollment: any) => {
          // Calculate weighted final grade
          const attendance = enrollment.attendance || 0;
          const assignments = enrollment.assignments || 0;
          const midterm = enrollment.midterm || 0;
          const final = enrollment.final || 0;
          
          const weightedGrade = Math.round(
            attendance * 0.1 + 
            assignments * 0.2 + 
            midterm * 0.3 + 
            final * 0.4
          );
          
          const gradeRecord = {
            id: enrollment.id || Math.random(),
            courseId: enrollment.subjectId || 0,
            courseName: enrollment.subject?.name || 'Unknown Course',
            courseAcronym: enrollment.subject?.code || 'N/A',
            assessmentType: 'Final Exam' as const,
            assessmentDate: enrollment.gradedAt || new Date().toISOString(),
            grade: weightedGrade.toString(),
            numericalGrade: weightedGrade,
            ects: enrollment.subject?.credits || 0,
            semester: this.formatSemester(enrollment.gradedAt),
            professor: 'Professor', // TODO: Get from enrollment
            comments: `Attendance: ${attendance}, Assignments: ${assignments}, Midterm: ${midterm}, Final: ${final}`
          };
          
          return gradeRecord;
        });
      
      // Also include traditional grades from Grade table (if any)
      const traditionalGrades = grades.map((grade: any) => {
        const subjectId = grade.exam?.subjectId || grade.subjectId;
        
        return {
          id: grade.id || Math.random(),
          courseId: subjectId || 0,
          courseName: grade.exam?.subject?.name || 'Unknown Course',
          courseAcronym: grade.exam?.subject?.code || 'N/A',
          assessmentType: 'Final Exam' as const,
          assessmentDate: grade.gradedAt || grade.exam?.examDate || new Date().toISOString(),
          grade: grade.grade?.toString() || '0',
          numericalGrade: grade.grade || 0,
          ects: grade.exam?.subject?.credits || 0,
          semester: this.formatSemester(grade.exam?.examDate),
          professor: 'Professor',
          comments: grade.comments
        };
      });
      
      // Combine both types of grades
      const allGrades = [...enrollmentGrades, ...traditionalGrades];
      return allGrades;
      
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

  // Helper method to format semester based on exam date
  private formatSemester(examDate?: string): string {
    if (!examDate) return 'Unknown';
    
    const date = new Date(examDate);
    const month = date.getMonth() + 1; // getMonth() returns 0-11
    const year = date.getFullYear();
    
    // Determine semester based on month
    if (month >= 2 && month <= 7) {
      return `Summer ${year}`;
    } else if (month >= 9 && month <= 12) {
      return `Winter ${year}/${year + 1}`;
    } else { // January
      return `Winter ${year - 1}/${year}`;
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
      if (!currentUser || !currentUser.studentProfile?.id) return [];

      // Use academic history API to get exam registrations
      const response = await this.request<any>(`/academic-records/students/${currentUser.studentProfile.id}/academic-history`);
      
      // Get exam registrations from the academic history response
      const examRegistrations = response.examRegistrations || [];
      
      // Transform backend data to frontend RegisteredExam format
      return examRegistrations.map((registration: any) => ({
        id: registration.id,
        examId: registration.examId, // Add examId for filtering
        courseId: registration.exam?.subjectId || registration.examId,
        courseName: registration.exam?.subject?.name || 'Unknown Course',
        courseCode: registration.exam?.subject?.code || 'N/A',
        courseCredits: registration.exam?.subject?.credits || 0,
        examDate: registration.exam?.examDate || new Date().toISOString(),
        examTime: "10:00 AM", // Backend doesn't have time yet
        examPeriodName: registration.exam?.examPeriod?.name || "Active Period",
        totalPoints: registration.exam?.maxPoints || 100,
        registrationDate: registration.registrationDate || new Date().toISOString(),
        status: registration.isActive ? 'REGISTERED' : 'CANCELLED'
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
      if (!currentUser || !currentUser.studentProfile?.id) return false;

      // Call the backend API to register for exam
      // FIXED: Use user.id (not studentProfile.id) as backend expects
      const response = await this.request<any>('/academic-records/register-exam', {
        method: 'POST',
        body: JSON.stringify({
          studentId: parseInt(currentUser.id.toString(), 10),
          examId: parseInt(examId.toString(), 10)
        })
      });

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
    if (!currentUser || !currentUser.studentProfile?.id) return [];

    // Get exams available for this specific student (only enrolled subjects)
    const response = await fetch(`${API_BASE_URL}/academic-records/exams/available`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authService.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const exams = await response.json();
    
    // Get already registered exams to filter them out
    const registeredExams = await coursesService.getRegisteredExams();
    const registeredExamIds = new Set(registeredExams.map(exam => exam.examId));
    
    // Filter out already registered exams and format for frontend
    const availableExams: AvailableExam[] = exams
      .filter((exam: any) => !registeredExamIds.has(exam.id))
      .map((exam: any) => ({
        id: exam.id,
        courseId: exam.subjectId,
        courseName: exam.subject?.name || 'Unknown Course',
        courseCode: exam.subject?.code || 'N/A',
        courseCredits: 100, // Default points
        examDate: exam.examDate,
        examTime: exam.examTime || '10:00 AM',
        examPeriodName: exam.examPeriod?.name || 'Exam Period',
        totalPoints: exam.maxPoints || 100,
        isActive: true // Already filtered by backend
      }));
    
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
    if (!currentUser || !currentUser.studentProfile?.id) return [];

    // Use the academic history API directly
    const response = await fetch(`${API_BASE_URL}/academic-records/students/${currentUser.studentProfile.id}/academic-history`, {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${authService.getToken()}`,
      },
    });

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    
    // Combine all course data from different sources with unique prefixes
    const passedSubjects = (data.passedSubjects || []).map((item: any, i: number) => ({ ...item, _source: 'passed', _index: i }));
    const currentEnrollments = (data.currentEnrollments || []).map((item: any, i: number) => ({ ...item, _source: 'current', _index: i }));
    const courseEnrollments = (data.student?.courseEnrollments || []).map((item: any, i: number) => ({ ...item, _source: 'enrollment', _index: i }));
    
    const allCourseData = [...passedSubjects, ...currentEnrollments, ...courseEnrollments];
    
    // Transform the data to match StudyHistoryItem format
    return allCourseData.map((item: any, index: number) => ({
      id: `${item._source}-${item.id || item.subjectId || item._index}-${index}`,
      subjectId: item.subjectId || item.id || 0,
      subjectName: item.subject?.name || item.name || 'Unknown Course',
      subjectCode: item.subject?.code || item.code || 'N/A',
      subjectCredits: item.subject?.credits || item.credits || 0,
      professor: item.professor 
        ? (typeof item.professor === 'string' 
           ? item.professor 
           : `${item.professor.firstName || ''} ${item.professor.lastName || ''}`.trim())
        : 'TBD',
      academicYear: item.academicYear || '2024/2025',
      semesterType: item.semesterType || 'WINTER',
      enrollmentDate: item.enrollmentDate || new Date().toISOString(),
      finalGrade: item.finalGrade || item.grade || null,
      finalPoints: item.finalPoints || (item.grade ? 85 : null),
      attempts: item.attempts || 1,
      status: item.finalGrade || item.grade 
        ? (parseInt(item.finalGrade || item.grade) >= 6 ? 'passed' : 'failed')
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

    const result = await response.json();
    // Backend returns { data: [...], meta: {...} }, we need just the data array
    return result.data || [];
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
