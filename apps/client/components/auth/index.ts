export { AuthProvider, useAuth } from '../../contexts/auth-context';
export {
  AuthGuard,
  StudentGuard,
  ProfessorGuard,
  AdminGuard,
  StudentServiceGuard,
} from './auth-guard';
export { authService } from '../../lib/auth.service';
export type {
  User,
  UserRole,
  ProfessorProfile,
  StudentProfile,
  AuthUser,
  LoginCredentials,
  RegisterData,
  AuthResponse,
  AuthContextType,
} from '../../types/auth';
