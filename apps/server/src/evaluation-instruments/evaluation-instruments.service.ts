import { Injectable, Logger, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { 
  CreateEvaluationInstrumentDto, 
  UpdateEvaluationInstrumentDto,
  CreateEvaluationSubmissionDto,
  UpdateEvaluationSubmissionDto
} from './dto';
import { EvaluationType, Prisma } from '@prisma/client';

@Injectable()
export class EvaluationInstrumentsService {
  private readonly logger = new Logger(EvaluationInstrumentsService.name);

  constructor(private readonly prisma: PrismaService) {}

  // Evaluation Instruments CRUD
  async createEvaluationInstrument(createDto: CreateEvaluationInstrumentDto) {
    try {
      const evaluationInstrument = await this.prisma.evaluationInstrument.create({
        data: {
          ...createDto,
          dueDate: createDto.dueDate ? new Date(createDto.dueDate) : null,
        },
        include: {
          subject: {
            include: {
              study_programs: {
                include: {
                  faculty: true,
                },
              },
            },
          },
        },
      });

      this.logger.log(`Created evaluation instrument: ${evaluationInstrument.title}`);
      return evaluationInstrument;
    } catch (error) {
      this.logger.error(`Failed to create evaluation instrument: ${error.message}`);
      throw new BadRequestException('Failed to create evaluation instrument');
    }
  }

  async findAllEvaluationInstruments(
    subjectId?: number,
    type?: EvaluationType,
    isActive?: boolean,
  ) {
    try {
      const where: Prisma.EvaluationInstrumentWhereInput = {};
      
      if (subjectId) where.subjectId = subjectId;
      if (type) where.type = type;
      if (isActive !== undefined) where.isActive = isActive;

      const evaluationInstruments = await this.prisma.evaluationInstrument.findMany({
        where,
        include: {
          subject: {
            include: {
              study_programs: {
                include: {
                  faculty: true,
                },
              },
            },
          },
          submissions: {
            include: {
              student: true,
            },
          },
        },
        orderBy: {
          createdAt: 'desc',
        },
      });

      return evaluationInstruments;
    } catch (error) {
      this.logger.error(`Failed to fetch evaluation instruments: ${error.message}`);
      throw new BadRequestException('Failed to fetch evaluation instruments');
    }
  }

  async findEvaluationInstrumentById(id: number) {
    try {
      const evaluationInstrument = await this.prisma.evaluationInstrument.findUnique({
        where: { id },
        include: {
          subject: {
            include: {
              study_programs: {
                include: {
                  faculty: true,
                },
              },
            },
          },
          submissions: {
            include: {
              student: true,
            },
          },
        },
      });

      if (!evaluationInstrument) {
        throw new NotFoundException(`Evaluation instrument with ID ${id} not found`);
      }

      return evaluationInstrument;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to fetch evaluation instrument: ${error.message}`);
      throw new BadRequestException('Failed to fetch evaluation instrument');
    }
  }

  async updateEvaluationInstrument(id: number, updateDto: UpdateEvaluationInstrumentDto) {
    try {
      const existingInstrument = await this.findEvaluationInstrumentById(id);

      const updatedInstrument = await this.prisma.evaluationInstrument.update({
        where: { id },
        data: {
          ...updateDto,
          dueDate: updateDto.dueDate ? new Date(updateDto.dueDate) : undefined,
        },
        include: {
          subject: {
            include: {
              study_programs: {
                include: {
                  faculty: true,
                },
              },
            },
          },
        },
      });

      this.logger.log(`Updated evaluation instrument: ${updatedInstrument.title}`);
      return updatedInstrument;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to update evaluation instrument: ${error.message}`);
      throw new BadRequestException('Failed to update evaluation instrument');
    }
  }

  async deleteEvaluationInstrument(id: number) {
    try {
      await this.findEvaluationInstrumentById(id);

      await this.prisma.evaluationInstrument.update({
        where: { id },
        data: { isActive: false },
      });

      this.logger.log(`Soft deleted evaluation instrument with ID: ${id}`);
      return { message: 'Evaluation instrument deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to delete evaluation instrument: ${error.message}`);
      throw new BadRequestException('Failed to delete evaluation instrument');
    }
  }

  // Evaluation Submissions CRUD
  async createEvaluationSubmission(createDto: CreateEvaluationSubmissionDto) {
    try {
      const submission = await this.prisma.evaluationSubmission.create({
        data: {
          ...createDto,
          gradedAt: createDto.gradedAt ? new Date(createDto.gradedAt) : null,
        },
        include: {
          instrument: {
            include: {
              subject: true,
            },
          },
          student: true,
        },
      });

      this.logger.log(`Created evaluation submission for student: ${submission.studentId}`);
      return submission;
    } catch (error) {
      this.logger.error(`Failed to create evaluation submission: ${error.message}`);
      throw new BadRequestException('Failed to create evaluation submission');
    }
  }

  async findAllEvaluationSubmissions(
    instrumentId?: number,
    studentId?: number,
    passed?: boolean,
  ) {
    try {
      const where: Prisma.EvaluationSubmissionWhereInput = {};
      
      if (instrumentId) where.instrumentId = instrumentId;
      if (studentId) where.studentId = studentId;
      if (passed !== undefined) where.passed = passed;

      const submissions = await this.prisma.evaluationSubmission.findMany({
        where,
        include: {
          instrument: {
            include: {
              subject: true,
            },
          },
          student: true,
        },
        orderBy: {
          submittedAt: 'desc',
        },
      });

      return submissions;
    } catch (error) {
      this.logger.error(`Failed to fetch evaluation submissions: ${error.message}`);
      throw new BadRequestException('Failed to fetch evaluation submissions');
    }
  }

  async findEvaluationSubmissionById(id: number) {
    try {
      const submission = await this.prisma.evaluationSubmission.findUnique({
        where: { id },
        include: {
          instrument: {
            include: {
              subject: true,
            },
          },
          student: true,
        },
      });

      if (!submission) {
        throw new NotFoundException(`Evaluation submission with ID ${id} not found`);
      }

      return submission;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to fetch evaluation submission: ${error.message}`);
      throw new BadRequestException('Failed to fetch evaluation submission');
    }
  }

  async updateEvaluationSubmission(id: number, updateDto: UpdateEvaluationSubmissionDto) {
    try {
      const existingSubmission = await this.findEvaluationSubmissionById(id);

      const updatedSubmission = await this.prisma.evaluationSubmission.update({
        where: { id },
        data: {
          ...updateDto,
          gradedAt: updateDto.gradedAt ? new Date(updateDto.gradedAt) : undefined,
        },
        include: {
          instrument: {
            include: {
              subject: true,
            },
          },
          student: true,
        },
      });

      this.logger.log(`Updated evaluation submission: ${updatedSubmission.id}`);
      return updatedSubmission;
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to update evaluation submission: ${error.message}`);
      throw new BadRequestException('Failed to update evaluation submission');
    }
  }

  async deleteEvaluationSubmission(id: number) {
    try {
      await this.findEvaluationSubmissionById(id);

      await this.prisma.evaluationSubmission.update({
        where: { id },
        data: { isActive: false },
      });

      this.logger.log(`Soft deleted evaluation submission with ID: ${id}`);
      return { message: 'Evaluation submission deleted successfully' };
    } catch (error) {
      if (error instanceof NotFoundException) throw error;
      this.logger.error(`Failed to delete evaluation submission: ${error.message}`);
      throw new BadRequestException('Failed to delete evaluation submission');
    }
  }

  // Additional methods for statistics and reporting
  async getEvaluationInstrumentStats(instrumentId: number) {
    try {
      const submissions = await this.prisma.evaluationSubmission.findMany({
        where: { 
          instrumentId,
          isActive: true,
        },
      });

      const totalSubmissions = submissions.length;
      const passedSubmissions = submissions.filter(s => s.passed).length;
      const averagePoints = submissions.length > 0 
        ? submissions.reduce((sum, s) => sum + (s.points || 0), 0) / submissions.length 
        : 0;
      const averageGrade = submissions.length > 0 
        ? submissions.reduce((sum, s) => sum + (s.grade || 0), 0) / submissions.length 
        : 0;

      return {
        totalSubmissions,
        passedSubmissions,
        failedSubmissions: totalSubmissions - passedSubmissions,
        passRate: totalSubmissions > 0 ? (passedSubmissions / totalSubmissions) * 100 : 0,
        averagePoints: Math.round(averagePoints * 100) / 100,
        averageGrade: Math.round(averageGrade * 100) / 100,
      };
    } catch (error) {
      this.logger.error(`Failed to get evaluation instrument stats: ${error.message}`);
      throw new BadRequestException('Failed to get evaluation instrument stats');
    }
  }

  async getStudentEvaluationHistory(studentId: number) {
    try {
      const submissions = await this.prisma.evaluationSubmission.findMany({
        where: { 
          studentId,
          isActive: true,
        },
        include: {
          instrument: {
            include: {
              subject: true,
            },
          },
        },
        orderBy: {
          submittedAt: 'desc',
        },
      });

      return submissions;
    } catch (error) {
      this.logger.error(`Failed to get student evaluation history: ${error.message}`);
      throw new BadRequestException('Failed to get student evaluation history');
    }
  }
}
