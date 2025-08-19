import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateStudyProgramDto } from './dto/create-study-program.dto';
import { UpdateStudyProgramDto } from './dto/update-study-program.dto';

@Injectable()
export class StudyProgramsService {
  constructor(private prisma: PrismaService) {}

  async create(createStudyProgramDto: CreateStudyProgramDto) {
    const facultyExists = await this.prisma.faculty.findUnique({
      where: { id: createStudyProgramDto.facultyId }
    });

    if (!facultyExists) {
      throw new BadRequestException('Faculty not found');
    }

    return this.prisma.studyProgram.create({
      data: createStudyProgramDto,
      include: {
        faculty: {
          select: {
            id: true,
            name: true,
            universityId: true
          }
        }
      }
    });
  }

  async findAll(page = 1, limit = 10, facultyId?: number, search?: string, duration?: number) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (facultyId) {
      where.facultyId = facultyId;
    }
    
    if (search) {
      where.name = {
        contains: search,
        mode: 'insensitive'
      };
    }
    
    if (duration) {
      where.duration = duration;
    }

    const [programs, total] = await Promise.all([
      this.prisma.studyProgram.findMany({
        where,
        skip,
        take: limit,
        include: {
          faculty: {
            select: {
              id: true,
              name: true,
              universityId: true
            }
          },
          _count: {
            select: {
              subjects: true
            }
          }
        },
        orderBy: {
          name: 'asc'
        }
      }),
      this.prisma.studyProgram.count({ where })
    ]);

    return {
      data: programs,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findOne(id: number) {
    const program = await this.prisma.studyProgram.findUnique({
      where: { id },
      include: {
        faculty: {
          select: {
            id: true,
            name: true,
            universityId: true
          }
        },
        subjects: {
          select: {
            id: true,
            subject: {
              select: {
                id: true,
                code: true,
                credits: true
              }
            }
          }
        }
      }
    });

    if (!program) {
      throw new NotFoundException('Study program not found');
    }

    return program;
  }

  async findByFaculty(facultyId: number) {
    const facultyExists = await this.prisma.faculty.findUnique({
      where: { id: facultyId }
    });

    if (!facultyExists) {
      throw new NotFoundException('Faculty not found');
    }

    return this.prisma.studyProgram.findMany({
      where: { facultyId },
      include: {
        _count: {
          select: {
            subjects: true
          }
        }
      },
      orderBy: {
        name: 'asc'
      }
    });
  }

  async update(id: number, updateStudyProgramDto: UpdateStudyProgramDto) {
    const existingProgram = await this.prisma.studyProgram.findUnique({
      where: { id }
    });

    if (!existingProgram) {
      throw new NotFoundException('Study program not found');
    }

    if (updateStudyProgramDto.facultyId && updateStudyProgramDto.facultyId !== existingProgram.facultyId) {
      const facultyExists = await this.prisma.faculty.findUnique({
        where: { id: updateStudyProgramDto.facultyId }
      });

      if (!facultyExists) {
        throw new BadRequestException('Faculty not found');
      }
    }

    return this.prisma.studyProgram.update({
      where: { id },
      data: updateStudyProgramDto,
      include: {
        faculty: {
          select: {
            id: true,
            name: true,
            universityId: true
          }
        }
      }
    });
  }

  async remove(id: number) {
    const existingProgram = await this.prisma.studyProgram.findUnique({
      where: { id }
    });

    if (!existingProgram) {
      throw new NotFoundException('Study program not found');
    }

    return this.prisma.studyProgram.delete({
      where: { id }
    });
  }
}
