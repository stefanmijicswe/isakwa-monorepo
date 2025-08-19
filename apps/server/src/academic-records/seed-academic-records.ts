import { PrismaService } from '../prisma/prisma.service';
import { UserRole, StudentStatus, SemesterType, TeachingType, ExamStatus } from '@prisma/client';

export async function seedAcademicRecords(prisma: PrismaService) {
  console.log('Seeding academic records...');

  const currentAcademicYear = '2024/2025';

  const studyPrograms = await prisma.studyProgram.findMany();
  const subjects = await prisma.subject.findMany();

  const students = await prisma.user.findMany({
    where: { role: UserRole.STUDENT },
    include: { studentProfile: true },
  });

  const professors = await prisma.user.findMany({
    where: { role: UserRole.PROFESSOR },
    include: { professorProfile: true },
  });

  if (students.length === 0 || professors.length === 0 || studyPrograms.length === 0) {
    console.log('No users, study programs, or subjects found. Skipping academic records seeding.');
    return;
  }

  for (let i = 0; i < Math.min(students.length, 10); i++) {
    const student = students[i];
    if (!student.studentProfile) continue;

    const randomStudyProgram = studyPrograms[i % studyPrograms.length];

    await prisma.studentEnrollment.upsert({
      where: {
        studentId_studyProgramId_academicYear: {
          studentId: student.studentProfile.id,
          studyProgramId: randomStudyProgram.id,
          academicYear: currentAcademicYear,
        },
      },
      update: {},
      create: {
        studentId: student.studentProfile.id,
        studyProgramId: randomStudyProgram.id,
        academicYear: currentAcademicYear,
        year: Math.floor(Math.random() * 4) + 1,
        status: StudentStatus.ACTIVE,
      },
    });

    await prisma.studentProfile.update({
      where: { id: student.studentProfile.id },
      data: {
        studyProgramId: randomStudyProgram.id,
        year: Math.floor(Math.random() * 4) + 1,
        enrollmentYear: '2024',
      },
    });

    const programSubjects = subjects.filter(s => s.studyProgramId === randomStudyProgram.id);
    const selectedSubjects = programSubjects.slice(0, Math.min(3, programSubjects.length));

    for (const subject of selectedSubjects) {
      await prisma.courseEnrollment.upsert({
        where: {
          studentId_subjectId_academicYear: {
            studentId: student.studentProfile.id,
            subjectId: subject.id,
            academicYear: currentAcademicYear,
          },
        },
        update: {},
        create: {
          studentId: student.studentProfile.id,
          subjectId: subject.id,
          academicYear: currentAcademicYear,
          semesterType: subject.semester % 2 === 1 ? SemesterType.WINTER : SemesterType.SUMMER,
          isActive: true,
        },
      });
    }
  }

  for (let i = 0; i < Math.min(professors.length, subjects.length); i++) {
    const professor = professors[i % professors.length];
    const subject = subjects[i];

    await prisma.professorAssignment.upsert({
      where: {
        professorId_subjectId_academicYear: {
          professorId: professor.id,
          subjectId: subject.id,
          academicYear: currentAcademicYear,
        },
      },
      update: {},
      create: {
        professorId: professor.id,
        subjectId: subject.id,
        studyProgramId: subject.studyProgramId,
        academicYear: currentAcademicYear,
        teachingType: TeachingType.LECTURE,
        isActive: true,
      },
    });
  }

  const winterExamPeriod = await prisma.examPeriod.upsert({
    where: { id: 1 },
    update: {},
    create: {
      name: 'Winter Exam Period 2024/2025',
      startDate: new Date('2025-01-15'),
      endDate: new Date('2025-02-15'),
      registrationStartDate: new Date('2025-01-01'),
      registrationEndDate: new Date('2025-01-10'),
      academicYear: currentAcademicYear,
      semesterType: SemesterType.WINTER,
      isActive: true,
    },
  });

  const summerExamPeriod = await prisma.examPeriod.upsert({
    where: { id: 2 },
    update: {},
    create: {
      name: 'Summer Exam Period 2024/2025',
      startDate: new Date('2025-06-15'),
      endDate: new Date('2025-07-15'),
      registrationStartDate: new Date('2025-06-01'),
      registrationEndDate: new Date('2025-06-10'),
      academicYear: currentAcademicYear,
      semesterType: SemesterType.SUMMER,
      isActive: false,
    },
  });

  for (let i = 0; i < Math.min(subjects.length, 10); i++) {
    const subject = subjects[i];
    const examPeriod = subject.semester % 2 === 1 ? winterExamPeriod : summerExamPeriod;

    const examDate = new Date(examPeriod.startDate);
    examDate.setDate(examDate.getDate() + Math.floor(Math.random() * 20));

    await prisma.exam.upsert({
      where: { id: i + 1 },
      update: {},
      create: {
        subjectId: subject.id,
        examPeriodId: examPeriod.id,
        examDate: examDate,
        examTime: ['09:00', '12:00', '15:00'][Math.floor(Math.random() * 3)],
        duration: [90, 120, 180][Math.floor(Math.random() * 3)],
        location: `Room ${100 + Math.floor(Math.random() * 50)}`,
        maxPoints: 100,
        status: ExamStatus.SCHEDULED,
      },
    });
  }

  const exams = await prisma.exam.findMany({
    where: { examPeriodId: winterExamPeriod.id },
  });

  const activeStudents = await prisma.studentProfile.findMany({
    where: { status: StudentStatus.ACTIVE },
    include: {
      courseEnrollments: {
        where: { isActive: true },
      },
    },
  });

  for (const student of activeStudents.slice(0, 5)) {
    for (const enrollment of student.courseEnrollments.slice(0, 2)) {
      const exam = exams.find(e => e.subjectId === enrollment.subjectId);
      if (exam) {
        await prisma.examRegistration.upsert({
          where: {
            studentId_examId: {
              studentId: student.id,
              examId: exam.id,
            },
          },
          update: {},
          create: {
            studentId: student.id,
            examId: exam.id,
            isActive: true,
          },
        });

        if (Math.random() > 0.5) {
          const points = Math.floor(Math.random() * 40) + 60;
          const grade = Math.floor(points / 10) + 1;
          const passed = grade >= 6;

          await prisma.grade.create({
            data: {
              studentId: student.id,
              examId: exam.id,
              points: points,
              grade: grade,
              passed: passed,
              attempt: 1,
              gradedBy: professors[0]?.id,
            },
          });
        }
      }
    }
  }

  console.log('Academic records seeded successfully');
}
