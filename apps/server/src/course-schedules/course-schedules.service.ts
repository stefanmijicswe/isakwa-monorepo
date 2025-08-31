import { Injectable, NotFoundException, ForbiddenException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import {
  CreateCourseScheduleDto,
  UpdateCourseScheduleDto,
  CreateCourseSessionDto,
  UpdateCourseSessionDto,
} from './dto';
import { TeachingType } from '@prisma/client';

@Injectable()
export class CourseSchedulesService {
  constructor(private prisma: PrismaService) {}

  // Course Schedule Management
  async createCourseSchedule(dto: CreateCourseScheduleDto, userId: number, userRole: string) {
    // For STUDENT_SERVICE, skip professor assignment check
    if (userRole === 'PROFESSOR') {
      // Verify professor is assigned to this subject
      const assignment = await this.prisma.professorAssignment.findFirst({
        where: {
          professorId: userId,
          subjectId: dto.subjectId,

          isActive: true,
        },
      });

      if (!assignment) {
        throw new ForbiddenException('Professor not assigned to this subject');
      }
    }

    // Check if schedule already exists
    const existingSchedule = await this.prisma.courseSchedule.findFirst({
      where: {
        subjectId: dto.subjectId,
        academicYear: dto.academicYear,
        semesterType: dto.semesterType,
      },
    });

    if (existingSchedule) {
      throw new BadRequestException('Course schedule already exists for this subject, year, and semester');
    }

    return this.prisma.courseSchedule.create({
      data: {
        subjectId: dto.subjectId,
        academicYear: dto.academicYear,
        semesterType: dto.semesterType,
        isActive: dto.isActive ?? true,
      },
      include: {
        subject: {
          select: { name: true, code: true },
        },
        sessions: {
          where: { isActive: true },
          orderBy: { sessionDate: 'asc' },
        },
      },
    });
  }

  async getCourseSchedules(filters: any, userId?: number, userRole?: string) {
    const where: any = { isActive: true };

    if (filters.subjectId) {
      where.subjectId = parseInt(filters.subjectId);
    }

    if (filters.academicYear) {
      where.academicYear = filters.academicYear;
    }

    if (filters.semesterType) {
      where.semesterType = filters.semesterType;
    }

    // If professor ID provided, only show schedules for subjects they teach
    if (userRole === 'PROFESSOR' && userId) {
      where.subject = {
        professorAssignments: {
          some: {
            professorId: userId,
            isActive: true,
          },
        },
      };
    }
    // For STUDENT_SERVICE, show all schedules (no filtering)

    return this.prisma.courseSchedule.findMany({
      where,
      include: {
        subject: {
          select: { name: true, code: true },
        },
        sessions: {
          where: { isActive: true },
          orderBy: { sessionDate: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async getCourseScheduleById(scheduleId: number, userId?: number, userRole?: string) {
    const where: any = { id: scheduleId, isActive: true };

    if (userRole === 'PROFESSOR' && userId) {
      where.subject = {
        professorAssignments: {
          some: {
            professorId: userId,
            isActive: true,
          },
        },
      };
    }
    // For STUDENT_SERVICE, show all schedules (no filtering)

    const schedule = await this.prisma.courseSchedule.findFirst({
      where,
      include: {
        subject: {
          select: { name: true, code: true },
        },
        sessions: {
          where: { isActive: true },
          orderBy: { sessionDate: 'asc' },
        },
      },
    });

    if (!schedule) {
      throw new NotFoundException('Course schedule not found');
    }

    return schedule;
  }

  async updateCourseSchedule(scheduleId: number, dto: UpdateCourseScheduleDto, userId: number, userRole?: string) {
    if (userRole === 'PROFESSOR') {
      const schedule = await this.prisma.courseSchedule.findUnique({
        where: { id: scheduleId },
        include: {
          subject: {
            include: {
              professorAssignments: {
                where: {
                  professorId: userId,
                  isActive: true,
                },
              },
            },
          },
        },
      });

      if (!schedule) {
        throw new NotFoundException('Course schedule not found');
      }

      if (schedule.subject.professorAssignments.length === 0) {
        throw new ForbiddenException('Professor not assigned to this subject');
      }
    } else {
      // For STUDENT_SERVICE, just verify schedule exists
      const schedule = await this.prisma.courseSchedule.findUnique({
        where: { id: scheduleId },
      });

      if (!schedule) {
        throw new NotFoundException('Course schedule not found');
      }
    }

    return this.prisma.courseSchedule.update({
      where: { id: scheduleId },
      data: dto,
      include: {
        subject: {
          select: { name: true, code: true },
        },
        sessions: {
          where: { isActive: true },
          orderBy: { sessionDate: 'asc' },
        },
      },
    });
  }

  async deleteCourseSchedule(scheduleId: number, userId: number, userRole?: string) {
    if (userRole === 'PROFESSOR') {
      const schedule = await this.prisma.courseSchedule.findUnique({
        where: { id: scheduleId },
        include: {
          subject: {
            include: {
              professorAssignments: {
                where: {
                  professorId: userId,
                  isActive: true,
                },
              },
            },
          },
        },
      });

      if (!schedule) {
        throw new NotFoundException('Course schedule not found');
      }

      if (schedule.subject.professorAssignments.length === 0) {
        throw new ForbiddenException('Professor not assigned to this subject');
      }
    } else {
      // For STUDENT_SERVICE, just verify schedule exists
      const schedule = await this.prisma.courseSchedule.findUnique({
        where: { id: scheduleId },
      });

      if (!schedule) {
        throw new NotFoundException('Course schedule not found');
      }
    }

    // Soft delete - set isActive to false
    return this.prisma.courseSchedule.update({
      where: { id: scheduleId },
      data: { isActive: false },
    });
  }

  // Course Session Management
  async createCourseSession(dto: CreateCourseSessionDto, userId: number, userRole: string) {
    // For STUDENT_SERVICE, skip professor assignment check
    if (userRole === 'PROFESSOR') {
      // Verify professor has access to this schedule
      const schedule = await this.prisma.courseSchedule.findUnique({
        where: { id: dto.scheduleId },
        include: {
          subject: {
            include: {
              professorAssignments: {
                where: {
                  professorId: userId,
                  isActive: true,
                },
              },
            },
          },
        },
      });

      if (!schedule) {
        throw new NotFoundException('Course schedule not found');
      }

      if (schedule.subject.professorAssignments.length === 0) {
        throw new ForbiddenException('Professor not assigned to this subject');
      }
    } else {
      // For STUDENT_SERVICE, just verify schedule exists
      const schedule = await this.prisma.courseSchedule.findUnique({
        where: { id: dto.scheduleId },
      });

      if (!schedule) {
        throw new NotFoundException('Course schedule not found');
      }
    }

    // Validate time format
    if (!this.isValidTimeFormat(dto.startTime) || !this.isValidTimeFormat(dto.endTime)) {
      throw new BadRequestException('Invalid time format. Use HH:MM format (e.g., 09:00)');
    }

    // Validate that end time is after start time
    if (dto.startTime >= dto.endTime) {
      throw new BadRequestException('End time must be after start time');
    }

    return this.prisma.courseSession.create({
      data: {
        scheduleId: dto.scheduleId,
        title: dto.title,
        description: dto.description,
        sessionDate: new Date(dto.sessionDate),
        startTime: dto.startTime,
        endTime: dto.endTime,
        room: dto.room,
        sessionType: dto.sessionType,
        dayOfWeek: new Date(dto.sessionDate).getDay(),
        isActive: dto.isActive ?? true,
      },
      include: {
        schedule: {
          select: { subject: { select: { name: true } } },
        },
      },
    });
  }

  async getCourseSessions(scheduleId: number, userId?: number, userRole?: string) {
    // Verify access to schedule
    if (userRole === 'PROFESSOR' && userId) {
      const schedule = await this.prisma.courseSchedule.findUnique({
        where: { id: scheduleId },
        include: {
          subject: {
            include: {
              professorAssignments: {
                where: {
                  professorId: userId,
                  isActive: true,
                },
              },
            },
          },
        },
      });

      if (!schedule || schedule.subject.professorAssignments.length === 0) {
        throw new ForbiddenException('Access denied to this course schedule');
      }
    } else if (userRole === 'STUDENT_SERVICE') {
      // For STUDENT_SERVICE, just verify schedule exists
      const schedule = await this.prisma.courseSchedule.findUnique({
        where: { id: scheduleId },
      });

      if (!schedule) {
        throw new NotFoundException('Course schedule not found');
      }
    }

    return this.prisma.courseSession.findMany({
      where: {
        scheduleId,
        isActive: true,
      },
      orderBy: { sessionDate: 'asc' },
      include: {
        schedule: {
          select: { subject: { select: { name: true } } },
        },
      },
    });
  }

  async getCourseSessionById(sessionId: number, userId?: number, userRole?: string) {
    const where: any = { id: sessionId, isActive: true };

    if (userRole === 'PROFESSOR' && userId) {
      where.schedule = {
        subject: {
          professorAssignments: {
            some: {
              professorId: userId,
              isActive: true,
            },
          },
        },
      };
    }
    // For STUDENT_SERVICE, show all sessions (no filtering)

    const session = await this.prisma.courseSession.findFirst({
      where,
      include: {
        schedule: {
          select: { subject: { select: { name: true } } },
        },
      },
    });

    if (!session) {
      throw new NotFoundException('Course session not found');
    }

    return session;
  }

  async updateCourseSession(sessionId: number, dto: UpdateCourseSessionDto, professorId: number) {
    const session = await this.prisma.courseSession.findUnique({
      where: { id: sessionId },
      include: {
        schedule: {
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

    if (!session) {
      throw new NotFoundException('Course session not found');
    }

    if (session.schedule.subject.professorAssignments.length === 0) {
      throw new ForbiddenException('Professor not assigned to this subject');
    }

    // Validate time format if provided
    if (dto.startTime && !this.isValidTimeFormat(dto.startTime)) {
      throw new BadRequestException('Invalid start time format. Use HH:MM format (e.g., 09:00)');
    }

    if (dto.endTime && !this.isValidTimeFormat(dto.endTime)) {
      throw new BadRequestException('Invalid end time format. Use HH:MM format (e.g., 09:00)');
    }

    // Validate that end time is after start time if both provided
    if (dto.startTime && dto.endTime && dto.startTime >= dto.endTime) {
      throw new BadRequestException('End time must be after start time');
    }

    return this.prisma.courseSession.update({
      where: { id: sessionId },
      data: dto,
      include: {
        schedule: {
          select: { subject: { select: { name: true } } },
        },
      },
    });
  }

  async deleteCourseSession(sessionId: number, professorId: number) {
    const session = await this.prisma.courseSession.findUnique({
      where: { id: sessionId },
      include: {
        schedule: {
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

    if (!session) {
      throw new NotFoundException('Course session not found');
    }

    if (session.schedule.subject.professorAssignments.length === 0) {
      throw new ForbiddenException('Professor not assigned to this subject');
    }

    // Soft delete - set isActive to false
    return this.prisma.courseSession.update({
      where: { id: sessionId },
      data: { isActive: false },
    });
  }

  // Helper methods
  private isValidTimeFormat(time: string): boolean {
    const timeRegex = /^([0-1]?[0-9]|2[0-3]):[0-5][0-9]$/;
    return timeRegex.test(time);
  }

  // Get schedules for a specific subject
  async getSchedulesBySubject(subjectId: number, academicYear?: string, semesterType?: string) {
    const where: any = { subjectId, isActive: true };

    if (academicYear) {
      where.academicYear = academicYear;
    }

    if (semesterType) {
      where.semesterType = semesterType;
    }

    return this.prisma.courseSchedule.findMany({
      where,
      include: {
        sessions: {
          where: { isActive: true },
          orderBy: { sessionDate: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  // Get schedules for a specific professor
  async getSchedulesByProfessor(professorId: number, academicYear?: string) {
    const where: any = {
      isActive: true,
      subject: {
        professorAssignments: {
          some: {
            professorId,
            isActive: true,
          },
        },
      },
    };

    if (academicYear) {
      where.academicYear = academicYear;
    }

    return this.prisma.courseSchedule.findMany({
      where,
      include: {
        subject: {
          select: { name: true, code: true },
        },
        sessions: {
          where: { isActive: true },
          orderBy: { sessionDate: 'asc' },
        },
      },
      orderBy: { createdAt: 'desc' },
    });
  }
}
