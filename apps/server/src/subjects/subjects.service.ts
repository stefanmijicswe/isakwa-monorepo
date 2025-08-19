import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';

@Injectable()
export class SubjectsService {
  constructor(private prisma: PrismaService) {}

  async create(createSubjectDto: CreateSubjectDto) {
    const studyProgramExists = await this.prisma.studyProgram.findUnique({
      where: { id: createSubjectDto.studyProgramId }
    });

    if (!studyProgramExists) {
      throw new BadRequestException('Study program not found');
    }

    const existingCode = await this.prisma.subject.findUnique({
      where: { code: createSubjectDto.code }
    });

    if (existingCode) {
      throw new BadRequestException('Subject code already exists');
    }

    return this.prisma.subject.create({
      data: createSubjectDto,
      include: {
        studyPrograms: {
          select: {
            id: true,
            studyProgram: {
              select: {
                id: true,
                name: true,
                facultyId: true,
                faculty: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  async findAll(page = 1, limit = 10, studyProgramId?: number, semester?: number, search?: string, credits?: number) {
    const skip = (page - 1) * limit;
    
    const where: any = {};
    
    if (studyProgramId) {
      where.studyProgramId = studyProgramId;
    }
    
    if (semester) {
      where.semester = semester;
    }
    
    if (credits) {
      where.credits = credits;
    }
    
    if (search) {
      where.OR = [
        {
          name: {
            contains: search,
            mode: 'insensitive'
          }
        },
        {
          code: {
            contains: search,
            mode: 'insensitive'
          }
        }
      ];
    }

    const [subjects, total] = await Promise.all([
      this.prisma.subject.findMany({
        where,
        skip,
        take: limit,
        include: {
                  studyPrograms: {
          select: {
            id: true,
            studyProgram: {
              select: {
                id: true,
                name: true,
                facultyId: true,
                faculty: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          }
        }
        },
        orderBy: [
          { semester: 'asc' },
          { name: 'asc' }
        ]
      }),
      this.prisma.subject.count({ where })
    ]);

    return {
      data: subjects,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit)
      }
    };
  }

  async findOne(id: number) {
    const subject = await this.prisma.subject.findUnique({
      where: { id },
      include: {
        studyPrograms: {
          select: {
            id: true,
            studyProgram: {
              select: {
                id: true,
                name: true,
                duration: true,
                facultyId: true,
                faculty: {
                  select: {
                    id: true,
                    name: true,
                    universityId: true,
                    University: {
                      select: {
                        id: true,
                        name: true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    });

    if (!subject) {
      throw new NotFoundException('Subject not found');
    }

    return subject;
  }

  async findByStudyProgram(studyProgramId: number) {
    const studyProgramExists = await this.prisma.studyProgram.findUnique({
      where: { id: studyProgramId }
    });

    if (!studyProgramExists) {
      throw new NotFoundException('Study program not found');
    }

    return this.prisma.subject.findMany({
      where: { studyProgramId },
      orderBy: [
        { semester: 'asc' },
        { name: 'asc' }
      ],
      include: {
        studyPrograms: {
          select: {
            id: true,
            studyProgram: {
              select: {
                id: true,
                name: true
              }
            }
          }
        }
      }
    });
  }

  async findBySemester(semester: number) {
    return this.prisma.subject.findMany({
      where: { semester },
      orderBy: {
        name: 'asc'
      },
      include: {
        studyPrograms: {
          select: {
            id: true,
            studyProgram: {
              select: {
                id: true,
                name: true,
                faculty: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  async update(id: number, updateSubjectDto: UpdateSubjectDto) {
    const existingSubject = await this.prisma.subject.findUnique({
      where: { id }
    });

    if (!existingSubject) {
      throw new NotFoundException('Subject not found');
    }

    if (updateSubjectDto.studyProgramId && updateSubjectDto.studyProgramId !== existingSubject.studyProgramId) {
      const studyProgramExists = await this.prisma.studyProgram.findUnique({
        where: { id: updateSubjectDto.studyProgramId }
      });

      if (!studyProgramExists) {
        throw new BadRequestException('Study program not found');
      }
    }

    if (updateSubjectDto.code && updateSubjectDto.code !== existingSubject.code) {
      const existingCode = await this.prisma.subject.findUnique({
        where: { code: updateSubjectDto.code }
      });

      if (existingCode) {
        throw new BadRequestException('Subject code already exists');
      }
    }

    return this.prisma.subject.update({
      where: { id },
      data: updateSubjectDto,
      include: {
        studyPrograms: {
          select: {
            id: true,
            studyProgram: {
              select: {
                id: true,
                name: true,
                facultyId: true,
                faculty: {
                  select: {
                    id: true,
                    name: true
                  }
                }
              }
            }
          }
        }
      }
    });
  }

  async remove(id: number) {
    const existingSubject = await this.prisma.subject.findUnique({
      where: { id }
    });

    if (!existingSubject) {
      throw new NotFoundException('Subject not found');
    }

    return this.prisma.subject.delete({
      where: { id }
    });
  }
}
