"use client";

import React, { useState, useEffect } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Alert, AlertDescription } from "@/components/ui/alert";
import { UserPlus, CheckCircle, AlertCircle } from "lucide-react";
import { enrollStudent, type EnrollStudentDto, type StudentEnrollment } from "@/lib/enrollment.service";
import { getStudents, type Student } from "@/lib/students.service";
import { getStudyPrograms, type StudyProgram } from "@/lib/study-programs.service";

export default function EnrollPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [studyPrograms, setStudyPrograms] = useState<StudyProgram[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  
  const [enrollmentForm, setEnrollmentForm] = useState({
    studentId: "",
    studyProgramId: "",
    academicYear: "",
    year: ""
  });

  // Fetch data on component mount
  useEffect(() => {
    fetchData();
  }, []);

  const fetchData = async () => {
    try {
      setLoading(true);
      const [studentsResponse, studyProgramsResponse] = await Promise.all([
        getStudents(1, 100),
        getStudyPrograms({ page: 1, limit: 100 })
      ]);
      
      setStudents(studentsResponse.users);
      setStudyPrograms(studyProgramsResponse.data);
    } catch (error) {
      console.error("Error fetching data:", error);
      setError("Failed to load students and study programs");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      // Clear previous messages
      setSuccess(null);
      setError(null);
      
      // Validate form
      if (!enrollmentForm.studentId || !enrollmentForm.studyProgramId || !enrollmentForm.academicYear || !enrollmentForm.year) {
        setError("Please fill in all fields");
        return;
      }

      setSubmitting(true);

      // Create enrollment
      const enrollmentData: EnrollStudentDto = {
        studentId: parseInt(enrollmentForm.studentId),
        studyProgramId: parseInt(enrollmentForm.studyProgramId),
        academicYear: enrollmentForm.academicYear,
        year: parseInt(enrollmentForm.year),
        status: 'ACTIVE'
      };

      const result = await enrollStudent(enrollmentData);
      
      // Success
      setSuccess(`Successfully enrolled ${result.student.firstName} ${result.student.lastName} in ${result.studyProgram.name}`);
      
      // Reset form
      setEnrollmentForm({
        studentId: "",
        studyProgramId: "",
        academicYear: "",
        year: ""
      });

    } catch (error: any) {
      console.error('Error enrolling student:', error);
      setError(error.message || 'Failed to enroll student');
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <div className="flex items-center justify-center h-64">
          <div className="text-center">
            <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
            <p className="text-gray-600 mt-2">Loading...</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6 max-w-2xl">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-gray-900">Student Enrollment</h1>
        <p className="text-gray-600 mt-2">Enroll students in study programs</p>
      </div>

      {/* Success Message */}
      {success && (
        <Alert className="mb-6 border-green-200 bg-green-50">
          <CheckCircle className="h-4 w-4 text-green-600" />
          <AlertDescription className="text-green-800">
            {success}
          </AlertDescription>
        </Alert>
      )}

      {/* Error Message */}
      {error && (
        <Alert className="mb-6 border-red-200 bg-red-50">
          <AlertCircle className="h-4 w-4 text-red-600" />
          <AlertDescription className="text-red-800">
            {error}
          </AlertDescription>
        </Alert>
      )}

      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <UserPlus className="h-5 w-5" />
            Enroll Student
          </CardTitle>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Student Selection */}
            <div>
              <Label htmlFor="student">Student</Label>
              <Select 
                value={enrollmentForm.studentId} 
                onValueChange={(value) => setEnrollmentForm(prev => ({ ...prev, studentId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a student" />
                </SelectTrigger>
                <SelectContent>
                  {students.length === 0 ? (
                    <SelectItem value="no-students" disabled>No students available</SelectItem>
                  ) : (
                    students.map((student) => (
                      <SelectItem key={student.id} value={student.id.toString()}>
                        {student.firstName} {student.lastName} ({student.email})
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Study Program Selection */}
            <div>
              <Label htmlFor="studyProgram">Study Program</Label>
              <Select 
                value={enrollmentForm.studyProgramId} 
                onValueChange={(value) => setEnrollmentForm(prev => ({ ...prev, studyProgramId: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select a study program" />
                </SelectTrigger>
                <SelectContent>
                  {studyPrograms.length === 0 ? (
                    <SelectItem value="no-programs" disabled>No study programs available</SelectItem>
                  ) : (
                    studyPrograms.map((program) => (
                      <SelectItem key={program.id} value={program.id.toString()}>
                        {program.name} ({program.level}, {program.duration} years)
                      </SelectItem>
                    ))
                  )}
                </SelectContent>
              </Select>
            </div>

            {/* Academic Year */}
            <div>
              <Label htmlFor="academicYear">Academic Year</Label>
              <Input
                id="academicYear"
                type="text"
                placeholder="e.g., 2024/2025"
                value={enrollmentForm.academicYear}
                onChange={(e) => setEnrollmentForm(prev => ({ ...prev, academicYear: e.target.value }))}
              />
            </div>

            {/* Year of Study */}
            <div>
              <Label htmlFor="year">Year of Study</Label>
              <Select 
                value={enrollmentForm.year} 
                onValueChange={(value) => setEnrollmentForm(prev => ({ ...prev, year: value }))}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select year of study" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1">1st Year</SelectItem>
                  <SelectItem value="2">2nd Year</SelectItem>
                  <SelectItem value="3">3rd Year</SelectItem>
                  <SelectItem value="4">4th Year</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Submit Button */}
            <Button 
              type="submit" 
              className="w-full" 
              disabled={submitting}
            >
              {submitting ? (
                <>
                  <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                  Enrolling...
                </>
              ) : (
                <>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Enroll Student
                </>
              )}
            </Button>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}