# Authentication System Setup

## Overview
This project now includes a complete authentication system with JWT tokens, role-based access control, and protected routes.

## Files Created

### 1. Types (`types/auth.d.ts`)
- `User` - Basic user interface
- `UserRole` - Enum for user roles (ADMIN, PROFESSOR, STUDENT, STUDENT_SERVICE)
- `ProfessorProfile` - Professor-specific data
- `StudentProfile` - Student-specific data
- `AuthUser` - Extended user with profile data
- `LoginCredentials` - Login form data
- `RegisterData` - Registration form data
- `AuthResponse` - API response with token and user
- `AuthContextType` - Context interface

### 2. Auth Service (`lib/auth.service.ts`)
- Handles API calls to backend
- Token management (localStorage)
- Error handling
- Automatic token inclusion in requests

### 3. Auth Context (`contexts/auth-context.tsx`)
- Global authentication state
- Login, register, logout functions
- User data management
- Automatic token validation

### 4. Auth Guards (`components/auth/auth-guard.tsx`)
- Route protection based on authentication
- Role-based access control
- Loading states
- Access denied handling

### 5. Top Navigation (`app/dashboard/components/top-nav.tsx`)
- Displays current user information
- Uses authentication context

## Setup Instructions

### 1. Environment Variables
Create `.env.local` in the client directory:
```bash
NEXT_PUBLIC_API_URL=http://localhost:3001/api
```

### 2. Backend Requirements
Ensure your backend has these endpoints:
- `POST /api/auth/login` - User login
- `POST /api/auth/register` - User registration
- `GET /api/auth/me` - Get current user (protected)

### 3. Database Schema
The system expects these Prisma models:
- `User` with fields: id, email, password, firstName, lastName, role, isActive
- `ProfessorProfile` for professor-specific data
- `StudentProfile` for student-specific data

## Usage Examples

### Using Auth Context
```tsx
import { useAuth } from '../components/auth';

function MyComponent() {
  const { user, login, logout, isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }
  
  return (
    <div>
      Welcome, {user.firstName}!
      <button onClick={logout}>Logout</button>
    </div>
  );
}
```

### Protecting Routes
```tsx
import { AuthGuard, StudentGuard } from '../components/auth';

// Any authenticated user
<AuthGuard>
  <ProtectedPage />
</AuthGuard>

// Only students
<StudentGuard>
  <StudentPage />
</StudentGuard>
```

### Login Form
```tsx
import { useAuth } from '../components/auth';

function LoginForm() {
  const { login } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  
  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    try {
      await login({ email, password });
      // Redirect or show success
    } catch (error) {
      // Handle error
    }
  };
  
  return (
    <form onSubmit={handleSubmit}>
      <input
        type="email"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
        placeholder="Email"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      <button type="submit">Login</button>
    </form>
  );
}
```

## Features

- ✅ JWT token authentication
- ✅ Role-based access control
- ✅ Protected routes
- ✅ Automatic token refresh
- ✅ Loading states
- ✅ Error handling
- ✅ TypeScript support
- ✅ Responsive design

## Security Notes

- Tokens are stored in localStorage (consider httpOnly cookies for production)
- All API calls include Authorization header
- Routes are protected at component level
- Role validation on both frontend and backend

## Testing

1. Start backend: `cd apps/server && npm run start:dev`
2. Start frontend: `cd apps/client && npm run dev`
3. Navigate to `/dashboard` - should redirect to login if not authenticated
4. Use login/register forms to test authentication flow
