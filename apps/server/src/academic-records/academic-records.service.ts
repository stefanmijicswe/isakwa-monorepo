import { Injectable, BadRequestException, NotFoundException, ForbiddenException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  EnrollStudentDto,
  EnrollCourseDto,
  AssignProfessorDto,
  RegisterExamDto,
  CreateExamPeriodDto,
  CreateExamDto,
  GradeExamDto,
  SearchStudentsDto,
  UpdateEnrollmentDto,
  CreateSyllabusDto,
  UpdateSyllabusDto,
  GetSyllabusDto,
  CreateSyllabusTopicDto,
  UpdateSyllabusTopicDto,
  CreateSyllabusMaterialDto,
  UpdateSyllabusMaterialDto,
} from './dto';
import { UserRole, StudentStatus } from '@prisma/client';

@Injectable()
export class AcademicRecordsService {
  constructor(private prisma: PrismaService) { }

  async enrollStudent(dto: EnrollStudentDto) {
    const student = await this.prisma.user.findUnique({
      where: { id: dto.studentId },
      include: { studentProfile: true },
    });

    if (!student || student.role !== UserRole.STUDENT) {
      throw new BadRequestException('Invalid student ID');
    }

    const studyProgram = await this.prisma.studyProgram.findUnique({
      where: { id: dto.studyProgramId },
    });

    if (!studyProgram) {
      throw new NotFoundException('Study program not found');
    }

    const existingEnrollment = await this.prisma.studentEnrollment.findFirst({
      where: {
        studentId: dto.studentId,
        studyProgramId: dto.studyProgramId,
        academicYear: dto.academicYear,
      },
    });

    if (existingEnrollment) {
      throw new BadRequestException('Student already enrolled in this program for this academic year');
    }

    const enrollment = await this.prisma.studentEnrollment.create({
      data: {
        studentId: dto.studentId,
        studyProgramId: dto.studyProgramId,
        academicYear: dto.academicYear,
        year: dto.year,
        status: dto.status || StudentStatus.ACTIVE,
      },
      include: {
        student: {
          include: {

          },
        },
        studyProgram: {
          include: {
            faculty: {
              select: { name: true },
            },
          },
        },
      },
    });

    if (student.studentProfile) {
      await this.prisma.studentProfile.update({
        where: { id: student.studentProfile.id },
        data: {
          studyProgramId: dto.studyProgramId,
          year: dto.year,
          enrollmentYear: dto.academicYear.split('/')[0],
        },
      });
    }

    //Automatically enroll student in all subjects of their study program
    const programSubjects = await this.prisma.subject.findMany({
      where: { studyProgramId: dto.studyProgramId },
    });

    console.log(`📚 Auto-enrolling student ${dto.studentId} in ${programSubjects.length} subjects for program ${dto.studyProgramId}`);

    // Create CourseEnrollment for each subject in the program
    if (programSubjects.length > 0) {
      const courseEnrollments = programSubjects.map(subject => ({
        studentId: dto.studentId,
        subjectId: subject.id,
        academicYear: dto.academicYear,
        isActive: true,
        status: 'Active',
      }));

      await this.prisma.courseEnrollment.createMany({
        data: courseEnrollments
      });

      console.log(`✅ Created ${courseEnrollments.length} course enrollments for student ${dto.studentId}`);
    }

    return enrollment;
  }

  async enrollInCourse(dto: EnrollCourseDto) {
    const studentProfile = await this.prisma.studentProfile.findUnique({
      where: { id: dto.studentId },
      include: {
        user: true,
        enrollments: {
          where: {
            academicYear: dto.academicYear,
            status: StudentStatus.ACTIVE,
          },
          include: {
            studyProgram: {
              include: {
                subjects: true,
              },
            },
          },
        },
      },
    });

    if (!studentProfile || !studentProfile.enrollments.length) {
      throw new BadRequestException('Student must be enrolled in a study program for this academic year');
    }

    const studentEnrollment = studentProfile.enrollments[0];
    const subject = await this.prisma.subject.findUnique({
      where: { id: dto.subjectId },
    });

    if (!subject || subject.studyProgramId !== studentEnrollment.studyProgramId) {
      throw new BadRequestException('Subject not available in student study program');
    }

    const existingCourseEnrollment = await this.prisma.courseEnrollment.findFirst({
      where: {
        studentId: dto.studentId,
        subjectId: dto.subjectId,
        academicYear: dto.academicYear,
      },
    });

    if (existingCourseEnrollment) {
      throw new BadRequestException('Student already enrolled in this course');
    }

    return this.prisma.courseEnrollment.create({
      data: {
        studentId: dto.studentId,
        subjectId: dto.subjectId,
        academicYear: dto.academicYear,
        isActive: dto.isActive ?? true,
      },
      include: {
        student: {
          include: {

          },
        },
        subject: {
          select: { name: true, code: true, credits: true, semester: true },
        },
      },
    });
  }

  async assignProfessor(dto: AssignProfessorDto) {
    const professor = await this.prisma.user.findUnique({
      where: { id: dto.professorId },
      include: { professorProfile: true },
    });

    if (!professor || professor.role !== UserRole.PROFESSOR) {
      throw new BadRequestException('Invalid professor ID');
    }

    const subject = await this.prisma.subject.findUnique({
      where: { id: dto.subjectId },
    });

    if (!subject || subject.studyProgramId !== dto.studyProgramId) {
      throw new BadRequestException('Subject not found in specified study program');
    }

    const existingAssignment = await this.prisma.professorAssignment.findFirst({
      where: {
        professorId: dto.professorId,
        subjectId: dto.subjectId,
        academicYear: dto.academicYear,
      },
    });

    if (existingAssignment) {
      throw new BadRequestException('Professor already assigned to this subject');
    }

    return this.prisma.professorAssignment.create({
      data: {
        professorId: dto.professorId,
        subjectId: dto.subjectId,
        studyProgramId: dto.studyProgramId,
        academicYear: dto.academicYear,
        teachingType: dto.teachingType,
        isActive: dto.isActive ?? true,
      },
      include: {
        professor: {
          select: { firstName: true, lastName: true, email: true },
        },
        subject: {
          select: { name: true, code: true },
        },
        studyProgram: {
          include: {
            faculty: {
              select: { name: true },
            },
          },
        },
      },
    });
  }

  async createExamPeriod(dto: CreateExamPeriodDto) {
    return this.prisma.examPeriod.create({
      data: {
        name: dto.name,
        startDate: new Date(dto.startDate),
        endDate: new Date(dto.endDate),
        registrationStartDate: new Date(dto.registrationStartDate),
        registrationEndDate: new Date(dto.registrationEndDate),
        academicYear: dto.academicYear,
        isActive: dto.isActive ?? true,
      },
    });
  }

  async createExam(dto: CreateExamDto) {
    const subject = await this.prisma.subject.findUnique({
      where: { id: dto.subjectId },
    });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    const examPeriod = await this.prisma.examPeriod.findUnique({
      where: { id: dto.examPeriodId },
    });

    if (!examPeriod) {
      throw new NotFoundException('Exam period not found');
    }

    const examDate = new Date(dto.examDate);
    if (examDate < examPeriod.startDate || examDate > examPeriod.endDate) {
      throw new BadRequestException('Exam date must be within exam period');
    }

    return this.prisma.exam.create({
      data: {
        subject: { connect: { id: dto.subjectId } },
        examPeriod: { connect: { id: dto.examPeriodId } },
        examDate: examDate,
        examTime: dto.examTime,
        startTime: '09:00',
        endTime: '11:00',
        duration: dto.duration,
        location: dto.location,
        maxPoints: dto.maxPoints ?? 100,
        status: dto.status,
      },
      include: {
        subject: {
          select: { name: true, code: true },
        },
        examPeriod: {
          select: { name: true },
        },
      },
    });
  }

  async getExams() {
    return this.prisma.exam.findMany({
      include: {
        subject: {
          select: { name: true, code: true },
        },
        examPeriod: {
          select: { name: true, startDate: true, endDate: true },
        },
      },
      orderBy: {
        examDate: 'asc',
      },
    });
  }

  // Get exams available for a specific student (only for subjects they're enrolled in)
  async getAvailableExamsForStudent(studentId: number) {
    return this.prisma.exam.findMany({
      where: {
        status: 'ACTIVE',
        subjectId: {
          in: await this.prisma.courseEnrollment.findMany({
            where: {
              studentId: studentId,
              isActive: true
            },
            select: { subjectId: true }
          }).then(enrollments => enrollments.map(e => e.subjectId))
        },
        examPeriod: {
          isActive: true,
          registrationStartDate: {
            lte: new Date()
          },
          registrationEndDate: {
            gte: new Date()
          }
        }
      },
      include: {
        subject: {
          select: { name: true, code: true },
        },
        examPeriod: {
          select: { name: true, startDate: true, endDate: true, registrationStartDate: true, registrationEndDate: true },
        },
      },
      orderBy: {
        examDate: 'asc',
      },
    });
  }

  async registerForExam(dto: RegisterExamDto) {
    console.log('🎯 EXAM REGISTRATION DEBUG:');
    console.log('- DTO:', JSON.stringify(dto, null, 2));

    const exam = await this.prisma.exam.findUnique({
      where: { id: dto.examId },
      include: {
        examPeriod: true,
        subject: true,
      },
    });

    if (!exam) {
      throw new NotFoundException('Exam not found');
    }

    console.log('- Exam found:', exam.id, exam.subject?.name);
    console.log('- Exam period academic year:', exam.examPeriod.academicYear);

    const now = new Date();
    if (now < exam.examPeriod.registrationStartDate || now > exam.examPeriod.registrationEndDate) {
      throw new ForbiddenException('Exam registration is not currently active');
    }

    console.log('- Looking for CourseEnrollment with:');
    console.log('  * studentId:', dto.studentId);
    console.log('  * subjectId:', exam.subjectId);
    console.log('  * academicYear:', exam.examPeriod.academicYear);
    console.log('  * isActive: true');

    const courseEnrollment = await this.prisma.courseEnrollment.findFirst({
      where: {
        studentId: dto.studentId,
        subjectId: exam.subjectId,
        academicYear: exam.examPeriod.academicYear,
        isActive: true,
      },
    });

    console.log('- CourseEnrollment found:', courseEnrollment ? 'YES' : 'NO');
    if (courseEnrollment) {
      console.log('- CourseEnrollment details:', JSON.stringify(courseEnrollment, null, 2));
    }

    const allStudentEnrollments = await this.prisma.courseEnrollment.findMany({
      where: { studentId: dto.studentId },
      include: {
        subject: { select: { name: true, code: true } }
      }
    });

    console.log('- All student enrollments:');
    allStudentEnrollments.forEach((e, i) => {
      console.log(`  ${i + 1}: ${e.subject?.name} - Subject ID: ${e.subjectId}, Academic Year: ${e.academicYear}, isActive: ${e.isActive}`);
    });

    if (!courseEnrollment) {
      throw new BadRequestException('Student must be enrolled in the subject to register for exam');
    }

    const existingRegistration = await this.prisma.examRegistration.findFirst({
      where: {
        studentId: dto.studentId,
        examId: dto.examId,
      },
    });

    if (existingRegistration) {
      throw new BadRequestException('Student already registered for this exam');
    }

    return this.prisma.examRegistration.create({
      data: {
        student: { connect: { id: dto.studentId } },
        exam: { connect: { id: dto.examId } },
        subject: { connect: { id: exam.subjectId } },
        isActive: dto.isActive ?? true,
      },
      include: {
        student: {
          include: {

          },
        },
        exam: {
          include: {
            subject: {
              select: { name: true, code: true },
            },
            examPeriod: {
              select: { name: true },
            },
          },
        },
      },
    });
  }

  async gradeExam(dto: GradeExamDto) {
    const examRegistration = await this.prisma.examRegistration.findFirst({
      where: {
        studentId: dto.studentId,
        examId: dto.examId,
        isActive: true,
      },
      include: {
        exam: {
          include: {
            examPeriod: true,
          },
        },
      },
    });

    if (!examRegistration) {
      throw new NotFoundException('Exam registration not found');
    }

    const now = new Date();
    const examDate = new Date(examRegistration.exam.examDate);
    const gradeDeadline = new Date(examDate.getTime() + 15 * 24 * 60 * 60 * 1000);

    // Allow grading for development/testing purposes
    const isDevelopment = process.env.NODE_ENV !== 'production';

    if (!isDevelopment && now > gradeDeadline) {
      throw new ForbiddenException('Grade entry deadline has passed (15 days after exam)');
    }

    const grade = dto.grade || (dto.points >= 51 ? Math.floor(dto.points / 10) + 1 : 5);
    const passed = grade >= 6;

    const existingGrade = await this.prisma.grade.findFirst({
      where: {
        studentId: dto.studentId,
        examId: dto.examId,
      },
    });

    const attempt = existingGrade ? existingGrade.attempt + 1 : (dto.attempt || 1);

    // Get exam for subjectId
    const exam = await this.prisma.exam.findUnique({
      where: { id: dto.examId }
    });

    return this.prisma.grade.create({
      data: {
        student: { connect: { id: dto.studentId } },
        exam: { connect: { id: dto.examId } },
        subject: { connect: { id: exam.subjectId } },
        points: dto.points,
        grade: grade,
        passed: passed,
        attempt: attempt,
        grader: { connect: { id: dto.gradedBy } },
      },
      include: {
        student: {
          include: {

          },
        },
        exam: {
          include: {
            subject: {
              select: { name: true, code: true, credits: true },
            },
          },
        },
      },
    });
  }



  async searchStudents(dto: SearchStudentsDto) {
    const where: any = {};

    if (dto.firstName || dto.lastName || dto.studentIndex) {
      where.user = {};
      if (dto.firstName) {
        where.user.firstName = { contains: dto.firstName, mode: 'insensitive' };
      }
      if (dto.lastName) {
        where.user.lastName = { contains: dto.lastName, mode: 'insensitive' };
      }
    }

    if (dto.studentIndex) {
      where.studentIndex = { contains: dto.studentIndex };
    }

    if (dto.enrollmentYear) {
      where.enrollmentYear = dto.enrollmentYear;
    }

    if (dto.studyProgramId) {
      where.studyProgramId = dto.studyProgramId;
    }

    const skip = ((dto.page || 1) - 1) * (dto.limit || 10);
    const take = dto.limit || 10;

    const students = await this.prisma.studentProfile.findMany({
      where,
      skip,
      take,
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true },
        },
        studyProgram: {
          include: {
            faculty: {
              select: { name: true },
            },
          },
        },
        grades: {
          where: { passed: true },
          include: {
            exam: {
              include: {
                subject: {
                  select: { credits: true },
                },
              },
            },
          },
        },
      },
    });

    // Get course enrollments separately using user IDs
    const userIds = students.map(s => s.userId);
    const courseEnrollments = await this.prisma.courseEnrollment.findMany({
      where: {
        studentId: { in: userIds },
        status: 'Completed',
        isActive: true
      },
      include: {
        subject: {
          select: {
            name: true,
            credits: true
          },
        },
      },
    });

    const studentsWithStats = students.map(student => {
      const passedGrades = student.grades.filter(g => g.passed);
      const studentEnrollments = courseEnrollments.filter(e => e.studentId === student.userId);

      // Combine ECTS from both sources
      const gradesECTS = passedGrades.reduce((sum, grade) => sum + grade.exam.subject.credits, 0);
      const enrollmentsECTS = studentEnrollments.reduce((sum, enrollment) => sum + enrollment.subject.credits, 0);
      const totalECTS = gradesECTS + enrollmentsECTS;

      // Calculate average grade from both sources
      const gradesSum = passedGrades.reduce((sum, grade) => sum + (grade.grade || 0), 0);
      const enrollmentsSum = studentEnrollments.reduce((sum, enrollment) => {
        // Calculate weighted grade from enrollment components
        const attendance = enrollment.attendance || 0;
        const assignments = enrollment.assignments || 0;
        const midterm = enrollment.midterm || 0;
        const final = enrollment.final || 0;
        const weightedGrade = Math.round(attendance * 0.1 + assignments * 0.2 + midterm * 0.3 + final * 0.4);
        return sum + weightedGrade;
      }, 0);

      const totalPassed = passedGrades.length + studentEnrollments.length;
      const averageGrade = totalPassed > 0
        ? (gradesSum + enrollmentsSum) / totalPassed
        : 0;

      return {
        ...student,
        totalECTS,
        averageGrade: parseFloat(averageGrade.toFixed(2)),
        grades: undefined,
        courseEnrollments: studentEnrollments, // Include for frontend
      };
    });

    if (dto.minGpa !== undefined || dto.maxGpa !== undefined) {
      return studentsWithStats.filter(student => {
        if (dto.minGpa !== undefined && student.averageGrade < dto.minGpa) return false;
        if (dto.maxGpa !== undefined && student.averageGrade > dto.maxGpa) return false;
        return true;
      });
    }

    const total = await this.prisma.studentProfile.count({ where });

    return {
      data: studentsWithStats,
      meta: {
        total,
        page: dto.page || 1,
        limit: dto.limit || 10,
        totalPages: Math.ceil(total / (dto.limit || 10)),
      },
    };
  }

  async getStudentAcademicHistory(studentId: number) {
    const student = await this.prisma.studentProfile.findUnique({
      where: { id: studentId },
      include: {
        user: {
          select: { firstName: true, lastName: true, email: true, id: true },
        },
        studyProgram: {
          include: {
            faculty: {
              select: { name: true },
            },
          },
        },
        studentEnrollments: {
          include: {
            studyProgram: {
              select: { name: true },
            },
          },
        },
        grades: {
          include: {
            exam: {
              include: {
                subject: {
                  select: { name: true, code: true, credits: true },
                },
              },
            },
          },
          orderBy: { gradedAt: 'desc' },
        },
        examRegistrations: {
          include: {
            exam: {
              include: {
                subject: {
                  select: { name: true, code: true },
                },
                examPeriod: {
                  select: { name: true },
                },
              },
            },
          },
          where: { isActive: true },
        },
      },
    });

    if (!student) {
      throw new NotFoundException('Student not found');
    }

    // Get course enrollments separately using the user ID
    const courseEnrollments = await this.prisma.courseEnrollment.findMany({
      where: {
        studentId: student.user.id,
        isActive: true
      },
      include: {
        subject: {
          select: { name: true, code: true, credits: true },
        },
      },
    });

    const passedGrades = student.grades.filter(g => g.passed);
    const failedGrades = student.grades.filter(g => !g.passed);
    const totalECTS = passedGrades.reduce((sum, grade) => sum + grade.exam.subject.credits, 0);
    const averageGrade = passedGrades.length > 0
      ? passedGrades.reduce((sum, grade) => sum + (grade.grade || 0), 0) / passedGrades.length
      : 0;

    return {
      student: {
        ...student,
        totalECTS,
        averageGrade: parseFloat(averageGrade.toFixed(2)),
        courseEnrollments, // Add course enrollments to student object for compatibility
      },
      passedSubjects: passedGrades,
      failedAttempts: failedGrades,
      currentEnrollments: await Promise.all(
        courseEnrollments.map(async (enrollment) => {
          // Find professor for this subject
          const professorAssignment = await this.prisma.professorAssignment.findFirst({
            where: {
              subjectId: enrollment.subjectId,
              academicYear: enrollment.academicYear,
              isActive: true,
            },
            include: {
              professor: {
                select: { firstName: true, lastName: true },
              },
            },
          });

          // Find grade for this enrollment
          const grade = student.grades.find(g => g.exam.subjectId === enrollment.subjectId);

          return {
            ...enrollment,
            professor: professorAssignment ? {
              firstName: professorAssignment.professor.firstName,
              lastName: professorAssignment.professor.lastName,
            } : null,
            finalGrade: grade ? grade.grade : null,
          };
        })
      ),
      examRegistrations: student.examRegistrations,
    };
  }

  async getProfessorSubjects(professorId: number, academicYear?: string) {
    // Get subjects assigned to this professor through ProfessorAssignment
    const assignments = await this.prisma.professorAssignment.findMany({
      where: {
        professorId: professorId,
        isActive: true,
        ...(academicYear && { academicYear: academicYear }),
      },
      include: {
        subject: {
          include: {
            studyProgram: {
              include: {
                faculty: {
                  select: { name: true },
                },
              },
            },
          },
        },
        professor: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
          },
        },
      },
    });

    // Map assignments to include necessary fields for frontend
    return assignments.map(assignment => ({
      subject: {
        id: assignment.subject.id,
        name: assignment.subject.name,
        code: assignment.subject.code,
        ects: assignment.subject.ects,
        semesterType: assignment.subject.semester % 2 === 1 ? 'WINTER' : 'SUMMER', // Odd semesters = WINTER, Even = SUMMER
        description: assignment.subject.description || 'No description available',
        credits: assignment.subject.credits,
        lectureHours: assignment.subject.numberOfLectures || 0,
        practicalHours: assignment.subject.numberOfExercises || 0,
        studyProgramId: assignment.subject.studyProgramId,
      },
      academicYear: assignment.academicYear || academicYear || '2024/2025',
      professorId: assignment.professorId,
      professor: assignment.professor,
      teachingType: assignment.teachingType,
      assignmentId: assignment.id,
    }));
  }

  async getActiveExamPeriods() {
    return this.prisma.examPeriod.findMany({
      where: { isActive: true },
      include: {
        exams: {
          include: {
            subject: {
              select: { name: true, code: true },
            },
            registrations: {
              include: {
                student: {
                  select: { firstName: true, lastName: true },
                },
              },
            },
          },
        },
      },
      orderBy: { startDate: 'asc' },
    });
  }

  async getStudentExamRegistrations(studentId: number) {
    return this.prisma.examRegistration.findMany({
      where: {
        studentId,
        isActive: true,
      },
      include: {
        exam: {
          include: {
            subject: {
              select: { name: true, code: true, credits: true },
            },
            examPeriod: {
              select: { name: true },
            },
          },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getProfessorExamRegistrations(professorId: number) {
    // Get professor's assigned subjects
    const professorAssignments = await this.prisma.professorAssignment.findMany({
      where: {
        professorId,
        isActive: true,
      },
      include: {
        subject: true,
      },
    });

    const subjectIds = professorAssignments.map(assignment => assignment.subjectId);

    if (subjectIds.length === 0) {
      return [];
    }

    // Get exam registrations for these subjects
    const examRegistrations = await this.prisma.examRegistration.findMany({
      where: {
        subjectId: {
          in: subjectIds,
        },
        isActive: true,
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
        subject: {
          select: {
            id: true,
            name: true,
            code: true,
            ects: true,
          },
        },
        exam: {
          include: {
            examPeriod: {
              select: {
                name: true,
              },
            },
          },
        },
      },
      orderBy: {
        createdAt: 'desc',
      },
    });

    return examRegistrations;
  }

  // Syllabus Management Methods
  async createSyllabus(dto: CreateSyllabusDto, professorId: number) {

    // Check if syllabus already exists
    const existingSyllabus = await this.prisma.syllabus.findFirst({
      where: {
        subjectId: dto.subjectId,
        academicYear: dto.academicYear,
      },
    });

    if (existingSyllabus) {
      // Update existing syllabus instead of throwing error
      return this.prisma.syllabus.update({
        where: { id: existingSyllabus.id },
        data: {
          description: dto.description,
          objectives: dto.objectives,
          isActive: dto.isActive ?? true,
        },
        include: {
          subject: {
            select: { name: true, code: true },
          },
          topics: {
            where: { isActive: true },
            orderBy: { createdAt: 'asc' },
          },
          materials: {
            where: { isActive: true },
          },
        },
      });
    }

    return this.prisma.syllabus.create({
      data: {
        subject: { connect: { id: dto.subjectId } },
        title: 'Syllabus',
        academicYear: dto.academicYear,
        description: dto.description,
        objectives: dto.objectives,
        isActive: dto.isActive ?? true,
      },
      include: {
        subject: {
          select: { name: true, code: true },
        },
        topics: {
          where: { isActive: true },
          orderBy: { createdAt: 'asc' },
        },
        materials: {
          where: { isActive: true },
        },
      },
    });
  }

  async updateSyllabus(syllabusId: number, dto: UpdateSyllabusDto, professorId: number) {
    const syllabus = await this.prisma.syllabus.findUnique({
      where: { id: syllabusId },
      include: {
        subject: {
          select: { name: true, code: true },
        },
      },
    });

    if (!syllabus) {
      throw new NotFoundException('Syllabus not found');
    }


    return this.prisma.syllabus.update({
      where: { id: syllabusId },
      data: dto,
      include: {
        subject: {
          select: { name: true, code: true },
        },
        topics: {
          where: { isActive: true },
          orderBy: { createdAt: 'asc' },
        },
        materials: {
          where: { isActive: true },
        },
      },
    });
  }

  async getSyllabus(filters: GetSyllabusDto, professorId?: number) {
    const where: any = { isActive: true };

    if (filters.subjectId) {
      where.subjectId = filters.subjectId;
    }
    if (filters.academicYear) {
      where.academicYear = filters.academicYear;
    }
    if (filters.semesterType) {
      where.semesterType = filters.semesterType;
    }

    // Filter by professor assignments if professorId is provided
    if (professorId) {
      where.subject = {
        professorAssignments: {
          some: {
            professorId,
            isActive: true,
          },
        },
      };
    }

    return this.prisma.syllabus.findMany({
      where,
      include: {
        subject: {
          select: { name: true, code: true },
        },
        topics: {
          where: { isActive: true },
          orderBy: { createdAt: 'asc' },
        },
        materials: {
          where: { isActive: true },
        },
      },
      orderBy: [
        { academicYear: 'desc' },
        { subject: { name: 'asc' } },
      ],
    });
  }

  async getSyllabusById(syllabusId: number, professorId?: number) {

    // First, check if any syllabi exist at all
    const allSyllabi = await this.prisma.syllabus.findMany();
    console.log(`📚 All syllabi in database:`, allSyllabi.map(s => ({ id: s.id, subjectId: s.subjectId })));

    const syllabus = await this.prisma.syllabus.findUnique({
      where: { id: syllabusId },
      include: {
        subject: {
          select: { name: true, code: true },
        },
        topics: {
          orderBy: { createdAt: 'asc' },
        },
        materials: true,
      },
    });

    console.log(`📖 Found syllabus:`, syllabus ? { id: syllabus.id, title: syllabus.title } : 'NOT FOUND');

    if (!syllabus) {
      throw new NotFoundException(`Syllabus with ID ${syllabusId} not found`);
    }

    return syllabus;
  }

  async deleteSyllabus(syllabusId: number, professorId: number) {
    const syllabus = await this.prisma.syllabus.findUnique({
      where: { id: syllabusId },
      include: {
        subject: {
          include: {
            professorAssignments: {
              where: {
                professorId,
                isActive: true,
              },
            },
          },
        },
      },
    });

    if (!syllabus) {
      throw new NotFoundException('Syllabus not found');
    }

    if (syllabus.subject.professorAssignments.length === 0) {
      throw new ForbiddenException('Professor not assigned to this subject');
    }

    // Soft delete - set isActive to false
    return this.prisma.syllabus.update({
      where: { id: syllabusId },
      data: { isActive: false },
    });
  }

  // Syllabus Topic Management
  async createSyllabusTopic(dto: CreateSyllabusTopicDto, professorId: number) {
    // Verify professor has access to this syllabus
    const syllabus = await this.prisma.syllabus.findUnique({
      where: { id: dto.syllabusId },
      include: {
        subject: {
          include: {
            professorAssignments: {
              where: {
                professorId,
                isActive: true,
              },
            },
          },
        },
      },
    });

    if (!syllabus) {
      throw new NotFoundException('Syllabus not found');
    }

    if (syllabus.subject.professorAssignments.length === 0) {
      throw new ForbiddenException('Professor not assigned to this subject');
    }

    return this.prisma.syllabusTopic.create({
      data: dto,
      include: {
        syllabus: {
          select: { subject: { select: { name: true } } },
        },
      },
    });
  }

  async updateSyllabusTopic(topicId: number, dto: UpdateSyllabusTopicDto, professorId: number) {
    const topic = await this.prisma.syllabusTopic.findUnique({
      where: { id: topicId },
      include: {
        syllabus: {
          include: {
            subject: {
              include: {
                professorAssignments: {
                  where: {
                    professorId,
                    isActive: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!topic) {
      throw new NotFoundException('Topic not found');
    }

    if (topic.syllabus.subject.professorAssignments.length === 0) {
      throw new ForbiddenException('Professor not assigned to this subject');
    }

    return this.prisma.syllabusTopic.update({
      where: { id: topicId },
      data: dto,
    });
  }

  async deleteSyllabusTopic(topicId: number, professorId: number) {
    const topic = await this.prisma.syllabusTopic.findUnique({
      where: { id: topicId },
      include: {
        syllabus: {
          include: {
            subject: {
              include: {
                professorAssignments: {
                  where: {
                    professorId,
                    isActive: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!topic) {
      throw new NotFoundException('Topic not found');
    }

    if (topic.syllabus.subject.professorAssignments.length === 0) {
      throw new ForbiddenException('Professor not assigned to this subject');
    }

    return this.prisma.syllabusTopic.update({
      where: { id: topicId },
      data: { isActive: false },
    });
  }

  // Syllabus Material Management
  async createSyllabusMaterial(dto: CreateSyllabusMaterialDto, professorId: number) {
    // Verify professor has access to this syllabus
    const syllabus = await this.prisma.syllabus.findUnique({
      where: { id: dto.syllabusId },
      include: {
        subject: {
          include: {
            professorAssignments: {
              where: {
                professorId,
                isActive: true,
              },
            },
          },
        },
      },
    });

    if (!syllabus) {
      throw new NotFoundException('Syllabus not found');
    }

    if (syllabus.subject.professorAssignments.length === 0) {
      throw new ForbiddenException('Professor not assigned to this subject');
    }

    return this.prisma.syllabusMaterial.create({
      data: dto,
      include: {
        syllabus: {
          select: { subject: { select: { name: true } } },
        },
      },
    });
  }

  async updateSyllabusMaterial(materialId: number, dto: UpdateSyllabusMaterialDto, professorId: number) {
    const material = await this.prisma.syllabusMaterial.findUnique({
      where: { id: materialId },
      include: {
        syllabus: {
          include: {
            subject: {
              include: {
                professorAssignments: {
                  where: {
                    professorId,
                    isActive: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!material) {
      throw new NotFoundException('Material not found');
    }

    if (material.syllabus.subject.professorAssignments.length === 0) {
      throw new ForbiddenException('Professor not assigned to this subject');
    }

    return this.prisma.syllabusMaterial.update({
      where: { id: materialId },
      data: dto,
    });
  }

  async deleteSyllabusMaterial(materialId: number, professorId: number) {
    const material = await this.prisma.syllabusMaterial.findUnique({
      where: { id: materialId },
      include: {
        syllabus: {
          include: {
            subject: {
              include: {
                professorAssignments: {
                  where: {
                    professorId,
                    isActive: true,
                  },
                },
              },
            },
          },
        },
      },
    });

    if (!material) {
      throw new NotFoundException('Material not found');
    }

    if (material.syllabus.subject.professorAssignments.length === 0) {
      throw new ForbiddenException('Professor not assigned to this subject');
    }

    return this.prisma.syllabusMaterial.update({
      where: { id: materialId },
      data: { isActive: false },
    });
  }

  // Grade Entry Methods
  async getProfessorCoursesWithExams(professorId: number) {
    console.log('🔍 Fetching courses for professor ID:', professorId);

    try {
      const assignments = await this.prisma.professorAssignment.findMany({
        where: {
          professorId,
          isActive: true,
        },
        include: {
          subject: true
        }
      });

      console.log('📚 Found assignments:', assignments.length);

      if (assignments.length === 0) {
        console.log('⚠️ No assignments found for professor');
        return [];
      }

      const result = [];

      for (const assignment of assignments) {
        const subject = assignment.subject;

        // Find the latest exam for this subject
        const latestExam = await this.prisma.exam.findFirst({
          where: {
            subjectId: subject.id,
            isActive: true
          },
          orderBy: {
            examDate: 'desc'
          }
        });

        // Count enrolled students for this subject
        const enrolledStudents = await this.prisma.courseEnrollment.count({
          where: {
            subjectId: subject.id,
            isActive: true
          }
        });

        result.push({
          id: subject.id,
          name: subject.name,
          code: subject.code,
          semester: `${assignment.academicYear || 'Winter 2024'}`,
          studentsEnrolled: enrolledStudents,
          gradingDeadline: latestExam ?
            new Date(new Date(latestExam.examDate).getTime() + (15 * 24 * 60 * 60 * 1000)).toISOString().split('T')[0] :
            null,
          examDate: latestExam ? latestExam.examDate.toISOString().split('T')[0] : null,
        });
      }

      console.log('Returning courses:', result);
      return result;

    } catch (error) {
      console.error('Error in getProfessorCoursesWithExams:', error);
      throw error;
    }
  }

  async getCourseStudents(subjectId: number, professorId: number) {
    // Verify professor is assigned to this subject
    const assignment = await this.prisma.professorAssignment.findFirst({
      where: {
        professorId,
        subjectId,
        isActive: true,
      },
    });

    if (!assignment) {
      throw new ForbiddenException('Professor not assigned to this subject');
    }

    const enrollments = await this.prisma.courseEnrollment.findMany({
      where: {
        subjectId,
        isActive: true,
      },
      include: {
        student: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          }
        }
      }
    });

    return enrollments.map(enrollment => ({
      id: enrollment.student.id,
      firstName: enrollment.student.firstName,
      lastName: enrollment.student.lastName,
      indexNumber: `2021/${enrollment.student.id.toString().padStart(3, '0')}`, // Generated index number
      email: enrollment.student.email,
      courseId: subjectId,
      enrollments: [{
        id: enrollment.id,
        courseId: subjectId,
        course: {
          id: subjectId,
          name: 'Course Name',
          code: 'Course Code'
        },
        attendance: enrollment.attendance || 0,
        assignments: enrollment.assignments || 0,
        midterm: enrollment.midterm || 0,
        final: enrollment.final || 0,
        status: enrollment.status || 'Pending'
      }]
    }));
  }

  async getAllProfessorStudents(professorId: number) {
    console.log('Fetching all students for professor ID:', professorId);

    try {
      // Get all subjects assigned to this professor
      const assignments = await this.prisma.professorAssignment.findMany({
        where: {
          professorId,
          isActive: true,
        },
        include: {
          subject: true
        }
      });

      if (assignments.length === 0) {
        console.log('No subject assignments found for professor');
        return [];
      }

      const subjectIds = assignments.map(assignment => assignment.subjectId);

      // Get all enrollments for professor's subjects
      const enrollments = await this.prisma.courseEnrollment.findMany({
        where: {
          subjectId: { in: subjectIds },
          isActive: true,
        },
        include: {
          student: {
            select: {
              id: true,
              firstName: true,
              lastName: true,
              email: true,
            }
          },
          subject: {
            select: {
              id: true,
              name: true,
              code: true,
            }
          }
        }
      });

      // Group enrollments by student
      const studentMap = new Map();

      enrollments.forEach(enrollment => {
        const studentId = enrollment.student.id;

        if (!studentMap.has(studentId)) {
          studentMap.set(studentId, {
            id: enrollment.student.id,
            firstName: enrollment.student.firstName,
            lastName: enrollment.student.lastName,
            indexNumber: `2021/${enrollment.student.id.toString().padStart(3, '0')}`,
            email: enrollment.student.email,
            enrollments: []
          });
        }

        studentMap.get(studentId).enrollments.push({
          id: enrollment.id,
          courseId: enrollment.subjectId,
          course: {
            id: enrollment.subject.id,
            name: enrollment.subject.name,
            code: enrollment.subject.code
          },
          attendance: enrollment.attendance || 0,
          assignments: enrollment.assignments || 0,
          midterm: enrollment.midterm || 0,
          final: enrollment.final || 0,
          status: enrollment.status || 'Pending'
        });
      });

      const result = Array.from(studentMap.values());
      console.log(`Found ${result.length} unique students across ${assignments.length} subjects`);
      return result;

    } catch (error) {
      console.error('Error in getAllProfessorStudents:', error);
      throw error;
    }
  }

  async saveGrades(subjectId: number, professorId: number, grades: Array<{
    studentId: number;
    attendance?: number;
    assignments?: number;
    midterm?: number;
    final?: number;
  }>) {
    console.log('Saving grades for subject:', subjectId, 'professor:', professorId);

    // Verify professor is assigned to this subject
    const assignment = await this.prisma.professorAssignment.findFirst({
      where: {
        professorId,
        subjectId,
        isActive: true,
      },
    });

    if (!assignment) {
      throw new ForbiddenException('Professor not assigned to this subject');
    }

    // Process each grade update
    const updatePromises = grades.map(async (gradeData) => {
      // Find the enrollment
      const enrollment = await this.prisma.courseEnrollment.findFirst({
        where: {
          studentId: gradeData.studentId,
          subjectId,
          isActive: true,
        },
      });

      if (!enrollment) {
        console.warn(`No enrollment found for student ${gradeData.studentId} in subject ${subjectId}`);
        return null;
      }

      // Prepare update data
      const updateData: any = {};
      if (gradeData.attendance !== undefined) updateData.attendance = gradeData.attendance;
      if (gradeData.assignments !== undefined) updateData.assignments = gradeData.assignments;
      if (gradeData.midterm !== undefined) updateData.midterm = gradeData.midterm;
      if (gradeData.final !== undefined) updateData.final = gradeData.final;

      // Determine status
      const hasAllGrades = (gradeData.attendance || enrollment.attendance) &&
        (gradeData.assignments || enrollment.assignments) &&
        (gradeData.midterm || enrollment.midterm) &&
        (gradeData.final || enrollment.final);

      if (hasAllGrades) {
        updateData.status = 'Completed';
        updateData.gradedBy = professorId;
        updateData.gradedAt = new Date();
      }

      // Update the enrollment
      return this.prisma.courseEnrollment.update({
        where: { id: enrollment.id },
        data: updateData,
      });
    });

    const results = await Promise.all(updatePromises);
    const successfulUpdates = results.filter(result => result !== null);

    console.log(`Updated ${successfulUpdates.length} enrollments out of ${grades.length} requests`);

    return {
      updated: successfulUpdates.length,
      total: grades.length,
      results: successfulUpdates
    };
  }
}
