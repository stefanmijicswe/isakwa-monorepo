"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Loader2 } from "lucide-react";
import { StudyProgram, UpdateStudyProgramDto, updateStudyProgram } from "@/lib/study-programs.service";
import { getFaculties, Faculty } from "@/lib/faculties.service";

interface EditStudyProgramModalProps {
  studyProgram: StudyProgram | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (updatedStudyProgram: StudyProgram) => void;
}

export function EditStudyProgramModal({
  studyProgram,
  isOpen,
  onClose,
  onSuccess,
}: EditStudyProgramModalProps) {
  const [formData, setFormData] = useState<UpdateStudyProgramDto>({});
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [faculties, setFaculties] = useState<Faculty[]>([]);

  // Fetch faculties when modal opens
  useEffect(() => {
    if (isOpen) {
      const fetchFaculties = async () => {
        try {
          const facultiesData = await getFaculties({ limit: 100 });
          setFaculties(facultiesData || []);
        } catch (err) {
          console.error('Error fetching faculties:', err);
        }
      };
      fetchFaculties();
    }
  }, [isOpen]);

  // Initialize form data when study program changes
  useEffect(() => {
    if (studyProgram) {
      initializeFormData(studyProgram);
    }
  }, [studyProgram]);

  const initializeFormData = (program: StudyProgram) => {
    setFormData({
      name: program.name,
      description: program.description || "",
      duration: program.duration,
      directorName: program.directorName || "",
      directorTitle: program.directorTitle || "",
      facultyId: program.facultyId,
    });
    setError(null);
  };

  const handleInputChange = (field: keyof UpdateStudyProgramDto, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name?.trim()) {
      setError("Name is required");
      return false;
    }
    if (formData.duration && formData.duration < 1) {
      setError("Duration must be at least 1 year");
      return false;
    }
    if (formData.facultyId && formData.facultyId <= 0) {
      setError("Please select a valid faculty");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm() || !studyProgram) return;

    setLoading(true);
    setError(null);

    try {
      // Only include defined values in the update
      const updateData: UpdateStudyProgramDto = {};
      if (formData.name !== undefined) updateData.name = formData.name;
      if (formData.description !== undefined) updateData.description = formData.description;
      if (formData.duration !== undefined) updateData.duration = formData.duration;
      if (formData.directorName !== undefined) updateData.directorName = formData.directorName;
      if (formData.directorTitle !== undefined) updateData.directorTitle = formData.directorTitle;
      if (formData.facultyId !== undefined) updateData.facultyId = formData.facultyId;

      const updatedStudyProgram = await updateStudyProgram(studyProgram.id, updateData);
      onSuccess(updatedStudyProgram);
      onClose();
    } catch (err: any) {
      console.error('Error updating study program:', err);
      setError(err.message || 'Failed to update study program. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!studyProgram) return null;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Edit Study Program</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 px-2">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter study program name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (years) *</Label>
              <Select
                value={formData.duration?.toString() || ""}
                onValueChange={(value) => handleInputChange("duration", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select duration" />
                </SelectTrigger>
                <SelectContent position="popper" side="bottom" sideOffset={4}>
                  {[1, 2, 3, 4, 5, 6].map((year) => (
                    <SelectItem key={year} value={year.toString()}>
                      {year} {year === 1 ? 'year' : 'years'}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={formData.description || ""}
              onChange={(e) => handleInputChange("description", e.target.value)}
              placeholder="Enter study program description"
              rows={3}
            />
          </div>

          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="directorName">Director Name</Label>
              <Input
                id="directorName"
                value={formData.directorName || ""}
                onChange={(e) => handleInputChange("directorName", e.target.value)}
                placeholder="Enter director name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="directorTitle">Director Title</Label>
              <Input
                id="directorTitle"
                value={formData.directorTitle || ""}
                onChange={(e) => handleInputChange("directorTitle", e.target.value)}
                placeholder="e.g., Prof. Dr., Assoc. Prof."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="facultyId">Faculty *</Label>
            <Select
              value={formData.facultyId?.toString() || ""}
              onValueChange={(value) => handleInputChange("facultyId", parseInt(value))}
            >
              <SelectTrigger>
                <SelectValue placeholder="Select faculty" />
              </SelectTrigger>
              <SelectContent position="popper" side="bottom" sideOffset={4}>
                {faculties.map((faculty) => (
                  <SelectItem key={faculty.id} value={faculty.id.toString()}>
                    {faculty.name}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Updating...
                </>
              ) : (
                "Update Study Program"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
