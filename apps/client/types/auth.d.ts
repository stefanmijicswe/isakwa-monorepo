export interface User {
  id: number;
  email: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  isActive: boolean;
  dateOfBirth?: string;
  createdAt: string;
  updatedAt: string;
}

export type UserRole = 'ADMIN' | 'PROFESSOR' | 'STUDENT' | 'STUDENT_SERVICE';

export interface ProfessorProfile {
  id: number;
  userId: number;
  department: string;
  title: string;
  phoneNumber?: string;
  officeRoom?: string;
}

export interface StudentProfile {
  id: number;
  userId: number;
  studentIndex: string;
  year: number;
  studyProgramId?: number;
  phoneNumber?: string;
  status: StudentStatus;
  enrollmentYear?: string;
}

export type StudentStatus = 'ACTIVE' | 'INACTIVE' | 'GRADUATED' | 'INTERRUPTED';

export interface AuthUser extends User {
  professorProfile?: ProfessorProfile;
  studentProfile?: StudentProfile;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  department?: string;
  title?: string;
  phoneNumber?: string;
  officeRoom?: string;
  studentIndex?: string;
  year?: number;
  program?: string;
  phone?: string;
  dateOfBirth?: string;
  cityId?: number;
  address?: string;
}

export interface AuthResponse {
  access_token: string;
  user: AuthUser;
}

export interface AuthContextType {
  user: AuthUser | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (credentials: LoginCredentials) => Promise<AuthUser>;
  register: (data: RegisterData) => Promise<AuthUser>;
  logout: () => void;
  refreshUser: () => Promise<void>;
}
