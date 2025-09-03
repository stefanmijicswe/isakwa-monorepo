-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
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
    CONSTRAINT "course_enrollments_gradedBy_fkey" FOREIGN KEY ("gradedBy") REFERENCES "users" ("id") ON DELETE SET NULL ON UPDATE CASCADE
);
INSERT INTO "new_course_enrollments" ("academicYear", "assignments", "attendance", "createdAt", "final", "gradedAt", "gradedBy", "id", "isActive", "midterm", "status", "studentId", "subjectId", "updatedAt") SELECT "academicYear", "assignments", "attendance", "createdAt", "final", "gradedAt", "gradedBy", "id", "isActive", "midterm", "status", "studentId", "subjectId", "updatedAt" FROM "course_enrollments";
DROP TABLE "course_enrollments";
ALTER TABLE "new_course_enrollments" RENAME TO "course_enrollments";
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
