"use client";

import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  UserPlus, 
  GraduationCap, 
  Search, 
  Plus, 
  User, 
  FileText,
  Users,
  CheckCircle,
  AlertCircle,
  Filter,
  Calendar, 
  BookOpen,
  Clock,
  Mail,
  Phone
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

interface StudyProgram {
  id: string;
  name: string;
  faculty: string;
  level: "BA" | "MA" | "PhD";
  duration: number;
  ects: number;
  available: boolean;
  enrolledCount: number;
  maxStudents: number;
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
  semester: "winter" | "summer";
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
    enrolledCount: 45,
    maxStudents: 60
  },
  {
    id: "2",
    name: "Business Economics",
    faculty: "Business",
    level: "BA",
    duration: 4,
    ects: 240,
    available: true,
    enrolledCount: 38,
    maxStudents: 50
  },
  {
    id: "3",
    name: "Software Engineering",
    faculty: "Informatics and Computing",
    level: "BA",
    duration: 4,
    ects: 240,
    available: true,
    enrolledCount: 32,
    maxStudents: 45
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
    status: "enrolled",
    semester: "winter"
  },
  {
    id: "2",
    studentId: "2021002",
    studentName: "Jane Smith",
    programId: "2",
    programName: "Business Economics",
    year: 3,
    enrollmentDate: "2021-09-01",
    status: "enrolled",
    semester: "winter"
  }
];

export default function EnrollPage() {
  const [searchTerm, setSearchTerm] = useState("");
  const [activeTab, setActiveTab] = useState("overview");
  const [selectedFaculty, setSelectedFaculty] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("");

  const filteredStudents = existingStudents.filter(student =>
    student.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
    student.email.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const getStatusColor = (status: string) => {
    switch (status) {
      case "active": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "inactive": return "bg-slate-50 text-slate-700 border-slate-200";
      case "graduated": return "bg-blue-50 text-blue-700 border-blue-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getEnrollmentStatusColor = (status: string) => {
    switch (status) {
      case "enrolled": return "bg-emerald-50 text-emerald-700 border-emerald-200";
      case "completed": return "bg-blue-50 text-blue-700 border-blue-200";
      case "withdrawn": return "bg-red-50 text-red-700 border-red-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  const getSemesterColor = (semester: string) => {
    switch (semester) {
      case "winter": return "bg-blue-50 text-blue-700 border-blue-200";
      case "summer": return "bg-amber-50 text-amber-700 border-amber-200";
      default: return "bg-slate-50 text-slate-700 border-slate-200";
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-8">
      {/* Header */}
      <div className="mb-8">
      <div className="flex items-center justify-between">
        <div>
            <h1 className="text-3xl font-bold text-slate-900 mb-2">
              Student Enrollment
            </h1>
            <p className="text-slate-600">
              Manage student enrollments, study programs, and academic records
            </p>
        </div>
          <div className="flex items-center space-x-3">
            <Button variant="outline" size="sm">
              <FileText className="h-4 w-4 mr-2" />
              Generate Report
            </Button>
            <Button size="sm">
              <UserPlus className="h-4 w-4 mr-2" />
          New Enrollment
        </Button>
          </div>
        </div>
      </div>



      {/* Quick Actions */}
      <div className="mb-8">
        <div className="bg-white p-6 rounded-lg border border-slate-200">
          <h3 className="text-lg font-medium text-slate-900 mb-4">Quick Actions</h3>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-20 flex-col space-y-2 bg-slate-50 hover:bg-slate-100 border-slate-200">
              <UserPlus className="h-6 w-6 text-blue-600" />
              <span className="text-sm font-medium">New Student</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 bg-slate-50 hover:bg-slate-100 border-slate-200">
              <GraduationCap className="h-6 w-6 text-emerald-600" />
              <span className="text-sm font-medium">Enroll Student</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 bg-slate-50 hover:bg-slate-100 border-slate-200">
              <FileText className="h-6 w-6 text-purple-600" />
              <span className="text-sm font-medium">Generate Report</span>
            </Button>
            <Button variant="outline" className="h-20 flex-col space-y-2 bg-slate-50 hover:bg-slate-100 border-slate-200">
              <Calendar className="h-6 w-6 text-amber-600" />
              <span className="text-sm font-medium">Schedule Exam</span>
            </Button>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <TabsList className="grid w-full grid-cols-4">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="students">Students</TabsTrigger>
          <TabsTrigger value="programs">Study Programs</TabsTrigger>
          <TabsTrigger value="enrollments">Enrollments</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Recent Enrollments */}
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900">Recent Enrollments</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {enrollments.slice(0, 3).map((enrollment) => (
                  <div key={enrollment.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center">
                        <User className="h-5 w-5 text-emerald-600" />
          </div>
                      <div>
                        <div className="font-medium text-slate-900">{enrollment.studentName}</div>
                        <div className="text-sm text-slate-600">{enrollment.programName}</div>
                        <div className="text-xs text-slate-500">Year {enrollment.year}</div>
                      </div>
                      </div>
                    <div className="text-right">
                      <Badge className={getEnrollmentStatusColor(enrollment.status)}>
                        {enrollment.status}
                      </Badge>
                      <Badge className={`mt-2 ${getSemesterColor(enrollment.semester)}`}>
                        {enrollment.semester}
                      </Badge>
                    </div>
                    </div>
                  ))}
              </CardContent>
            </Card>

            {/* Popular Programs */}
            <Card className="border-0 shadow-sm bg-white">
              <CardHeader className="pb-4">
                <CardTitle className="text-lg font-semibold text-slate-900">Popular Programs</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                  {studyPrograms.slice(0, 3).map((program) => (
                  <div key={program.id} className="flex items-center justify-between p-4 bg-slate-50 rounded-lg">
                    <div className="flex items-center space-x-3">
                      <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center">
                        <BookOpen className="h-5 w-5 text-blue-600" />
                      </div>
                      <div>
                        <div className="font-medium text-slate-900">{program.name}</div>
                        <div className="text-sm text-slate-600">{program.faculty}</div>
                        <div className="text-xs text-slate-500">{program.level} • {program.duration} years</div>
                      </div>
                      </div>
                      <div className="text-right">
                      <div className="text-sm font-medium text-slate-900">{program.enrolledCount}/{program.maxStudents}</div>
                      <div className="text-xs text-slate-500">students</div>
                      <div className="w-16 bg-slate-200 rounded-full h-2 mt-1">
                        <div 
                          className="bg-emerald-500 h-2 rounded-full" 
                          style={{ width: `${(program.enrolledCount / program.maxStudents) * 100}%` }}
                        ></div>
                      </div>
                      </div>
                    </div>
                  ))}
              </CardContent>
            </Card>
          </div>

          {/* Academic Calendar */}
          <Card className="border-0 shadow-sm bg-white">
            <CardHeader>
              <CardTitle className="text-lg font-semibold text-slate-900">Academic Calendar</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-blue-50 rounded-lg border border-blue-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Calendar className="h-5 w-5 text-blue-600" />
                    <span className="font-medium text-blue-900">Winter Semester</span>
                  </div>
                  <p className="text-sm text-blue-700">Registration: Sep 1-15</p>
                  <p className="text-sm text-blue-700">Classes: Sep 20 - Jan 15</p>
                </div>
                <div className="p-4 bg-amber-50 rounded-lg border border-amber-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <Clock className="h-5 w-5 text-amber-600" />
                    <span className="font-medium text-amber-900">Summer Semester</span>
                  </div>
                  <p className="text-sm text-amber-700">Registration: Feb 1-15</p>
                  <p className="text-sm text-amber-700">Classes: Feb 20 - Jun 15</p>
                </div>
                <div className="p-4 bg-emerald-50 rounded-lg border border-emerald-200">
                  <div className="flex items-center space-x-2 mb-2">
                    <CheckCircle className="h-5 w-5 text-emerald-600" />
                    <span className="font-medium text-emerald-900">Exams</span>
                  </div>
                  <p className="text-sm text-emerald-700">Winter: Jan 20-30</p>
                  <p className="text-sm text-emerald-700">Summer: Jun 20-30</p>
                </div>
                </div>
              </CardContent>
            </Card>
        </TabsContent>

        <TabsContent value="students" className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-slate-900">Student Management</h3>
                <Button size="sm">
                  <UserPlus className="h-4 w-4 mr-2" />
                  Add Student
                </Button>
              </div>
            </div>
            
            <div className="p-6">
              <div className="flex items-center space-x-4 mb-6">
                <div className="flex-1">
                  <div className="relative">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-slate-400" />
                  <Input
                      placeholder="Search students by name or email..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                      className="pl-10 border-slate-200"
                  />
                </div>
                </div>
                <Button variant="outline" size="sm">
                  <Filter className="h-4 w-4 mr-2" />
                  Filters
                </Button>
              </div>

              <div className="overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Program
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Contact
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                {filteredStudents.map((student) => (
                      <tr key={student.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-blue-100 rounded-full flex items-center justify-center mr-3">
                          <User className="h-5 w-5 text-blue-600" />
                        </div>
                        <div>
                              <div className="text-sm font-medium text-slate-900">
                                {student.firstName} {student.lastName}
                              </div>
                              <div className="text-sm text-slate-500">ID: {student.id}</div>
                              <div className="text-sm text-slate-500">Year {student.currentYear}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div>
                            <div className="text-sm font-medium text-slate-900">{student.currentProgram}</div>
                            <div className="text-sm text-slate-500">Enrolled: {student.enrollmentDate}</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <div className="flex items-center text-sm text-slate-600">
                              <Mail className="h-4 w-4 mr-2" />
                              {student.email}
                            </div>
                            <div className="flex items-center text-sm text-slate-600">
                              <Phone className="h-4 w-4 mr-2" />
                              {student.phone}
                        </div>
                      </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getStatusColor(student.status)}>
                          {student.status}
                        </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <UserPlus className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <FileText className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                      </div>
                    </div>
                  </div>
        </TabsContent>

        <TabsContent value="programs" className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-medium text-slate-900">Study Programs</h3>
                <Button size="sm">
                  <Plus className="h-4 w-4 mr-2" />
                  Add Program
                </Button>
              </div>
              </div>

            <div className="p-6">
              <div className="overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Program
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Faculty
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Details
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Enrollment
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                    {studyPrograms.map((program) => (
                      <tr key={program.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                              <GraduationCap className="h-5 w-5 text-emerald-600" />
                            </div>
                      <div>
                              <div className="text-sm font-medium text-slate-900">{program.name}</div>
                              <div className="text-sm text-slate-500">{program.level}</div>
                            </div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-900">{program.faculty}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-1">
                            <div className="text-sm text-slate-900">{program.duration} years</div>
                            <div className="text-sm text-slate-500">{program.ects} ECTS</div>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="space-y-2">
                            <div className="text-sm text-slate-900">
                              {program.enrolledCount}/{program.maxStudents} students
                            </div>
                            <div className="w-24 bg-slate-200 rounded-full h-2">
                              <div 
                                className="bg-emerald-500 h-2 rounded-full" 
                                style={{ width: `${(program.enrolledCount / program.maxStudents) * 100}%` }}
                              ></div>
                        </div>
                      </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={program.available ? "bg-emerald-50 text-emerald-700 border-emerald-200" : "bg-red-50 text-red-700 border-red-200"}>
                          {program.available ? "Available" : "Not Available"}
                        </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <BookOpen className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <UserPlus className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                      </div>
                    </div>
                  </div>
        </TabsContent>

        <TabsContent value="enrollments" className="space-y-6">
          <div className="bg-white rounded-lg border border-slate-200">
            <div className="p-6 border-b border-slate-200">
              <h3 className="text-lg font-medium text-slate-900">Enrollment Records</h3>
            </div>
            
            <div className="p-6">
              <div className="overflow-hidden">
                <table className="w-full">
                  <thead className="bg-slate-50 border-b border-slate-200">
                    <tr>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Student
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Program
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Academic Year
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Semester
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Status
                      </th>
                      <th className="px-6 py-3 text-left text-xs font-medium text-slate-500 uppercase tracking-wider">
                        Actions
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-slate-200">
                {enrollments.map((enrollment) => (
                      <tr key={enrollment.id} className="hover:bg-slate-50 transition-colors">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="flex items-center">
                            <div className="h-10 w-10 bg-emerald-100 rounded-full flex items-center justify-center mr-3">
                              <User className="h-5 w-5 text-emerald-600" />
                        </div>
                        <div>
                              <div className="text-sm font-medium text-slate-900">{enrollment.studentName}</div>
                              <div className="text-sm text-slate-500">ID: {enrollment.studentId}</div>
                        </div>
                      </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-900">{enrollment.programName}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm text-slate-900">Year {enrollment.year}</div>
                          <div className="text-sm text-slate-500">{enrollment.enrollmentDate}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <Badge className={getSemesterColor(enrollment.semester)}>
                            {enrollment.semester}
                          </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                        <Badge className={getEnrollmentStatusColor(enrollment.status)}>
                          {enrollment.status}
                        </Badge>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
                          <div className="flex items-center space-x-2">
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <FileText className="h-4 w-4" />
                            </Button>
                            <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                              <UserPlus className="h-4 w-4" />
                            </Button>
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
                      </div>
                    </div>
                  </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
