"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { 
  UserPlus, 
  GraduationCap, 
  Search, 
  Plus, 
  User, 
  Calendar, 
  BookOpen,
  Users,
  ArrowUp,
  CheckCircle,
  AlertCircle
} from "lucide-react";

interface Student {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  dateOfBirth: string;
  phone: string;
  address: string;
  currentYear?: number;
  currentProgram?: string;
  enrollmentDate?: string;
  status: "active" | "inactive" | "graduated";
  failedSubjects?: string[];
  enrolledSubjects?: string[];
  pendingSubjects?: string[];
}

interface Subject {
  id: string;
  name: string;
  acronym: string;
  ects: number;
  semester: "winter" | "summer";
  mandatory: boolean;
  year: number;
}

interface StudyProgram {
  id: string;
  name: string;
  faculty: string;
  level: "BA" | "MA" | "PhD";
  duration: number;
  ects: number;
  available: boolean;
  subjects: Subject[];
}

interface Enrollment {
  id: string;
  studentId: string;
  studentName: string;
  programId: string;
  programName: string;
  year: number;
  enrollmentDate: string;
  status: "enrolled" | "completed" | "withdrawn";
}

const existingStudents: Student[] = [
  {
    id: "2021001",
    firstName: "John",
    lastName: "Doe",
    email: "john.doe@student.edu",
    dateOfBirth: "2000-05-15",
    phone: "+381 60 123 4567",
    address: "Belgrade, Serbia",
    currentYear: 2,
    currentProgram: "Computer Science",
    enrollmentDate: "2021-09-01",
    status: "active",
    failedSubjects: ["CS101", "CS102"],
    enrolledSubjects: ["CS201", "CS202", "CS203", "CS204", "CS205", "CS206"],
    pendingSubjects: ["CS301", "CS302", "CS303", "CS304", "CS305", "CS306"]
  },
  {
    id: "2021002",
    firstName: "Jane",
    lastName: "Smith",
    email: "jane.smith@student.edu",
    dateOfBirth: "1999-08-22",
    phone: "+381 60 234 5678",
    address: "Novi Sad, Serbia",
    currentYear: 3,
    currentProgram: "Business Economics",
    enrollmentDate: "2021-09-01",
    status: "active",
    failedSubjects: ["BE201"],
    enrolledSubjects: ["BE301", "BE302", "BE303", "BE304", "BE305", "BE306"],
    pendingSubjects: ["BE401", "BE402", "BE403"]
  },
  {
    id: "2020001",
    firstName: "Michael",
    lastName: "Brown",
    email: "michael.brown@student.edu",
    dateOfBirth: "1998-12-10",
    phone: "+381 60 345 6789",
    address: "Niš, Serbia",
    currentYear: 4,
    currentProgram: "Software Engineering",
    enrollmentDate: "2020-09-01",
    status: "active",
    failedSubjects: [],
    enrolledSubjects: ["SE401", "SE402", "SE403"],
    pendingSubjects: []
  }
];

const studyPrograms: StudyProgram[] = [
  {
    id: "1",
    name: "Computer Science",
    faculty: "Informatics and Computing",
    level: "BA",
    duration: 4,
    ects: 240,
    available: true,
    subjects: [
      { id: "CS101", name: "Introduction to Programming", acronym: "ITP", ects: 6, semester: "winter", mandatory: true, year: 1 },
      { id: "CS102", name: "Mathematics for Computer Science", acronym: "MCS", ects: 6, semester: "winter", mandatory: true, year: 1 },
      { id: "CS103", name: "Computer Architecture", acronym: "CA", ects: 6, semester: "winter", mandatory: true, year: 1 },
      { id: "CS104", name: "Data Structures", acronym: "DS", ects: 6, semester: "summer", mandatory: true, year: 1 },
      { id: "CS105", name: "Algorithms", acronym: "ALG", ects: 6, semester: "summer", mandatory: true, year: 1 },
      { id: "CS106", name: "English for IT", acronym: "EIT", ects: 3, semester: "summer", mandatory: false, year: 1 }
    ]
  },
  {
    id: "2",
    name: "Business Economics",
    faculty: "Business",
    level: "BA",
    duration: 4,
    ects: 240,
    available: true,
    subjects: [
      { id: "BE101", name: "Introduction to Economics", acronym: "IE", ects: 6, semester: "winter", mandatory: true, year: 1 },
      { id: "BE102", name: "Business Mathematics", acronym: "BM", ects: 6, semester: "winter", mandatory: true, year: 1 },
      { id: "BE103", name: "Business Law", acronym: "BL", ects: 6, semester: "winter", mandatory: true, year: 1 },
      { id: "BE104", name: "Marketing Principles", acronym: "MP", ects: 6, semester: "summer", mandatory: true, year: 1 },
      { id: "BE105", name: "Financial Accounting", acronym: "FA", ects: 6, semester: "summer", mandatory: true, year: 1 },
      { id: "BE106", name: "Business English", acronym: "BE", ects: 3, semester: "summer", mandatory: false, year: 1 }
    ]
  }
];

const enrollments: Enrollment[] = [
  {
    id: "1",
    studentId: "2021001",
    studentName: "John Doe",
    programId: "1",
    programName: "Computer Science",
    year: 2,
    enrollmentDate: "2021-09-01",
    status: "enrolled"
  },
  {
    id: "2",
    studentId: "2021002",
    studentName: "Jane Smith",
    programId: "2",
    programName: "Business Economics",
    year: 3,
    enrollmentDate: "2021-09-01",
    status: "enrolled"
  }
];

export default function EnrollPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedProgram, setSelectedProgram] = useState("");
  const [newStudent, setNewStudent] = useState({
    firstName: "",
    lastName: "",
    email: "",
    dateOfBirth: "",
    phone: "",
    address: ""
  });

  const filteredStudents = existingStudents.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const filteredPrograms = studyPrograms.filter(program =>
    selectedProgram === "" || program.id === selectedProgram
  );

  const handleNewStudentSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Here you would typically send the data to your backend
    console.log("New student data:", newStudent);
    // Reset form
    setNewStudent({
      firstName: "",
      lastName: "",
      email: "",
      dateOfBirth: "",
      phone: "",
      address: ""
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-green-100 text-green-800";
      case "inactive": return "bg-gray-100 text-gray-800";
      case "graduated": return "bg-blue-100 text-blue-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getEnrollmentStatusColor = (status: string) => {
    switch (status) {
      case "enrolled": return "bg-green-100 text-green-800";
      case "completed": return "bg-blue-100 text-blue-800";
      case "withdrawn": return "bg-red-100 text-red-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Student Enrollment</h1>
          <p className="text-gray-600 mt-2">Manage student enrollments and study programs</p>
        </div>
        <Button className="bg-blue-600 hover:bg-blue-700">
          <Plus className="h-4 w-4 mr-2" />
          New Enrollment
        </Button>
      </div>

      <Tabs defaultValue="overview" className="w-full">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="programs">Study Programs</TabsTrigger>
          <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Total Students</CardTitle>
                <Users className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{existingStudents.length}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+12%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Programs</CardTitle>
                <GraduationCap className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{studyPrograms.filter(p => p.available).length}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+2</span> new programs
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Active Enrollments</CardTitle>
                <CheckCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{enrollments.filter(e => e.status === "enrolled").length}</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-green-600">+8%</span> from last month
                </p>
              </CardContent>
            </Card>

            <Card>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">Pending Applications</CardTitle>
                <AlertCircle className="h-4 w-4 text-muted-foreground" />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">5</div>
                <p className="text-xs text-muted-foreground">
                  <span className="text-orange-600">3</span> require review
                </p>
              </CardContent>
            </Card>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Recent Enrollments</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {enrollments.slice(0, 3).map((enrollment) => (
                    <div key={enrollment.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{enrollment.studentName}</p>
                        <p className="text-sm text-gray-600">{enrollment.programName}</p>
                      </div>
                      <Badge className={getEnrollmentStatusColor(enrollment.status)}>
                        {enrollment.status}
                      </Badge>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Popular Programs</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {studyPrograms.slice(0, 3).map((program) => (
                    <div key={program.id} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div>
                        <p className="font-medium">{program.name}</p>
                        <p className="text-sm text-gray-600">{program.faculty}</p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium">{program.level}</p>
                        <p className="text-xs text-gray-600">{program.duration} years</p>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Student Management</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex-1">
                  <Search className="absolute left-3 top-3 h-4 w-4 text-gray-400" />
                  <Input
                    placeholder="Search students..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="pl-10"
                  />
                </div>
                <Button>
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </div>

              <div className="space-y-4">
                {filteredStudents.map((student) => (
                  <div key={student.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{student.firstName} {student.lastName}</h3>
                          <p className="text-sm text-gray-600">{student.email}</p>
                          <p className="text-sm text-gray-500">{student.phone}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getStatusColor(student.status)}>
                          {student.status}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">
                          {student.currentProgram} - Year {student.currentYear}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="programs" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Study Programs</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex-1">
                  <Label htmlFor="program-filter">Filter by Program</Label>
                  <select
                    id="program-filter"
                    value={selectedProgram}
                    onChange={(e) => setSelectedProgram(e.target.value)}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="">All Programs</option>
                    {studyPrograms.map((program) => (
                      <option key={program.id} value={program.id}>
                        {program.name}
                      </option>
                    ))}
                  </select>
                </div>
                <Button>
                  <Plus className="h-4 w-4 mr-2" />
                  Add Program
                </Button>
              </div>

              <div className="space-y-4">
                {filteredPrograms.map((program) => (
                  <div key={program.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="font-medium text-lg">{program.name}</h3>
                        <p className="text-gray-600">{program.faculty}</p>
                        <div className="flex items-center space-x-4 mt-2">
                          <Badge variant="outline">{program.level}</Badge>
                          <Badge variant="outline">{program.duration} years</Badge>
                          <Badge variant="outline">{program.ects} ECTS</Badge>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={program.available ? "bg-green-100 text-green-800" : "bg-red-100 text-red-800"}>
                          {program.available ? "Available" : "Not Available"}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-2">
                          {program.subjects.length} subjects
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="enrollments" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Enrollment Records</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {enrollments.map((enrollment) => (
                  <div key={enrollment.id} className="border rounded-lg p-4">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="h-10 w-10 bg-green-100 rounded-full flex items-center justify-center">
                          <GraduationCap className="h-5 w-5 text-green-600" />
                        </div>
                        <div>
                          <h3 className="font-medium">{enrollment.studentName}</h3>
                          <p className="text-sm text-gray-600">{enrollment.programName}</p>
                          <p className="text-sm text-gray-500">Year {enrollment.year}</p>
                        </div>
                      </div>
                      <div className="text-right">
                        <Badge className={getEnrollmentStatusColor(enrollment.status)}>
                          {enrollment.status}
                        </Badge>
                        <p className="text-sm text-gray-600 mt-1">
                          {enrollment.enrollmentDate}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
