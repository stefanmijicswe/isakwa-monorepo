import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';
import { UserRole } from '@prisma/client';

export interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  role: UserRole;
  // Profesor podaci
  department?: string;
  title?: string;
  phoneNumber?: string;
  officeRoom?: string;
  // Student podaci
  studentIndex?: string;
  year?: number;
  program?: string;
}

@Injectable()
export class UsersService {
  constructor(private prisma: PrismaService) {}

  async create(data: CreateUserData) {
    const user = await this.prisma.user.create({
      data: {
        email: data.email,
        password: data.password,
        firstName: data.firstName,
        lastName: data.lastName,
        role: data.role,
      },
    });

    // Kreirati profil na osnovu uloge
    if (data.role === UserRole.PROFESOR) {
      await this.prisma.professorProfile.create({
        data: {
          userId: user.id,
          department: data.department || '',
          title: data.title || '',
          phoneNumber: data.phoneNumber,
          officeRoom: data.officeRoom,
        },
      });
    } else if (data.role === UserRole.STUDENT) {
      await this.prisma.studentProfile.create({
        data: {
          userId: user.id,
          studentIndex: data.studentIndex || '',
          year: data.year || 1,
          program: data.program || '',
          phoneNumber: data.phoneNumber,
        },
      });
    }

    return this.findById(user.id);
  }

  async findByEmail(email: string) {
    return this.prisma.user.findUnique({
      where: { email },
      include: {
        profesorProfile: true,
        studentProfile: true,
      },
    });
  }

  async findById(id: number) {
    return this.prisma.user.findUnique({
      where: { id },
      include: {
        profesorProfile: true,
        studentProfile: true,
      },
    });
  }

  async findAll() {
    return this.prisma.user.findMany({
      include: {
        profesorProfile: true,
        studentProfile: true,
      },
    });
  }

  async findByRole(role: UserRole) {
    return this.prisma.user.findMany({
      where: { role },
      include: {
        profesorProfile: true,
        studentProfile: true,
      },
    });
  }
}
