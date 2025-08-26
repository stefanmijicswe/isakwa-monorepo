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
  constructor(private prisma: PrismaService) {}

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
            user: {
              select: { firstName: true, lastName: true, email: true },
            },
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

    return enrollment;
  }

  async enrollInCourse(dto: EnrollCourseDto) {
    // Prvo pronađi student profile based na studentId (koji je zapravo student profile ID)
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
        semesterType: dto.semesterType,
        isActive: dto.isActive ?? true,
      },
      include: {
        student: {
          include: {
            user: {
              select: { firstName: true, lastName: true, email: true },
            },
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
        semesterType: dto.semesterType,
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
        subjectId: dto.subjectId,
        examPeriodId: dto.examPeriodId,
        examDate: examDate,
        examTime: dto.examTime,
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

  async registerForExam(dto: RegisterExamDto) {
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

    const now = new Date();
    if (now < exam.examPeriod.registrationStartDate || now > exam.examPeriod.registrationEndDate) {
      throw new ForbiddenException('Exam registration is not currently active');
    }

    const courseEnrollment = await this.prisma.courseEnrollment.findFirst({
      where: {
        studentId: dto.studentId,
        subjectId: exam.subjectId,
        academicYear: exam.examPeriod.academicYear,
        isActive: true,
      },
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
        studentId: dto.studentId,
        examId: dto.examId,
        isActive: dto.isActive ?? true,
      },
      include: {
        student: {
          include: {
            user: {
              select: { firstName: true, lastName: true, email: true },
            },
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

    if (now > gradeDeadline) {
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

    return this.prisma.grade.create({
      data: {
        studentId: dto.studentId,
        examId: dto.examId,
        points: dto.points,
        grade: grade,
        passed: passed,
        attempt: attempt,
        gradedBy: dto.gradedBy,
      },
      include: {
        student: {
          include: {
            user: {
              select: { firstName: true, lastName: true, email: true },
            },
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
          select: { name: true },
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

    const studentsWithStats = students.map(student => {
      const passedGrades = student.grades.filter(g => g.passed);
      const totalECTS = passedGrades.reduce((sum, grade) => sum + grade.exam.subject.credits, 0);
      const averageGrade = passedGrades.length > 0 
        ? passedGrades.reduce((sum, grade) => sum + (grade.grade || 0), 0) / passedGrades.length 
        : 0;

      return {
        ...student,
        totalECTS,
        averageGrade: parseFloat(averageGrade.toFixed(2)),
        grades: undefined,
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
          select: { firstName: true, lastName: true, email: true },
        },
        studyProgram: {
          include: {
            faculty: {
              select: { name: true },
            },
          },
        },
        enrollments: {
          include: {
            studyProgram: {
              select: { name: true },
            },
          },
        },
        courseEnrollments: {
          include: {
            subject: {
              select: { name: true, code: true, credits: true },
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
      },
      passedSubjects: passedGrades,
      failedAttempts: failedGrades,
      currentEnrollments: await Promise.all(
        student.courseEnrollments.filter(e => e.isActive).map(async (enrollment) => {
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
    const where: any = { professorId, isActive: true };
    if (academicYear) {
      where.academicYear = academicYear;
    }

    return this.prisma.professorAssignment.findMany({
      where,
      include: {
        subject: {
          include: {
            courseEnrollments: {
              where: academicYear ? { academicYear } : {},
              include: {
                student: {
                  include: {
                    user: {
                      select: { firstName: true, lastName: true, email: true },
                    },
                  },
                },
              },
            },
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
                  include: {
                    user: {
                      select: { firstName: true, lastName: true },
                    },
                  },
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
      orderBy: { registrationDate: 'desc' },
    });
  }

  // Syllabus Management Methods
  async createSyllabus(dto: CreateSyllabusDto, professorId: number) {
    // Verify professor is assigned to this subject
    const assignment = await this.prisma.professorAssignment.findFirst({
      where: {
        professorId,
        subjectId: dto.subjectId,
        academicYear: dto.academicYear,
        isActive: true,
      },
    });

    if (!assignment) {
      throw new ForbiddenException('Professor not assigned to this subject');
    }

    // Check if syllabus already exists
    const existingSyllabus = await this.prisma.syllabus.findFirst({
      where: {
        subjectId: dto.subjectId,
        academicYear: dto.academicYear,
        semesterType: dto.semesterType,
      },
    });

    if (existingSyllabus) {
      throw new BadRequestException('Syllabus already exists for this subject, year, and semester');
    }

    return this.prisma.syllabus.create({
      data: {
        subjectId: dto.subjectId,
        academicYear: dto.academicYear,
        semesterType: dto.semesterType,
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
          orderBy: { order: 'asc' },
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
          include: {
            ProfessorAssignment: {
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

    if (syllabus.subject.ProfessorAssignment.length === 0) {
      throw new ForbiddenException('Professor not assigned to this subject');
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
          orderBy: { order: 'asc' },
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

    // If professorId is provided, only return syllabi for subjects they're assigned to
    if (professorId) {
      where.subject = {
        ProfessorAssignment: {
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
          orderBy: { order: 'asc' },
        },
        materials: {
          where: { isActive: true },
        },
      },
      orderBy: [
        { academicYear: 'desc' },
        { semesterType: 'asc' },
        { subject: { name: 'asc' } },
      ],
    });
  }

  async getSyllabusById(syllabusId: number, professorId?: number) {
    const where: any = { id: syllabusId, isActive: true };

    if (professorId) {
      where.subject = {
        ProfessorAssignment: {
          some: {
            professorId,
            isActive: true,
          },
        },
      };
    }

    const syllabus = await this.prisma.syllabus.findFirst({
      where,
      include: {
        subject: {
          select: { name: true, code: true },
        },
        topics: {
          where: { isActive: true },
          orderBy: { order: 'asc' },
        },
        materials: {
          where: { isActive: true },
        },
      },
    });

    if (!syllabus) {
      throw new NotFoundException('Syllabus not found');
    }

    return syllabus;
  }

  async deleteSyllabus(syllabusId: number, professorId: number) {
    const syllabus = await this.prisma.syllabus.findUnique({
      where: { id: syllabusId },
              include: {
          subject: {
            include: {
              ProfessorAssignment: {
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

    if (syllabus.subject.ProfessorAssignment.length === 0) {
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
            ProfessorAssignment: {
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

    if (syllabus.subject.ProfessorAssignment.length === 0) {
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
                ProfessorAssignment: {
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

    if (topic.syllabus.subject.ProfessorAssignment.length === 0) {
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
                ProfessorAssignment: {
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

    if (topic.syllabus.subject.ProfessorAssignment.length === 0) {
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
            ProfessorAssignment: {
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

    if (syllabus.subject.ProfessorAssignment.length === 0) {
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
                ProfessorAssignment: {
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

    if (material.syllabus.subject.ProfessorAssignment.length === 0) {
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
                ProfessorAssignment: {
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

    if (material.syllabus.subject.ProfessorAssignment.length === 0) {
      throw new ForbiddenException('Professor not assigned to this subject');
    }

    return this.prisma.syllabusMaterial.update({
      where: { id: materialId },
      data: { isActive: false },
    });
  }
}
