"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, X } from "lucide-react";
import { CreatePersonnelDto, Personnel, Department, createPersonnel, getDepartments } from "@/lib/personnel.service";

interface AddPersonnelModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newPersonnel: Personnel) => void;
}

export function AddPersonnelModal({ isOpen, onClose, onSuccess }: AddPersonnelModalProps) {
  const [formData, setFormData] = useState<CreatePersonnelDto>({
    email: "",
    firstName: "",
    lastName: "",
    role: "PROFESSOR",
    departmentId: 1,
    title: "",
    phoneNumber: "",
    officeRoom: "",
  });
  const [departments, setDepartments] = useState<Department[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch departments when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchDepartments = async () => {
        try {
          const depts = await getDepartments();
          setDepartments(depts);
          // Set first department as default if none selected
          if (depts.length > 0 && !formData.departmentId) {
            setFormData(prev => ({ ...prev, departmentId: depts[0].id }));
          }
        } catch (error) {
          console.error('Error fetching departments:', error);
          setErrors({ submit: 'Failed to load departments. Please try again.' });
        }
      };
      
      fetchDepartments();
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof CreatePersonnelDto, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.firstName.trim()) {
      newErrors.firstName = "First name is required";
    }

    if (!formData.lastName.trim()) {
      newErrors.lastName = "Last name is required";
    }

    if (!formData.email.trim()) {
      newErrors.email = "Email is required";
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = "Please enter a valid email address";
    }

    if (formData.departmentId <= 0) {
      newErrors.departmentId = "Department is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const newPersonnel = await createPersonnel(formData);
      onSuccess(newPersonnel);
      onClose();
      // Reset form
      setFormData({
        email: "",
        firstName: "",
        lastName: "",
        role: "PROFESSOR",
        departmentId: 1,
        title: "",
        phoneNumber: "",
        officeRoom: "",
      });
      setErrors({});
    } catch (error) {
      console.error('Error creating personnel:', error);
      let errorMessage = 'Failed to create personnel. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('409')) {
          errorMessage = 'Email already exists. Please use a different email.';
        } else if (error.message.includes('400')) {
          errorMessage = 'Invalid data. Please check your input.';
        } else if (error.message.includes('401')) {
          errorMessage = 'Authentication required. Please log in again.';
        } else if (error.message.includes('403')) {
          errorMessage = 'Access denied. You do not have permission to create personnel.';
        } else if (error.message.includes('500')) {
          errorMessage = 'Server error. Please try again later.';
        } else {
          errorMessage = `Error: ${error.message}`;
        }
      }
      
      setErrors({ submit: errorMessage });
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Personnel</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 px-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="firstName">First Name *</Label>
              <Input
                id="firstName"
                value={formData.firstName}
                onChange={(e) => handleInputChange("firstName", e.target.value)}
                placeholder="First name"
                className={errors.firstName ? "border-red-500" : ""}
              />
              {errors.firstName && <p className="text-sm text-red-500">{errors.firstName}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="lastName">Last Name *</Label>
              <Input
                id="lastName"
                value={formData.lastName}
                onChange={(e) => handleInputChange("lastName", e.target.value)}
                placeholder="Last name"
                className={errors.lastName ? "border-red-500" : ""}
              />
              {errors.lastName && <p className="text-sm text-red-500">{errors.lastName}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="email">Email *</Label>
            <Input
              id="email"
              type="email"
              value={formData.email}
              onChange={(e) => handleInputChange("email", e.target.value)}
              placeholder="email@isakwa.edu"
              className={errors.email ? "border-red-500" : ""}
            />
            {errors.email && <p className="text-sm text-red-500">{errors.email}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="role">Role *</Label>
              <Select
                value={formData.role}
                onValueChange={(value) => handleInputChange("role", value as 'PROFESSOR' | 'STUDENT_SERVICE')}
              >
                <SelectTrigger className={errors.role ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select role" />
                </SelectTrigger>
                <SelectContent position="popper" side="bottom" sideOffset={4}>
                  <SelectItem value="PROFESSOR">Professor</SelectItem>
                  <SelectItem value="STUDENT_SERVICE">Student Service</SelectItem>
                </SelectContent>
              </Select>
              {errors.role && <p className="text-sm text-red-500">{errors.role}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="departmentId">Department *</Label>
              <Select
                value={formData.departmentId.toString()}
                onValueChange={(value) => handleInputChange("departmentId", parseInt(value))}
              >
                <SelectTrigger className={errors.departmentId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select department" />
                </SelectTrigger>
                <SelectContent position="popper" side="bottom" sideOffset={4}>
                  {departments.map((dept) => (
                    <SelectItem key={dept.id} value={dept.id.toString()}>
                      {dept.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.departmentId && <p className="text-sm text-red-500">{errors.departmentId}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="title">
              {formData.role === 'PROFESSOR' ? 'Academic Title' : 'Position'}
            </Label>
            <Input
              id="title"
              value={formData.title}
              onChange={(e) => handleInputChange("title", e.target.value)}
              placeholder={formData.role === 'PROFESSOR' ? 'e.g., Associate Professor' : 'e.g., Academic Coordinator'}
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="phoneNumber">Phone Number</Label>
              <Input
                id="phoneNumber"
                value={formData.phoneNumber}
                onChange={(e) => handleInputChange("phoneNumber", e.target.value)}
                placeholder="+381 21 485 2100"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="officeRoom">Office Room</Label>
              <Input
                id="officeRoom"
                value={formData.officeRoom}
                onChange={(e) => handleInputChange("officeRoom", e.target.value)}
                placeholder="e.g., CS-201"
              />
            </div>
          </div>

          {errors.submit && (
            <div className="bg-red-50 border border-red-200 rounded-md p-3">
              <p className="text-sm text-red-600">{errors.submit}</p>
            </div>
          )}

          <div className="bg-blue-50 border border-blue-200 rounded-md p-3">
            <p className="text-sm text-blue-600">
              <strong>Note:</strong> The new user will receive a default password: <code className="bg-blue-100 px-1 rounded">defaultPassword123</code>
              <br />
              They should change this password after their first login.
            </p>
          </div>

          <DialogFooter className="gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={handleClose}
              disabled={loading}
            >
              <X className="h-4 w-4 mr-2" />
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Plus className="h-4 w-4 mr-2" />
              )}
              Create Personnel
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
