"use client";

import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { BookOpen, GraduationCap, Calendar } from "lucide-react";

interface EnrolledCourse {
  id: string;
  name: string;
  acronym: string;
  ects: number;
  professor: string;
  type: "mandatory" | "elective";
  semester: "winter" | "summer";
}

const enrolledCourses: EnrolledCourse[] = [
  {
    id: "1",
    name: "Introduction to Computer Science",
    acronym: "CS101",
    ects: 6,
    professor: "Prof. Dr. John Smith",
    type: "mandatory",
    semester: "winter"
  },
  {
    id: "2",
    name: "Mathematics for Computer Science",
    acronym: "MATH101",
    ects: 8,
    professor: "Prof. Dr. Sarah Johnson",
    type: "mandatory",
    semester: "winter"
  },
  {
    id: "3",
    name: "Programming Fundamentals",
    acronym: "CS102",
    ects: 7,
    professor: "Prof. Dr. Michael Brown",
    type: "mandatory",
    semester: "winter"
  },
  {
    id: "4",
    name: "Digital Logic Design",
    acronym: "CS103",
    ects: 5,
    professor: "Prof. Dr. Emily Davis",
    type: "mandatory",
    semester: "winter"
  },
  {
    id: "5",
    name: "Web Development Basics",
    acronym: "CS201",
    ects: 6,
    professor: "Prof. Dr. Robert Wilson",
    type: "elective",
    semester: "summer"
  },
  {
    id: "6",
    name: "Database Systems",
    acronym: "CS202",
    ects: 7,
    professor: "Prof. Dr. Lisa Anderson",
    type: "mandatory",
    semester: "summer"
  },
  {
    id: "7",
    name: "Software Engineering",
    acronym: "CS203",
    ects: 8,
    professor: "Prof. Dr. David Thompson",
    type: "mandatory",
    semester: "summer"
  },
  {
    id: "8",
    name: "Artificial Intelligence",
    acronym: "CS301",
    ects: 6,
    professor: "Prof. Dr. Jennifer Lee",
    type: "elective",
    semester: "summer"
  }
];

export default function CoursesPage() {
  // Simplified calculations to avoid potential errors
  const totalEcts = enrolledCourses.reduce((sum, course) => sum + course.ects, 0);
  const mandatoryCourses = enrolledCourses.filter(course => course.type === "mandatory");
  const electiveCourses = enrolledCourses.filter(course => course.type === "elective");
  const winterCourses = enrolledCourses.filter(course => course.semester === "winter");
  const summerCourses = enrolledCourses.filter(course => course.semester === "summer");

  const getTypeColor = (type: string) => {
    if (type === "mandatory") return "bg-blue-100 text-blue-800";
    return "bg-green-100 text-green-800";
  };

  const getSemesterColor = (semester: string) => {
    if (semester === "winter") return "bg-gray-100 text-gray-800";
    return "bg-orange-100 text-orange-800";
  };

  const getMandatoryEcts = () => {
    let sum = 0;
    for (const course of mandatoryCourses) {
      sum += course.ects;
    }
    return sum;
  };

  const getElectiveEcts = () => {
    let sum = 0;
    for (const course of electiveCourses) {
      sum += course.ects;
    }
    return sum;
  };

  const getWinterEcts = () => {
    let sum = 0;
    for (const course of winterCourses) {
      sum += course.ects;
    }
    return sum;
  };

  const getSummerEcts = () => {
    let sum = 0;
    for (const course of summerCourses) {
      sum += course.ects;
    }
    return sum;
  };

  return (
    <div className="container mx-auto p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold text-gray-900" style={{ color: '#111827' }}>My Enrolled Courses</h1>
          <p className="text-gray-600" style={{ color: '#4b5563' }}>Academic Year 2024-2025</p>
        </div>
        <div className="flex items-center space-x-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-600" style={{ color: '#2563eb' }}>{totalEcts}</div>
            <div className="text-sm text-gray-600" style={{ color: '#4b5563' }}>Total ECTS</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-gray-600" style={{ color: '#4b5563' }}>{enrolledCourses.length}</div>
            <div className="text-sm text-gray-600" style={{ color: '#4b5563' }}>Courses</div>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {enrolledCourses.map((course) => (
          <Card key={course.id} className="hover:shadow-md transition-shadow">
            <CardHeader className="pb-3">
              <div className="flex items-start justify-between">
                <div className="flex-1">
                  <CardTitle className="text-lg mb-2">{course.name}</CardTitle>
                  <div className="flex items-center space-x-2 text-sm text-gray-600 mb-2">
                    <BookOpen className="h-4 w-4" />
                    <span className="font-mono">{course.acronym}</span>
                  </div>
                </div>
                <div className="flex flex-col items-end space-y-2">
                  <Badge className={getTypeColor(course.type)}>
                    {course.type === "mandatory" ? "Mandatory" : "Elective"}
                  </Badge>
                  <Badge className={getSemesterColor(course.semester)}>
                    {course.semester === "winter" ? "Winter" : "Summer"}
                  </Badge>
                </div>
              </div>
            </CardHeader>
            <CardContent className="pt-0">
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <GraduationCap className="h-4 w-4" />
                    <span>Professor</span>
                  </div>
                  <span className="text-sm font-medium text-gray-900">{course.professor}</span>
                </div>
                
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2 text-sm text-gray-600">
                    <Calendar className="h-4 w-4" />
                    <span>ECTS</span>
                  </div>
                  <span className="text-lg font-bold text-blue-600">{course.ects}</span>
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              <span>Course Summary</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Mandatory Courses</span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{mandatoryCourses.length}</span>
                  <Badge variant="outline" className="text-blue-600">
                    {getMandatoryEcts()} ECTS
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Elective Courses</span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{electiveCourses.length}</span>
                  <Badge variant="outline" className="text-green-600">
                    {getElectiveEcts()} ECTS
                  </Badge>
                </div>
              </div>
              <div className="border-t pt-4">
                <div className="flex items-center justify-between">
                  <span className="font-semibold text-gray-900">Total</span>
                  <div className="flex items-center space-x-2">
                    <span className="font-bold text-lg text-blue-600">{totalEcts}</span>
                    <span className="text-sm text-gray-600">ECTS</span>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <Calendar className="h-5 w-5 text-orange-600" />
              <span>Semester Distribution</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Winter Semester</span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{winterCourses.length}</span>
                  <Badge variant="outline" className="text-gray-600">
                    {getWinterEcts()} ECTS
                  </Badge>
                </div>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-gray-600">Summer Semester</span>
                <div className="flex items-center space-x-2">
                  <span className="font-semibold">{summerCourses.length}</span>
                  <Badge variant="outline" className="text-orange-600">
                    {getSummerEcts()} ECTS
                  </Badge>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
