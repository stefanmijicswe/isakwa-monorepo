"use client";

import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Loader2, AlertTriangle, Users, CheckCircle } from "lucide-react";
import { StudyProgram, deleteStudyProgram, checkStudyProgramEnrollments } from "@/lib/study-programs.service";
import { getFaculties, Faculty } from "@/lib/faculties.service";

interface DeleteStudyProgramModalProps {
  studyProgram: StudyProgram | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteStudyProgramModal({
  studyProgram,
  isOpen,
  onClose,
  onSuccess,
}: DeleteStudyProgramModalProps) {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [enrollmentCheck, setEnrollmentCheck] = useState<{
    hasEnrollments: boolean;
    count: number;
  } | null>(null);

  // Check enrollments when modal opens
  useEffect(() => {
    if (isOpen && studyProgram) {
      checkEnrollments();
    }
  }, [isOpen, studyProgram]);

  const checkEnrollments = async () => {
    try {
      const result = await checkStudyProgramEnrollments(studyProgram!.id);
      setEnrollmentCheck(result);
    } catch (err) {
      console.error('Error checking enrollments:', err);
      // Default to safe - assume there are enrollments
      setEnrollmentCheck({ hasEnrollments: true, count: 0 });
    }
  };

  const handleDelete = async () => {
    if (!studyProgram || enrollmentCheck?.hasEnrollments) return;

    setLoading(true);
    setError(null);

    try {
      await deleteStudyProgram(studyProgram.id);
      onSuccess();
      onClose();
    } catch (err: any) {
      console.error('Error deleting study program:', err);
      setError(err.message || 'Failed to delete study program. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  if (!studyProgram) return null;

  const canDelete = !enrollmentCheck?.hasEnrollments;

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <AlertTriangle className="h-5 w-5 text-red-500" />
            Delete Study Program
          </DialogTitle>
          <DialogDescription>
            This action cannot be undone. This will permanently delete the study program.
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4">
          {/* Study Program Info */}
          <div className="bg-gray-50 p-4 rounded-lg">
            <h4 className="font-medium text-gray-900 mb-2">{studyProgram.name}</h4>
            <div className="text-sm text-gray-600 space-y-1">
              <p>Duration: {studyProgram.duration} years</p>
              {studyProgram.description && (
                <p>Description: {studyProgram.description}</p>
              )}
              {studyProgram.directorName && (
                <p>Director: {studyProgram.directorName}</p>
              )}
            </div>
          </div>

          {/* Enrollment Status */}
          {enrollmentCheck && (
            <div className={`p-4 rounded-lg border ${
              enrollmentCheck.hasEnrollments 
                ? 'bg-red-50 border-red-200' 
                : 'bg-green-50 border-green-200'
            }`}>
              <div className="flex items-center gap-2">
                {enrollmentCheck.hasEnrollments ? (
                  <>
                    <Users className="h-5 w-5 text-red-500" />
                    <div>
                      <p className="font-medium text-red-800">Cannot Delete</p>
                      <p className="text-sm text-red-600">
                        This study program has {enrollmentCheck.count} enrolled students and cannot be deleted.
                      </p>
                    </div>
                  </>
                ) : (
                  <>
                    <CheckCircle className="h-5 w-5 text-green-500" />
                    <div>
                      <p className="font-medium text-green-800">Safe to Delete</p>
                      <p className="text-sm text-green-600">
                        No students are currently enrolled in this study program.
                      </p>
                    </div>
                  </>
                )}
              </div>
            </div>
          )}

          {error && (
            <div className="text-sm text-red-600 bg-red-50 p-3 rounded-md">
              {error}
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-2 pt-4">
            <Button
              type="button"
              variant="outline"
              onClick={onClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              type="button"
              variant="destructive"
              onClick={handleDelete}
              disabled={loading || !canDelete}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Deleting...
                </>
              ) : (
                "Delete Study Program"
              )}
            </Button>
          </div>

          {/* Warning Message */}
          {!canDelete && (
            <div className="text-sm text-amber-600 bg-amber-50 p-3 rounded-md border border-amber-200">
              <p className="font-medium">⚠️ Deletion Blocked</p>
              <p>
                To delete this study program, you must first remove all enrolled students 
                or transfer them to another program.
              </p>
            </div>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}
