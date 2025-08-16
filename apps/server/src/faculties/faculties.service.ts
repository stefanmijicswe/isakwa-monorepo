import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

export interface CreateFacultyData {
  universityId: number;
  name: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  deanName?: string;
  deanTitle?: string;
}

export interface UpdateFacultyData {
  name?: string;
  description?: string;
  address?: string;
  phone?: string;
  email?: string;
  deanName?: string;
  deanTitle?: string;
}

@Injectable()
export class FacultiesService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateFacultyData) {
    return this.prisma.faculty.create({
      data,
      include: {
        university: true,
        studyPrograms: true,
      },
    });
  }

  async findAll() {
    return this.prisma.faculty.findMany({
      include: {
        university: true,
        studyPrograms: true,
      },
    });
  }

  async findOne(id: number) {
    const faculty = await this.prisma.faculty.findUnique({
      where: { id },
      include: {
        university: true,
        studyPrograms: true,
      },
    });

    if (!faculty) {
      throw new NotFoundException(`Fakultet sa ID ${id} nije pronađen`);
    }

    return faculty;
  }

  async findByUniversity(universityId: number) {
    return this.prisma.faculty.findMany({
      where: { universityId },
      include: {
        studyPrograms: true,
      },
    });
  }

  async update(id: number, data: UpdateFacultyData) {
    await this.findOne(id); // Check if exists

    return this.prisma.faculty.update({
      where: { id },
      data,
      include: {
        university: true,
        studyPrograms: true,
      },
    });
  }

  async remove(id: number) {
    await this.findOne(id); // Check if exists

    return this.prisma.faculty.delete({
      where: { id },
    });
  }
}
