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
import { StudyProgram, CreateStudyProgramDto, createStudyProgram } from "@/lib/study-programs.service";
import { getFaculties, Faculty } from "@/lib/faculties.service";

interface AddStudyProgramModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: (newStudyProgram: StudyProgram) => void;
}

export function AddStudyProgramModal({
  isOpen,
  onClose,
  onSuccess,
}: AddStudyProgramModalProps) {
  const [formData, setFormData] = useState<CreateStudyProgramDto>({
    name: "",
    description: "",
    duration: 4,
    directorName: "",
    directorTitle: "",
    facultyId: 0,
  });
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

  const handleInputChange = (field: keyof CreateStudyProgramDto, value: string | number) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const validateForm = (): boolean => {
    if (!formData.name.trim()) {
      setError("Name is required");
      return false;
    }
    if (formData.duration < 1) {
      setError("Duration must be at least 1 year");
      return false;
    }
    if (!formData.facultyId || formData.facultyId <= 0) {
      setError("Please select a faculty");
      return false;
    }
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!validateForm()) return;

    setLoading(true);
    setError(null);

    try {
      const newStudyProgram = await createStudyProgram(formData);
      onSuccess(newStudyProgram);
      onClose();
      
      // Reset form
      setFormData({
        name: "",
        description: "",
        duration: 4,
        directorName: "",
        directorTitle: "",
        facultyId: 0,
      });
    } catch (err: any) {
      console.error('Error creating study program:', err);
      setError(err.message || 'Failed to create study program. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[600px]">
        <DialogHeader>
          <DialogTitle>Add New Study Program</DialogTitle>
        </DialogHeader>
        
        <form onSubmit={handleSubmit} className="space-y-6 px-2">
          <div className="grid grid-cols-2 gap-6">
            <div className="space-y-2">
              <Label htmlFor="name">Name *</Label>
              <Input
                id="name"
                value={formData.name}
                onChange={(e) => handleInputChange("name", e.target.value)}
                placeholder="Enter study program name"
                required
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="duration">Duration (years) *</Label>
              <Select
                value={formData.duration.toString()}
                onValueChange={(value) => handleInputChange("duration", parseInt(value))}
              >
                <SelectTrigger>
                  <SelectValue />
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
              value={formData.description}
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
                value={formData.directorName}
                onChange={(e) => handleInputChange("directorName", e.target.value)}
                placeholder="Enter director name"
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="directorTitle">Director Title</Label>
              <Input
                id="directorTitle"
                value={formData.directorTitle}
                onChange={(e) => handleInputChange("directorTitle", e.target.value)}
                placeholder="e.g., Prof. Dr., Assoc. Prof."
              />
            </div>
          </div>

          <div className="space-y-2">
            <Label htmlFor="facultyId">Faculty *</Label>
            <Select
              value={formData.facultyId ? formData.facultyId.toString() : ""}
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
                  Creating...
                </>
              ) : (
                "Create Study Program"
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
