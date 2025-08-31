"use client";

import React, { useState, useEffect } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2, Plus, X } from "lucide-react";
import { CreateSubjectDto, createSubject, getStudyPrograms, StudyProgram } from "@/lib/subjects.service";

interface AddSubjectModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newSubject: any) => void;
}

export function AddSubjectModal({ isOpen, onClose, onSuccess }: AddSubjectModalProps) {
  const [formData, setFormData] = useState<CreateSubjectDto>({
    name: "",
    code: "",
    description: "",
    credits: 6,
    semester: 1,
    lectureHours: 45,
    exerciseHours: 15,
    studyProgramId: 1, // Default value
  });
  const [studyPrograms, setStudyPrograms] = useState<StudyProgram[]>([]);
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  // Fetch study programs when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchStudyPrograms = async () => {
        try {
          const programs = await getStudyPrograms();
          setStudyPrograms(programs);
          // Set first program as default if none selected
          if (programs.length > 0 && !formData.studyProgramId) {
            setFormData(prev => ({ ...prev, studyProgramId: programs[0].id }));
          }
        } catch (error) {
          console.error('Error fetching study programs:', error);
          setErrors({ submit: 'Failed to load study programs. Please try again.' });
        }
      };
      
      fetchStudyPrograms();
    }
  }, [isOpen]);

  const handleInputChange = (field: keyof CreateSubjectDto, value: string | number) => {
    setFormData(prev => ({ ...prev, [field]: value }));
    // Clear error when user starts typing
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: "" }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = "Name is required";
    }

    if (!formData.code.trim()) {
      newErrors.code = "Code is required";
    }

    if (formData.credits < 1 || formData.credits > 30) {
      newErrors.credits = "Credits must be between 1 and 30";
    }

    if (formData.semester < 1 || formData.semester > 8) {
      newErrors.semester = "Semester must be between 1 and 8";
    }

    if (formData.lectureHours < 0) {
      newErrors.lectureHours = "Lecture hours cannot be negative";
    }

    if (formData.exerciseHours < 0) {
      newErrors.exerciseHours = "Exercise hours cannot be negative";
    }

    if (formData.studyProgramId <= 0) {
      newErrors.studyProgramId = "Study Program ID is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    try {
      const newSubject = await createSubject(formData);
      onSuccess(newSubject);
      onClose();
      // Reset form
      setFormData({
        name: "",
        code: "",
        description: "",
        credits: 6,
        semester: 1,
        lectureHours: 45,
        exerciseHours: 15,
        studyProgramId: 1,
      });
      setErrors({});
    } catch (error) {
      console.error('Error creating subject:', error);
      let errorMessage = 'Failed to create subject. Please try again.';
      
      if (error instanceof Error) {
        if (error.message.includes('401')) {
          errorMessage = 'Authentication required. Please log in again.';
        } else if (error.message.includes('403')) {
          errorMessage = 'Access denied. You do not have permission to create subjects.';
        } else if (error.message.includes('400')) {
          errorMessage = 'Invalid data. Please check your input.';
        } else if (error.message.includes('409')) {
          errorMessage = 'Subject code already exists. Please use a different code.';
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
          <DialogTitle>Add New Course</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 px-2">
          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Course name"
                className={errors.name ? "border-red-500" : ""}
              />
              {errors.name && <p className="text-sm text-red-500">{errors.name}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="code">Code *</Label>
              <Input
                id="code"
                value={formData.code}
                onChange={(e) => handleInputChange("code", e.target.value)}
                placeholder="Course code"
                className={errors.code ? "border-red-500" : ""}
              />
              {errors.code && <p className="text-sm text-red-500">{errors.code}</p>}
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
                          <Textarea
                id="description"
                value={formData.description}
                onChange={(e) => handleInputChange("description", e.target.value)}
                placeholder="Course description"
                rows={3}
              />
          </div>

          <div className="grid grid-cols-3 gap-6">
            <div className="space-y-2">
              <Label htmlFor="credits">Credits *</Label>
              <Input
                id="credits"
                type="number"
                min="1"
                max="30"
                value={formData.credits}
                onChange={(e) => handleInputChange("credits", parseInt(e.target.value) || 1)}
                placeholder="ECTS"
                className={errors.credits ? "border-red-500" : ""}
              />
              {errors.credits && <p className="text-sm text-red-500">{errors.credits}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="semester">Semester *</Label>
              <Select
                value={formData.semester.toString()}
                onValueChange={(value) => handleInputChange("semester", parseInt(value))}
              >
                <SelectTrigger className={errors.semester ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select semester" />
                </SelectTrigger>
                <SelectContent position="popper" side="bottom" sideOffset={4}>
                  {[1, 2, 3, 4, 5, 6, 7, 8].map((sem) => (
                    <SelectItem key={sem} value={sem.toString()}>
                      {sem}. semester
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.semester && <p className="text-sm text-red-500">{errors.semester}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="studyProgramId">Study Program *</Label>
              <Select
                value={formData.studyProgramId.toString()}
                onValueChange={(value) => handleInputChange("studyProgramId", parseInt(value))}
              >
                <SelectTrigger className={errors.studyProgramId ? "border-red-500" : ""}>
                  <SelectValue placeholder="Select study program" />
                </SelectTrigger>
                <SelectContent position="popper" side="bottom" sideOffset={4}>
                  {studyPrograms.map((program) => (
                    <SelectItem key={program.id} value={program.id.toString()}>
                      {program.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
              {errors.studyProgramId && <p className="text-sm text-red-500">{errors.studyProgramId}</p>}
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div className="space-y-2">
              <Label htmlFor="lectureHours">Lecture Hours</Label>
              <Input
                id="lectureHours"
                type="number"
                min="0"
                value={formData.lectureHours}
                onChange={(e) => handleInputChange("lectureHours", parseInt(e.target.value) || 0)}
                placeholder="Hours"
                className={errors.lectureHours ? "border-red-500" : ""}
              />
              {errors.lectureHours && <p className="text-sm text-red-500">{errors.lectureHours}</p>}
            </div>

            <div className="space-y-2">
              <Label htmlFor="exerciseHours">Exercise Hours</Label>
              <Input
                id="exerciseHours"
                type="number"
                min="0"
                value={formData.exerciseHours}
                onChange={(e) => handleInputChange("exerciseHours", parseInt(e.target.value) || 0)}
                placeholder="Hours"
                className={errors.exerciseHours ? "border-red-500" : ""}
              />
              {errors.exerciseHours && <p className="text-sm text-red-500">{errors.exerciseHours}</p>}
            </div>
          </div>

          {errors.submit && (
            <p className="text-sm text-red-500 text-center">{errors.submit}</p>
          )}

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
              Create Course
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
