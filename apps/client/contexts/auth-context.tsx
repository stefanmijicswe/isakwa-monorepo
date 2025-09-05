'use client';

import React, { createContext, useContext, useEffect, useState, ReactNode } from 'react';
import { AuthContextType, AuthUser, LoginCredentials, RegisterData } from '../types/auth';
import { authService } from '../lib/auth.service';

const AuthContext = createContext<AuthContextType | undefined>(undefined);

interface AuthProviderProps {
  children: ReactNode;
}

export const AuthProvider: React.FC<AuthProviderProps> = ({ children }) => {
  const [user, setUser] = useState<AuthUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Initialize auth state on mount
  useEffect(() => {
    const initializeAuth = async () => {
      try {
        if (authService.isAuthenticated()) {
          await refreshUser();
        }
      } catch (error) {
        console.error('Failed to initialize auth:', error);
        // Clear invalid token
        authService.removeToken();
      } finally {
        setIsLoading(false);
      }
    };

    initializeAuth();
  }, []);

  const login = async (credentials: LoginCredentials) => {
    try {
      setIsLoading(true);
      const response = await authService.login(credentials);
      
      // Store token
      authService.setToken(response.access_token);
      
      
      // Store user data in localStorage for easy access
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_id', response.user.id.toString());
        localStorage.setItem('user_role', response.user.role);
      }
      
      // Update state
      setUser(response.user);
      setIsAuthenticated(true);
      
      // console.log('Login successful:', response.user);
      return response.user;
    } catch (error) {
      console.error('Login failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (data: RegisterData) => {
    try {
      setIsLoading(true);
      const response = await authService.register(data);
      
      // Store token
      authService.setToken(response.access_token);
      
      // Store user data in localStorage for easy access
      if (typeof window !== 'undefined') {
        localStorage.setItem('user_id', response.user.id.toString());
        localStorage.setItem('user_role', response.user.role);
      }
      
      // Update state
      setUser(response.user);
      setIsAuthenticated(true);
      
      // console.log('Registration successful:', response.user);
      return response.user;
    } catch (error) {
      console.error('Registration failed:', error);
      throw error;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    // Clear token and state
    authService.removeToken();
    
    // Clear user data from localStorage
    if (typeof window !== 'undefined') {
      localStorage.removeItem('user_id');
      localStorage.removeItem('user_role');
    }
    
    setUser(null);
    setIsAuthenticated(false);
    
    // console.log('User logged out');
  };

  const refreshUser = async () => {
    try {
      const userData = await authService.getCurrentUser();
      setUser(userData);
      setIsAuthenticated(true);
    } catch (error) {
      console.error('Failed to refresh user:', error);
      // Clear invalid token and state
      authService.removeToken();
      setUser(null);
      setIsAuthenticated(false);
      throw error;
    }
  };

  const value: AuthContextType = {
    user,
    isLoading,
    isAuthenticated,
    login,
    register,
    logout,
    refreshUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = (): AuthContextType => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
