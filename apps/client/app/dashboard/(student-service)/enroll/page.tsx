'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Check, ChevronsUpDown, Search } from 'lucide-react';
import { cn } from '@/lib/utils';

interface StudyProgram {
  id: number;
  name: string;
  description: string;
  duration: number;
  faculty: {
    name: string;
  };
}

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  studentProfile?: {
    id: number;
    year: number;
    studyProgram?: {
      name: string;
    };
  };
}

export default function EnrollPage() {
  const [studyPrograms, setStudyPrograms] = useState<StudyProgram[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Form state
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedProgram, setSelectedProgram] = useState<string>('');
  const [academicYear, setAcademicYear] = useState<string>('2024/2025');
  const [year, setYear] = useState<string>('1');

  // Dialog states
  const [studentDialogOpen, setStudentDialogOpen] = useState(false);
  const [programDialogOpen, setProgramDialogOpen] = useState(false);

  // Fetch study programs
  useEffect(() => {
    const fetchStudyPrograms = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/study-programs');
        if (response.ok) {
          const data = await response.json();
          setStudyPrograms(data.data || []);
        }
      } catch (error) {
        console.error('Error fetching study programs:', error);
      }
    };

    fetchStudyPrograms();
  }, []);

  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/users/students', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
          }
        });
        if (response.ok) {
          const data = await response.json();
          setStudents(data.users || []);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      }
    };

    fetchStudents();
  }, []);

  // Handle enrollment
  const handleEnroll = async () => {
    if (!selectedStudent || !selectedProgram || !academicYear || !year) {
      setError('Please fill in all fields');
      return;
    }

    setLoading(true);
    setError(null);

    try {
      // Find the student profile ID for the selected user
      const student = students.find(s => s.id.toString() === selectedStudent);
      if (!student?.studentProfile?.id) {
        setError('Selected student does not have a profile. Please create a student profile first.');
        return;
      }

      const response = await fetch('http://localhost:3001/api/academic-records/enroll-student', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
        },
        body: JSON.stringify({
          studentId: student.studentProfile.id, // Use StudentProfile.id, not User.id
          studyProgramId: parseInt(selectedProgram),
          academicYear,
          year: parseInt(year),
        }),
      });

      if (response.ok) {
        setSuccess(true);
        // Reset form
        setSelectedStudent('');
        setSelectedProgram('');
        setYear('1');
        // Hide success message after 3 seconds
        setTimeout(() => setSuccess(false), 3000);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Failed to enroll student');
      }
    } catch (error) {
      setError('Network error occurred');
    } finally {
      setLoading(false);
    }
  };

  // Get current academic year
  const currentYear = new Date().getFullYear();
  const academicYears = [
    `${currentYear}/${currentYear + 1}`,
    `${currentYear + 1}/${currentYear + 2}`,
    `${currentYear + 2}/${currentYear + 3}`,
  ];

  // Get selected student display name
  const getSelectedStudentName = () => {
    if (!selectedStudent) return 'Choose a student...';
    const student = students.find(s => s.id.toString() === selectedStudent);
    if (!student) return 'Choose a student...';
    return `${student.firstName} ${student.lastName}`;
  };

  // Get selected program display name
  const getSelectedProgramName = () => {
    if (!selectedProgram) return 'Choose a study program...';
    const program = studyPrograms.find(p => p.id.toString() === selectedProgram);
    if (!program) return 'Choose a study program...';
    return program.name;
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto px-4 py-8">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Student Enrollment</h1>
          <p className="text-gray-600">Enroll students in study programs for the academic year</p>
        </div>

        {/* Main Form Card */}
        <div className="max-w-2xl mx-auto">
          <Card className="shadow-sm border-0 bg-white">
            <CardHeader className="pb-4">
              <CardTitle className="text-xl font-semibold text-gray-900">Enrollment Form</CardTitle>
              <CardDescription>
                Select a student and study program to complete the enrollment process
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Student Selection with Search */}
              <div className="space-y-2">
                <Label htmlFor="student" className="text-sm font-medium text-gray-700">
                  Student
                </Label>
                <Dialog open={studentDialogOpen} onOpenChange={setStudentDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={studentDialogOpen}
                      className="w-full justify-between"
                    >
                      {getSelectedStudentName()}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Select a student</DialogTitle>
                    </DialogHeader>
                    <Command>
                      <CommandInput placeholder="Search students..." />
                      <CommandList>
                        <CommandEmpty>No student found.</CommandEmpty>
                        <CommandGroup>
                          {students.map((student) => (
                            <CommandItem
                              key={student.id}
                              value={student.id.toString()}
                              onSelect={() => {
                                setSelectedStudent(student.id.toString());
                                setStudentDialogOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedStudent === student.id.toString() ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div className="flex flex-col">
                                <span className="font-medium">
                                  {student.firstName} {student.lastName}
                                </span>
                                <span className="text-sm text-gray-500">{student.email}</span>
                                {student.studentProfile?.studyProgram && (
                                  <span className="text-xs text-gray-400">
                                    Currently: {student.studentProfile.studyProgram.name}
                                  </span>
                                )}
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Study Program Selection with Search */}
              <div className="space-y-2">
                <Label htmlFor="program" className="text-sm font-medium text-gray-700">
                  Study Program
                </Label>
                <Dialog open={programDialogOpen} onOpenChange={setProgramDialogOpen}>
                  <DialogTrigger asChild>
                    <Button
                      variant="outline"
                      role="combobox"
                      aria-expanded={programDialogOpen}
                      className="w-full justify-between"
                    >
                      {getSelectedProgramName()}
                      <ChevronsUpDown className="ml-2 h-4 w-4 shrink-0 opacity-50" />
                    </Button>
                  </DialogTrigger>
                  <DialogContent className="max-w-md">
                    <DialogHeader>
                      <DialogTitle>Select a study program</DialogTitle>
                    </DialogHeader>
                    <Command>
                      <CommandInput placeholder="Search study programs..." />
                      <CommandList>
                        <CommandEmpty>No study program found.</CommandEmpty>
                        <CommandGroup>
                          {studyPrograms.map((program) => (
                            <CommandItem
                              key={program.id}
                              value={program.id.toString()}
                              onSelect={() => {
                                setSelectedProgram(program.id.toString());
                                setProgramDialogOpen(false);
                              }}
                            >
                              <Check
                                className={cn(
                                  "mr-2 h-4 w-4",
                                  selectedProgram === program.id.toString() ? "opacity-100" : "opacity-0"
                                )}
                              />
                              <div className="flex flex-col">
                                <span className="font-medium">{program.name}</span>
                                <span className="text-sm text-gray-500">
                                  {program.faculty.name} • {program.duration} years
                                </span>
                              </div>
                            </CommandItem>
                          ))}
                        </CommandGroup>
                      </CommandList>
                    </Command>
                  </DialogContent>
                </Dialog>
              </div>

              {/* Academic Year and Year */}
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="academicYear" className="text-sm font-medium text-gray-700">
                    Academic Year
                  </Label>
                  <Select value={academicYear} onValueChange={setAcademicYear}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {academicYears.map((year) => (
                        <SelectItem key={year} value={year}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="year" className="text-sm font-medium text-gray-700">
                    Year of Study
                  </Label>
                  <Select value={year} onValueChange={setYear}>
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {[1, 2, 3, 4, 5].map((y) => (
                        <SelectItem key={y} value={y.toString()}>
                          Year {y}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>

              <Separator />

              {/* Submit Button */}
              <Button
                onClick={handleEnroll}
                disabled={loading || !selectedStudent || !selectedProgram}
                className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3"
              >
                {loading ? 'Enrolling...' : 'Enroll Student'}
              </Button>

              {/* Success/Error Messages */}
              {success && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg">
                  <p className="text-green-800 font-medium">
                    ✅ Student enrolled successfully!
                  </p>
                </div>
              )}

              {error && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                  <p className="text-red-800 font-medium">
                    ❌ {error}
                  </p>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
