"use client"

import { useState } from "react"
import { Button } from "../../../../components/ui/button"
import { cn } from "../../../../lib/utils"
import { Input } from "../../../../components/ui/input"
import { Label } from "../../../../components/ui/label"
import { useAuth } from "../../../../contexts/auth-context"
import { useRouter } from "next/navigation"
import { UserRole } from "../../../../types/auth"

export function RegisterForm({
  className,
  ...props
}: React.ComponentProps<"div">) {
  const { register, isLoading } = useAuth()
  const router = useRouter()
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    password: "",
    confirmPassword: "",
    role: "STUDENT" as UserRole
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const [showPassword, setShowPassword] = useState(false)
  const [showConfirmPassword, setShowConfirmPassword] = useState(false)
  const [submitError, setSubmitError] = useState("")

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }))
    
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }))
    }
    if (submitError) {
      setSubmitError("")
    }
  }

  const handleRoleChange = (role: UserRole) => {
    setFormData(prev => ({ ...prev, role }))
    if (submitError) {
      setSubmitError("")
    }
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    const newErrors: Record<string, string> = {}

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required"
    }
    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required"
    }
    if (!formData.email.trim()) {
      newErrors.email = "Email is required"
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email"
    }
    if (!formData.password) {
      newErrors.password = "Password is required"
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = "Passwords do not match"
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      return
    }

    try {
      // Prepare register data based on role
      const registerData = {
        email: formData.email,
        password: formData.password,
        firstName: formData.firstName,
        lastName: formData.lastName,
        role: formData.role,
        // Add role-specific fields
        ...(formData.role === "PROFESSOR" && {
          department: "Computer Science", // Default value, could be made configurable
          title: "Assistant Professor", // Default value
          phoneNumber: "+38160123456" // Default value
        }),
        ...(formData.role === "STUDENT" && {
          studentIndex: `2024${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`,
          year: 1,
          phoneNumber: "+38160123457" // Default value
        })
      }

      await register(registerData)
      // Redirect to dashboard on successful registration
      router.push("/dashboard")
    } catch (error: any) {
      console.error("Registration failed:", error)
      setSubmitError(error.message || "Registration failed. Please try again.")
    }
  }

  return (
    <div className={`bg-white rounded-lg border border-slate-200 p-6 ${className}`} {...props}>
      <form onSubmit={handleSubmit} className="space-y-4">
        {submitError && (
          <div className="p-3 text-sm text-red-500 bg-red-50 border border-red-200 rounded-md">
            {submitError}
          </div>
        )}
        
        <div className="grid grid-cols-2 gap-3">
          <div className="space-y-2">
            <Label htmlFor="firstName" className="text-sm font-medium">First Name</Label>
            <Input
              id="firstName"
              type="text"
              placeholder="John"
              value={formData.firstName}
              onChange={(e) => handleInputChange("firstName", e.target.value)}
              className={cn("h-9", errors.firstName ? "border-red-500" : "")}
              disabled={isLoading}
            />
            {errors.firstName && (
              <span className="text-xs text-red-500">{errors.firstName}</span>
            )}
          </div>
          <div className="space-y-2">
            <Label htmlFor="lastName" className="text-sm font-medium">Last Name</Label>
            <Input
              id="lastName"
              type="text"
              placeholder="Doe"
              value={formData.lastName}
              onChange={(e) => handleInputChange("lastName", e.target.value)}
              className={cn("h-9", errors.lastName ? "border-red-500" : "")}
              disabled={isLoading}
            />
            {errors.lastName && (
              <span className="text-xs text-red-500">{errors.lastName}</span>
            )}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="email" className="text-sm font-medium">Email</Label>
          <Input
            id="email"
            type="email"
            placeholder="m@example.com"
            value={formData.email}
            onChange={(e) => handleInputChange("email", e.target.value)}
            className={cn("h-9", errors.email ? "border-red-500" : "")}
            disabled={isLoading}
          />
          {errors.email && (
            <span className="text-xs text-red-500">{errors.email}</span>
          )}
        </div>

        <div className="space-y-2">
          <Label htmlFor="role" className="text-sm font-medium">Role</Label>
          <div className="grid grid-cols-2 gap-2">
            {(["STUDENT", "PROFESSOR", "STUDENT_SERVICE", "ADMIN"] as UserRole[]).map((role) => (
              <Button
                key={role}
                type="button"
                variant={formData.role === role ? "default" : "outline"}
                size="sm"
                className="h-9 text-xs"
                onClick={() => handleRoleChange(role)}
                disabled={isLoading}
              >
                {role.replace("_", " ")}
              </Button>
            ))}
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="password" className="text-sm font-medium">Password</Label>
          <div className="relative">
            <Input 
              id="password" 
              type={showPassword ? "text" : "password"}
              value={formData.password}
              onChange={(e) => handleInputChange("password", e.target.value)}
              className={cn(
                "h-9 pr-10",
                errors.password ? "border-red-500" : "",
                formData.password && formData.confirmPassword && formData.password !== formData.confirmPassword ? "border-orange-500" : ""
              )}
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-slate-100 rounded"
              onClick={() => setShowPassword(!showPassword)}
              disabled={isLoading}
            >
              {showPassword ? (
                <svg className="w-3 h-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="w-3 h-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </Button>
          </div>
          {errors.password && (
            <span className="text-xs text-red-500">{errors.password}</span>
          )}
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="confirmPassword" className="text-sm font-medium">Confirm Password</Label>
          <div className="relative">
            <Input 
              id="confirmPassword" 
              type={showConfirmPassword ? "text" : "password"}
              value={formData.confirmPassword}
              onChange={(e) => handleInputChange("confirmPassword", e.target.value)}
              className={cn(
                "h-9 pr-10",
                errors.confirmPassword ? "border-red-500" : "",
                formData.confirmPassword && formData.password !== formData.confirmPassword ? "border-orange-500" : "",
                formData.confirmPassword && formData.password === formData.confirmPassword ? "border-green-500" : ""
              )}
              disabled={isLoading}
            />
            <Button
              type="button"
              variant="ghost"
              size="sm"
              className="absolute right-1 top-1/2 -translate-y-1/2 h-7 w-7 p-0 hover:bg-slate-100 rounded"
              onClick={() => setShowConfirmPassword(!showConfirmPassword)}
              disabled={isLoading}
            >
              {showConfirmPassword ? (
                <svg className="w-3 h-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.878 9.878L3 3m6.878 6.878L21 21" />
                </svg>
              ) : (
                <svg className="w-3 h-3 text-slate-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                </svg>
              )}
            </Button>
          </div>
          {formData.confirmPassword && (
            <div className="flex items-center space-x-2">
              {formData.password === formData.confirmPassword ? (
                <div className="flex items-center space-x-2 text-green-600">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                  </svg>
                  <span className="text-xs">Passwords match</span>
                </div>
              ) : (
                <div className="flex items-center space-x-2 text-orange-600">
                  <svg className="w-3 h-3" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0z" />
                  </svg>
                  <span className="text-xs">Passwords do not match</span>
                </div>
              )}
            </div>
          )}
          {errors.confirmPassword && (
            <span className="text-xs text-red-500">{errors.confirmPassword}</span>
          )}
        </div>
        
        <Button type="submit" className="w-full h-9 mt-6" disabled={isLoading}>
          {isLoading ? "Creating Account..." : "Create Account"}
        </Button>
      </form>
    </div>
  )
}
