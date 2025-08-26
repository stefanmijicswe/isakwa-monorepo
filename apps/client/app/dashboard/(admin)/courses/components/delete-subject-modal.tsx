"use client";

import React, { useState } from "react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { AlertTriangle, Loader2, Trash2, X } from "lucide-react";
import { Subject, deleteSubject, checkSubjectEnrollments } from "@/lib/subjects.service";

interface DeleteSubjectModalProps {
  subject: Subject | null;
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function DeleteSubjectModal({ subject, isOpen, onClose, onSuccess }: DeleteSubjectModalProps) {
  const [loading, setLoading] = useState(false);
  const [enrollmentCheck, setEnrollmentCheck] = useState<{ hasEnrollments: boolean; count: number } | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Check enrollments when modal opens
  React.useEffect(() => {
    if (isOpen && subject) {
      checkEnrollments();
    }
  }, [isOpen, subject]);

  const checkEnrollments = async () => {
    try {
      const result = await checkSubjectEnrollments(subject!.id);
      setEnrollmentCheck(result);
    } catch (error) {
      console.error('Error checking enrollments:', error);
      // Assume safe to delete if check fails
      setEnrollmentCheck({ hasEnrollments: false, count: 0 });
    }
  };

  const handleDelete = async () => {
    if (!subject) return;

    setLoading(true);
    setError(null);

    try {
      await deleteSubject(subject.id);
      onSuccess();
      onClose();
    } catch (error) {
      console.error('Error deleting subject:', error);
      setError('Failed to delete subject. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!subject) return null;

  const canDelete = !enrollmentCheck?.hasEnrollments;

  return (
    <Dialog open={isOpen} onOpenChange={handleClose}>
      <DialogContent className="sm:max-w-[425px]">
        <DialogHeader>
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-100">
              <Trash2 className="h-5 w-5 text-red-600" />
            </div>
            <div>
              <DialogTitle>Delete Subject</DialogTitle>
              <DialogDescription>
                Are you sure you want to delete this subject?
              </DialogDescription>
            </div>
          </div>
        </DialogHeader>

        <div className="space-y-4">
          <div className="rounded-lg bg-gray-50 p-4">
            <h4 className="font-medium text-gray-900 mb-2">{subject.name}</h4>
            <p className="text-sm text-gray-600">Code: {subject.code}</p>
            <p className="text-sm text-gray-600">Credits: {subject.credits} ECTS</p>
            <p className="text-sm text-gray-600">Semester: {subject.semester}</p>
          </div>

          {enrollmentCheck && (
            <div className={`rounded-lg p-4 ${
              enrollmentCheck.hasEnrollments 
                ? 'bg-red-50 border border-red-200' 
                : 'bg-green-50 border border-green-200'
            }`}>
              <div className="flex items-center gap-2">
                {enrollmentCheck.hasEnrollments ? (
                  <AlertTriangle className="h-4 w-4 text-red-600" />
                ) : (
                  <div className="h-4 w-4 rounded-full bg-green-600" />
                )}
                <span className={`text-sm font-medium ${
                  enrollmentCheck.hasEnrollments ? 'text-red-800' : 'text-green-800'
                }`}>
                  {enrollmentCheck.hasEnrollments 
                    ? `Cannot delete - ${enrollmentCheck.count} student(s) enrolled`
                    : 'Safe to delete - no students enrolled'
                  }
                </span>
              </div>
            </div>
          )}

          {error && (
            <div className="rounded-lg bg-red-50 border border-red-200 p-4">
              <p className="text-sm text-red-800">{error}</p>
            </div>
          )}
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
          <Button
            type="button"
            variant="destructive"
            onClick={handleDelete}
            disabled={loading || !canDelete}
          >
            {loading ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <Trash2 className="h-4 w-4 mr-2" />
            )}
            Delete Subject
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
