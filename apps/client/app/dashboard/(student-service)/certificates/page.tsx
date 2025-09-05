'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Command, CommandEmpty, CommandGroup, CommandInput, CommandItem, CommandList } from '@/components/ui/command';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { Check, ChevronsUpDown, FileText, Download, Printer } from 'lucide-react';
import { cn } from '@/lib/utils';

interface Student {
  id: number;
  firstName: string;
  lastName: string;
  email: string;
  studentProfile?: {
    id: number;
    year: number;
    studentIndex?: string;
    enrollmentYear?: string;
    studyProgram?: {
      name: string;
      faculty: {
        name: string;
      };
    };
  };
}

interface AcademicHistory {
  student: {
    id: number;
    firstName: string;
    lastName: string;
    email: string;
    totalECTS: number;
    averageGrade: number;
    grades: Array<{
      id: number;
      grade: number;
      points: number;
      passed: boolean;
      gradedAt: string;
      exam: {
        subject: {
          name: string;
          code: string;
          credits: number;
        };
      };
    }>;
    studyProgram?: {
      name: string;
      faculty: {
        name: string;
      };
    };
    year?: number;
    studentIndex?: string;
  };
  currentEnrollments: any[];
  examRegistrations: any[];
  passedSubjects: any[];
  failedAttempts: any[];
}

export default function CertificatesPage() {
  const [students, setStudents] = useState<Student[]>([]);
  const [selectedStudent, setSelectedStudent] = useState<string>('');
  const [selectedCertificateType, setSelectedCertificateType] = useState<string>('');
  const [academicHistory, setAcademicHistory] = useState<AcademicHistory | null>(null);
  const [loading, setLoading] = useState(false);
  const [generatedCertificate, setGeneratedCertificate] = useState<string>('');

  // Dialog states
  const [studentDialogOpen, setStudentDialogOpen] = useState(false);

  // Certificate types
  const certificateTypes = [
    {
      id: 'enrollment',
      name: 'Enrollment Certificate',
      description: 'Certificate confirming student enrollment in study program',
      icon: FileText
    },
    {
      id: 'progress',
      name: 'Academic Progress Report',
      description: 'Detailed report of student academic progress and achievements',
      icon: FileText
    },
    {
      id: 'transcript',
      name: 'Grade Transcript',
      description: 'Official transcript of all grades and completed courses',
      icon: FileText
    },
    {
      id: 'status',
      name: 'Student Status Certificate',
      description: 'Certificate confirming current student status and enrollment',
      icon: FileText
    }
  ];

  // Fetch students
  useEffect(() => {
    const fetchStudents = async () => {
      try {
        setLoading(true);
        // Fetch with a large limit to get all students
        const response = await fetch('http://localhost:3001/api/users/students?page=1&limit=1000', {
          headers: {
            'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
            'Content-Type': 'application/json',
          }
        });
        
        
        if (response.ok) {
          const data = await response.json();
          setStudents(data.users || []);
        } else {
          const errorText = await response.text();
          console.error('Students API error:', response.status, errorText);
        }
      } catch (error) {
        console.error('Error fetching students:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchStudents();
  }, []);

  // Fetch academic history when student is selected
  useEffect(() => {
    if (selectedStudent) {
      const fetchAcademicHistory = async () => {
        try {
          const student = students.find(s => s.id.toString() === selectedStudent);
          if (student?.studentProfile?.id) {
            const response = await fetch(`http://localhost:3001/api/academic-records/students/${student.studentProfile.id}/academic-history`, {
              headers: {
                'Authorization': `Bearer ${localStorage.getItem('auth_token')}`,
              }
            });
            if (response.ok) {
              const data = await response.json();
              setAcademicHistory(data);
            }
          }
        } catch (error) {
          console.error('Error fetching academic history:', error);
        }
      };

      fetchAcademicHistory();
    }
  }, [selectedStudent, students]);

  // Generate certificate
  const generateCertificate = () => {
    if (!selectedStudent || !selectedCertificateType || !academicHistory) return;

    const student = students.find(s => s.id.toString() === selectedStudent);
    if (!student) return;

    const certificate = generateCertificateHTML(student, selectedCertificateType, academicHistory);
    setGeneratedCertificate(certificate);
  };

  // Generate certificate HTML
  const generateCertificateHTML = (student: Student, type: string, history: AcademicHistory) => {
    const currentDate = new Date().toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });

    const studentName = `${student.firstName} ${student.lastName}`;
    const studentIndex = student.studentProfile?.studentIndex || 'N/A';
    const studyProgram = student.studentProfile?.studyProgram?.name || 'N/A';
    const faculty = student.studentProfile?.studyProgram?.faculty?.name || 'N/A';
    const currentYear = student.studentProfile?.year || 'N/A';

    let certificateContent = '';

    switch (type) {
      case 'enrollment':
        certificateContent = `
          <div class="certificate">
            <div class="header">
              <h1>HARVOX UNIVERSITY</h1>
              <h2>ENROLLMENT CERTIFICATE</h2>
            </div>
            <div class="content">
              <p>This is to certify that <strong>${studentName}</strong> (Student Index: ${studentIndex}) 
              is officially enrolled as a student at Harvox University.</p>
              
              <div class="details">
                <p><strong>Study Program:</strong> ${studyProgram}</p>
                <p><strong>Faculty:</strong> ${faculty}</p>
                <p><strong>Current Year:</strong> ${currentYear}</p>
                <p><strong>Enrollment Status:</strong> Active</p>
              </div>
              
              <p>This certificate is valid for the current academic year and confirms the student's 
              official enrollment status at our institution.</p>
            </div>
            <div class="footer">
              <p>Issued on: ${currentDate}</p>
              <p>Student Service Department</p>
            </div>
          </div>
        `;
        break;

      case 'progress':
        certificateContent = `
          <div class="certificate">
            <div class="header">
              <h1>HARVOX UNIVERSITY</h1>
              <h2>ACADEMIC PROGRESS REPORT</h2>
            </div>
            <div class="content">
              <p>This report provides the academic progress of <strong>${studentName}</strong> 
              (Student Index: ${studentIndex}) for the current academic year.</p>
              
              <div class="details">
                <p><strong>Study Program:</strong> ${studyProgram}</p>
                <p><strong>Faculty:</strong> ${faculty}</p>
                <p><strong>Current Year:</strong> ${currentYear}</p>
              </div>
              
              <div class="progress">
                <h3>Academic Progress Summary:</h3>
                <p><strong>Total Courses:</strong> ${history.currentEnrollments?.length || 0}</p>
                <p><strong>Completed Courses:</strong> ${history.student?.grades?.filter(g => g.passed).length || 0}</p>
                <p><strong>Active Courses:</strong> ${history.currentEnrollments?.filter(c => c.isActive).length || 0}</p>
              </div>
            </div>
            <div class="footer">
              <p>Generated on: ${currentDate}</p>
              <p>Student Service Department</p>
            </div>
          </div>
        `;
        break;

      case 'transcript':
        certificateContent = `
          <div class="certificate">
            <div class="header">
              <h1>HARVOX UNIVERSITY</h1>
              <h2>GRADE TRANSCRIPT</h2>
            </div>
            <div class="content">
              <p>Official transcript for <strong>${studentName}</strong> (Student Index: ${studentIndex})</p>
              
              <div class="details">
                <p><strong>Study Program:</strong> ${studyProgram}</p>
                <p><strong>Faculty:</strong> ${faculty}</p>
                <p><strong>Current Year:</strong> ${currentYear}</p>
              </div>
              
              <div class="grades">
                <h3>Academic Record:</h3>
                ${history.student?.grades?.map(grade => `
                  <div class="grade-item">
                    <span>${grade.exam?.subject?.name || 'Unknown Subject'}</span>
                    <span>Grade: ${grade.grade || 'N/A'}</span>
                    <span>Status: ${grade.passed ? 'Passed' : 'Failed'}</span>
                  </div>
                `).join('') || '<p>No grades available</p>'}
              </div>
            </div>
            <div class="footer">
              <p>Generated on: ${currentDate}</p>
              <p>Student Service Department</p>
            </div>
          </div>
        `;
        break;

      case 'status':
        certificateContent = `
          <div class="certificate">
            <div class="header">
              <h1>HARVOX UNIVERSITY</h1>
              <h2>STUDENT STATUS CERTIFICATE</h2>
            </div>
            <div class="content">
              <p>This certificate confirms the current academic status of <strong>${studentName}</strong> 
              (Student Index: ${studentIndex}) at Harvox University.</p>
              
              <div class="details">
                <p><strong>Study Program:</strong> ${studyProgram}</p>
                <p><strong>Faculty:</strong> ${faculty}</p>
                <p><strong>Current Year:</strong> ${currentYear}</p>
                <p><strong>Academic Status:</strong> Active</p>
                <p><strong>Enrollment Year:</strong> ${student.studentProfile?.enrollmentYear || 'N/A'}</p>
              </div>
              
              <p>This certificate is valid for administrative purposes and confirms the student's 
              current enrollment status at our institution.</p>
            </div>
            <div class="footer">
              <p>Issued on: ${currentDate}</p>
              <p>Student Service Department</p>
            </div>
          </div>
        `;
        break;
    }

    return `
      <!DOCTYPE html>
      <html>
      <head>
        <meta charset="utf-8">
        <title>Certificate - ${studentName}</title>
        <style>
          body { font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; margin: 0; padding: 20px; background: #f5f5f5; }
          .certificate { max-width: 800px; margin: 0 auto; background: white; padding: 40px; border-radius: 12px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); }
          .header { text-align: center; margin-bottom: 30px; border-bottom: 2px solid #3b82f6; padding-bottom: 20px; }
          .header h1 { color: #1e40af; margin: 0; font-size: 28px; font-weight: bold; }
          .header h2 { color: #374151; margin: 10px 0 0 0; font-size: 20px; font-weight: 600; }
          .content { margin-bottom: 30px; line-height: 1.6; }
          .details { background: #f8fafc; padding: 20px; border-radius: 8px; margin: 20px 0; }
          .details p { margin: 8px 0; }
          .progress h3, .grades h3 { color: #374151; border-bottom: 1px solid #e5e7eb; padding-bottom: 8px; }
          .grade-item { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #f3f4f6; }
          .footer { text-align: center; margin-top: 30px; padding-top: 20px; border-top: 1px solid #e5e7eb; color: #6b7280; }
          .footer p { margin: 5px 0; }
        </style>
      </head>
      <body>
        ${certificateContent}
      </body>
      </html>
    `;
  };

  // Download certificate as HTML
  const downloadCertificate = () => {
    if (!generatedCertificate) return;
    
    const blob = new Blob([generatedCertificate], { type: 'text/html' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `certificate-${selectedCertificateType}-${Date.now()}.html`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  // Download certificate as PDF
  const downloadPDF = () => {
    if (!generatedCertificate) return;
    
    // Create a new window with print-optimized styles
    const printWindow = window.open('', '_blank');
    if (printWindow) {
      printWindow.document.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="utf-8">
          <title>Certificate - PDF</title>
          <style>
            @media print {
              @page {
                margin: 0;
                size: A4;
              }
            }
            body { 
              font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; 
              margin: 0; 
              padding: 20px; 
              background: white; 
              -webkit-print-color-adjust: exact;
              print-color-adjust: exact;
            }
            .certificate { 
              max-width: 100%; 
              margin: 0 auto; 
              background: white; 
              padding: 40px; 
              border-radius: 12px; 
              box-shadow: 0 4px 6px rgba(0,0,0,0.1); 
            }
            .header { 
              text-align: center; 
              margin-bottom: 30px; 
              border-bottom: 2px solid #3b82f6; 
              padding-bottom: 20px; 
            }
            .header h1 { 
              color: #1e40af; 
              margin: 0; 
              font-size: 28px; 
              font-weight: bold; 
            }
            .header h2 { 
              color: #374151; 
              margin: 10px 0 0 0; 
              font-size: 20px; 
              font-weight: 600; 
            }
            .content { 
              margin-bottom: 30px; 
              line-height: 1.6; 
            }
            .details { 
              background: #f8fafc; 
              padding: 20px; 
              border-radius: 8px; 
              margin: 20px 0; 
            }
            .details p { 
              margin: 8px 0; 
            }
            .progress h3, .grades h3 { 
              color: #374151; 
              border-bottom: 1px solid #e5e7eb; 
              padding-bottom: 8px; 
            }
            .grade-item { 
              display: flex; 
              justify-content: space-between; 
              padding: 8px 0; 
              border-bottom: 1px solid #f3f4f6; 
            }
            .footer { 
              text-align: center; 
              margin-top: 30px; 
              padding-top: 20px; 
              border-top: 1px solid #e5e7eb; 
              color: #6b7280; 
            }
            .footer p { 
              margin: 5px 0; 
            }
          </style>
        </head>
        <body>
          ${generatedCertificate}
        </body>
        </html>
      `);
      printWindow.document.close();
      
      // Wait for content to load, then trigger print dialog
      printWindow.onload = () => {
        printWindow.print();
      };
    }
  };

  // Get selected student display name
  const getSelectedStudentName = () => {
    if (loading) return 'Loading students...';
    if (!selectedStudent) return 'Choose a student...';
    const student = students.find(s => s.id.toString() === selectedStudent);
    if (!student) return 'Choose a student...';
    return `${student.firstName} ${student.lastName}`;
  };

  return (
    <div className="min-h-screen bg-gray-50/50">
      <div className="container mx-auto px-6 py-4">
        {/* Header - More Compact */}
        <div className="mb-4">
          <h1 className="text-xl font-semibold text-gray-900 mb-1">Certificate Generator</h1>
          <p className="text-xs text-gray-600">Generate official certificates and documents for students</p>
        </div>

        {/* Main Content - Single Column Layout - More Compact */}
        <div className="max-w-xl mx-auto">
          <div className="space-y-3">
            {/* Student Selection - More Compact */}
            <Card className="shadow-sm border border-gray-200 bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-900">Student Selection</CardTitle>
                <CardDescription className="text-xs text-gray-500">Choose a student to generate certificate for</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-3">
                <div className="space-y-1">
                  <Label htmlFor="student" className="text-xs font-medium text-gray-700">
                    Student
                  </Label>
                  <Dialog open={studentDialogOpen} onOpenChange={setStudentDialogOpen}>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        role="combobox"
                        aria-expanded={studentDialogOpen}
                        className="w-full justify-between h-8 text-xs"
                      >
                        {getSelectedStudentName()}
                        <ChevronsUpDown className="ml-2 h-3 w-3 shrink-0 opacity-50" />
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="max-w-md">
                      <DialogHeader>
                        <DialogTitle>Select a student</DialogTitle>
                      </DialogHeader>
                      <Command>
                        <CommandInput placeholder="Search students..." />
                        <CommandList>
                          <CommandEmpty>
                            {loading ? 'Loading students...' : 'No student found.'}
                          </CommandEmpty>
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
                                    "mr-2 h-3 w-3",
                                    selectedStudent === student.id.toString() ? "opacity-100" : "opacity-0"
                                  )}
                                />
                                <div className="flex flex-col">
                                  <span className="font-medium text-sm">
                                    {student.firstName} {student.lastName}
                                  </span>
                                  <span className="text-xs text-gray-500">{student.email}</span>
                                  {student.studentProfile?.studyProgram && (
                                    <span className="text-xs text-gray-400">
                                      {student.studentProfile.studyProgram.name} • Year {student.studentProfile.year}
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
              </CardContent>
            </Card>

            {/* Certificate Type Selection - More Compact */}
            <Card className="shadow-sm border border-gray-200 bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-900">Certificate Type</CardTitle>
                <CardDescription className="text-xs text-gray-500">Choose the type of certificate to generate</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-3">
                <div className="space-y-1">
                  <Label htmlFor="certificateType" className="text-xs font-medium text-gray-700">
                    Type
                  </Label>
                  <Select value={selectedCertificateType} onValueChange={setSelectedCertificateType}>
                    <SelectTrigger className="h-8 text-xs">
                      <SelectValue placeholder="Choose certificate type" />
                    </SelectTrigger>
                    <SelectContent>
                      {certificateTypes.map((type) => (
                        <SelectItem key={type.id} value={type.id}>
                          <div className="flex flex-col">
                            <span className="font-medium text-sm">{type.name}</span>
                            <span className="text-xs text-gray-500">{type.description}</span>
                          </div>
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            {/* Generate and Download Section - More Compact */}
            <Card className="shadow-sm border border-gray-200 bg-white">
              <CardHeader className="pb-2">
                <CardTitle className="text-sm font-medium text-gray-900">Generate & Download</CardTitle>
                <CardDescription className="text-xs text-gray-500">Generate certificate and download in your preferred format</CardDescription>
              </CardHeader>
              <CardContent className="pt-0 pb-3">
                <div className="space-y-2">
                  {/* Generate Button */}
                  <Button
                    onClick={generateCertificate}
                    disabled={!selectedStudent || !selectedCertificateType || loading}
                    className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-2 h-8 text-xs"
                  >
                    {loading ? 'Generating...' : 'Generate Certificate'}
                  </Button>

                  {/* Download Options - Only show when certificate is generated */}
                  {generatedCertificate && (
                    <div className="pt-2 border-t border-gray-100">
                      <p className="text-xs text-gray-600 mb-2">Download options:</p>
                      <div className="flex gap-2">
                        <Button
                          onClick={downloadCertificate}
                          variant="outline"
                          size="sm"
                          className="flex-1 h-7 text-xs"
                        >
                          <Download className="mr-1 h-3 w-3" />
                          Download HTML
                        </Button>
                        <Button
                          onClick={downloadPDF}
                          variant="outline"
                          size="sm"
                          className="flex-1 h-7 text-xs"
                        >
                          <Printer className="mr-1 h-3 w-3" />
                          Print
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}