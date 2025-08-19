/*
  Warnings:

  - You are about to drop the column `address` on the `faculties` table. All the data in the column will be lost.
  - You are about to drop the column `program` on the `student_profiles` table. All the data in the column will be lost.
  - You are about to drop the column `address` on the `universities` table. All the data in the column will be lost.
  - A unique constraint covering the columns `[facultyId,name]` on the table `study_programs` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `registrationEndDate` to the `exam_periods` table without a default value. This is not possible if the table is not empty.
  - Added the required column `registrationStartDate` to the `exam_periods` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "users" ADD COLUMN "dateOfBirth" DATETIME;

-- CreateTable
CREATE TABLE "title_types" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "titles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "professorId" INTEGER NOT NULL,
    "titleTypeId" INTEGER NOT NULL,
    "electionDate" DATETIME NOT NULL,
    "endDate" DATETIME,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    CONSTRAINT "titles_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "professor_profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "titles_titleTypeId_fkey" FOREIGN KEY ("titleTypeId") REFERENCES "title_types" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "scientific_fields" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "states" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL
);

-- CreateTable
CREATE TABLE "cities" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "zipCode" TEXT NOT NULL,
    "stateId" INTEGER NOT NULL,
    CONSTRAINT "cities_stateId_fkey" FOREIGN KEY ("stateId") REFERENCES "states" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "addresses" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "street" TEXT NOT NULL,
    "number" TEXT NOT NULL,
    "cityId" INTEGER NOT NULL,
    CONSTRAINT "addresses_cityId_fkey" FOREIGN KEY ("cityId") REFERENCES "cities" ("id") ON DELETE RESTRICT ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "subject_outcomes" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "subjectId" INTEGER NOT NULL,
    "description" TEXT NOT NULL,
    "order" INTEGER NOT NULL,
    CONSTRAINT "subject_outcomes_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "student_enrollments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "studentId" INTEGER NOT NULL,
    "studyProgramId" INTEGER NOT NULL,
    "academicYear" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "enrollmentDate" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "completionDate" DATETIME,
    CONSTRAINT "student_enrollments_studentId_fkey" FOREIGN KEY ("studentId") REFERENCES "student_profiles" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "student_enrollments_studyProgramId_fkey" FOREIGN KEY ("studyProgramId") REFERENCES "study_programs" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "professor_assignments" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "professorId" INTEGER NOT NULL,
    "subjectId" INTEGER NOT NULL,
    "studyProgramId" INTEGER NOT NULL,
    "academicYear" TEXT NOT NULL,
    "teachingType" TEXT NOT NULL DEFAULT 'LECTURE',
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "assignedAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    CONSTRAINT "professor_assignments_professorId_fkey" FOREIGN KEY ("professorId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "professor_assignments_subjectId_fkey" FOREIGN KEY ("subjectId") REFERENCES "subjects" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "professor_assignments_studyProgramId_fkey" FOREIGN KEY ("studyProgramId") REFERENCES "study_programs" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- CreateTable
CREATE TABLE "_ScientificFieldToTitle" (
    "A" INTEGER NOT NULL,
    "B" INTEGER NOT NULL,
    CONSTRAINT "_ScientificFieldToTitle_A_fkey" FOREIGN KEY ("A") REFERENCES "scientific_fields" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "_ScientificFieldToTitle_B_fkey" FOREIGN KEY ("B") REFERENCES "titles" ("id") ON DELETE CASCADE ON UPDATE CASCADE
);

-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_exam_periods" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "startDate" DATETIME NOT NULL,
    "endDate" DATETIME NOT NULL,
    "registrationStartDate" DATETIME NOT NULL,
    "registrationEndDate" DATETIME NOT NULL,
    "academicYear" TEXT NOT NULL,
    "semesterType" TEXT NOT NULL,
    "isActive" BOOLEAN NOT NULL DEFAULT true,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP
);
INSERT INTO "new_exam_periods" ("academicYear", "createdAt", "endDate", "id", "isActive", "name", "semesterType", "startDate") SELECT "academicYear", "createdAt", "endDate", "id", "isActive", "name", "semesterType", "startDate" FROM "exam_periods";
DROP TABLE "exam_periods";
ALTER TABLE "new_exam_periods" RENAME TO "exam_periods";
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
    CONSTRAINT "faculties_universityId_fkey" FOREIGN KEY ("universityId") REFERENCES "universities" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "faculties_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_faculties" ("createdAt", "deanName", "deanTitle", "description", "email", "id", "name", "phone", "universityId", "updatedAt") SELECT "createdAt", "deanName", "deanTitle", "description", "email", "id", "name", "phone", "universityId", "updatedAt" FROM "faculties";
DROP TABLE "faculties";
ALTER TABLE "new_faculties" RENAME TO "faculties";
CREATE TABLE "new_student_profiles" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "userId" INTEGER NOT NULL,
    "studentIndex" TEXT NOT NULL,
    "year" INTEGER NOT NULL,
    "studyProgramId" INTEGER,
    "phoneNumber" TEXT,
    "status" TEXT NOT NULL DEFAULT 'ACTIVE',
    "enrollmentYear" TEXT,
    CONSTRAINT "student_profiles_userId_fkey" FOREIGN KEY ("userId") REFERENCES "users" ("id") ON DELETE CASCADE ON UPDATE CASCADE,
    CONSTRAINT "student_profiles_studyProgramId_fkey" FOREIGN KEY ("studyProgramId") REFERENCES "study_programs" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_student_profiles" ("id", "phoneNumber", "studentIndex", "userId", "year") SELECT "id", "phoneNumber", "studentIndex", "userId", "year" FROM "student_profiles";
DROP TABLE "student_profiles";
ALTER TABLE "new_student_profiles" RENAME TO "student_profiles";
CREATE UNIQUE INDEX "student_profiles_userId_key" ON "student_profiles"("userId");
CREATE UNIQUE INDEX "student_profiles_studentIndex_key" ON "student_profiles"("studentIndex");
CREATE TABLE "new_universities" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "name" TEXT NOT NULL,
    "description" TEXT,
    "addressId" INTEGER,
    "phone" TEXT,
    "email" TEXT,
    "website" TEXT,
    "rectorName" TEXT,
    "rectorTitle" TEXT,
    "createdAt" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updatedAt" DATETIME NOT NULL,
    CONSTRAINT "universities_addressId_fkey" FOREIGN KEY ("addressId") REFERENCES "addresses" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_universities" ("createdAt", "description", "email", "id", "name", "phone", "rectorName", "rectorTitle", "updatedAt", "website") SELECT "createdAt", "description", "email", "id", "name", "phone", "rectorName", "rectorTitle", "updatedAt", "website" FROM "universities";
DROP TABLE "universities";
ALTER TABLE "new_universities" RENAME TO "universities";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;

-- CreateIndex
CREATE UNIQUE INDEX "student_enrollments_studentId_studyProgramId_academicYear_key" ON "student_enrollments"("studentId", "studyProgramId", "academicYear");

-- CreateIndex
CREATE UNIQUE INDEX "professor_assignments_professorId_subjectId_academicYear_key" ON "professor_assignments"("professorId", "subjectId", "academicYear");

-- CreateIndex
CREATE UNIQUE INDEX "_ScientificFieldToTitle_AB_unique" ON "_ScientificFieldToTitle"("A", "B");

-- CreateIndex
CREATE INDEX "_ScientificFieldToTitle_B_index" ON "_ScientificFieldToTitle"("B");

-- CreateIndex
CREATE UNIQUE INDEX "study_programs_facultyId_name_key" ON "study_programs"("facultyId", "name");
