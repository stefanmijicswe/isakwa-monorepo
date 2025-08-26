'use client';

import React, { ReactNode } from 'react';
import { useAuth } from '../../contexts/auth-context';
import { UserRole } from '../../types/auth';

interface AuthGuardProps {
  children: ReactNode;
  requiredRole?: UserRole;
  fallback?: ReactNode;
  redirectTo?: string;
}

export const AuthGuard: React.FC<AuthGuardProps> = ({
  children,
  requiredRole,
  fallback,
  redirectTo = '/auth/login',
}) => {
  const { user, isAuthenticated, isLoading } = useAuth();

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-primary"></div>
      </div>
    );
  }

  // Check if user is authenticated
  if (!isAuthenticated || !user) {
    if (fallback) {
      return <>{fallback}</>;
    }
    
    // Redirect to login (you can implement this with Next.js router)
    if (typeof window !== 'undefined') {
      window.location.href = redirectTo;
    }
    return null;
  }

  // Check if user has required role
  if (requiredRole && user.role !== requiredRole) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-red-600 mb-4">Access Denied</h1>
          <p className="text-gray-600">
            You don't have permission to access this page.
          </p>
          <p className="text-sm text-gray-500 mt-2">
            Required role: {requiredRole} | Your role: {user.role}
          </p>
        </div>
      </div>
    );
  }

  // User is authenticated and has required role
  return <>{children}</>;
};

// Convenience components for specific roles
export const StudentGuard: React.FC<{ children: ReactNode }> = ({ children }) => (
  <AuthGuard requiredRole="STUDENT">{children}</AuthGuard>
);

export const ProfessorGuard: React.FC<{ children: ReactNode }> = ({ children }) => (
  <AuthGuard requiredRole="PROFESSOR">{children}</AuthGuard>
);

export const AdminGuard: React.FC<{ children: ReactNode }> = ({ children }) => (
  <AuthGuard requiredRole="ADMIN">{children}</AuthGuard>
);

export const StudentServiceGuard: React.FC<{ children: ReactNode }> = ({ children }) => (
  <AuthGuard requiredRole="STUDENT_SERVICE">{children}</AuthGuard>
);
