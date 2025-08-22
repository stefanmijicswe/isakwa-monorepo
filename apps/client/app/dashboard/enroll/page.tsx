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
      { id: "CS106", name: "English for IT", acronym: "EIT", ects: 3, semester: "summer", mandatory: false, year: 1 },
      { id: "CS201", name: "Object-Oriented Programming", acronym: "OOP", ects: 6, semester: "winter", mandatory: true, year: 2 },
      { id: "CS202", name: "Database Systems", acronym: "DBS", ects: 6, semester: "winter", mandatory: true, year: 2 },
      { id: "CS203", name: "Software Engineering", acronym: "SE", ects: 6, semester: "winter", mandatory: true, year: 2 },
      { id: "CS204", name: "Web Development", acronym: "WD", ects: 6, semester: "summer", mandatory: true, year: 2 },
      { id: "CS205", name: "Operating Systems", acronym: "OS", ects: 6, semester: "summer", mandatory: true, year: 2 },
      { id: "CS206", name: "Business Communication", acronym: "BC", ects: 3, semester: "summer", mandatory: false, year: 2 },
      { id: "CS301", name: "Computer Networks", acronym: "CN", ects: 6, semester: "winter", mandatory: true, year: 3 },
      { id: "CS302", name: "Artificial Intelligence", acronym: "AI", ects: 6, semester: "winter", mandatory: true, year: 3 },
      { id: "CS303", name: "Machine Learning", acronym: "ML", ects: 6, semester: "winter", mandatory: true, year: 3 },
      { id: "CS304", name: "Software Testing", acronym: "ST", ects: 6, semester: "summer", mandatory: true, year: 3 },
      { id: "CS305", name: "Project Management", acronym: "PM", ects: 6, semester: "summer", mandatory: true, year: 3 },
      { id: "CS306", name: "Elective Course", acronym: "EC", ects: 3, semester: "summer", mandatory: false, year: 3 },
      { id: "CS401", name: "Final Project", acronym: "FP", ects: 12, semester: "winter", mandatory: true, year: 4 },
      { id: "CS402", name: "Internship", acronym: "INT", ects: 6, semester: "summer", mandatory: true, year: 4 },
      { id: "CS403", name: "Advanced Topics", acronym: "AT", ects: 6, semester: "summer", mandatory: true, year: 4 }
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
      { id: "BE106", name: "Business English", acronym: "BE", ects: 3, semester: "summer", mandatory: false, year: 1 },
      { id: "BE201", name: "Microeconomics", acronym: "MIC", ects: 6, semester: "winter", mandatory: true, year: 2 },
      { id: "BE202", name: "Macroeconomics", acronym: "MAC", ects: 6, semester: "winter", mandatory: true, year: 2 },
      { id: "BE203", name: "Business Statistics", acronym: "BS", ects: 6, semester: "winter", mandatory: true, year: 2 },
      { id: "BE204", name: "Corporate Finance", acronym: "CF", ects: 6, semester: "summer", mandatory: true, year: 2 },
      { id: "BE205", name: "Human Resource Management", acronym: "HRM", ects: 6, semester: "summer", mandatory: true, year: 2 },
      { id: "BE206", name: "Business Ethics", acronym: "BETH", ects: 3, semester: "summer", mandatory: false, year: 2 },
      { id: "BE301", name: "Strategic Management", acronym: "SM", ects: 6, semester: "winter", mandatory: true, year: 3 },
      { id: "BE302", name: "International Business", acronym: "IB", ects: 6, semester: "winter", mandatory: true, year: 3 },
      { id: "BE303", name: "Business Research Methods", acronym: "BRM", ects: 6, semester: "winter", mandatory: true, year: 3 },
      { id: "BE304", name: "Operations Management", acronym: "OM", ects: 6, semester: "summer", mandatory: true, year: 3 },
      { id: "BE305", name: "Business Analytics", acronym: "BA", ects: 6, semester: "summer", mandatory: true, year: 3 },
      { id: "BE306", name: "Elective Course", acronym: "EC", ects: 3, semester: "summer", mandatory: false, year: 3 },
      { id: "BE401", name: "Final Thesis", acronym: "FT", ects: 12, semester: "winter", mandatory: true, year: 4 },
      { id: "BE402", name: "Business Internship", acronym: "BI", ects: 6, semester: "summer", mandatory: true, year: 4 },
      { id: "BE403", name: "Advanced Business Topics", acronym: "ABT", ects: 6, semester: "summer", mandatory: true, year: 4 }
    ]
  },
  {
    id: "3",
    name: "Software Engineering",
    faculty: "Informatics and Computing",
    level: "BA",
    duration: 4,
    ects: 240,
    available: true,
    subjects: [
      { id: "SE101", name: "Programming Fundamentals", acronym: "PF", ects: 6, semester: "winter", mandatory: true, year: 1 },
      { id: "SE102", name: "Discrete Mathematics", acronym: "DM", ects: 6, semester: "winter", mandatory: true, year: 1 },
      { id: "SE103", name: "Computer Fundamentals", acronym: "CF", ects: 6, semester: "winter", mandatory: true, year: 1 },
      { id: "SE104", name: "Data Structures and Algorithms", acronym: "DSA", ects: 6, semester: "summer", mandatory: true, year: 1 },
      { id: "SE105", name: "Software Design", acronym: "SD", ects: 6, semester: "summer", mandatory: true, year: 1 },
      { id: "SE106", name: "Technical Writing", acronym: "TW", ects: 3, semester: "summer", mandatory: false, year: 1 },
      { id: "SE201", name: "Software Architecture", acronym: "SA", ects: 6, semester: "winter", mandatory: true, year: 2 },
      { id: "SE202", name: "Database Design", acronym: "DD", ects: 6, semester: "winter", mandatory: true, year: 2 },
      { id: "SE203", name: "Software Testing", acronym: "ST", ects: 6, semester: "winter", mandatory: true, year: 2 },
      { id: "SE204", name: "Web Technologies", acronym: "WT", ects: 6, semester: "summer", mandatory: true, year: 2 },
      { id: "SE205", name: "Mobile Development", acronym: "MD", ects: 6, semester: "summer", mandatory: true, year: 2 },
      { id: "SE206", name: "Professional Skills", acronym: "PS", ects: 3, semester: "summer", mandatory: false, year: 2 },
      { id: "SE301", name: "Software Project Management", acronym: "SPM", ects: 6, semester: "winter", mandatory: true, year: 3 },
      { id: "SE302", name: "Software Security", acronym: "SS", ects: 6, semester: "winter", mandatory: true, year: 3 },
      { id: "SE303", name: "Cloud Computing", acronym: "CC", ects: 6, semester: "winter", mandatory: true, year: 3 },
      { id: "SE304", name: "DevOps Practices", acronym: "DP", ects: 6, semester: "summer", mandatory: true, year: 3 },
      { id: "SE305", name: "Software Quality Assurance", acronym: "SQA", ects: 6, semester: "summer", mandatory: true, year: 3 },
      { id: "SE306", name: "Elective Course", acronym: "EC", ects: 3, semester: "summer", mandatory: false, year: 3 },
      { id: "SE401", name: "Capstone Project", acronym: "CP", ects: 12, semester: "winter", mandatory: true, year: 4 },
      { id: "SE402", name: "Industry Internship", acronym: "II", ects: 6, semester: "summer", mandatory: true, year: 4 },
      { id: "SE403", name: "Advanced Software Topics", acronym: "AST", ects: 6, semester: "summer", mandatory: true, year: 4 }
    ]
  },
  {
    id: "4",
    name: "Applied Artificial Intelligence",
    faculty: "Informatics and Computing",
    level: "MA",
    duration: 2,
    ects: 120,
    available: true,
    subjects: [
      { id: "AI101", name: "Advanced Machine Learning", acronym: "AML", ects: 6, semester: "winter", mandatory: true, year: 1 },
      { id: "AI102", name: "Deep Learning", acronym: "DL", ects: 6, semester: "winter", mandatory: true, year: 1 },
      { id: "AI103", name: "Natural Language Processing", acronym: "NLP", ects: 6, semester: "winter", mandatory: true, year: 1 },
      { id: "AI104", name: "Computer Vision", acronym: "CV", ects: 6, semester: "summer", mandatory: true, year: 1 },
      { id: "AI105", name: "AI Ethics", acronym: "AIE", ects: 3, semester: "summer", mandatory: true, year: 1 },
      { id: "AI106", name: "Research Methods", acronym: "RM", ects: 3, semester: "summer", mandatory: false, year: 1 },
      { id: "AI201", name: "AI Project", acronym: "AIP", ects: 12, semester: "winter", mandatory: true, year: 2 },
      { id: "AI202", name: "Advanced AI Topics", acronym: "AAT", ects: 6, semester: "summer", mandatory: true, year: 2 },
      { id: "AI203", name: "AI Internship", acronym: "AIINT", ects: 6, semester: "summer", mandatory: true, year: 2 }
    ]
  },
  {
    id: "5",
    name: "Data Science",
    faculty: "Informatics and Computing",
    level: "MA",
    duration: 2,
    ects: 120,
    available: true,
    subjects: [
      { id: "DS101", name: "Statistical Analysis", acronym: "SA", ects: 6, semester: "winter", mandatory: true, year: 1 },
      { id: "DS102", name: "Data Mining", acronym: "DM", ects: 6, semester: "winter", mandatory: true, year: 1 },
      { id: "DS103", name: "Big Data Technologies", acronym: "BDT", ects: 6, semester: "winter", mandatory: true, year: 1 },
      { id: "DS104", name: "Data Visualization", acronym: "DV", ects: 6, semester: "summer", mandatory: true, year: 1 },
      { id: "DS105", name: "Data Ethics", acronym: "DE", ects: 3, semester: "summer", mandatory: true, year: 1 },
      { id: "DS106", name: "Research Methods", acronym: "RM", ects: 3, semester: "summer", mandatory: false, year: 1 },
      { id: "DS201", name: "Data Science Project", acronym: "DSP", ects: 12, semester: "winter", mandatory: true, year: 2 },
      { id: "DS202", name: "Advanced Data Topics", acronym: "ADT", ects: 6, semester: "summer", mandatory: true, year: 2 },
      { id: "DS203", name: "Data Science Internship", acronym: "DSINT", ects: 6, semester: "summer", mandatory: true, year: 2 }
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
  return (
    <div className="container mx-auto p-6">
      <h1 className="text-3xl font-bold text-gray-900">Enroll</h1>
    </div>
  );
}
