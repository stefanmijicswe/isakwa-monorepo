"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { 
  Search, 
  User, 
  BookOpen, 
  Calculator,
  CheckCircle,
  XCircle,
  AlertCircle
} from "lucide-react";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  year: number;
  status: "active" | "inactive";
}

interface Course {
  id: string;
  name: string;
  acronym: string;
  ects: number;
  semester: "winter" | "summer";
  professor: string;
}

interface ExamRegistration {
  id: string;
  studentId: string;
  studentName: string;
  courseId: string;
  courseName: string;
  courseAcronym: string;
  examTerm: string;
}

const students: Student[] = [
  {
    id: "2021001",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@student.edu",
    year: 2,
    status: "active"
  },
  {
    id: "2021002",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@student.edu",
    year: 3,
    status: "active"
  },
  {
    id: "2021003",
    firstName: "Michael",
    lastName: "Brown",
    email: "michael.brown@student.edu",
    year: 2,
    status: "active"
  },
  {
    id: "2021004",
    firstName: "Sarah",
    lastName: "Johnson",
    email: "sarah.johnson@student.edu",
    year: 3,
    status: "active"
  }
];

const courses: Course[] = [
  {
    id: "CS201",
    name: "Object-Oriented Programming",
    acronym: "OOP",
    ects: 6,
    semester: "winter",
    professor: "Prof. Johnson"
  },
  {
    id: "CS202",
    name: "Database Systems",
    acronym: "DBS",
    ects: 6,
    semester: "winter",
    professor: "Prof. Johnson"
  },
  {
    id: "CS203",
    name: "Software Engineering",
    acronym: "SE",
    ects: 6,
    semester: "winter",
    professor: "Prof. Johnson"
  },
  {
    id: "BE201",
    name: "Microeconomics",
    acronym: "MIC",
    ects: 6,
    semester: "winter",
    professor: "Prof. Brown"
  }
];

const examRegistrations: ExamRegistration[] = [
  {
    id: "1",
    studentId: "2021001",
    studentName: "John Doe",
    courseId: "CS201",
    courseName: "Object-Oriented Programming",
    courseAcronym: "OOP",
    examTerm: "January 2025"
  },
  {
    id: "2",
    studentId: "2021001",
    studentName: "John Doe",
    courseId: "CS202",
    courseName: "Database Systems",
    courseAcronym: "DBS",
    examTerm: "January 2025"
  },
  {
    id: "3",
    studentId: "2021002",
    studentName: "Jane Smith",
    courseId: "CS201",
    courseName: "Object-Oriented Programming",
    courseAcronym: "OOP",
    examTerm: "January 2025"
  },
  {
    id: "4",
    studentId: "2021003",
    studentName: "Michael Brown",
    courseId: "CS203",
    courseName: "Software Engineering",
    courseAcronym: "SE",
    examTerm: "January 2025"
  },
  {
    id: "5",
    studentId: "2021004",
    studentName: "Sarah Johnson",
    courseId: "BE201",
    courseName: "Microeconomics",
    courseAcronym: "MIC",
    examTerm: "January 2025"
  }
];

export default function GradingPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRegistration, setSelectedRegistration] = useState<ExamRegistration | null>(null);
  const [showGradingModal, setShowGradingModal] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [gradedStudent, setGradedStudent] = useState<{name: string, course: string} | null>(null);
  const [gradingForm, setGradingForm] = useState({
    midterm1: "",
    midterm2: "",
    finalExam: "",
    attendance: ""
  });

  const filteredRegistrations = examRegistrations.filter(registration =>
    registration.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    registration.courseName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    registration.courseAcronym.toLowerCase().includes(searchTerm.toLowerCase()) ||
    registration.studentId.includes(searchTerm)
  );

  const calculateGrade = (totalPoints: number): number => {
    if (totalPoints < 51) return 5;
    if (totalPoints <= 60) return 6;
    if (totalPoints <= 70) return 7;
    if (totalPoints <= 80) return 8;
    if (totalPoints <= 90) return 9;
    return 10;
  };

  const isPassing = (totalPoints: number): boolean => {
    return totalPoints >= 51;
  };

  const isFormValid = (): boolean => {
    const midterm1 = parseFloat(gradingForm.midterm1) || 0;
    const midterm2 = parseFloat(gradingForm.midterm2) || 0;
    const finalExam = parseFloat(gradingForm.finalExam) || 0;
    const attendance = parseFloat(gradingForm.attendance) || 0;

    return midterm1 >= 0 && midterm1 <= 30 &&
           midterm2 >= 0 && midterm2 <= 30 &&
           finalExam >= 0 && finalExam <= 30 &&
           attendance >= 0 && attendance <= 10;
  };

  const handleGradeStudent = (registration: ExamRegistration) => {
    setSelectedRegistration(registration);
    setGradingForm({
      midterm1: "",
      midterm2: "",
      finalExam: "",
      attendance: ""
    });
    setShowGradingModal(true);
  };

  const handleSaveGrade = () => {
    if (!selectedRegistration) return;

    const midterm1 = parseFloat(gradingForm.midterm1) || 0;
    const midterm2 = parseFloat(gradingForm.midterm2) || 0;
    const finalExam = parseFloat(gradingForm.finalExam) || 0;
    const attendance = parseFloat(gradingForm.attendance) || 0;

    // Validate that all values are within their respective ranges
    if (midterm1 < 0 || midterm1 > 30) return;
    if (midterm2 < 0 || midterm2 > 30) return;
    if (finalExam < 0 || finalExam > 30) return;
    if (attendance < 0 || attendance > 10) return;

    const examPoints = midterm1 + midterm2 + finalExam;
    const totalPoints = examPoints >= 51 ? examPoints + attendance : examPoints;
    const grade = calculateGrade(totalPoints);
    const passed = isPassing(totalPoints);

    // Remove the graded registration from the list
    const registrationIndex = examRegistrations.findIndex(r => r.id === selectedRegistration.id);
    if (registrationIndex !== -1) {
      examRegistrations.splice(registrationIndex, 1);
    }

    // Set success modal data
    setGradedStudent({
      name: selectedRegistration.studentName,
      course: selectedRegistration.courseName
    });

    setShowGradingModal(false);
    setSelectedRegistration(null);
    setGradingForm({
      midterm1: "",
      midterm2: "",
      finalExam: "",
      attendance: ""
    });

    // Show success modal
    setShowSuccessModal(true);
  };



  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Grading</h1>
          <p className="text-gray-600">Grade students who have registered for exams</p>
        </div>
        <div className="flex items-center space-x-2 text-sm text-gray-600">
          <Calculator className="h-5 w-5" />
          <span>{examRegistrations.length} exams pending grading</span>
        </div>
      </div>

            <Card>
        <CardHeader>
          <CardTitle>Pending Exam Grading</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-4 w-4" />
              <Input
                placeholder="Search by student name, course, or ID..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            
            <div className="space-y-3">
              {filteredRegistrations.map((registration) => {
                const student = students.find(s => s.id === registration.studentId);
                const course = courses.find(c => c.id === registration.courseId);
                
                return (
                  <div key={registration.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <div className="flex-1">
                        <h3 className="font-medium">{registration.studentName}</h3>
                        <div className="text-sm text-gray-600 space-y-1">
                          <p>ID: {registration.studentId}</p>
                          <p>Course: {registration.courseName} ({registration.courseAcronym})</p>
                          <p>Exam Term: {registration.examTerm}</p>
                          {student && <p>Year: {student.year}</p>}
                        </div>
                      </div>
                      <div className="flex items-center space-x-2">
                        <Badge className="bg-yellow-100 text-yellow-800">
                          Pending Grade
                        </Badge>
                        {course && (
                          <Badge variant="outline">
                            {course.ects} ECTS
                          </Badge>
                        )}
                      </div>
                    </div>
                    
                    <div className="border-t pt-3">
                      <Button
                        onClick={() => handleGradeStudent(registration)}
                        className="w-full"
                      >
                        Grade Student
                      </Button>
                    </div>
                  </div>
                );
              })}
              
              {filteredRegistrations.length === 0 && (
                <p className="text-center text-gray-500 py-8">
                  {searchTerm ? "No exam registrations found matching your search" : "No exam registrations found"}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>

      {showGradingModal && selectedRegistration && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 w-full max-w-md mx-4">
            <h2 className="text-xl font-bold mb-4">Grade Student</h2>
            <div className="space-y-4">
              <div>
                <Label htmlFor="student-name">Student</Label>
                <Input
                  id="student-name"
                  value={selectedRegistration.studentName}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              <div>
                <Label htmlFor="course-name">Course</Label>
                <Input
                  id="course-name"
                  value={`${selectedRegistration.courseName} (${selectedRegistration.courseAcronym})`}
                  disabled
                  className="bg-gray-50"
                />
              </div>
              
                             <div className="grid grid-cols-2 gap-4">
                 <div>
                   <Label htmlFor="midterm1">Midterm 1 (0-30)</Label>
                   <Input
                     id="midterm1"
                     type="number"
                     value={gradingForm.midterm1}
                     onChange={(e) => {
                       const value = e.target.value;
                       const numValue = parseFloat(value);
                       if (value === "" || (numValue >= 0 && numValue <= 30)) {
                         setGradingForm({...gradingForm, midterm1: value});
                       }
                     }}
                     min="0"
                     max="30"
                     placeholder="0"
                   />
                   <p className="text-xs text-gray-500 mt-1">Min: 15 to pass</p>
                 </div>
                 <div>
                   <Label htmlFor="midterm2">Midterm 2 (0-30)</Label>
                   <Input
                     id="midterm2"
                     type="number"
                     value={gradingForm.midterm2}
                     onChange={(e) => {
                       const value = e.target.value;
                       const numValue = parseFloat(value);
                       if (value === "" || (numValue >= 0 && numValue <= 30)) {
                         setGradingForm({...gradingForm, midterm2: value});
                       }
                     }}
                     min="0"
                     max="30"
                     placeholder="0"
                   />
                   <p className="text-xs text-gray-500 mt-1">Min: 15 to pass</p>
                 </div>
               </div>
               
               <div className="grid grid-cols-2 gap-4">
                 <div>
                   <Label htmlFor="final-exam">Final Exam (0-30)</Label>
                   <Input
                     id="final-exam"
                     type="number"
                     value={gradingForm.finalExam}
                     onChange={(e) => {
                       const value = e.target.value;
                       const numValue = parseFloat(value);
                       if (value === "" || (numValue >= 0 && numValue <= 30)) {
                         setGradingForm({...gradingForm, finalExam: value});
                       }
                     }}
                     min="0"
                     max="30"
                     placeholder="0"
                   />
                   <p className="text-xs text-gray-500 mt-1">No minimum</p>
                 </div>
                 <div>
                   <Label htmlFor="attendance">Attendance (0-10)</Label>
                   <Input
                     id="attendance"
                     type="number"
                     value={gradingForm.attendance}
                     onChange={(e) => {
                       const value = e.target.value;
                       const numValue = parseFloat(value);
                       if (value === "" || (numValue >= 0 && numValue <= 10)) {
                         setGradingForm({...gradingForm, attendance: value});
                       }
                     }}
                     min="0"
                     max="10"
                     placeholder="0"
                   />
                 </div>
               </div>
              
                             <div className="p-3 bg-blue-50 border border-blue-200 rounded-lg">
                 <div className="text-sm text-blue-800">
                   <div className="flex items-center justify-between mb-1">
                     <span>Exam Points:</span>
                     <span className="font-medium">
                       {(() => {
                         const examPoints = (parseFloat(gradingForm.midterm1) || 0) + 
                                          (parseFloat(gradingForm.midterm2) || 0) + 
                                          (parseFloat(gradingForm.finalExam) || 0);
                         return `${examPoints}/90`;
                       })()}
                     </span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span>Attendance Bonus:</span>
                     <span className="font-medium">
                       {(() => {
                         const examPoints = (parseFloat(gradingForm.midterm1) || 0) + 
                                          (parseFloat(gradingForm.midterm2) || 0) + 
                                          (parseFloat(gradingForm.finalExam) || 0);
                         const attendance = examPoints >= 51 ? (parseFloat(gradingForm.attendance) || 0) : 0;
                         return attendance > 0 ? `${attendance}/10` : "Not applicable";
                       })()}
                     </span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span>Total Points:</span>
                     <span className="font-medium">
                       {(() => {
                         const examPoints = (parseFloat(gradingForm.midterm1) || 0) + 
                                          (parseFloat(gradingForm.midterm2) || 0) + 
                                          (parseFloat(gradingForm.finalExam) || 0);
                         const total = examPoints >= 51 ? examPoints + (parseFloat(gradingForm.attendance) || 0) : examPoints;
                         return `${total}/100`;
                       })()}
                     </span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span>Grade:</span>
                     <span className="font-medium">
                       {(() => {
                         const examPoints = (parseFloat(gradingForm.midterm1) || 0) + 
                                          (parseFloat(gradingForm.midterm2) || 0) + 
                                          (parseFloat(gradingForm.finalExam) || 0);
                         const total = examPoints >= 51 ? examPoints + (parseFloat(gradingForm.midterm1) || 0) : examPoints;
                         return total >= 51 ? calculateGrade(total) : 5;
                       })()}
                     </span>
                   </div>
                   <div className="flex items-center justify-between">
                     <span>Status:</span>
                     <span className={`font-medium ${(() => {
                       const examPoints = (parseFloat(gradingForm.midterm1) || 0) + 
                                          (parseFloat(gradingForm.midterm2) || 0) + 
                                          (parseFloat(gradingForm.finalExam) || 0);
                       const total = examPoints >= 51 ? examPoints + (parseFloat(gradingForm.attendance) || 0) : examPoints;
                       return total >= 51 ? 'text-green-600' : 'text-red-600';
                     })()}`}>
                       {(() => {
                         const examPoints = (parseFloat(gradingForm.midterm1) || 0) + 
                                          (parseFloat(gradingForm.midterm2) || 0) + 
                                          (parseFloat(gradingForm.finalExam) || 0);
                         const total = examPoints >= 51 ? examPoints + (parseFloat(gradingForm.attendance) || 0) : examPoints;
                         return total >= 51 ? 'Passed' : 'Failed';
                       })()}
                     </span>
                   </div>
                 </div>
               </div>
              
                             <div className="flex space-x-2">
                 <Button 
                   onClick={handleSaveGrade} 
                   className="flex-1"
                   disabled={!isFormValid()}
                 >
                   Save Grade
                 </Button>
                 <Button 
                   onClick={() => setShowGradingModal(false)} 
                   variant="outline" 
                   className="flex-1"
                 >
                   Cancel
                 </Button>
               </div>
            </div>
          </div>
        </div>
      )}

      {showSuccessModal && gradedStudent && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
          <div className="bg-white rounded-lg p-6 max-w-md w-full mx-4">
            <div className="text-center">
              <div className="mx-auto flex items-center justify-center h-12 w-12 rounded-full bg-green-100 mb-4">
                <CheckCircle className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-lg font-medium text-gray-900 mb-2">
                Grade Saved Successfully!
              </h3>
              <p className="text-sm text-gray-600 mb-6">
                {gradedStudent.name} has been graded for {gradedStudent.course}
              </p>
              <Button
                onClick={() => setShowSuccessModal(false)}
                className="w-full"
              >
                Continue
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
