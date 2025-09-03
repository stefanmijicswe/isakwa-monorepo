/*
  Warnings:

  - You are about to drop the `_ScientificFieldToTitle` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the `subject_outcomes` table. If the table is not empty, all the data it contains will be lost.
  - You are about to drop the column `enrollmentDate` on the `course_enrollments` table. All the data in the column will be lost.
  - You are about to drop the column `semesterType` on the `course_enrollments` table. All the data in the column will be lost.
  - You are about to drop the column `registrationDate` on the `exam_registrations` table. All the data in the column will be lost.
  - You are about to drop the column `assignedAt` on the `professor_assignments` table. All the data in the column will be lost.
  - You are about to drop the column `department` on the `professor_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `completionDate` on the `student_enrollments` table. All the data in the column will be lost.
  - You are about to drop the column `enrollmentDate` on the `student_enrollments` table. All the data in the column will be lost.
  - You are about to drop the column `department` on the `student_service_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `exerciseHours` on the `subjects` table. All the data in the column will be lost.
  - You are about to drop the column `lectureHours` on the `subjects` table. All the data in the column will be lost.
  - You are about to drop the column `isActive` on the `titles` table. All the data in the column will be lost.
  - You are about to drop the column `professorId` on the `titles` table. All the data in the column will be lost.
  - You are about to drop the column `titleTypeId` on the `titles` table. All the data in the column will be lost.
  - Added the required column `countryId` to the `cities` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `course_enrollments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `exam_periods` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectId` to the `exam_registrations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `exam_registrations` table without a default value. This is not possible if the table is not empty.
  - Added the required column `endTime` to the `exams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `startTime` to the `exams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `exams` table without a default value. This is not possible if the table is not empty.
  - Added the required column `subjectId` to the `grades` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `grades` table without a default value. This is not possible if the table is not empty.
  - Made the column `grade` on table `grades` required. This step will fail if there are existing NULL values in that column.
  - Added the required column `updatedAt` to the `notifications` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `professor_assignments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departmentId` to the `professor_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jmbg` to the `professor_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `content` to the `request_comments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `scientific_fields` table without a default value. This is not possible if the table is not empty.
  - Added the required column `countryId` to the `states` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `states` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `student_enrollments` table without a default value. This is not possible if the table is not empty.
  - Added the required column `jmbg` to the `student_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `departmentId` to the `student_service_profiles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `code` to the `study_programs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `level` to the `study_programs` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `title_types` table without a default value. This is not possible if the table is not empty.
  - Added the required column `name` to the `titles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `professorProfileId` to the `titles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `type` to the `titles` table without a default value. This is not possible if the table is not empty.
  - Added the required column `updatedAt` to the `titles` table without a default value. This is not possible if the table is not empty.

*/
-- DropIndex
DROP INDEX "_ScientificFieldToTitle_B_index";

-- DropIndex
DROP INDEX "_ScientificFieldToTitle_AB_unique";

-- AlterTable
ALTER TABLE "universities" ADD COLUMN "foundingDate" DATETIME;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "_ScientificFieldToTitle";
PRAGMA foreign_keys=on;

-- DropTable
PRAGMA foreign_keys=off;
DROP TABLE "subject_outcomes";
PRAGMA foreign_keys=on;

-- CreateTable
CREATE TABLE "departments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "facultyId" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "departments_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculties" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "countries" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "subject_study_programs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "subjectId" INTEGER NOT NULL,
    "studyProgramId" INTEGER NOT NULL,
    CONSTRAINT "subject_study_programs_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "subject_study_programs_studyProgramId_fkey" FOREIGN KEY ("studyProgramId") REFERENCES "study_programs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "course_schedules" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "subjectId" INTEGER NOT NULL,
    "academicYear" TEXT NOT NULL,
    "semesterType" TEXT NOT NULL,
    "createdBy" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "course_schedules_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "course_schedules_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "course_sessions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "scheduleId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "sessionType" TEXT NOT NULL,
    "dayOfWeek" INTEGER NOT NULL,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "room" TEXT,
    "sessionDate" DATETIME,
    "createdBy" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "course_sessions_scheduleId_fkey" FOREIGN KEY ("scheduleId") REFERENCES "course_schedules" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "course_sessions_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "syllabus" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "subjectId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "objectives" TEXT,
    "academicYear" TEXT,
    "createdBy" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "syllabus_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "syllabus_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "syllabus_topics" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "syllabusId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "weekNumber" INTEGER,
    "createdBy" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "syllabus_topics_syllabusId_fkey" FOREIGN KEY ("syllabusId") REFERENCES "syllabus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "syllabus_topics_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "syllabus_materials" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "syllabusId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "filePath" TEXT,
    "createdBy" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "syllabus_materials_syllabusId_fkey" FOREIGN KEY ("syllabusId") REFERENCES "syllabus" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "syllabus_materials_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "evaluation_instruments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "type" TEXT NOT NULL,
    "maxPoints" INTEGER NOT NULL DEFAULT 100,
    "dueDate" DATETIME,
    "subjectId" INTEGER NOT NULL,
    "createdBy" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "evaluation_instruments_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "evaluation_instruments_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "evaluation_submissions" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "instrumentId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "points" INTEGER,
    "grade" INTEGER,
    "feedback" TEXT,
    "passed" BOOLEAN NOT NULL DEFAULT false,
    "gradedAt" DATETIME,
    "gradedBy" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "evaluation_submissions_instrumentId_fkey" FOREIGN KEY ("instrumentId") REFERENCES "evaluation_instruments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "evaluation_submissions_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "evaluation_submissions_gradedBy_fkey" FOREIGN KEY ("gradedBy") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "evaluation_submissions_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student_profiles" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "student_violations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "studentId" INTEGER NOT NULL,
    "violationType" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "date" DATETIME NOT NULL,
    "createdBy" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "student_violations_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "student_violations_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "student_violations_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student_profiles" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "final_projects" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "studentId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT,
    "subjectId" INTEGER,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "grade" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "final_projects_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "final_projects_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "final_projects_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student_profiles" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "inventory_items" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "category" TEXT NOT NULL,
    "quantity" INTEGER NOT NULL,
    "minStock" INTEGER NOT NULL DEFAULT 0,
    "unit" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "inventory_issuances" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "inventoryItemId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "quantity" INTEGER NOT NULL,
    "quantityIssued" INTEGER NOT NULL,
    "issuedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "returnedAt" DATETIME,
    "notes" TEXT,
    "returnNotes" TEXT,
    "issuedBy" INTEGER NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "inventory_issuances_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "inventory_items" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "inventory_issuances_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "inventory_issuances_issuedBy_fkey" FOREIGN KEY ("issuedBy") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "inventory_requests" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "inventoryItemId" INTEGER NOT NULL,
    "requesterId" INTEGER NOT NULL,
    "approverId" INTEGER,
    "quantity" INTEGER NOT NULL,
    "quantityRequested" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "notes" TEXT,
    "reason" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "inventory_requests_inventoryItemId_fkey" FOREIGN KEY ("inventoryItemId") REFERENCES "inventory_items" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "inventory_requests_requesterId_fkey" FOREIGN KEY ("requesterId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "inventory_requests_approverId_fkey" FOREIGN KEY ("approverId") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "library_items" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "author" TEXT NOT NULL,
    "isbn" TEXT,
    "type" TEXT NOT NULL,
    "category" TEXT NOT NULL,
    "description" TEXT,
    "copies" INTEGER NOT NULL DEFAULT 1,
    "totalCopies" INTEGER NOT NULL DEFAULT 1,
    "available" INTEGER NOT NULL DEFAULT 1,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);

-- CreateTable
CREATE TABLE "library_borrowings" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "libraryItemId" INTEGER NOT NULL,
    "studentId" INTEGER NOT NULL,
    "borrowedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "dueDate" DATETIME NOT NULL,
    "returnedAt" DATETIME,
    "notes" TEXT,
    "status" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "library_borrowings_libraryItemId_fkey" FOREIGN KEY ("libraryItemId") REFERENCES "library_items" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "library_borrowings_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_cities" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "countryId" INTEGER NOT NULL,
    "stateId" INTEGER,
    "zipCode" TEXT,
    CONSTRAINT "cities_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "states" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "cities_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_cities" ("id", "name", "stateId", "zipCode") SELECT "id", "name", "stateId", "zipCode" FROM "cities";
DROP TABLE "cities";
ALTER TABLE "new_cities" RENAME TO "cities";
CREATE TABLE "new_course_enrollments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "studentId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "academicYear" TEXT,
    "attendance" REAL DEFAULT 0,
    "assignments" REAL DEFAULT 0,
    "midterm" REAL DEFAULT 0,
    "final" REAL DEFAULT 0,
    "status" TEXT NOT NULL DEFAULT 'Pending',
    "gradedBy" INTEGER,
    "gradedAt" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "course_enrollments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "course_enrollments_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "course_enrollments_gradedBy_fkey" FOREIGN KEY ("gradedBy") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "course_enrollments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student_profiles" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_course_enrollments" ("academicYear", "id", "isActive", "studentId", "subjectId") SELECT "academicYear", "id", "isActive", "studentId", "subjectId" FROM "course_enrollments";
DROP TABLE "course_enrollments";
ALTER TABLE "new_course_enrollments" RENAME TO "course_enrollments";
CREATE TABLE "new_exam_periods" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "registrationStartDate" DATETIME NOT NULL,
    "registrationEndDate" DATETIME NOT NULL,
    "academicYear" TEXT NOT NULL,
    "semesterType" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_exam_periods" ("academicYear", "createdAt", "endDate", "id", "isActive", "name", "registrationEndDate", "registrationStartDate", "semesterType", "startDate") SELECT "academicYear", "createdAt", "endDate", "id", "isActive", "name", "registrationEndDate", "registrationStartDate", "semesterType", "startDate" FROM "exam_periods";
DROP TABLE "exam_periods";
ALTER TABLE "new_exam_periods" RENAME TO "exam_periods";
CREATE TABLE "new_exam_registrations" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "studentId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "examId" INTEGER,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "exam_registrations_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "exam_registrations_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "exam_registrations_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exams" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "exam_registrations_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student_profiles" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_exam_registrations" ("examId", "id", "isActive", "studentId") SELECT "examId", "id", "isActive", "studentId" FROM "exam_registrations";
DROP TABLE "exam_registrations";
ALTER TABLE "new_exam_registrations" RENAME TO "exam_registrations";
CREATE TABLE "new_exams" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "subjectId" INTEGER NOT NULL,
    "examPeriodId" INTEGER NOT NULL,
    "examDate" DATETIME NOT NULL,
    "examTime" TEXT,
    "startTime" TEXT NOT NULL,
    "endTime" TEXT NOT NULL,
    "location" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "maxPoints" INTEGER NOT NULL DEFAULT 100,
    "duration" INTEGER NOT NULL DEFAULT 120,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "exams_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "exams_examPeriodId_fkey" FOREIGN KEY ("examPeriodId") REFERENCES "exam_periods" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_exams" ("createdAt", "duration", "examDate", "examPeriodId", "examTime", "id", "location", "maxPoints", "status", "subjectId") SELECT "createdAt", "duration", "examDate", "examPeriodId", "examTime", "id", "location", "maxPoints", "status", "subjectId" FROM "exams";
DROP TABLE "exams";
ALTER TABLE "new_exams" RENAME TO "exams";
CREATE TABLE "new_faculties" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "universityId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "addressId" INTEGER,
    "phone" TEXT,
    "email" TEXT,
    "deanName" TEXT,
    "deanTitle" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "faculties_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "universities" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "faculties_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_faculties" ("addressId", "createdAt", "deanName", "deanTitle", "description", "email", "id", "name", "phone", "universityId", "updatedAt") SELECT "addressId", "createdAt", "deanName", "deanTitle", "description", "email", "id", "name", "phone", "universityId", "updatedAt" FROM "faculties";
DROP TABLE "faculties";
ALTER TABLE "new_faculties" RENAME TO "faculties";
CREATE TABLE "new_grades" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "studentId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "examId" INTEGER,
    "grade" INTEGER NOT NULL,
    "points" INTEGER,
    "passed" BOOLEAN NOT NULL DEFAULT false,
    "attempt" INTEGER NOT NULL DEFAULT 1,
    "gradedBy" INTEGER,
    "gradedAt" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "grades_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "grades_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "grades_examId_fkey" FOREIGN KEY ("examId") REFERENCES "exams" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "grades_gradedBy_fkey" FOREIGN KEY ("gradedBy") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "grades_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student_profiles" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_grades" ("attempt", "examId", "grade", "gradedAt", "gradedBy", "id", "passed", "points", "studentId") SELECT "attempt", "examId", "grade", "gradedAt", "gradedBy", "id", "passed", "points", "studentId" FROM "grades";
DROP TABLE "grades";
ALTER TABLE "new_grades" RENAME TO "grades";
CREATE TABLE "new_notification_recipients" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "notificationId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "isRead" BOOLEAN NOT NULL DEFAULT false,
    "readAt" DATETIME,
    CONSTRAINT "notification_recipients_notificationId_fkey" FOREIGN KEY ("notificationId") REFERENCES "notifications" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "notification_recipients_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_notification_recipients" ("id", "isRead", "notificationId", "readAt", "userId") SELECT "id", "isRead", "notificationId", "readAt", "userId" FROM "notification_recipients";
DROP TABLE "notification_recipients";
ALTER TABLE "new_notification_recipients" RENAME TO "notification_recipients";
CREATE TABLE "new_notifications" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "title" TEXT NOT NULL,
    "message" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "priority" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdBy" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "notifications_createdBy_fkey" FOREIGN KEY ("createdBy") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_notifications" ("createdAt", "createdBy", "id", "isActive", "message", "priority", "title", "type") SELECT "createdAt", "createdBy", "id", "isActive", "message", "priority", "title", "type" FROM "notifications";
DROP TABLE "notifications";
ALTER TABLE "new_notifications" RENAME TO "notifications";
CREATE TABLE "new_professor_assignments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "professorId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "studyProgramId" INTEGER,
    "academicYear" TEXT,
    "teachingType" TEXT,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "professor_assignments_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "professor_assignments_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "professor_assignments_studyProgramId_fkey" FOREIGN KEY ("studyProgramId") REFERENCES "study_programs" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_professor_assignments" ("academicYear", "id", "isActive", "professorId", "studyProgramId", "subjectId", "teachingType") SELECT "academicYear", "id", "isActive", "professorId", "studyProgramId", "subjectId", "teachingType" FROM "professor_assignments";
DROP TABLE "professor_assignments";
ALTER TABLE "new_professor_assignments" RENAME TO "professor_assignments";
CREATE TABLE "new_professor_profiles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "title" TEXT NOT NULL,
    "phoneNumber" TEXT,
    "officeRoom" TEXT,
    "biography" TEXT,
    "jmbg" TEXT NOT NULL,
    CONSTRAINT "professor_profiles_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "professor_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_professor_profiles" ("id", "officeRoom", "phoneNumber", "title", "userId") SELECT "id", "officeRoom", "phoneNumber", "title", "userId" FROM "professor_profiles";
DROP TABLE "professor_profiles";
ALTER TABLE "new_professor_profiles" RENAME TO "professor_profiles";
CREATE UNIQUE INDEX "professor_profiles_userId_key" ON "professor_profiles"("userId");
CREATE UNIQUE INDEX "professor_profiles_jmbg_key" ON "professor_profiles"("jmbg");
CREATE TABLE "new_request_attachments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "requestId" INTEGER NOT NULL,
    "fileName" TEXT NOT NULL,
    "filePath" TEXT NOT NULL,
    "fileSize" INTEGER,
    "mimeType" TEXT,
    "uploadedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "request_attachments_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "student_requests" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_request_attachments" ("fileName", "filePath", "id", "requestId", "uploadedAt") SELECT "fileName", "filePath", "id", "requestId", "uploadedAt" FROM "request_attachments";
DROP TABLE "request_attachments";
ALTER TABLE "new_request_attachments" RENAME TO "request_attachments";
CREATE TABLE "new_request_comments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "requestId" INTEGER NOT NULL,
    "userId" INTEGER NOT NULL,
    "content" TEXT NOT NULL,
    "comment" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "request_comments_requestId_fkey" FOREIGN KEY ("requestId") REFERENCES "student_requests" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "request_comments_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_request_comments" ("comment", "createdAt", "id", "requestId", "userId") SELECT "comment", "createdAt", "id", "requestId", "userId" FROM "request_comments";
DROP TABLE "request_comments";
ALTER TABLE "new_request_comments" RENAME TO "request_comments";
CREATE TABLE "new_scientific_fields" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_scientific_fields" ("id", "name") SELECT "id", "name" FROM "scientific_fields";
DROP TABLE "scientific_fields";
ALTER TABLE "new_scientific_fields" RENAME TO "scientific_fields";
CREATE TABLE "new_states" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "countryId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "states_countryId_fkey" FOREIGN KEY ("countryId") REFERENCES "countries" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_states" ("id", "name") SELECT "id", "name" FROM "states";
DROP TABLE "states";
ALTER TABLE "new_states" RENAME TO "states";
CREATE TABLE "new_student_enrollments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "studentId" INTEGER NOT NULL,
    "studyProgramId" INTEGER,
    "year" INTEGER NOT NULL,
    "academicYear" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "student_enrollments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "student_enrollments_studyProgramId_fkey" FOREIGN KEY ("studyProgramId") REFERENCES "study_programs" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "student_enrollments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student_profiles" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "student_enrollments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student_profiles" ("userId") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_student_enrollments" ("academicYear", "id", "status", "studentId", "studyProgramId", "year") SELECT "academicYear", "id", "status", "studentId", "studyProgramId", "year" FROM "student_enrollments";
DROP TABLE "student_enrollments";
ALTER TABLE "new_student_enrollments" RENAME TO "student_enrollments";
CREATE TABLE "new_student_profiles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "studentIndex" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "studyProgramId" INTEGER,
    "phoneNumber" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "enrollmentYear" TEXT,
    "jmbg" TEXT NOT NULL,
    CONSTRAINT "student_profiles_studyProgramId_fkey" FOREIGN KEY ("studyProgramId") REFERENCES "study_programs" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "student_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_student_profiles" ("enrollmentYear", "id", "phoneNumber", "status", "studentIndex", "studyProgramId", "userId", "year") SELECT "enrollmentYear", "id", "phoneNumber", "status", "studentIndex", "studyProgramId", "userId", "year" FROM "student_profiles";
DROP TABLE "student_profiles";
ALTER TABLE "new_student_profiles" RENAME TO "student_profiles";
CREATE UNIQUE INDEX "student_profiles_userId_key" ON "student_profiles"("userId");
CREATE UNIQUE INDEX "student_profiles_studentIndex_key" ON "student_profiles"("studentIndex");
CREATE UNIQUE INDEX "student_profiles_jmbg_key" ON "student_profiles"("jmbg");
CREATE TABLE "new_student_requests" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "studentId" INTEGER NOT NULL,
    "type" TEXT NOT NULL,
    "title" TEXT NOT NULL,
    "description" TEXT NOT NULL,
    "category" TEXT NOT NULL DEFAULT 'OTHER',
    "status" TEXT NOT NULL DEFAULT 'PENDING',
    "assignedTo" INTEGER,
    "priority" TEXT NOT NULL DEFAULT 'NORMAL',
    "dueDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "student_requests_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "users" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "student_requests_assignedTo_fkey" FOREIGN KEY ("assignedTo") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_student_requests" ("createdAt", "description", "id", "status", "studentId", "title", "type", "updatedAt") SELECT "createdAt", "description", "id", "status", "studentId", "title", "type", "updatedAt" FROM "student_requests";
DROP TABLE "student_requests";
ALTER TABLE "new_student_requests" RENAME TO "student_requests";
CREATE TABLE "new_student_service_profiles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "departmentId" INTEGER NOT NULL,
    "position" TEXT,
    "phoneNumber" TEXT,
    "officeRoom" TEXT,
    CONSTRAINT "student_service_profiles_departmentId_fkey" FOREIGN KEY ("departmentId") REFERENCES "departments" ("id") ON DELETE RESTRICT ON UPDATE CASCADE,
    CONSTRAINT "student_service_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);
INSERT INTO "new_student_service_profiles" ("id", "phoneNumber", "userId") SELECT "id", "phoneNumber", "userId" FROM "student_service_profiles";
DROP TABLE "student_service_profiles";
ALTER TABLE "new_student_service_profiles" RENAME TO "student_service_profiles";
CREATE UNIQUE INDEX "student_service_profiles_userId_key" ON "student_service_profiles"("userId");
CREATE TABLE "new_study_programs" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "facultyId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "level" TEXT NOT NULL,
    "description" TEXT,
    "duration" INTEGER NOT NULL,
    "directorName" TEXT,
    "directorTitle" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "study_programs_facultyId_fkey" FOREIGN KEY ("facultyId") REFERENCES "faculties" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_study_programs" ("createdAt", "description", "directorName", "directorTitle", "duration", "facultyId", "id", "name", "updatedAt") SELECT "createdAt", "description", "directorName", "directorTitle", "duration", "facultyId", "id", "name", "updatedAt" FROM "study_programs";
DROP TABLE "study_programs";
ALTER TABLE "new_study_programs" RENAME TO "study_programs";
CREATE UNIQUE INDEX "study_programs_name_key" ON "study_programs"("name");
CREATE UNIQUE INDEX "study_programs_code_key" ON "study_programs"("code");
CREATE TABLE "new_subjects" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "code" TEXT NOT NULL,
    "description" TEXT,
    "credits" INTEGER NOT NULL,
    "ects" INTEGER NOT NULL DEFAULT 0,
    "semester" INTEGER NOT NULL,
    "mandatory" BOOLEAN NOT NULL DEFAULT true,
    "numberOfLectures" INTEGER NOT NULL DEFAULT 0,
    "numberOfExercises" INTEGER NOT NULL DEFAULT 0,
    "otherFormsOfTeaching" INTEGER NOT NULL DEFAULT 0,
    "researchWork" INTEGER NOT NULL DEFAULT 0,
    "otherClasses" INTEGER NOT NULL DEFAULT 0,
    "studyProgramId" INTEGER NOT NULL,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "subjects_studyProgramId_fkey" FOREIGN KEY ("studyProgramId") REFERENCES "study_programs" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_subjects" ("code", "createdAt", "credits", "description", "id", "name", "semester", "studyProgramId", "updatedAt") SELECT "code", "createdAt", "credits", "description", "id", "name", "semester", "studyProgramId", "updatedAt" FROM "subjects";
DROP TABLE "subjects";
ALTER TABLE "new_subjects" RENAME TO "subjects";
CREATE UNIQUE INDEX "subjects_code_key" ON "subjects"("code");
CREATE TABLE "new_title_types" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL
);
INSERT INTO "new_title_types" ("id", "name") SELECT "id", "name" FROM "title_types";
DROP TABLE "title_types";
ALTER TABLE "new_title_types" RENAME TO "title_types";
CREATE TABLE "new_titles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "professorProfileId" INTEGER NOT NULL,
    "name" TEXT NOT NULL,
    "type" TEXT NOT NULL,
    "typeId" INTEGER,
    "scientificFieldId" INTEGER,
    "electionDate" DATETIME,
    "endDate" DATETIME,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "titles_typeId_fkey" FOREIGN KEY ("typeId") REFERENCES "title_types" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "titles_scientificFieldId_fkey" FOREIGN KEY ("scientificFieldId") REFERENCES "scientific_fields" ("id") ON DELETE SET NULL ON UPDATE CASCADE,
    CONSTRAINT "titles_professorProfileId_fkey" FOREIGN KEY ("professorProfileId") REFERENCES "professor_profiles" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);
INSERT INTO "new_titles" ("electionDate", "endDate", "id") SELECT "electionDate", "endDate", "id" FROM "titles";
DROP TABLE "titles";
ALTER TABLE "new_titles" RENAME TO "titles";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "countries_name_key" ON "countries"("name");

-- CreateIndex
CREATE UNIQUE INDEX "countries_code_key" ON "countries"("code");
